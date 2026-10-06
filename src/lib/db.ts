import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { BibleBook, BibleVerse, Song, SongVersion, Category, SiteSettings, FavoriteItem, ReadingHistoryItem, AdminStats } from './types';

const dbPath = path.join(process.cwd(), 'data', 'church.db');

declare global {
  var __church_db: Database.Database | undefined;
}

export function getDb(): Database.Database {
  if (!global.__church_db) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    global.__church_db = new Database(dbPath);
    global.__church_db.pragma('journal_mode = WAL');

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
    } catch (e) {
      // Ignore migration errors if already done
    }
  }
  return global.__church_db;
}

// BIBLE QUERIES
export function getBibleBooks(): BibleBook[] {
  const db = getDb();
  return db.prepare('SELECT * FROM bible_books ORDER BY book_order ASC').all() as BibleBook[];
}

export function getBibleBook(id: number): BibleBook | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM bible_books WHERE id = ?').get(id) as BibleBook | undefined;
}

export function getVerses(bookId: number, chapterNumber: number): BibleVerse[] {
  const db = getDb();
  return db.prepare(`
    SELECT v.*, b.name_english as book_english, b.name_telugu as book_telugu
    FROM bible_verses v
    JOIN bible_books b ON b.id = v.book_id
    WHERE v.book_id = ? AND v.chapter_number = ?
    ORDER BY v.verse_number ASC
  `).all(bookId, chapterNumber) as BibleVerse[];
}

export function getVerse(bookId: number, chapterNumber: number, verseNumber: number): BibleVerse | undefined {
  const db = getDb();
  return db.prepare(`
    SELECT v.*, b.name_english as book_english, b.name_telugu as book_telugu
    FROM bible_verses v
    JOIN bible_books b ON b.id = v.book_id
    WHERE v.book_id = ? AND v.chapter_number = ? AND v.verse_number = ?
  `).get(bookId, chapterNumber, verseNumber) as BibleVerse | undefined;
}

export function searchBible(query: string, limit = 50): BibleVerse[] {
  const db = getDb();
  const pattern = `%${query.trim()}%`;
  return db.prepare(`
    SELECT v.*, b.name_english as book_english, b.name_telugu as book_telugu
    FROM bible_verses v
    JOIN bible_books b ON b.id = v.book_id
    WHERE v.telugu_text LIKE ? 
       OR v.english_text LIKE ?
       OR b.name_english LIKE ?
       OR b.name_telugu LIKE ?
    ORDER BY b.book_order ASC, v.chapter_number ASC, v.verse_number ASC
    LIMIT ?
  `).all(pattern, pattern, pattern, pattern, limit) as BibleVerse[];
}

export function addVerse(bookId: number, chapterNumber: number, verseNumber: number, teluguText: string, englishText: string): number {
  const db = getDb();
  const res = db.prepare(`
    INSERT INTO bible_verses (book_id, chapter_number, verse_number, telugu_text, english_text)
    VALUES (?, ?, ?, ?, ?)
  `).run(bookId, chapterNumber, verseNumber, teluguText, englishText);
  return Number(res.lastInsertRowid);
}

export function updateVerse(id: number, teluguText: string, englishText: string): boolean {
  const db = getDb();
  const res = db.prepare(`
    UPDATE bible_verses SET telugu_text = ?, english_text = ? WHERE id = ?
  `).run(teluguText, englishText, id);
  return res.changes > 0;
}

export function deleteVerse(id: number): boolean {
  const db = getDb();
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
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
  const map: Record<string, string> = {};
  for (const r of rows) {
    map[r.key] = r.value;
  }

  return {
    website_name: map.website_name || 'Revival Chapel',
    church_display_name: map.church_display_name || 'Revival Chapel Sanctuary',
    website_title: map.website_title || 'Revival Chapel - Public Bible & Worship Song Library',
    website_description: map.website_description || 'Public Bilingual Scripture Preaching, Sacred Worship Hymns, and Church Projector Sanctuary',
    logo_url: map.logo_url || '/images/revival-chapel-logo.jpg',
    custom_domain: map.custom_domain || 'revivalchapel.org'
  };
}

export function updateSiteSettings(settings: Partial<SiteSettings>): boolean {
  const db = getDb();
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
    if (settings.logo_url !== undefined) updateStmt.run('logo_url', settings.logo_url);
    if (settings.custom_domain !== undefined) updateStmt.run('custom_domain', settings.custom_domain);
  });

  tx();
  return true;
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

