/**
 * Generates valid PNG and WebP test poster images for acceptance testing.
 * Resolutions tested:
 * 1. 1920 × 1080 (16:9 Landscape Projector) - PNG
 * 2. 1920 × 1200 (16:10 Landscape) - PNG
 * 3. 1080 × 1350 (4:5 Portrait Service Flyer) - PNG
 * 4. 1080 × 1920 (9:16 Portrait Story/Screen) - WebP
 * 5. 2560 × 1440 (16:9 Quad HD High-Res) - PNG
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const Database = require('better-sqlite3');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'posters');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CRC32 implementation for PNG chunks
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}
const crcTable = makeCrcTable();

function crc32(buf, offset, length) {
  let c = 0xffffffff;
  for (let i = offset; i < offset + length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createPng(width, height, r, g, b) {
  // Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = Buffer.alloc(4 + 4 + 13 + 4);
  ihdrChunk.writeUInt32BE(13, 0);
  ihdrChunk.write('IHDR', 4);
  ihdrData.copy(ihdrChunk, 8);
  const ihdrCrc = crc32(ihdrChunk, 4, 17);
  ihdrChunk.writeUInt32BE(ihdrCrc, 21);

  // Raw image scanlines
  // We can generate a pleasant striped/bordered pattern
  const rowBytes = 1 + width * 3;
  const rawData = Buffer.alloc(rowBytes * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // filter None
    const isBorder = y < 12 || y >= height - 12;
    for (let x = 0; x < width; x++) {
      const isColBorder = x < 12 || x >= width - 12;
      const pxOffset = rowOffset + 1 + x * 3;
      if (isBorder || isColBorder) {
        rawData[pxOffset] = 245;
        rawData[pxOffset + 1] = 158;
        rawData[pxOffset + 2] = 11; // Amber border
      } else {
        // Gradient
        const shade = Math.floor((x / width) * 40);
        rawData[pxOffset] = Math.min(255, r + shade);
        rawData[pxOffset + 1] = Math.min(255, g + shade);
        rawData[pxOffset + 2] = Math.min(255, b + shade);
      }
    }
  }

  const deflated = zlib.deflateSync(rawData, { level: 6 });
  const idatChunk = Buffer.alloc(4 + 4 + deflated.length + 4);
  idatChunk.writeUInt32BE(deflated.length, 0);
  idatChunk.write('IDAT', 4);
  deflated.copy(idatChunk, 8);
  const idatCrc = crc32(idatChunk, 4, 4 + deflated.length);
  idatChunk.writeUInt32BE(idatCrc, 8 + deflated.length);

  // IEND
  const iendChunk = Buffer.alloc(12);
  iendChunk.writeUInt32BE(0, 0);
  iendChunk.write('IEND', 4);
  iendChunk.writeUInt32BE(crc32(iendChunk, 4, 4), 8);

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Minimal valid WebP Extended (VP8X)
function createWebP(width, height) {
  // VP8X header
  const vp8xPayload = Buffer.alloc(10);
  vp8xPayload[0] = 0x00; // flags
  vp8xPayload[1] = 0x00;
  vp8xPayload[2] = 0x00;
  vp8xPayload[3] = 0x00;
  // Canvas width - 1 (24 bits little endian)
  const wMinus1 = width - 1;
  vp8xPayload[4] = wMinus1 & 0xff;
  vp8xPayload[5] = (wMinus1 >> 8) & 0xff;
  vp8xPayload[6] = (wMinus1 >> 16) & 0xff;
  // Canvas height - 1 (24 bits little endian)
  const hMinus1 = height - 1;
  vp8xPayload[7] = hMinus1 & 0xff;
  vp8xPayload[8] = (hMinus1 >> 8) & 0xff;
  vp8xPayload[9] = (hMinus1 >> 16) & 0xff;

  // VP8 lossy minimal frame
  const vp8Keyframe = Buffer.from([
    0x9d, 0x01, 0x2a, // Sync code
    width & 0xff, (width >> 8) & 0x3f,
    height & 0xff, (height >> 8) & 0x3f,
    0x00, 0x00
  ]);
  const vp8Header = Buffer.alloc(10);
  vp8Header[0] = 0x30; // keyframe flag
  vp8Header[1] = 0x00;
  vp8Header[2] = 0x00;
  vp8Keyframe.copy(vp8Header, 3);

  // RIFF header
  const totalRiffSize = 4 + 8 + 10 + 8 + vp8Header.length;
  const riff = Buffer.alloc(12);
  riff.write('RIFF', 0);
  riff.writeUInt32LE(totalRiffSize, 4);
  riff.write('WEBP', 8);

  const vp8xChunk = Buffer.alloc(8 + 10);
  vp8xChunk.write('VP8X', 0);
  vp8xChunk.writeUInt32LE(10, 4);
  vp8xPayload.copy(vp8xChunk, 8);

  const vp8Chunk = Buffer.alloc(8 + vp8Header.length);
  vp8Chunk.write('VP8 ', 0);
  vp8Chunk.writeUInt32LE(vp8Header.length, 4);
  vp8Header.copy(vp8Chunk, 8);

  return Buffer.concat([riff, vp8xChunk, vp8Chunk]);
}

// Generate the 5 test posters
const postersToSeed = [
  {
    title: 'Sunday Worship Celebration & Miracle Service',
    event_name: 'Sunday Worship Service',
    description: 'Join JBM for divine worship, heartfelt praise, and the uncompromised Word of God. Experience transformation and breakthrough.',
    event_date: 'Sunday, Oct 18',
    event_time: '9:30 AM',
    location: 'JBM Main Sanctuary',
    category: 'Sunday Service',
    language: 'Telugu + English',
    bible_reference: 'Psalm 100:4-5',
    speaker: 'Senior Pastor',
    contact_info: '+91 98765 43210',
    width: 1920,
    height: 1080,
    aspect_ratio: '16:9',
    format: 'png',
    color: [16, 85, 60] // Deep emerald
  },
  {
    title: 'Annual Revival Convention 2026',
    event_name: 'Revival Fire Convention',
    description: 'Three nights of supernatural breakthrough, prayer intercession, and holy anointing.',
    event_date: 'Nov 12 - Nov 14',
    event_time: '6:30 PM Daily',
    location: 'JBM Convention Grounds',
    category: 'Special Event',
    language: 'Telugu + English',
    bible_reference: 'Habakkuk 3:2',
    speaker: 'Guest Evangelist',
    contact_info: 'info@jbm.org',
    width: 1920,
    height: 1200,
    aspect_ratio: '16:10',
    format: 'png',
    color: [30, 41, 59] // Slate Navy
  },
  {
    title: 'Youth Ignited Rally & Concert',
    event_name: 'Ignited Youth Conference',
    description: 'Equipping the next generation with Christ-centered purpose, dynamic music, and spiritual empowerment.',
    event_date: 'Saturday, Oct 24',
    event_time: '5:00 PM',
    location: 'JBM Youth Center',
    category: 'Youth',
    language: 'Telugu + English',
    bible_reference: '1 Timothy 4:12',
    speaker: 'Youth Pastor',
    contact_info: 'youth@jbm.org',
    width: 1080,
    height: 1350,
    aspect_ratio: '4:5',
    format: 'png',
    color: [146, 64, 14] // Warm amber/gold
  },
  {
    title: 'Midweek Miracle & Prayer Convention',
    event_name: 'Wednesday Intercession',
    description: 'Gather with believers to seek the Lord in fasting, intercession, and personal deliverance.',
    event_date: 'Every Wednesday',
    event_time: '7:00 PM',
    location: 'JBM Prayer Chapel',
    category: 'Prayer Meeting',
    language: 'Telugu',
    bible_reference: 'Jeremiah 33:3',
    speaker: 'Prayer Team Leaders',
    contact_info: '+91 98765 43210',
    width: 1080,
    height: 1920,
    aspect_ratio: '9:16',
    format: 'webp',
    color: [15, 23, 42]
  },
  {
    title: 'Christmas Gala & Carol Festival 2026',
    event_name: 'JBM Christmas Spectacular',
    description: 'Celebrating the birth of our Lord and Savior Jesus Christ with choir performances, nativity pageant, and festive blessings.',
    event_date: 'Dec 24 - Dec 25',
    event_time: '6:00 PM',
    location: 'JBM Grand Auditorium',
    category: 'Christmas',
    language: 'Telugu + English',
    bible_reference: 'Isaiah 9:6',
    speaker: 'Rev. JBM Leadership',
    contact_info: 'christmas@jbm.org',
    width: 2560,
    height: 1440,
    aspect_ratio: '16:9',
    format: 'png',
    color: [120, 20, 30] // Festive Royal Crimson
  }
];

const dbPath = path.join(__dirname, '..', 'data', 'church.db');
const db = new Database(dbPath);

// Ensure table exists
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

// Ensure column migrations exist
const posterCols = db.pragma('table_info(posters)');
const pColNames = posterCols.map(c => c.name);
const addCol = (col, type) => {
  if (!pColNames.includes(col)) {
    db.prepare(`ALTER TABLE posters ADD COLUMN ${col} ${type}`).run();
  }
};
addCol('large_url', 'TEXT');
addCol('speaker', 'TEXT');
addCol('contact_info', 'TEXT');
addCol('width', 'INTEGER');
addCol('height', 'INTEGER');
addCol('aspect_ratio', 'TEXT');
addCol('file_type', 'TEXT');
addCol('file_size', 'TEXT');
addCol('file_size_bytes', 'INTEGER');

console.log('Seeding multi-resolution test posters into church.db...');

const seededPosters = [];

postersToSeed.forEach((item, index) => {
  const ts = Date.now() + index;
  const fileName = `poster-test-${ts}-${item.width}x${item.height}.${item.format}`;
  const filePath = path.join(uploadsDir, fileName);
  const fileUrl = `/uploads/posters/${fileName}`;

  let buffer;
  if (item.format === 'webp') {
    buffer = createWebP(item.width, item.height);
  } else {
    buffer = createPng(item.width, item.height, item.color[0], item.color[1], item.color[2]);
  }

  fs.writeFileSync(filePath, buffer);

  // Generate thumbnail and large representations
  const thumbName = `thumb-${fileName}.png`;
  const thumbPath = path.join(uploadsDir, thumbName);
  const thumbUrl = `/uploads/posters/${thumbName}`;
  const thumbBuf = createPng(Math.round(item.width / 4), Math.round(item.height / 4), item.color[0], item.color[1], item.color[2]);
  fs.writeFileSync(thumbPath, thumbBuf);

  const largeName = `large-${fileName}.png`;
  const largePath = path.join(uploadsDir, largeName);
  const largeUrl = `/uploads/posters/${largeName}`;
  fs.writeFileSync(largePath, buffer);

  const fileSizeStr = `${(buffer.length / 1024).toFixed(1)} KB`;

  // Insert into SQLite
  const stmt = db.prepare(`
    INSERT INTO posters (
      image_url, thumbnail_url, large_url, title, description,
      event_name, event_date, event_time, location, category,
      language, bible_reference, speaker, contact_info,
      width, height, aspect_ratio, file_type, file_size, file_size_bytes,
      created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
  `);

  const info = stmt.run(
    fileUrl,
    thumbUrl,
    largeUrl,
    item.title,
    item.description,
    item.event_name,
    item.event_date,
    item.event_time,
    item.location,
    item.category,
    item.language,
    item.bible_reference,
    item.speaker,
    item.contact_info,
    item.width,
    item.height,
    item.aspect_ratio,
    item.format.toUpperCase(),
    fileSizeStr,
    buffer.length
  );

  seededPosters.push({
    id: info.lastInsertRowid,
    image_url: fileUrl,
    thumbnail_url: thumbUrl,
    large_url: largeUrl,
    title: item.title,
    description: item.description,
    event_name: item.event_name,
    event_date: item.event_date,
    event_time: item.event_time,
    location: item.location,
    category: item.category,
    language: item.language,
    bible_reference: item.bible_reference,
    speaker: item.speaker,
    contact_info: item.contact_info,
    width: item.width,
    height: item.height,
    aspect_ratio: item.aspect_ratio,
    file_type: item.format.toUpperCase(),
    file_size: fileSizeStr,
    file_size_bytes: buffer.length,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  console.log(`✓ Seeded ${item.width}×${item.height} (${item.aspect_ratio}) [${item.format.toUpperCase()}]: ${item.title}`);
});

// Sync to public/data/posters.json
const jsonPath = path.join(__dirname, '..', 'public', 'data', 'posters.json');
const allRows = db.prepare('SELECT * FROM posters ORDER BY id DESC').all();
fs.writeFileSync(jsonPath, JSON.stringify(allRows, null, 2), 'utf-8');
console.log(`✓ Synced ${allRows.length} total posters to ${jsonPath}`);

db.close();
console.log('Seeding complete successfully!');
