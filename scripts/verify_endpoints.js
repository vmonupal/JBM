async function verify() {
  const checks = [
    { name: 'Site Settings', url: 'http://localhost:3000/api/site-settings' },
    { name: 'Posters API', url: 'http://localhost:3000/api/posters' },
    { name: 'Bible Verses (John 3)', url: 'http://localhost:3000/api/bible/verses?bookId=43&chapter=3' },
    { name: 'Songs API', url: 'http://localhost:3000/api/songs' },
    { name: 'Homepage', url: 'http://localhost:3000/' },
    { name: 'Posters Page', url: 'http://localhost:3000/posters' },
    { name: 'Owner Page', url: 'http://localhost:3000/owner' }
  ];

  for (const c of checks) {
    try {
      const res = await fetch(c.url);
      console.log('[PASS] ' + c.name + ' (Status: ' + res.status + ')');
      if (c.url.includes('api/site-settings')) {
        const data = await res.json();
        console.log('  -> website_name: ' + data.website_name + ', tagline: ' + data.tagline + ', use_text_logo: ' + data.use_text_logo);
      }
      if (c.url.includes('api/posters') && !c.url.includes('posters/')) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.posters || []);
        console.log('  -> posters count: ' + list.length);
        if (list[0]) {
          console.log('  -> first poster: ' + list[0].title + ' (' + list[0].category + ')');
        }
      }
      if (c.url.includes('api/bible/verses')) {
        const data = await res.json();
        const v = data.verses ? data.verses[15] : null;
        console.log('  -> John 3:16 English: ' + (v?.verse_text_english ? v.verse_text_english.substring(0, 40) + '...' : 'N/A'));
        console.log('  -> John 3:16 Telugu: ' + (v?.verse_text_telugu ? v.verse_text_telugu.substring(0, 40) + '...' : 'N/A'));
      }
    } catch (e) {
      console.error('[FAIL] ' + c.name + ': ' + e.message);
    }
  }
}

verify();
