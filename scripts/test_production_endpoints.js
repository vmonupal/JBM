const http = require('http');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    }).on('error', reject);
  });
}

function fetchRaw(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING PRODUCTION SERVER ENDPOINT VERIFICATION TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  // 1. Books API
  const booksRes = await fetchJson('http://localhost:3000/api/bible/books');
  assert(booksRes.status === 200 && Array.isArray(booksRes.data) && booksRes.data.length === 66, 'API /api/bible/books returns 66 books', `got ${booksRes.data?.length}`);
  const otBooks = booksRes.data?.filter(b => b.testament === 'OT') || [];
  const ntBooks = booksRes.data?.filter(b => b.testament === 'NT') || [];
  assert(otBooks.length === 39, 'Old Testament has 39 books', `got ${otBooks.length}`);
  assert(ntBooks.length === 27, 'New Testament has 27 books', `got ${ntBooks.length}`);

  // 2. Key Chapters
  const testChapters = [
    { bookId: 1, chap: 1, name: 'Genesis 1', expectedMinVerses: 31 },
    { bookId: 2, chap: 1, name: 'Exodus 1', expectedMinVerses: 22 },
    { bookId: 19, chap: 23, name: 'Psalms 23', expectedMinVerses: 6 },
    { bookId: 40, chap: 1, name: 'Matthew 1', expectedMinVerses: 25 },
    { bookId: 43, chap: 3, name: 'John 3', expectedMinVerses: 36 },
    { bookId: 44, chap: 2, name: 'Acts 2', expectedMinVerses: 47 },
    { bookId: 66, chap: 22, name: 'Revelation 22', expectedMinVerses: 21 }
  ];

  for (const tc of testChapters) {
    const res = await fetchJson(`http://localhost:3000/api/bible/verses?bookId=${tc.bookId}&chapter=${tc.chap}`);
    const verses = Array.isArray(res.data) ? res.data : (res.data?.verses || []);
    assert(
      res.status === 200 && verses.length >= tc.expectedMinVerses,
      `API /api/bible/verses loads ${tc.name} with verses (found ${verses.length})`
    );

    // Verify both Telugu and English exist
    const hasTe = verses.every(v => v.telugu_text && v.telugu_text.trim().length > 0);
    const hasEn = verses.every(v => v.english_text && v.english_text.trim().length > 0);
    assert(hasTe && hasEn, `${tc.name} has both valid Telugu Unicode and English text for all verses`);
  }

  // Check specific verse text
  const acts2Res = await fetchJson('http://localhost:3000/api/bible/verses?bookId=44&chapter=2');
  const actsVerses = Array.isArray(acts2Res.data) ? acts2Res.data : [];
  const v38 = actsVerses.find(v => v.verse_number === 38);
  assert(
    v38 && v38.telugu_text.includes('మారుమనస్సు') && v38.english_text.toLowerCase().includes('repent'),
    'Acts 2:38 contains authentic authorized Telugu & English repentance text'
  );

  const john3Res = await fetchJson('http://localhost:3000/api/bible/verses?bookId=43&chapter=3');
  const johnVerses = Array.isArray(john3Res.data) ? john3Res.data : [];
  const v16 = johnVerses.find(v => v.verse_number === 16);
  assert(
    v16 && v16.telugu_text.includes('దేవుడు లోకమును ఎంతో ప్రేమించెను') && v16.english_text.toLowerCase().includes('god so loved the world'),
    'John 3:16 contains authentic authorized Telugu & English Gospel text'
  );

  // 3. Static JSON files (Deployment offline/static fallbacks)
  const staticBooks = await fetchJson('http://localhost:3000/data/bible/books.json');
  assert(staticBooks.status === 200 && Array.isArray(staticBooks.data) && staticBooks.data.length === 66, 'Static fallback /data/bible/books.json exists with 66 books');

  const staticActs = await fetchJson('http://localhost:3000/data/bible/44.json');
  const actsChap2 = staticActs.data?.filter(v => v.chapter_number === 2) || [];
  assert(staticActs.status === 200 && actsChap2.length === 47, 'Static fallback /data/bible/44.json exists with complete Acts 2 verses');

  // 4. Search API
  const searchJohn = await fetchJson('http://localhost:3000/api/bible/search?q=John+3:16');
  assert(searchJohn.status === 200 && (searchJohn.data?.reference?.verse === 16 || searchJohn.data?.verses?.length > 0), 'Search handles "John 3:16"');

  const searchActs = await fetchJson('http://localhost:3000/api/bible/search?q=Acts+2');
  assert(searchActs.status === 200 && (searchActs.data?.reference?.chapter === 2 || searchActs.data?.verses?.length > 0), 'Search handles "Acts 2"');

  const searchTeluguWord = await fetchJson('http://localhost:3000/api/bible/search?q=%E0%B0%AA%E0%B1%8D%E0%B0%B0%E0%B1%87%E0%B0%AE');
  assert(searchTeluguWord.status === 200 && searchTeluguWord.data?.verses?.length > 0, `Telugu keyword search "ప్రేమ" returned ${searchTeluguWord.data?.verses?.length} results`);

  const searchEnglishWord = await fetchJson('http://localhost:3000/api/bible/search?q=faith');
  assert(searchEnglishWord.status === 200 && searchEnglishWord.data?.verses?.length > 0, `English keyword search "faith" returned ${searchEnglishWord.data?.verses?.length} results`);

  // 5. Bible Integrity
  const integrity = await fetchJson('http://localhost:3000/api/admin/bible-integrity');
  assert(integrity.status === 200 && integrity.data?.is_complete === true, `Admin Bible integrity verification passes (books: ${integrity.data?.books_count}/66, chapters: ${integrity.data?.chapters_count}/1189, verses: ${integrity.data?.telugu_verses_count}/31102)`);

  // 6. Service Worker
  const sw = await fetchRaw('http://localhost:3000/sw.js');
  assert(sw.status === 200 && sw.data.includes('revival-chapel-cache-v1'), 'Service worker /sw.js is deployed and active');

  // 7. Songs API
  const songs = await fetchJson('http://localhost:3000/api/songs');
  assert(songs.status === 200 && Array.isArray(songs.data), 'Songs API is operational');

  console.log('\n====================================================');
  console.log(`TOTAL PASSED: ${passed}`);
  console.log(`TOTAL FAILED: ${failed}`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
