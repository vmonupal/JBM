const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'church.db');
const db = new Database(dbPath);

const outputDir = path.join(__dirname, '..', 'public', 'data', 'bible');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('=== EXPORTING COMPLETE 66-BOOK BIBLE DATASET TO STATIC JSON ===');

// 1. Export Books
const books = db.prepare('SELECT * FROM bible_books ORDER BY book_order ASC').all();
console.log(`Found ${books.length} books in database.`);

fs.writeFileSync(
  path.join(outputDir, 'books.json'),
  JSON.stringify(books, null, 2),
  'utf8'
);
console.log('Exported public/data/bible/books.json');

// 2. Export Verses grouped by book
const insertVerseStmt = db.prepare(`
  SELECT 
    v.id,
    v.book_id,
    b.name_english as book_name_english,
    b.name_telugu as book_name_telugu,
    b.name_english as book_english,
    b.name_telugu as book_telugu,
    b.testament,
    v.chapter_number,
    v.verse_number,
    v.english_text,
    v.telugu_text,
    COALESCE(v.translation_english, 'King James Version (KJV)') as translation_english,
    COALESCE(v.translation_telugu, 'Telugu Holy Bible (పరిశుద్ధ గ్రంథము - BSI OV)') as translation_telugu,
    COALESCE(v.translation_english, 'KJV') || ' / ' || COALESCE(v.translation_telugu, 'Telugu OV') as translation_source,
    COALESCE(v.license, 'Public Domain / Authorized Church Use') as license_information,
    v.created_at
  FROM bible_verses v
  JOIN bible_books b ON b.id = v.book_id
  WHERE v.book_id = ?
  ORDER BY v.chapter_number ASC, v.verse_number ASC
`);

let totalExportedVerses = 0;
let totalExportedChapters = new Set();

for (const book of books) {
  const verses = insertVerseStmt.all(book.id);
  totalExportedVerses += verses.length;

  for (const v of verses) {
    totalExportedChapters.add(`${v.book_id}_${v.chapter_number}`);
  }

  // Write book JSON file: public/data/bible/[book_id].json
  fs.writeFileSync(
    path.join(outputDir, `${book.id}.json`),
    JSON.stringify(verses),
    'utf8'
  );
}

console.log(`Successfully exported ${books.length} books.`);
console.log(`Total chapters verified: ${totalExportedChapters.size} (expected 1189)`);
console.log(`Total verses verified: ${totalExportedVerses} (expected 31102)`);

// 3. Export a quick lookup map of chapters count per book
const chaptersSummary = books.map(b => ({
  id: b.id,
  name_english: b.name_english,
  name_telugu: b.name_telugu,
  testament: b.testament,
  total_chapters: b.total_chapters,
  book_order: b.book_order
}));

fs.writeFileSync(
  path.join(outputDir, 'summary.json'),
  JSON.stringify(chaptersSummary, null, 2),
  'utf8'
);

console.log('Export complete! Public static Bible dataset is ready.');
