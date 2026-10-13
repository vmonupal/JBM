const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new Database(path.join(__dirname, '..', 'data', 'church.db'));

// 1. Add new columns to songs table
const songsInfo = db.pragma('table_info(songs)');
const songCols = songsInfo.map(c => c.name);

const songColsToAdd = [
  { name: 'language', type: "TEXT DEFAULT 'Telugu + English'" },
  { name: 'lyrics_other', type: 'TEXT' },
  { name: 'other_language_name', type: 'TEXT' },
  { name: 'composer', type: 'TEXT' },
  { name: 'source_origin', type: 'TEXT' },
  { name: 'image_url', type: 'TEXT' }
];

for (const col of songColsToAdd) {
  if (!songCols.includes(col.name)) {
    db.prepare(`ALTER TABLE songs ADD COLUMN ${col.name} ${col.type}`).run();
    console.log(`Added column ${col.name} to songs table`);
  }
}

// 2. Add matching columns to song_versions table
const versionInfo = db.pragma('table_info(song_versions)');
const versionCols = versionInfo.map(c => c.name);

const versionColsToAdd = [
  { name: 'language', type: 'TEXT' },
  { name: 'lyrics_other', type: 'TEXT' },
  { name: 'other_language_name', type: 'TEXT' },
  { name: 'composer', type: 'TEXT' },
  { name: 'source_origin', type: 'TEXT' },
  { name: 'image_url', type: 'TEXT' }
];

for (const col of versionColsToAdd) {
  if (!versionCols.includes(col.name)) {
    db.prepare(`ALTER TABLE song_versions ADD COLUMN ${col.name} ${col.type}`).run();
    console.log(`Added column ${col.name} to song_versions table`);
  }
}

// 3. Create site_settings table for Owner branding & domain management
db.prepare(`
  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();
console.log('Verified site_settings table');

// Insert default site settings if not present
const defaultSettings = [
  { key: 'website_name', value: 'JBM' },
  { key: 'church_display_name', value: 'JBM' },
  { key: 'website_title', value: 'JBM' },
  { key: 'website_description', value: 'JBM - Holy Bible in Telugu and English, sacred worship hymns, church posters, and live sanctuary presentation projector mode.' },
  { key: 'logo_url', value: '' },
  { key: 'custom_domain', value: 'jbm.org' },
  { key: 'owner_passkey_hash', value: bcrypt.hashSync('revival2026', 10) }
];

for (const s of defaultSettings) {
  const existing = db.prepare('SELECT * FROM site_settings WHERE key = ?').get(s.key);
  if (!existing) {
    db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run(s.key, s.value);
    console.log(`Initialized site setting: ${s.key}`);
  }
}

// Ensure any users table is dropped
db.prepare('DROP TABLE IF EXISTS users').run();
db.prepare('DROP TABLE IF EXISTS members').run();

console.log('Migration v2 complete successfully.');
