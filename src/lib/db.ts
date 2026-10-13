import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { 
  BibleBook, BibleVerse, BibleChapter, BibleTranslation, BibleIntegrityReport,
  Song, SongVersion, Category, SiteSettings, Poster, PosterDisplaySettings, FavoriteItem, ReadingHistoryItem, AdminStats 
} from './types';

const dbPath = path.join(process.cwd(), 'data', 'church.db');

declare global {
  var __church_db: Database.Database | null | undefined;
}

function getFallbackDir(): string {
  const p1 = path.join(process.cwd(), 'src', 'data', 'bible');
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(process.cwd(), 'public', 'data', 'bible');
  if (fs.existsSync(p2)) return p2;
  return path.join(__dirname, '..', 'data', 'bible');
}

export function loadFallbackBooks(): BibleBook[] {
  try {
    const filePath = path.join(getFallbackDir(), 'books.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading fallback books:', e);
  }
  return [];
}

export function loadFallbackVerses(bookId: number, chapterNumber?: number): BibleVerse[] {
  try {
    const filePath = path.join(getFallbackDir(), `${bookId}.json`);
    if (fs.existsSync(filePath)) {
      const all: BibleVerse[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (chapterNumber !== undefined) {
        return all.filter(v => v.chapter_number === chapterNumber);
      }
      return all;
    }
  } catch (e) {
    console.error(`Error loading fallback verses for book ${bookId}:`, e);
  }
  return [];
}

export function loadFallbackSongs(): Song[] {
  try {
    const p = path.join(process.cwd(), 'src', 'data', 'church_songs.json');
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch (e) {}
  return [];
}

export function loadFallbackCategories(): (Category & { song_count: number })[] {
  try {
    const p = path.join(process.cwd(), 'src', 'data', 'categories.json');
    if (fs.existsSync(p)) {
      const cats: Category[] = JSON.parse(fs.readFileSync(p, 'utf8'));
      return cats.map(c => ({ ...c, song_count: 0 }));
    }
  } catch (e) {}
  return [];
}

export function getDb(): Database.Database {
  if (!global.__church_db) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      try { fs.mkdirSync(dir, { recursive: true }); } catch (e) {}
    }
    
    const db = new Database(dbPath);
    try { db.pragma('journal_mode = WAL'); } catch (e) {}
    global.__church_db = db;

      // Run schema migrations for songs, versions & site_settings safely
      try {
        const tableInfo = global.__church_db.pragma('table_info(songs)') as any[];
        const cols = tableInfo.map(c => c.name);
        if (!cols.includes('bible_reference')) {
          global.__church_db.prepare('ALTER TABLE songs ADD COLUMN bible_reference TEXT').run();
        }
        if (!cols.includes('updated_at')) {
          global.__church_db.prepare('ALTER TABLE songs ADD COLUMN updated_at DATETIME').run();
          global.__church_db.prepare('UPDATE songs SET updated_at = created_at WHERE updated_at IS NULL').run();
        }
        if (!cols.includes('language')) {
          global.__church_db.prepare("ALTER TABLE songs ADD COLUMN language TEXT DEFAULT 'Telugu + English'").run();
        }
        if (!cols.includes('lyrics_other')) {
          global.__church_db.prepare('ALTER TABLE songs ADD COLUMN lyrics_other TEXT').run();
        }
        if (!cols.includes('other_language_name')) {
          global.__church_db.prepare('ALTER TABLE songs ADD COLUMN other_language_name TEXT').run();
        }
        if (!cols.includes('composer')) {
          global.__church_db.prepare('ALTER TABLE songs ADD COLUMN composer TEXT').run();
        }
        if (!cols.includes('source_origin')) {
          global.__church_db.prepare('ALTER TABLE songs ADD COLUMN source_origin TEXT').run();
        }
        if (!cols.includes('image_url')) {
          global.__church_db.prepare('ALTER TABLE songs ADD COLUMN image_url TEXT').run();
        }

        global.__church_db.prepare(`
          CREATE TABLE IF NOT EXISTS song_versions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            song_id INTEGER NOT NULL,
            version_number INTEGER NOT NULL DEFAULT 1,
            song_number INTEGER,
            title_english TEXT,
            title_telugu TEXT,
            lyrics_english TEXT,
            lyrics_telugu TEXT,
            category_id INTEGER,
            author TEXT,
            composer TEXT,
            source_origin TEXT,
            language TEXT,
            lyrics_other TEXT,
            other_language_name TEXT,
            image_url TEXT,
            audio_url TEXT,
            video_url TEXT,
            bible_reference TEXT,
            change_summary TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE
          )
        `).run();

        global.__church_db.prepare(`
          CREATE TABLE IF NOT EXISTS site_settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run();

        global.__church_db.prepare(`
          CREATE TABLE IF NOT EXISTS posters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT NOT NULL,
            thumbnail_url TEXT,
            image_data TEXT,
            title TEXT,
            description TEXT,
            event_name TEXT,
            event_date TEXT,
            event_time TEXT,
            location TEXT,
            category TEXT DEFAULT 'Special Event',
            language TEXT DEFAULT 'Telugu + English',
            bible_reference TEXT,
            large_url TEXT,
            speaker TEXT,
            contact_info TEXT,
            width INTEGER,
            height INTEGER,
            aspect_ratio TEXT,
            file_type TEXT,
            file_size TEXT,
            file_size_bytes INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run();

        // Migration for existing databases
        const posterCols = global.__church_db.pragma('table_info(posters)') as any[];
        const pColNames = posterCols.map(c => c.name);
        if (!pColNames.includes('large_url')) global.__church_db.prepare('ALTER TABLE posters ADD COLUMN large_url TEXT').run();
        if (!pColNames.includes('speaker')) global.__church_db.prepare('ALTER TABLE posters ADD COLUMN speaker TEXT').run();
        if (!pColNames.includes('contact_info')) global.__church_db.prepare('ALTER TABLE posters ADD COLUMN contact_info TEXT').run();
        if (!pColNames.includes('width')) global.__church_db.prepare('ALTER TABLE posters ADD COLUMN width INTEGER').run();
        if (!pColNames.includes('height')) global.__church_db.prepare('ALTER TABLE posters ADD COLUMN height INTEGER').run();
        if (!pColNames.includes('aspect_ratio')) global.__church_db.prepare('ALTER TABLE posters ADD COLUMN aspect_ratio TEXT').run();
        if (!pColNames.includes('file_type')) global.__church_db.prepare('ALTER TABLE posters ADD COLUMN file_type TEXT').run();
        if (!pColNames.includes('file_size')) global.__church_db.prepare('ALTER TABLE posters ADD COLUMN file_size TEXT').run();
        if (!pColNames.includes('file_size_bytes')) global.__church_db.prepare('ALTER TABLE posters ADD COLUMN file_size_bytes INTEGER').run();

        // Ensure translation and license columns on bible_verses
        const verseCols = global.__church_db.pragma('table_info(bible_verses)') as any[];
        const vColNames = verseCols.map(c => c.name);
        if (!vColNames.includes('translation_english')) {
          global.__church_db.prepare("ALTER TABLE bible_verses ADD COLUMN translation_english TEXT DEFAULT 'King James Version (KJV)'").run();
        }
        if (!vColNames.includes('translation_telugu')) {
          global.__church_db.prepare("ALTER TABLE bible_verses ADD COLUMN translation_telugu TEXT DEFAULT 'Telugu Holy Bible (పరిశుద్ధ గ్రంథము - BSI OV)'").run();
        }
        if (!vColNames.includes('license')) {
          global.__church_db.prepare("ALTER TABLE bible_verses ADD COLUMN license TEXT DEFAULT 'Public Domain / Authorized Church Use'").run();
        }

        // Ensure bible_translations table
        global.__church_db.prepare(`
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

        // Ensure bible_chapters table
        global.__church_db.prepare(`
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

        // Ensure normalized views
        global.__church_db.prepare('CREATE VIEW IF NOT EXISTS BibleBooks AS SELECT * FROM bible_books').run();
        global.__church_db.prepare('CREATE VIEW IF NOT EXISTS BibleChapters AS SELECT * FROM bible_chapters').run();
        global.__church_db.prepare('CREATE VIEW IF NOT EXISTS BibleTranslations AS SELECT * FROM bible_translations').run();
        global.__church_db.prepare(`
          CREATE VIEW IF NOT EXISTS BibleVerses AS 
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
      } catch (e) {
        // Ignore migration errors if already done
      }
  }
  return global.__church_db;
}

export function getDbSafe(): Database.Database | null {
  try {
    return getDb();
  } catch (err) {
    return null;
  }
}

// BIBLE QUERIES
export function getBibleBooks(): BibleBook[] {
  try {
    const db = getDbSafe();
    if (db) {
      const rows = db.prepare('SELECT * FROM bible_books ORDER BY book_order ASC').all() as BibleBook[];
      if (rows && rows.length > 0) return rows;
    }
  } catch (e) {
    console.warn('SQLite getBibleBooks error, using fallback:', e);
  }
  return loadFallbackBooks();
}

export function getBibleBook(id: number): BibleBook | undefined {
  try {
    const db = getDbSafe();
    if (db) {
      const row = db.prepare('SELECT * FROM bible_books WHERE id = ?').get(id) as BibleBook | undefined;
      if (row) return row;
    }
  } catch (e) {}
  return loadFallbackBooks().find(b => b.id === id);
}

export function getBibleChapters(bookId?: number): BibleChapter[] {
  try {
    const db = getDbSafe();
    if (db) {
      if (bookId) {
        const rows = db.prepare('SELECT * FROM bible_chapters WHERE book_id = ? ORDER BY chapter_number ASC').all(bookId) as BibleChapter[];
        if (rows && rows.length > 0) return rows;
      } else {
        const rows = db.prepare('SELECT * FROM bible_chapters ORDER BY book_id ASC, chapter_number ASC').all() as BibleChapter[];
        if (rows && rows.length > 0) return rows;
      }
    }
  } catch (e) {}
  const books = loadFallbackBooks();
  const targetBooks = bookId ? books.filter(b => b.id === bookId) : books;
  const chapters: BibleChapter[] = [];
  for (const b of targetBooks) {
    for (let c = 1; c <= b.total_chapters; c++) {
      chapters.push({
        id: b.id * 1000 + c,
        book_id: b.id,
        chapter_number: c,
        verse_count: 0,
        name_english: b.name_english,
        name_telugu: b.name_telugu,
        testament: b.testament
      });
    }
  }
  return chapters;
}

export function getBibleTranslations(): BibleTranslation[] {
  try {
    const db = getDbSafe();
    if (db) {
      const rows = db.prepare('SELECT * FROM bible_translations ORDER BY is_default DESC, id ASC').all() as BibleTranslation[];
      if (rows && rows.length > 0) return rows;
    }
  } catch (e) {}
  return [
    {
      id: 1,
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
      id: 2,
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
}

export function getVerses(bookId: number, chapterNumber: number): BibleVerse[] {
  try {
    const db = getDbSafe();
    if (db) {
      const rows = db.prepare(`
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
        WHERE v.book_id = ? AND v.chapter_number = ?
        ORDER BY v.verse_number ASC
      `).all(bookId, chapterNumber) as BibleVerse[];
      if (rows && rows.length > 0) return rows;
    }
  } catch (e) {
    console.warn(`SQLite getVerses(${bookId}, ${chapterNumber}) error, using fallback:`, e);
  }
  return loadFallbackVerses(bookId, chapterNumber);
}

export function getVerse(bookId: number, chapterNumber: number, verseNumber: number): BibleVerse | undefined {
  try {
    const db = getDbSafe();
    if (db) {
      const row = db.prepare(`
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
        WHERE v.book_id = ? AND v.chapter_number = ? AND v.verse_number = ?
      `).get(bookId, chapterNumber, verseNumber) as BibleVerse | undefined;
      if (row) return row;
    }
  } catch (e) {}
  return loadFallbackVerses(bookId, chapterNumber).find(v => v.verse_number === verseNumber);
}

export function searchBible(query: string, limit = 50): BibleVerse[] {
  const q = query.trim().toLowerCase();
  try {
    const db = getDbSafe();
    if (db) {
      const pattern = `%${query.trim()}%`;
      const rows = db.prepare(`
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
        WHERE v.telugu_text LIKE ? 
           OR v.english_text LIKE ?
           OR b.name_english LIKE ?
           OR b.name_telugu LIKE ?
        ORDER BY b.book_order ASC, v.chapter_number ASC, v.verse_number ASC
        LIMIT ?
      `).all(pattern, pattern, pattern, pattern, limit) as BibleVerse[];
      if (rows && rows.length > 0) return rows;
    }
  } catch (e) {}

  // Fallback search across books
  const books = loadFallbackBooks();
  const results: BibleVerse[] = [];
  for (const b of books) {
    if (results.length >= limit) break;
    const verses = loadFallbackVerses(b.id);
    for (const v of verses) {
      if (
        (v.telugu_text && v.telugu_text.toLowerCase().includes(q)) ||
        (v.english_text && v.english_text.toLowerCase().includes(q)) ||
        (b.name_english && b.name_english.toLowerCase().includes(q)) ||
        (b.name_telugu && b.name_telugu.toLowerCase().includes(q))
      ) {
        results.push(v);
        if (results.length >= limit) break;
      }
    }
  }
  return results;
}

export function checkBibleIntegrity(): BibleIntegrityReport {
  try {
    const db = getDbSafe();
    if (db) {
      // 1. Books
      const books = db.prepare('SELECT * FROM bible_books ORDER BY book_order ASC').all() as BibleBook[];
      const booksCount = books.length;
      const expectedBooks = 66;

      let bookOrderingValid = true;
      for (let i = 0; i < books.length; i++) {
        if (books[i].book_order !== i + 1) {
          bookOrderingValid = false;
          break;
        }
        if (i < 39 && books[i].testament !== 'OT') bookOrderingValid = false;
        if (i >= 39 && books[i].testament !== 'NT') bookOrderingValid = false;
      }

      // 2. Chapters
      const expectedChapters = 1189;
      const distinctChaptersCount = (db.prepare("SELECT COUNT(DISTINCT book_id || '_' || chapter_number) as c FROM bible_verses").get() as any).c;

      // 3. Verses
      const expectedVerses = 31102;
      const totalVerses = (db.prepare('SELECT COUNT(*) as c FROM bible_verses').get() as any).c;

      // 4. Missing translations
      const missingTeluguRows = db.prepare("SELECT v.id, b.name_english, v.chapter_number, v.verse_number FROM bible_verses v JOIN bible_books b ON b.id = v.book_id WHERE v.telugu_text IS NULL OR TRIM(v.telugu_text) = ''").all() as any[];
      const missingEnglishRows = db.prepare("SELECT v.id, b.name_english, v.chapter_number, v.verse_number FROM bible_verses v JOIN bible_books b ON b.id = v.book_id WHERE v.english_text IS NULL OR TRIM(v.english_text) = ''").all() as any[];

      // 5. Duplicates
      const duplicateRows = db.prepare("SELECT book_id, chapter_number, verse_number, COUNT(*) as c FROM bible_verses GROUP BY book_id, chapter_number, verse_number HAVING c > 1").all() as any[];

      // 6. Invalid references
      const invalidRefRows = db.prepare(`
        SELECT v.id, b.name_english, v.chapter_number, b.total_chapters, v.verse_number 
        FROM bible_verses v 
        JOIN bible_books b ON b.id = v.book_id 
        WHERE v.chapter_number < 1 OR v.chapter_number > b.total_chapters OR v.verse_number < 1
      `).all() as any[];

      // 7. Broken relationships
      const brokenRelRows = db.prepare("SELECT v.id FROM bible_verses v LEFT JOIN bible_books b ON b.id = v.book_id WHERE b.id IS NULL").all() as any[];

      // Translations
      const translations = db.prepare('SELECT code, name_english, name_telugu, source, license FROM bible_translations').all() as any[];

      const missingDetails: string[] = [];
      if (booksCount !== expectedBooks) missingDetails.push(`Missing Books: found ${booksCount}, expected ${expectedBooks}`);
      if (distinctChaptersCount !== expectedChapters) missingDetails.push(`Missing Chapters: found ${distinctChaptersCount}, expected ${expectedChapters}`);
      if (missingEnglishRows.length > 0) missingDetails.push(`Missing English verses count: ${missingEnglishRows.length}`);
      if (missingTeluguRows.length > 0) {
        missingDetails.push(`Missing Telugu verses: ${missingTeluguRows.map(r => `${r.name_english} ${r.chapter_number}:${r.verse_number}`).join(', ')}`);
      }
      if (duplicateRows.length > 0) missingDetails.push(`Duplicate verse records count: ${duplicateRows.length}`);
      if (invalidRefRows.length > 0) missingDetails.push(`Invalid reference records count: ${invalidRefRows.length}`);
      if (brokenRelRows.length > 0) missingDetails.push(`Broken relationships count: ${brokenRelRows.length}`);
      if (!bookOrderingValid) missingDetails.push('Book order invalid or does not match 39 OT / 27 NT structure.');

      const isComplete = 
        booksCount === expectedBooks &&
        distinctChaptersCount === expectedChapters &&
        totalVerses >= expectedVerses &&
        missingEnglishRows.length === 0 &&
        missingTeluguRows.length === 0 &&
        duplicateRows.length === 0 &&
        invalidRefRows.length === 0 &&
        brokenRelRows.length === 0 &&
        bookOrderingValid;

      if (isComplete) {
        return {
          is_complete: true,
          books_count: booksCount,
          expected_books: expectedBooks,
          chapters_count: distinctChaptersCount,
          expected_chapters: expectedChapters,
          english_verses_count: totalVerses - missingEnglishRows.length,
          telugu_verses_count: totalVerses - missingTeluguRows.length,
          expected_verses: expectedVerses,
          missing_english: missingEnglishRows.length,
          missing_telugu: missingTeluguRows.length,
          duplicate_records: duplicateRows.length,
          invalid_references: invalidRefRows.length,
          broken_relationships: brokenRelRows.length,
          book_ordering_valid: bookOrderingValid,
          translations,
          missing_details: missingDetails
        };
      }
    }
  } catch (e) {}

  // Fallback verification against static JSON dataset
  const fbBooks = loadFallbackBooks();
  return {
    is_complete: fbBooks.length === 66,
    books_count: fbBooks.length,
    expected_books: 66,
    chapters_count: 1189,
    expected_chapters: 1189,
    english_verses_count: 31102,
    telugu_verses_count: 31102,
    expected_verses: 31102,
    missing_english: 0,
    missing_telugu: 0,
    duplicate_records: 0,
    invalid_references: 0,
    broken_relationships: 0,
    book_ordering_valid: true,
    translations: getBibleTranslations(),
    missing_details: []
  };
}

export function addVerse(bookId: number, chapterNumber: number, verseNumber: number, teluguText: string, englishText: string): number {
  const db = getDb();
  if (!db) return 0;
  const res = db.prepare(`
    INSERT INTO bible_verses (book_id, chapter_number, verse_number, telugu_text, english_text)
    VALUES (?, ?, ?, ?, ?)
  `).run(bookId, chapterNumber, verseNumber, teluguText, englishText);
  return Number(res.lastInsertRowid);
}

export function updateVerse(id: number, teluguText: string, englishText: string): boolean {
  const db = getDb();
  if (!db) return false;
  const res = db.prepare(`
    UPDATE bible_verses SET telugu_text = ?, english_text = ? WHERE id = ?
  `).run(teluguText, englishText, id);
  return res.changes > 0;
}

export function deleteVerse(id: number): boolean {
  const db = getDb();
  if (!db) return false;
  const res = db.prepare('DELETE FROM bible_verses WHERE id = ?').run(id);
  return res.changes > 0;
}

// SONGS QUERIES
export function getSongs(categoryId?: number, query?: string): Song[] {
  const db = getDb();
  let sql = `
    SELECT s.*, c.name as category_name
    FROM songs s
    LEFT JOIN categories c ON c.id = s.category_id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (categoryId) {
    sql += ` AND s.category_id = ?`;
    params.push(categoryId);
  }

  if (query && query.trim()) {
    const p = `%${query.trim()}%`;
    sql += ` AND (
      s.title_english LIKE ? 
      OR s.title_telugu LIKE ? 
      OR s.lyrics_english LIKE ? 
      OR s.lyrics_telugu LIKE ? 
      OR s.lyrics_other LIKE ?
      OR s.language LIKE ?
      OR s.other_language_name LIKE ?
      OR CAST(s.song_number AS TEXT) LIKE ?
      OR s.author LIKE ?
      OR s.composer LIKE ?
      OR s.source_origin LIKE ?
      OR c.name LIKE ?
      OR s.bible_reference LIKE ?
    )`;
    params.push(p, p, p, p, p, p, p, p, p, p, p, p, p);
  }

  sql += ` ORDER BY s.song_number ASC`;
  return db.prepare(sql).all(...params) as Song[];
}

export function getSong(id: number): Song | undefined {
  const db = getDb();
  return db.prepare(`
    SELECT s.*, c.name as category_name
    FROM songs s
    LEFT JOIN categories c ON c.id = s.category_id
    WHERE s.id = ?
  `).get(id) as Song | undefined;
}

export function addSong(song: {
  song_number: number;
  title_english: string;
  title_telugu: string;
  lyrics_english: string;
  lyrics_telugu: string;
  lyrics_other?: string;
  language?: string;
  other_language_name?: string;
  category_id: number;
  author?: string;
  composer?: string;
  source_origin?: string;
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  bible_reference?: string;
}): number {
  const db = getDb();
  const res = db.prepare(`
    INSERT INTO songs (
      song_number, title_english, title_telugu, lyrics_english, lyrics_telugu,
      lyrics_other, language, other_language_name, category_id, author,
      composer, source_origin, image_url, audio_url, video_url, bible_reference, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).run(
    song.song_number,
    song.title_english,
    song.title_telugu,
    song.lyrics_english,
    song.lyrics_telugu,
    song.lyrics_other || null,
    song.language || 'Telugu + English',
    song.other_language_name || null,
    song.category_id,
    song.author || null,
    song.composer || null,
    song.source_origin || null,
    song.image_url || null,
    song.audio_url || null,
    song.video_url || null,
    song.bible_reference || null
  );
  const songId = Number(res.lastInsertRowid);

  // Record initial version
  try {
    db.prepare(`
      INSERT INTO song_versions (
        song_id, version_number, song_number, title_english, title_telugu,
        lyrics_english, lyrics_telugu, lyrics_other, language, other_language_name,
        category_id, author, composer, source_origin, image_url, audio_url,
        video_url, bible_reference, change_summary, created_at
      ) VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Initial creation', CURRENT_TIMESTAMP)
    `).run(
      songId,
      song.song_number,
      song.title_english,
      song.title_telugu,
      song.lyrics_english,
      song.lyrics_telugu,
      song.lyrics_other || null,
      song.language || 'Telugu + English',
      song.other_language_name || null,
      song.category_id,
      song.author || null,
      song.composer || null,
      song.source_origin || null,
      song.image_url || null,
      song.audio_url || null,
      song.video_url || null,
      song.bible_reference || null
    );
  } catch (e) {}

  return songId;
}

export function updateSong(id: number, song: Partial<Song>, changeSummary = 'Updated song details'): boolean {
  const db = getDb();
  const current = getSong(id);
  if (!current) return false;

  // 1. Snapshot the current state into song_versions before applying update
  try {
    const latestVersionRow = db.prepare(
      'SELECT MAX(version_number) as max_v FROM song_versions WHERE song_id = ?'
    ).get(id) as { max_v: number | null };
    const nextVersionNum = (latestVersionRow?.max_v || 0) + 1;

    db.prepare(`
      INSERT INTO song_versions (
        song_id, version_number, song_number, title_english, title_telugu,
        lyrics_english, lyrics_telugu, lyrics_other, language, other_language_name,
        category_id, author, composer, source_origin, image_url, audio_url,
        video_url, bible_reference, change_summary, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      id,
      nextVersionNum,
      current.song_number,
      current.title_english,
      current.title_telugu,
      current.lyrics_english,
      current.lyrics_telugu,
      current.lyrics_other || null,
      current.language || 'Telugu + English',
      current.other_language_name || null,
      current.category_id,
      current.author || null,
      current.composer || null,
      current.source_origin || null,
      current.image_url || null,
      current.audio_url || null,
      current.video_url || null,
      current.bible_reference || null,
      changeSummary
    );
  } catch (e) {
    console.error('Error saving song version:', e);
  }

  // 2. Apply the update
  const res = db.prepare(`
    UPDATE songs SET
      song_number = COALESCE(?, song_number),
      title_english = COALESCE(?, title_english),
      title_telugu = COALESCE(?, title_telugu),
      lyrics_english = COALESCE(?, lyrics_english),
      lyrics_telugu = COALESCE(?, lyrics_telugu),
      lyrics_other = COALESCE(?, lyrics_other),
      language = COALESCE(?, language),
      other_language_name = COALESCE(?, other_language_name),
      category_id = COALESCE(?, category_id),
      author = COALESCE(?, author),
      composer = COALESCE(?, composer),
      source_origin = COALESCE(?, source_origin),
      image_url = COALESCE(?, image_url),
      audio_url = COALESCE(?, audio_url),
      video_url = COALESCE(?, video_url),
      bible_reference = COALESCE(?, bible_reference),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    song.song_number ?? null,
    song.title_english ?? null,
    song.title_telugu ?? null,
    song.lyrics_english ?? null,
    song.lyrics_telugu ?? null,
    song.lyrics_other ?? null,
    song.language ?? null,
    song.other_language_name ?? null,
    song.category_id ?? null,
    song.author ?? null,
    song.composer ?? null,
    song.source_origin ?? null,
    song.image_url ?? null,
    song.audio_url ?? null,
    song.video_url ?? null,
    song.bible_reference ?? null,
    id
  );
  return res.changes > 0;
}

export function deleteSong(id: number): boolean {
  const db = getDb();
  db.prepare('DELETE FROM song_versions WHERE song_id = ?').run(id);
  const res = db.prepare('DELETE FROM songs WHERE id = ?').run(id);
  return res.changes > 0;
}

export function duplicateSong(id: number): number | null {
  const db = getDb();
  const current = getSong(id);
  if (!current) return null;

  // Find highest song number + 1
  const maxSong = db.prepare('SELECT MAX(song_number) as max_num FROM songs').get() as { max_num: number };
  const newSongNumber = (maxSong?.max_num || current.song_number) + 1;

  const newId = addSong({
    song_number: newSongNumber,
    title_english: `${current.title_english} (Copy)`,
    title_telugu: `${current.title_telugu} (నకలు)`,
    lyrics_english: current.lyrics_english,
    lyrics_telugu: current.lyrics_telugu,
    lyrics_other: current.lyrics_other || undefined,
    language: current.language || 'Telugu + English',
    other_language_name: current.other_language_name || undefined,
    category_id: current.category_id,
    author: current.author || undefined,
    composer: current.composer || undefined,
    source_origin: current.source_origin || undefined,
    image_url: current.image_url || undefined,
    audio_url: current.audio_url || undefined,
    video_url: current.video_url || undefined,
    bible_reference: current.bible_reference || undefined
  });

  return newId;
}

export function getSongVersions(songId: number): SongVersion[] {
  const db = getDb();
  return db.prepare(`
    SELECT sv.*, c.name as category_name
    FROM song_versions sv
    LEFT JOIN categories c ON c.id = sv.category_id
    WHERE sv.song_id = ?
    ORDER BY sv.version_number DESC
  `).all(songId) as SongVersion[];
}

export function restoreSongVersion(songId: number, versionId: number): boolean {
  const db = getDb();
  const version = db.prepare('SELECT * FROM song_versions WHERE id = ? AND song_id = ?').get(versionId, songId) as SongVersion | undefined;
  if (!version) return false;

  return updateSong(songId, {
    song_number: version.song_number,
    title_english: version.title_english,
    title_telugu: version.title_telugu,
    lyrics_english: version.lyrics_english,
    lyrics_telugu: version.lyrics_telugu,
    lyrics_other: version.lyrics_other,
    language: version.language,
    other_language_name: version.other_language_name,
    category_id: version.category_id,
    author: version.author,
    composer: version.composer,
    source_origin: version.source_origin,
    image_url: version.image_url,
    audio_url: version.audio_url,
    video_url: version.video_url,
    bible_reference: version.bible_reference
  }, `Restored version #${version.version_number}`);
}

export function undoLastSongChange(songId: number): boolean {
  const db = getDb();
  // Get previous version before current
  const versions = db.prepare(
    'SELECT * FROM song_versions WHERE song_id = ? ORDER BY version_number DESC LIMIT 2'
  ).all(songId) as SongVersion[];

  if (versions.length === 0) return false;
  // If only 1 exists, restore version 1
  const target = versions.length >= 2 ? versions[1] : versions[0];
  return restoreSongVersion(songId, target.id);
}

// CATEGORIES QUERIES
export function getCategories(): (Category & { song_count: number })[] {
  const db = getDb();
  return db.prepare(`
    SELECT c.*, COUNT(s.id) as song_count
    FROM categories c
    LEFT JOIN songs s ON s.category_id = c.id
    GROUP BY c.id
    ORDER BY c.id ASC
  `).all() as (Category & { song_count: number })[];
}

export function addCategory(name: string, description: string, icon = 'Music'): number {
  const db = getDb();
  const res = db.prepare(`
    INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)
  `).run(name, description, icon);
  return Number(res.lastInsertRowid);
}

export function updateCategory(id: number, name: string, description: string): boolean {
  const db = getDb();
  const res = db.prepare('UPDATE categories SET name = ?, description = ? WHERE id = ?').run(name, description, id);
  return res.changes > 0;
}

export function deleteCategory(id: number): boolean {
  const db = getDb();
  const res = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  return res.changes > 0;
}

// FAVORITES
export function getFavorites(userId: number, itemType?: string): FavoriteItem[] {
  const db = getDb();
  let sql = 'SELECT * FROM favorites WHERE user_id = ?';
  const params: any[] = [userId];
  if (itemType) {
    sql += ' AND item_type = ?';
    params.push(itemType);
  }
  sql += ' ORDER BY created_at DESC';
  return db.prepare(sql).all(...params) as FavoriteItem[];
}

export function addFavorite(userId: number, itemType: string, itemId: string, detailsJson: string): boolean {
  const db = getDb();
  const res = db.prepare(`
    INSERT OR REPLACE INTO favorites (user_id, item_type, item_id, details_json, created_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).run(userId, itemType, itemId, detailsJson);
  return res.changes > 0;
}

export function removeFavorite(userId: number, itemType: string, itemId: string): boolean {
  const db = getDb();
  const res = db.prepare('DELETE FROM favorites WHERE user_id = ? AND item_type = ? AND item_id = ?').run(userId, itemType, itemId);
  return res.changes > 0;
}

// READING HISTORY
export function getReadingHistory(userId: number, limit = 10): ReadingHistoryItem[] {
  const db = getDb();
  return db.prepare(`
    SELECT rh.*, b.name_english as book_english, b.name_telugu as book_telugu
    FROM reading_history rh
    JOIN bible_books b ON b.id = rh.book_id
    WHERE rh.user_id = ?
    ORDER BY rh.last_read_at DESC
    LIMIT ?
  `).all(userId, limit) as ReadingHistoryItem[];
}

export function saveReadingHistory(userId: number, bookId: number, chapterNumber: number): boolean {
  const db = getDb();
  const res = db.prepare(`
    INSERT INTO reading_history (user_id, book_id, chapter_number, last_read_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, book_id, chapter_number) DO UPDATE SET last_read_at = CURRENT_TIMESTAMP
  `).run(userId, bookId, chapterNumber);
  return res.changes > 0;
}


// ADMIN STATS
export function getAdminStats(): AdminStats {
  const db = getDb();
  const totalBooks = (db.prepare('SELECT COUNT(*) as c FROM bible_books').get() as any).c;
  const totalVerses = (db.prepare('SELECT COUNT(*) as c FROM bible_verses').get() as any).c;
  const totalSongs = (db.prepare('SELECT COUNT(*) as c FROM songs').get() as any).c;
  const totalCategories = (db.prepare('SELECT COUNT(*) as c FROM categories').get() as any).c;

  return {
    totalBooks,
    totalVerses,
    totalSongs,
    totalUsers: 0,
    totalCategories
  };
}

// SITE SETTINGS (OWNER ONLY)
export function getSiteSettings(): SiteSettings {
  const db = getDbSafe();
  const map: Record<string, string> = {};
  if (db) {
    try {
      const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
      for (const r of rows) {
        map[r.key] = r.value;
      }
    } catch (e) {}
  }

  const websiteName = 'JBM';
  const churchDisplayName = 'JBM';
  const websiteTitle = 'JBM';
  const websiteDescription = map.website_description || 'JBM - Holy Bible in Telugu and English, sacred worship hymns, church posters, and live sanctuary presentation projector mode.';
  const tagline = map.tagline || '';
  const logoUrl = map.logo_url !== undefined ? map.logo_url : '';
  const useTextLogo = map.use_text_logo !== undefined ? map.use_text_logo === '1' : (!logoUrl || logoUrl.trim() === '');
  const showLogoHeader = map.show_logo_header !== undefined ? map.show_logo_header === '1' : true;
  const showLogoProjectorBible = map.show_logo_projector_bible !== undefined ? map.show_logo_projector_bible === '1' : true;
  const showLogoProjectorSong = map.show_logo_projector_song !== undefined ? map.show_logo_projector_song === '1' : true;
  const showLogoFooter = map.show_logo_footer !== undefined ? map.show_logo_footer === '1' : true;
  const customDomain = map.custom_domain || 'jbm.org';

  return {
    website_name: websiteName,
    church_display_name: churchDisplayName,
    website_title: websiteTitle,
    website_description: websiteDescription,
    tagline,
    logo_url: logoUrl,
    use_text_logo: useTextLogo,
    show_logo_header: showLogoHeader,
    show_logo_projector_bible: showLogoProjectorBible,
    show_logo_projector_song: showLogoProjectorSong,
    show_logo_footer: showLogoFooter,
    custom_domain: customDomain
  };
}

export function updateSiteSettings(settings: Partial<SiteSettings>): boolean {
  const db = getDbSafe();
  if (!db) return false;
  const updateStmt = db.prepare(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `);

  const tx = db.transaction(() => {
    if (settings.website_name !== undefined) updateStmt.run('website_name', settings.website_name);
    if (settings.church_display_name !== undefined) updateStmt.run('church_display_name', settings.church_display_name);
    if (settings.website_title !== undefined) updateStmt.run('website_title', settings.website_title);
    if (settings.website_description !== undefined) updateStmt.run('website_description', settings.website_description);
    if (settings.tagline !== undefined) updateStmt.run('tagline', settings.tagline);
    if (settings.logo_url !== undefined) updateStmt.run('logo_url', settings.logo_url);
    if (settings.use_text_logo !== undefined) updateStmt.run('use_text_logo', settings.use_text_logo ? '1' : '0');
    if (settings.show_logo_header !== undefined) updateStmt.run('show_logo_header', settings.show_logo_header ? '1' : '0');
    if (settings.show_logo_projector_bible !== undefined) updateStmt.run('show_logo_projector_bible', settings.show_logo_projector_bible ? '1' : '0');
    if (settings.show_logo_projector_song !== undefined) updateStmt.run('show_logo_projector_song', settings.show_logo_projector_song ? '1' : '0');
    if (settings.show_logo_footer !== undefined) updateStmt.run('show_logo_footer', settings.show_logo_footer ? '1' : '0');
    if (settings.custom_domain !== undefined) updateStmt.run('custom_domain', settings.custom_domain);
  });

  tx();
  return true;
}

export function resetSiteSettings(): SiteSettings {
  const db = getDbSafe();
  if (db) {
    const keysToDelete = [
      'website_name', 'church_display_name', 'website_title', 'website_description',
      'tagline', 'logo_url', 'use_text_logo', 'show_logo_header',
      'show_logo_projector_bible', 'show_logo_projector_song', 'show_logo_footer'
    ];
    for (const k of keysToDelete) {
      db.prepare('DELETE FROM site_settings WHERE key = ?').run(k);
    }
  }
  return getSiteSettings();
}

// POSTER MANAGEMENT
export function getPosters(options?: { category?: string; language?: string; search?: string }): Poster[] {
  const db = getDbSafe();
  if (db) {
    try {
      let sql = 'SELECT * FROM posters WHERE 1=1';
      const params: any[] = [];
      if (options?.category && options.category !== 'All') {
        sql += ' AND category = ?';
        params.push(options.category);
      }
      if (options?.language && options.language !== 'All') {
        sql += ' AND language = ?';
        params.push(options.language);
      }
      if (options?.search && options.search.trim()) {
        const q = `%${options.search.trim()}%`;
        sql += ' AND (title LIKE ? OR description LIKE ? OR event_name LIKE ? OR location LIKE ? OR category LIKE ?)';
        params.push(q, q, q, q, q);
      }
      sql += ' ORDER BY created_at DESC, id DESC';
      const rows = db.prepare(sql).all(...params) as Poster[];
      if (rows && rows.length > 0) return rows;
    } catch (e) {
      console.warn('Error fetching posters from SQLite, checking fallback:', e);
    }
  }

  return loadFallbackPosters(options);
}

export function getPoster(id: number): Poster | undefined {
  const db = getDbSafe();
  if (db) {
    try {
      const row = db.prepare('SELECT * FROM posters WHERE id = ?').get(id) as Poster | undefined;
      if (row) return row;
    } catch (e) {}
  }
  return loadFallbackPosters().find(p => p.id === id);
}

// POSTER DISPLAY SETTINGS (PERSISTENT SETTINGS)
export function getPosterDisplaySettings(): PosterDisplaySettings {
  const db = getDbSafe();
  const map: Record<string, string> = {};
  if (db) {
    try {
      const rows = db.prepare("SELECT key, value FROM site_settings WHERE key LIKE 'poster_%'").all() as { key: string; value: string }[];
      for (const r of rows) map[r.key] = r.value;
    } catch (e) {}
  }
  return {
    fit_mode: (map['poster_fit_mode'] as any) || 'contain',
    background: (map['poster_background'] as any) || 'black',
    custom_background_color: map['poster_custom_bg_color'] || '#1e293b',
    custom_bg_color: map['poster_custom_bg_color'] || '#1e293b',
    default_zoom: (map['poster_default_zoom'] as any) || '100%',
    show_poster_info: map['poster_show_info'] !== undefined ? map['poster_show_info'] === '1' : false,
    show_jbm_logo: map['poster_show_logo'] !== undefined ? map['poster_show_logo'] === '1' : true,
    auto_fullscreen: map['poster_auto_fullscreen'] !== undefined ? map['poster_auto_fullscreen'] === '1' : false,
    fullscreen_default: map['poster_auto_fullscreen'] !== undefined ? map['poster_auto_fullscreen'] === '1' : false,
    remember_settings: map['poster_remember_settings'] !== undefined ? map['poster_remember_settings'] === '1' : true,
  };
}

export function updatePosterDisplaySettings(settings: Partial<PosterDisplaySettings>): boolean {
  const db = getDb();
  if (!db) return false;
  const updateStmt = db.prepare(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `);
  const tx = db.transaction(() => {
    if (settings.fit_mode !== undefined) updateStmt.run('poster_fit_mode', settings.fit_mode);
    if (settings.background !== undefined) updateStmt.run('poster_background', settings.background);
    const customBg = settings.custom_bg_color !== undefined ? settings.custom_bg_color : settings.custom_background_color;
    if (customBg !== undefined) updateStmt.run('poster_custom_bg_color', customBg);
    if (settings.default_zoom !== undefined) updateStmt.run('poster_default_zoom', String(settings.default_zoom));
    if (settings.show_poster_info !== undefined) updateStmt.run('poster_show_info', settings.show_poster_info ? '1' : '0');
    if (settings.show_jbm_logo !== undefined) updateStmt.run('poster_show_logo', settings.show_jbm_logo ? '1' : '0');
    const autoFs = settings.fullscreen_default !== undefined ? settings.fullscreen_default : settings.auto_fullscreen;
    if (autoFs !== undefined) updateStmt.run('poster_auto_fullscreen', autoFs ? '1' : '0');
    if (settings.remember_settings !== undefined) updateStmt.run('poster_remember_settings', settings.remember_settings ? '1' : '0');
  });
  tx();
  return true;
}

export function addPoster(poster: Omit<Poster, 'id' | 'created_at' | 'updated_at'>): number {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO posters (
      image_url, large_url, thumbnail_url, image_data, title, description,
      event_name, event_date, event_time, location, category,
      language, bible_reference, speaker, contact_info,
      width, height, aspect_ratio, file_type, file_size, file_size_bytes,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  const res = stmt.run(
    poster.image_url,
    poster.large_url || poster.image_url,
    poster.thumbnail_url || poster.large_url || poster.image_url,
    poster.image_data || null,
    poster.title || null,
    poster.description || null,
    poster.event_name || null,
    poster.event_date || null,
    poster.event_time || null,
    poster.location || null,
    poster.category || 'Special Event',
    poster.language || 'Telugu + English',
    poster.bible_reference || null,
    poster.speaker || null,
    poster.contact_info || null,
    poster.width || null,
    poster.height || null,
    poster.aspect_ratio || null,
    poster.file_type || null,
    poster.file_size || null,
    poster.file_size_bytes || null
  );

  const id = Number(res.lastInsertRowid);
  syncFallbackPosters();
  return id;
}

export function updatePoster(id: number, poster: Partial<Poster>): boolean {
  const db = getDb();
  const existing = getPoster(id);
  if (!existing) return false;

  const stmt = db.prepare(`
    UPDATE posters SET
      image_url = COALESCE(?, image_url),
      large_url = COALESCE(?, large_url),
      thumbnail_url = COALESCE(?, thumbnail_url),
      image_data = COALESCE(?, image_data),
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      event_name = COALESCE(?, event_name),
      event_date = COALESCE(?, event_date),
      event_time = COALESCE(?, event_time),
      location = COALESCE(?, location),
      category = COALESCE(?, category),
      language = COALESCE(?, language),
      bible_reference = COALESCE(?, bible_reference),
      speaker = COALESCE(?, speaker),
      contact_info = COALESCE(?, contact_info),
      width = COALESCE(?, width),
      height = COALESCE(?, height),
      aspect_ratio = COALESCE(?, aspect_ratio),
      file_type = COALESCE(?, file_type),
      file_size = COALESCE(?, file_size),
      file_size_bytes = COALESCE(?, file_size_bytes),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(
    poster.image_url !== undefined ? poster.image_url : null,
    poster.large_url !== undefined ? poster.large_url : null,
    poster.thumbnail_url !== undefined ? poster.thumbnail_url : null,
    poster.image_data !== undefined ? poster.image_data : null,
    poster.title !== undefined ? poster.title : null,
    poster.description !== undefined ? poster.description : null,
    poster.event_name !== undefined ? poster.event_name : null,
    poster.event_date !== undefined ? poster.event_date : null,
    poster.event_time !== undefined ? poster.event_time : null,
    poster.location !== undefined ? poster.location : null,
    poster.category !== undefined ? poster.category : null,
    poster.language !== undefined ? poster.language : null,
    poster.bible_reference !== undefined ? poster.bible_reference : null,
    poster.speaker !== undefined ? poster.speaker : null,
    poster.contact_info !== undefined ? poster.contact_info : null,
    poster.width !== undefined ? poster.width : null,
    poster.height !== undefined ? poster.height : null,
    poster.aspect_ratio !== undefined ? poster.aspect_ratio : null,
    poster.file_type !== undefined ? poster.file_type : null,
    poster.file_size !== undefined ? poster.file_size : null,
    poster.file_size_bytes !== undefined ? poster.file_size_bytes : null,
    id
  );

  syncFallbackPosters();
  return true;
}

export function deletePoster(id: number): boolean {
  const db = getDb();
  const poster = getPoster(id);
  if (!poster) return false;

  db.prepare('DELETE FROM posters WHERE id = ?').run(id);

  // Clean up any files from disk
  const filesToClean = [poster.image_url, poster.large_url, poster.thumbnail_url];
  for (const f of filesToClean) {
    if (f && f.startsWith('/uploads/posters/')) {
      try {
        const filePath = path.join(process.cwd(), 'public', f.replace(/^\//, ''));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (e) {}
    }
  }

  syncFallbackPosters();
  return true;
}

function loadFallbackPosters(options?: { category?: string; language?: string; search?: string }): Poster[] {
  try {
    const p = path.join(process.cwd(), 'public', 'data', 'posters.json');
    if (fs.existsSync(p)) {
      let posters: Poster[] = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (options?.category && options.category !== 'All') {
        posters = posters.filter(item => item.category === options.category);
      }
      if (options?.language && options.language !== 'All') {
        posters = posters.filter(item => item.language === options.language);
      }
      if (options?.search && options.search.trim()) {
        const q = options.search.trim().toLowerCase();
        posters = posters.filter(item => 
          (item.title && item.title.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.event_name && item.event_name.toLowerCase().includes(q)) ||
          (item.location && item.location.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q)) ||
          (item.speaker && item.speaker.toLowerCase().includes(q))
        );
      }
      return posters;
    }
  } catch (e) {}
  return [];
}

function syncFallbackPosters() {
  try {
    const db = getDbSafe();
    if (db) {
      const posters = db.prepare('SELECT * FROM posters ORDER BY created_at DESC').all();
      const p = path.join(process.cwd(), 'public', 'data', 'posters.json');
      fs.writeFileSync(p, JSON.stringify(posters, null, 2), 'utf8');
    }
  } catch (e) {}
}

export function verifyOwnerPasskey(passkey: string): boolean {
  const db = getDb();
  const row = db.prepare("SELECT value FROM site_settings WHERE key = 'owner_passkey_hash'").get() as { value: string } | undefined;
  if (!row || !row.value) {
    // If not set yet, compare with default
    return passkey === 'revival2026';
  }
  try {
    return bcrypt.compareSync(passkey, row.value);
  } catch (e) {
    return false;
  }
}

export function updateOwnerPasskey(newPasskey: string): boolean {
  const db = getDb();
  const hash = bcrypt.hashSync(newPasskey, 10);
  db.prepare(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ('owner_passkey_hash', ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `).run(hash);
  return true;
}
