const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'church.db');
const db = new Database(dbPath);

try {
  // Ensure posters table
  db.prepare(`
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Update default branding to JBM
  const updateStmt = db.prepare(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `);

  updateStmt.run('website_name', 'JBM');
  updateStmt.run('church_display_name', 'JBM');
  updateStmt.run('website_title', 'JBM');
  updateStmt.run('website_description', 'JBM - Holy Bible in Telugu and English, sacred worship hymns, church posters, and live sanctuary presentation projector mode.');
  updateStmt.run('tagline', '');
  updateStmt.run('logo_url', '');
  updateStmt.run('use_text_logo', '1');
  updateStmt.run('show_logo_header', '1');
  updateStmt.run('show_logo_projector_bible', '1');
  updateStmt.run('show_logo_projector_song', '1');
  updateStmt.run('show_logo_footer', '1');
  updateStmt.run('custom_domain', 'jbm.org');

  console.log('Site branding updated to JBM in SQLite!');

  // Seed posters
  const count = (db.prepare('SELECT COUNT(*) as c FROM posters').get()).c;
  console.log(`Current posters in DB: ${count}`);
  if (count === 0) {
    const seedPath = path.join(__dirname, '..', 'public', 'data', 'posters.json');
    if (fs.existsSync(seedPath)) {
      const posters = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      const insert = db.prepare(`
        INSERT INTO posters (
          image_url, thumbnail_url, title, description, event_name,
          event_date, event_time, location, category, language, bible_reference
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const p of posters) {
        insert.run(
          p.image_url, p.thumbnail_url, p.title, p.description, p.event_name,
          p.event_date, p.event_time, p.location, p.category, p.language, p.bible_reference
        );
      }
      console.log(`Seeded ${posters.length} posters into SQLite DB.`);
    }
  }

  console.log('Seed completed successfully!');
} catch (e) {
  console.error('Seed error:', e);
}
