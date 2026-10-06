import { BibleVerse } from './types';

export interface ParsedBibleReference {
  bookId: number;
  bookEnglish: string;
  bookTelugu: string;
  chapter: number;
  verse?: number;
  exactVerse?: BibleVerse;
}

// Normalized book mapping dictionary (all 66 books in English & Telugu with aliases)
export interface BookMatch {
  id: number;
  english: string;
  telugu: string;
  aliases: string[];
}

export const BOOK_ALIASES: BookMatch[] = [
  { id: 1, english: 'Genesis', telugu: 'ఆదికాండము', aliases: ['genesis', 'gen', 'ఆదికాండము', 'ఆది'] },
  { id: 2, english: 'Exodus', telugu: 'నిర్గమకాండము', aliases: ['exodus', 'exod', 'ex', 'నిర్గమకాండము', 'నిర్గమ'] },
  { id: 3, english: 'Leviticus', telugu: 'లేవీయకాండము', aliases: ['leviticus', 'lev', 'లేవీయకాండము', 'లేవీయ'] },
  { id: 4, english: 'Numbers', telugu: 'సంఖ్యాకాండము', aliases: ['numbers', 'num', 'సంఖ్యాకాండము', 'సంఖ్యా'] },
  { id: 5, english: 'Deuteronomy', telugu: 'ద్వితీయోపదేశకాండము', aliases: ['deuteronomy', 'deut', 'dt', 'ద్వితీయోపదేశకాండము', 'ద్వితీయోపదేశ'] },
  { id: 6, english: 'Joshua', telugu: 'యెహోషువ', aliases: ['joshua', 'josh', 'యెహోషువ'] },
  { id: 7, english: 'Judges', telugu: 'న్యాయాధిపతులు', aliases: ['judges', 'judg', 'న్యాయాధిపతులు'] },
  { id: 8, english: 'Ruth', telugu: 'రూతు', aliases: ['ruth', 'రూతు'] },
  { id: 9, english: '1 Samuel', telugu: '1 సమూయేలు', aliases: ['1 samuel', '1samuel', '1sam', '1 sam', '1 సమూయేలు', '1సమూయేలు'] },
  { id: 10, english: '2 Samuel', telugu: '2 సమూయేలు', aliases: ['2 samuel', '2samuel', '2sam', '2 sam', '2 సమూయేలు', '2సమూయేలు'] },
  { id: 11, english: '1 Kings', telugu: '1 రాజులు', aliases: ['1 kings', '1kings', '1kgs', '1 kgs', '1 రాజులు', '1రాజులు'] },
  { id: 12, english: '2 Kings', telugu: '2 రాజులు', aliases: ['2 kings', '2kings', '2kgs', '2 kgs', '2 రాజులు', '2రాజులు'] },
  { id: 13, english: '1 Chronicles', telugu: '1 దినవృత్తాంతములు', aliases: ['1 chronicles', '1chronicles', '1chron', '1 chron', '1 దినవృత్తాంతములు', '1దినవృత్తాంతములు'] },
  { id: 14, english: '2 Chronicles', telugu: '2 దినవృత్తాంతములు', aliases: ['2 chronicles', '2chronicles', '2chron', '2 chron', '2 దినవృత్తాంతములు', '2దినవృత్తాంతములు'] },
  { id: 15, english: 'Ezra', telugu: 'ఎజ్రా', aliases: ['ezra', 'ezr', 'ఎజ్రా'] },
  { id: 16, english: 'Nehemiah', telugu: 'నెహెమ్యా', aliases: ['nehemiah', 'neh', 'నెహెమ్యా'] },
  { id: 17, english: 'Esther', telugu: 'ఎస్తేరు', aliases: ['esther', 'esth', 'ఎస్తేరు'] },
  { id: 18, english: 'Job', telugu: 'యోబు', aliases: ['job', 'యోబు'] },
  { id: 19, english: 'Psalms', telugu: 'కీర్తనలు', aliases: ['psalms', 'psalm', 'ps', 'psa', 'కీర్తనలు', 'కీర్తన'] },
  { id: 20, english: 'Proverbs', telugu: 'సామెతలు', aliases: ['proverbs', 'prov', 'prv', 'సామెతలు'] },
  { id: 21, english: 'Ecclesiastes', telugu: 'ప్రసంగి', aliases: ['ecclesiastes', 'eccl', 'ecc', 'ప్రసంగి'] },
  { id: 22, english: 'Song of Solomon', telugu: 'పరమగీతము', aliases: ['song of solomon', 'song of songs', 'song', 'songs', 'పరమగీతము', 'పరమగీతములు'] },
  { id: 23, english: 'Isaiah', telugu: 'యెషయా', aliases: ['isaiah', 'isa', 'యెషయా'] },
  { id: 24, english: 'Jeremiah', telugu: 'యిర్మీయా', aliases: ['jeremiah', 'jer', 'యిర్మీయా'] },
  { id: 25, english: 'Lamentations', telugu: 'విలాపవాక్యములు', aliases: ['lamentations', 'lam', 'విలాపవాక్యములు'] },
  { id: 26, english: 'Ezekiel', telugu: 'యెహెజ్కేలు', aliases: ['ezekiel', 'ezek', 'యెహెజ్కేలు'] },
  { id: 27, english: 'Daniel', telugu: 'దానియేలు', aliases: ['daniel', 'dan', 'దానియేలు'] },
  { id: 28, english: 'Hosea', telugu: 'హోషేయ', aliases: ['hosea', 'hos', 'హోషేయ'] },
  { id: 29, english: 'Joel', telugu: 'యోవేలు', aliases: ['joel', 'యోవేలు'] },
  { id: 30, english: 'Amos', telugu: 'ఆమోసు', aliases: ['amos', 'am', 'ఆమోసు'] },
  { id: 31, english: 'Obadiah', telugu: 'ఓబద్యా', aliases: ['obadiah', 'obad', 'ఓబద్యా'] },
  { id: 32, english: 'Jonah', telugu: 'యోనా', aliases: ['jonah', 'jon', 'యోనా'] },
  { id: 33, english: 'Micah', telugu: 'మీకా', aliases: ['micah', 'mic', 'మీకా'] },
  { id: 34, english: 'Nahum', telugu: 'నహూము', aliases: ['nahum', 'nah', 'నహూము'] },
  { id: 35, english: 'Habakkuk', telugu: 'హబక్కూకు', aliases: ['habakkuk', 'hab', 'హబక్కూకు'] },
  { id: 36, english: 'Zephaniah', telugu: 'జెఫన్యా', aliases: ['zephaniah', 'zeph', 'జెఫన్యా'] },
  { id: 37, english: 'Haggai', telugu: 'హగ్గయి', aliases: ['haggai', 'hag', 'హగ్గయి'] },
  { id: 38, english: 'Zechariah', telugu: 'జెకర్యా', aliases: ['zechariah', 'zech', 'జెకర్యా'] },
  { id: 39, english: 'Malachi', telugu: 'మలాకీ', aliases: ['malachi', 'mal', 'మలాకీ'] },
  { id: 40, english: 'Matthew', telugu: 'మత్తయి సువార్త', aliases: ['matthew', 'matt', 'mt', 'మత్తయి సువార్త', 'మత్తయి'] },
  { id: 41, english: 'Mark', telugu: 'మార్కు సువార్త', aliases: ['mark', 'mk', 'mrk', 'మార్కు సువార్త', 'మార్కు'] },
  { id: 42, english: 'Luke', telugu: 'లూకా సువార్త', aliases: ['luke', 'lk', 'luk', 'లూకా సువార్త', 'లూకా'] },
  { id: 43, english: 'John', telugu: 'యోహాను సువార్త', aliases: ['john', 'jn', 'jhn', 'యోహాను సువార్త', 'యోహాను'] },
  { id: 44, english: 'Acts', telugu: 'అపొస్తలుల కార్యములు', aliases: ['acts', 'act', 'అపొస్తలుల కార్యములు', 'అపొస్తలుల'] },
  { id: 45, english: 'Romans', telugu: 'రోమీయులకు', aliases: ['romans', 'rom', 'రోమీయులకు', 'రోమా'] },
  { id: 46, english: '1 Corinthians', telugu: '1 కొరింథీయులకు', aliases: ['1 corinthians', '1corinthians', '1cor', '1 cor', '1 కొరింథీయులకు', '1 కొరింథి', '1కొరింథీయులకు'] },
  { id: 47, english: '2 Corinthians', telugu: '2 కొరింథీయులకు', aliases: ['2 corinthians', '2corinthians', '2cor', '2 cor', '2 కొరింథీయులకు', '2 కొరింథి', '2కొరింథీయులకు'] },
  { id: 48, english: 'Galatians', telugu: 'గలతీయులకు', aliases: ['galatians', 'gal', 'గలతీయులకు', 'గలతీ'] },
  { id: 49, english: 'Ephesians', telugu: 'ఎఫెసీయులకు', aliases: ['ephesians', 'eph', 'ఎఫెసీయులకు', 'ఎఫెసి'] },
  { id: 50, english: 'Philippians', telugu: 'ఫిలిప్పీయులకు', aliases: ['philippians', 'phil', 'php', 'ఫిలిప్పీయులకు', 'ఫిలిప్పి'] },
  { id: 51, english: 'Colossians', telugu: 'కొలస్సీయులకు', aliases: ['colossians', 'col', 'కొలస్సీయులకు', 'కొలస్సి'] },
  { id: 52, english: '1 Thessalonians', telugu: '1 థెస్సలొనీకయులకు', aliases: ['1 thessalonians', '1thessalonians', '1thess', '1 thess', '1 థెస్సలొనీకయులకు'] },
  { id: 53, english: '2 Thessalonians', telugu: '2 థెస్సలొనీకయులకు', aliases: ['2 thessalonians', '2thessalonians', '2thess', '2 thess', '2 థెస్సలొనీకయులకు'] },
  { id: 54, english: '1 Timothy', telugu: '1 తిమోతికి', aliases: ['1 timothy', '1timothy', '1tim', '1 tim', '1 తిమోతికి', '1 తిమోతి'] },
  { id: 55, english: '2 Timothy', telugu: '2 తిమోతికి', aliases: ['2 timothy', '2timothy', '2tim', '2 tim', '2 తిమోతికి', '2 తిమోతి'] },
  { id: 56, english: 'Titus', telugu: 'తీతుకు', aliases: ['titus', 'tit', 'తీతుకు', 'తీతు'] },
  { id: 57, english: 'Philemon', telugu: 'ఫిలేమోనుకు', aliases: ['philemon', 'phlm', 'ఫిలేమోనుకు', 'ఫిలేమోను'] },
  { id: 58, english: 'Hebrews', telugu: 'హెబ్రీయులకు', aliases: ['hebrews', 'heb', 'హెబ్రీయులకు', 'హెబ్రీ'] },
  { id: 59, english: 'James', telugu: 'యాకోబు', aliases: ['james', 'jas', 'యాకోబు'] },
  { id: 60, english: '1 Peter', telugu: '1 పేతురు', aliases: ['1 peter', '1peter', '1pet', '1 pet', '1 పేతురు', '1పేతురు'] },
  { id: 61, english: '2 Peter', telugu: '2 పేతురు', aliases: ['2 peter', '2peter', '2pet', '2 pet', '2 పేతురు', '2పేతురు'] },
  { id: 62, english: '1 John', telugu: '1 యోహాను', aliases: ['1 john', '1john', '1jn', '1 jn', '1 యోహాను', '1యోహాను'] },
  { id: 63, english: '2 John', telugu: '2 యోహాను', aliases: ['2 john', '2john', '2jn', '2 jn', '2 యోహాను', '2యోహాను'] },
  { id: 64, english: '3 John', telugu: '3 యోహాను', aliases: ['3 john', '3john', '3jn', '3 jn', '3 యోహాను', '3యోహాను'] },
  { id: 65, english: 'Jude', telugu: 'యూదా', aliases: ['jude', 'jud', 'యూదా'] },
  { id: 66, english: 'Revelation', telugu: 'ప్రకటన గ్రంథము', aliases: ['revelation', 'rev', 'ప్రకటన గ్రంథము', 'ప్రకటన'] }
];

