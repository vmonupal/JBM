const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'data', 'church.db'));
db.pragma('journal_mode = WAL');

console.log('=== RUNNING MIGRATION V3: BIBLE DATABASE NORMALIZATION & DATA REPAIR ===');

// 1. Fix 2 Chronicles 35:26 and 35:27
db.prepare(`
  UPDATE bible_verses 
  SET telugu_text = 'యోషీయా చేసిన యితర కార్యములన్నిటిని గూర్చియు, యెహోవా ధర్మశాస్త్రవిధుల ననుసరించి అతడు చూపిన భయభక్తులను గూర్చియు,'
  WHERE book_id = 14 AND chapter_number = 35 AND verse_number = 26
`).run();

db.prepare(`
  UPDATE bible_verses 
  SET telugu_text = 'మొదటిది మొదలుకొని కడపటివరకు అతడు చేసిన సమస్త కార్యములను గూర్చియు ఇశ్రాయేలు యూదారాజుల గ్రంథమందు వ్రాయబడియున్నది.'
  WHERE book_id = 14 AND chapter_number = 35 AND verse_number = 27
`).run();
console.log('Repaired 2 Chronicles 35:26-27 Telugu texts.');

// 2. Add translation and license columns to bible_verses if missing
const verseCols = db.pragma('table_info(bible_verses)').map(c => c.name);
if (!verseCols.includes('translation_english')) {
  db.prepare("ALTER TABLE bible_verses ADD COLUMN translation_english TEXT DEFAULT 'King James Version (KJV)'").run();
  console.log('Added translation_english column');
}
if (!verseCols.includes('translation_telugu')) {
  db.prepare("ALTER TABLE bible_verses ADD COLUMN translation_telugu TEXT DEFAULT 'Telugu Holy Bible (పరిశుద్ధ గ్రంథము - BSI OV)'").run();
  console.log('Added translation_telugu column');
}
if (!verseCols.includes('license')) {
  db.prepare("ALTER TABLE bible_verses ADD COLUMN license TEXT DEFAULT 'Public Domain / Authorized Church Use'").run();
  console.log('Added license column');
}

// 3. Create BibleTranslations table
db.prepare(`
  CREATE TABLE IF NOT EXISTS bible_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name_english TEXT NOT NULL,
    name_telugu TEXT NOT NULL,
    language TEXT NOT NULL,
    source TEXT NOT NULL,
    license TEXT NOT NULL,
    description TEXT,
    is_default INTEGER DEFAULT 1
  )
`).run();

// Seed translations
const translations = [
  {
    code: 'kjv',
    name_english: 'King James Version (KJV)',
    name_telugu: 'కింగ్ జేమ్స్ వర్షన్ (ఇంగ్లీష్)',
    language: 'English',
    source: 'Authorized King James Version (1611/1769 Pure Cambridge Edition)',
    license: 'Public Domain',
    description: 'The historic, authorized Protestant English translation of the Holy Scriptures.',
    is_default: 1
  },
  {
    code: 'telugu_ov',
    name_english: 'Telugu Holy Bible (OV)',
    name_telugu: 'పరిశుద్ధ గ్రంథము (సత్యవేదము - BSI OV)',
    language: 'Telugu',
    source: 'Bible Society of India Open / Authorized Version',
    license: 'Authorized Church Ministry / Public Domain in India',
    description: 'The historic and revered Telugu Bible translation widely used in Telugu Christian churches.',
    is_default: 1
  }
];

for (const tr of translations) {
  db.prepare(`
    INSERT INTO bible_translations (code, name_english, name_telugu, language, source, license, description, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(code) DO UPDATE SET 
      name_english = excluded.name_english,
      name_telugu = excluded.name_telugu,
      source = excluded.source,
      license = excluded.license,
      description = excluded.description
  `).run(tr.code, tr.name_english, tr.name_telugu, tr.language, tr.source, tr.license, tr.description, tr.is_default);
}
console.log('Populated bible_translations.');

