const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'church.db');
const db = new Database(dbPath);

const count = db.prepare('SELECT count(*) as c FROM songs').get().c;
console.log('Current songs count:', count);

if (count === 0) {
  const songsPath = path.join(__dirname, '..', 'src', 'data', 'church_songs.json');
  const songs = JSON.parse(fs.readFileSync(songsPath, 'utf8'));

  const insert = db.prepare(`
    INSERT INTO songs (
      id, song_number, title_english, title_telugu, lyrics_english, lyrics_telugu,
      category_id, author, audio_url, video_url, language, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Telugu + English', CURRENT_TIMESTAMP)
  `);

  const insertVersion = db.prepare(`
    INSERT INTO song_versions (
      song_id, version_number, song_number, title_english, title_telugu,
      lyrics_english, lyrics_telugu, category_id, author, audio_url, video_url,
      language, change_summary, created_at
    ) VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Telugu + English', 'Initial version', CURRENT_TIMESTAMP)
  `);

  const seedTx = db.transaction(() => {
    for (const s of songs) {
      insert.run(
        s.id,
        s.song_number,
        s.title_english,
        s.title_telugu,
        s.lyrics_english,
        s.lyrics_telugu,
        s.category_id,
        s.author || null,
        s.audio_url || null,
        s.video_url || null
      );
      insertVersion.run(
        s.id,
        s.song_number,
        s.title_english,
        s.title_telugu,
        s.lyrics_english,
        s.lyrics_telugu,
        s.category_id,
        s.author || null,
        s.audio_url || null,
        s.video_url || null
      );
    }
  });

  seedTx();
  console.log(`Successfully seeded ${songs.length} songs with version history!`);
} else {
  console.log('Songs table already contains data.');
}