export function parseBibleReference(rawInput: string): ParsedBibleReference | null {
  if (!rawInput || !rawInput.trim()) return null;
  const input = rawInput.trim();

  // Pattern to extract: Optional number (1-3), book word(s), chapter number, optional verse number
  const regex = /^([1-3]\s*)?([a-zA-Z\u0C00-\u0C7F\s]+?)\s*(\d+)[\s:]*(\d+)?$/i;
  const match = input.match(regex);

  if (!match) return null;

  const prefix = (match[1] || '').trim();
  const bookNamePart = (match[2] || '').trim();
  const chapter = parseInt(match[3], 10);
  const verse = match[4] ? parseInt(match[4], 10) : undefined;

  const fullBookQuery = `${prefix ? prefix + ' ' : ''}${bookNamePart}`.trim().toLowerCase();

  // Find book match
  let matchedBook = BOOK_ALIASES.find(b => 
    b.aliases.some(alias => alias.toLowerCase() === fullBookQuery || alias.toLowerCase() === fullBookQuery.replace(/\s+/g, ''))
  );

  // Fallback prefix search
  if (!matchedBook) {
    matchedBook = BOOK_ALIASES.find(b =>
      b.aliases.some(alias => alias.toLowerCase().startsWith(fullBookQuery))
    );
  }

  if (!matchedBook) return null;

  return {
    bookId: matchedBook.id,
    bookEnglish: matchedBook.english,
    bookTelugu: matchedBook.telugu,
    chapter,
    verse
  };
}