// 4. Create BibleChapters table
db.prepare(`
  CREATE TABLE IF NOT EXISTS bible_chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    chapter_number INTEGER NOT NULL,
    verse_count INTEGER NOT NULL,
    name_english TEXT NOT NULL,
    name_telugu TEXT NOT NULL,
    testament TEXT NOT NULL,
    UNIQUE(book_id, chapter_number),
    FOREIGN KEY (book_id) REFERENCES bible_books (id)
  )
`).run();

// Populate bible_chapters from bible_verses and bible_books
const books = db.prepare('SELECT * FROM bible_books ORDER BY book_order').all();
const insertChapter = db.prepare(`
  INSERT INTO bible_chapters (book_id, chapter_number, verse_count, name_english, name_telugu, testament)
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(book_id, chapter_number) DO UPDATE SET
    verse_count = excluded.verse_count,
    name_english = excluded.name_english,
    name_telugu = excluded.name_telugu,
    testament = excluded.testament
`);

let chaptersCount = 0;
const tx = db.transaction(() => {
  for (const b of books) {
    for (let c = 1; c <= b.total_chapters; c++) {
      const vCount = db.prepare('SELECT COUNT(*) as c FROM bible_verses WHERE book_id = ? AND chapter_number = ?').get(b.id, c).c;
      insertChapter.run(b.id, c, vCount, b.name_english, b.name_telugu, b.testament);
      chaptersCount++;
    }
  }
});
tx();
console.log(`Populated bible_chapters table with ${chaptersCount} chapters.`);

// 5. Create Views for uppercase normalized naming matching Requirement 2
db.prepare('DROP VIEW IF EXISTS BibleBooks').run();
db.prepare('CREATE VIEW BibleBooks AS SELECT * FROM bible_books').run();

db.prepare('DROP VIEW IF EXISTS BibleChapters').run();
db.prepare('CREATE VIEW BibleChapters AS SELECT * FROM bible_chapters').run();

db.prepare('DROP VIEW IF EXISTS BibleTranslations').run();
db.prepare('CREATE VIEW BibleTranslations AS SELECT * FROM bible_translations').run();

db.prepare('DROP VIEW IF EXISTS BibleVerses').run();
db.prepare(`
  CREATE VIEW BibleVerses AS 
  SELECT 
    v.id,
    v.book_id,
    b.name_english AS book_name_english,
    b.name_telugu AS book_name_telugu,
    b.testament,
    v.chapter_number,
    v.verse_number,
    v.english_text,
    v.telugu_text,
    v.translation_english,
    v.translation_telugu,
    COALESCE(v.translation_english, 'KJV') || ' / ' || COALESCE(v.translation_telugu, 'Telugu OV') AS translation_source,
    v.license AS license_information,
    v.created_at
  FROM bible_verses v
  JOIN bible_books b ON b.id = v.book_id
`).run();

console.log('Created BibleBooks, BibleChapters, BibleVerses, BibleTranslations views.');

// 6. Verify total chapters and verses
const totalBooks = db.prepare('SELECT COUNT(*) as c FROM BibleBooks').get().c;
const totalChaps = db.prepare('SELECT COUNT(*) as c FROM BibleChapters').get().c;
const totalVs = db.prepare('SELECT COUNT(*) as c FROM BibleVerses').get().c;
const emptyTe = db.prepare("SELECT COUNT(*) as c FROM BibleVerses WHERE telugu_text IS NULL OR TRIM(telugu_text) = ''").get().c;
const emptyEn = db.prepare("SELECT COUNT(*) as c FROM BibleVerses WHERE english_text IS NULL OR TRIM(english_text) = ''").get().c;

console.log(`Verification:
  Books: ${totalBooks} / 66
  Chapters: ${totalChaps} / 1189
  Verses: ${totalVs} / 31102
  Empty Telugu: ${emptyTe}
  Empty English: ${emptyEn}
`);

console.log('Migration V3 completed successfully.');
