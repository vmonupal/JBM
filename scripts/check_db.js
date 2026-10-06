const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'data', 'church.db'));

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));

// Drop users or members table if exists as per Rule 21
for (const t of ['users', 'members', 'user_profiles']) {
  if (tables.some(row => row.name === t)) {
    db.prepare(`DROP TABLE IF EXISTS ${t}`).run();
    console.log(`Dropped forbidden table: ${t}`);
  }
}
