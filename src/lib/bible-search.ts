import { getVerse, searchBible } from './db';
import { BibleVerse } from './types';
import { parseBibleReference as parseRawRef, type ParsedBibleReference } from './bible-reference-parser';

export type { ParsedBibleReference };
export { parseRawRef };

export function parseBibleReference(rawInput: string): ParsedBibleReference | null {
  const parsed = parseRawRef(rawInput);
  if (!parsed) return null;

  if (parsed.verse) {
    const exactVerse = getVerse(parsed.bookId, parsed.chapter, parsed.verse);
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
  const verses = searchBible(query, limit);

  return {
    reference: parsedRef,
    verses
  };
}

