const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'data', 'church.db'));

const tableInfo = db.pragma('table_info(songs)');
const cols = tableInfo.map(c => c.name);

if (!cols.includes('bible_reference')) {
  db.prepare('ALTER TABLE songs ADD COLUMN bible_reference TEXT').run();
  console.log('Added bible_reference column to songs');
}

if (!cols.includes('updated_at')) {
  db.prepare('ALTER TABLE songs ADD COLUMN updated_at DATETIME').run();
  db.prepare('UPDATE songs SET updated_at = created_at WHERE updated_at IS NULL').run();
  console.log('Added updated_at column to songs');
}

db.prepare(`
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
    audio_url TEXT,
    video_url TEXT,
    bible_reference TEXT,
    change_summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE
  )
`).run();
console.log('Created song_versions table');

// Ensure standard categories exist
const standardCategories = [
  { name: 'Worship', description: 'Songs of deep reverence, adoration, and intimacy with God.', icon: 'Flame' },
  { name: 'Praise', description: "Joyful songs celebrating God's power, majesty, and goodness.", icon: 'Music' },
  { name: 'Prayer', description: "Heartfelt supplication, intercession, and seeking God's face.", icon: 'HeartHandshake' },
  { name: 'Christmas', description: 'Celebration of the birth of our Lord and Savior Jesus Christ.', icon: 'Sparkles' },
  { name: 'Easter', description: 'Celebrating the triumphant resurrection and victory over the grave.', icon: 'Sun' },
  { name: 'Youth', description: 'High-energy, contemporary worship songs for young believers.', icon: 'Zap' },
  { name: 'Sunday School', description: 'Uplifting, memorable faith songs for children and Sunday school.', icon: 'Smile' },
  { name: 'Traditional', description: 'Timeless church hymns and historic spiritual classics.', icon: 'BookOpen' },
  { name: 'Telugu Songs', description: 'Authentic Telugu devotional hymns and spiritual geethalu.', icon: 'Scroll' },
  { name: 'English Songs', description: 'Classic and contemporary English gospel and worship songs.', icon: 'Globe' },
  { name: 'Other', description: 'Other devotional songs and spiritual hymns.', icon: 'Music' }
];

for (const cat of standardCategories) {
  const existing = db.prepare('SELECT * FROM categories WHERE LOWER(name) = LOWER(?)').get(cat.name);
  if (!existing) {
    db.prepare('INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)').run(cat.name, cat.description, cat.icon);
    console.log('Added category:', cat.name);
  }
}

// Update existing 'Telugu Christian Songs' to 'Telugu Songs' if desired or keep both
const teluguOld = db.prepare("SELECT * FROM categories WHERE name = 'Telugu Christian Songs'").get();
if (teluguOld) {
  db.prepare("UPDATE categories SET name = 'Telugu Songs' WHERE id = ?").run(teluguOld.id);
}
const englishOld = db.prepare("SELECT * FROM categories WHERE name = 'English Christian Songs'").get();
if (englishOld) {
  db.prepare("UPDATE categories SET name = 'English Songs' WHERE id = ?").run(englishOld.id);
}

// Initial populate of song_versions for existing songs if not present
const songs = db.prepare('SELECT * FROM songs').all();
for (const s of songs) {
  const existingVersion = db.prepare('SELECT * FROM song_versions WHERE song_id = ?').get(s.id);
  if (!existingVersion) {
    db.prepare(`
      INSERT INTO song_versions (
        song_id, version_number, song_number, title_english, title_telugu,
        lyrics_english, lyrics_telugu, category_id, author, audio_url,
        video_url, bible_reference, change_summary, created_at
      ) VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Initial version', COALESCE(?, CURRENT_TIMESTAMP))
    `).run(
      s.id, s.song_number, s.title_english, s.title_telugu,
      s.lyrics_english, s.lyrics_telugu, s.category_id, s.author, s.audio_url,
      s.video_url, s.bible_reference || null, s.created_at
    );
  }
}

console.log('Migration complete successfully');
