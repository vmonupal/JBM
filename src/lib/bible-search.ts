import { getDb } from './db';
import { BibleVerse } from './types';
import { parseBibleReference as parseRawRef, type ParsedBibleReference } from './bible-reference-parser';

export type { ParsedBibleReference };
export { parseRawRef };

export function parseBibleReference(rawInput: string): ParsedBibleReference | null {
  const parsed = parseRawRef(rawInput);
  if (!parsed) return null;

  if (parsed.verse) {
    const db = getDb();
    const exactVerse = db.prepare(`
      SELECT v.*, b.name_english as book_english, b.name_telugu as book_telugu
      FROM bible_verses v
      JOIN bible_books b ON b.id = v.book_id
      WHERE v.book_id = ? AND v.chapter_number = ? AND v.verse_number = ?
    `).get(parsed.bookId, parsed.chapter, parsed.verse) as BibleVerse | undefined;
    parsed.exactVerse = exactVerse;
  }

  return parsed;
}

export function searchBibleUniversal(rawQuery: string, limit = 50): {
  reference: ParsedBibleReference | null;
  verses: BibleVerse[];
} {
  const query = (rawQuery || '').trim();
  if (!query) {
    return { reference: null, verses: [] };
  }

  // 1. Try reference parse first
  const parsedRef = parseBibleReference(query);

  // 2. Perform full database word/phrase search across all 66 books (31,102 verses)
  const db = getDb();
  const pattern = `%${query}%`;
  const verses = db.prepare(`
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

  return {
    reference: parsedRef,
    verses
  };
}
