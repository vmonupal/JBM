const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'data', 'church.db'));

console.log('=== THOROUGH BIBLE DATA INTEGRITY CHECK ===');

// 1. Books check
const books = db.prepare('SELECT * FROM bible_books ORDER BY book_order').all();
console.log('Total books:', books.length);
const otBooks = books.filter(b => b.testament === 'OT');
const ntBooks = books.filter(b => b.testament === 'NT');
console.log(`OT Books: ${otBooks.length} (expected 39), NT Books: ${ntBooks.length} (expected 27)`);

// 2. Chapters check
const totalChapters = books.reduce((acc, b) => acc + b.total_chapters, 0);
console.log(`Total expected chapters across books: ${totalChapters} (expected 1189)`);

// Check distinct chapters in verses
const distinctChapters = db.prepare("SELECT COUNT(DISTINCT book_id || '_' || chapter_number) as count FROM bible_verses").get().count;
console.log(`Distinct chapters in bible_verses: ${distinctChapters} (expected 1189)`);

// 3. Verses check
const totalVerses = db.prepare('SELECT COUNT(*) as count FROM bible_verses').get().count;
console.log(`Total verses in bible_verses: ${totalVerses} (expected 31102)`);

// 4. Missing text
const emptyTelugu = db.prepare("SELECT v.*, b.name_english FROM bible_verses v JOIN bible_books b ON b.id = v.book_id WHERE v.telugu_text IS NULL OR TRIM(v.telugu_text) = ''").all();
console.log('Verses with empty Telugu:', emptyTelugu);

const emptyEnglish = db.prepare("SELECT v.*, b.name_english FROM bible_verses v JOIN bible_books b ON b.id = v.book_id WHERE v.english_text IS NULL OR TRIM(v.english_text) = ''").all();
console.log('Verses with empty English:', emptyEnglish);

// 5. Duplicates check
const duplicates = db.prepare("SELECT book_id, chapter_number, verse_number, COUNT(*) as count FROM bible_verses GROUP BY book_id, chapter_number, verse_number HAVING count > 1").all();
console.log('Duplicate verses count:', duplicates.length);

// 6. Invalid references (chapter > total_chapters, verse <= 0, etc.)
const invalidChapters = db.prepare("SELECT v.id, v.book_id, b.name_english, v.chapter_number, b.total_chapters FROM bible_verses v JOIN bible_books b ON b.id = v.book_id WHERE v.chapter_number < 1 OR v.chapter_number > b.total_chapters").all();
console.log('Invalid chapter references count:', invalidChapters.length);

const invalidVerseNums = db.prepare("SELECT id, book_id, chapter_number, verse_number FROM bible_verses WHERE verse_number < 1").all();
console.log('Invalid verse numbers count:', invalidVerseNums.length);

// 7. Check placeholders
const placeholderKeywords = ['sample verse', 'bible verse here', 'lorem ipsum', 'content coming soon', 'chapter data unavailable'];
for (const kw of placeholderKeywords) {
  const match = db.prepare("SELECT COUNT(*) as c FROM bible_verses WHERE LOWER(english_text) LIKE ? OR LOWER(telugu_text) LIKE ?").get(`%${kw}%`, `%${kw}%`).c;
  console.log(`Occurrences of "${kw}":`, match);
}
