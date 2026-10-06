'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, Copy, Share2, Heart, 
  Tv, Type, Columns, Rows, Check, Search, BookOpen, Settings,
  Sparkles, Compass, ArrowRight, CornerDownRight
} from 'lucide-react';
import { BibleBook, BibleVerse } from '@/lib/types';
import BibleSettingsModal, { BibleSettings } from './BibleSettingsModal';
import { parseBibleReference } from '@/lib/bible-reference-parser';

interface BibleReaderProps {
  initialBooks: BibleBook[];
  initialBookId?: number;
  initialChapter?: number;
  initialVerse?: number;
}

export default function BibleReader({
  initialBooks,
  initialBookId = 43, // Default to Gospel of John
  initialChapter = 3,
  initialVerse
}: BibleReaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [books, setBooks] = useState<BibleBook[]>(initialBooks);
  const [selectedBookId, setSelectedBookId] = useState<number>(
    Number(searchParams.get('bookId')) || initialBookId
  );
  const [selectedChapter, setSelectedChapter] = useState<number>(
    Number(searchParams.get('chapter')) || initialChapter
  );
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(
    initialVerse || (searchParams.get('verse') ? Number(searchParams.get('verse')) : null)
  );

  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter books by Testament tab (Requirement 10)
  const [selectedTestament, setSelectedTestament] = useState<'ALL' | 'OT' | 'NT'>('ALL');

  // Prominent Search Bar (Requirement 7 & 8)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStatus, setSearchStatus] = useState<string | null>(null);

  // Settings State (Requirement 6, 12, 14)
  const [settings, setSettings] = useState<BibleSettings>({
    language: 'both',
    textSize: 'large',
    fontPercent: 100,
    layout: 'side-by-side',
    columnWidth: '50-50',
    textSpacing: 'relaxed',
    theme: 'dark',
    showVerseNumbers: true,
    showChapterSummary: true,
    showBookInfo: true
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Bookmarks & Copy feedback
  const [copiedVerseId, setCopiedVerseId] = useState<number | null>(null);
  const [favoritedVerses, setFavoritedVerses] = useState<Record<number, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedBook = books.find(b => b.id === selectedBookId) || books[0];

  // Load saved settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rci_bible_display_settings');
      if (saved) {
        setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (e) {}

    try {
      const savedFavs = JSON.parse(localStorage.getItem('rci_favorite_verses') || '{}');
      setFavoritedVerses(savedFavs);
    } catch (e) {}
  }, []);

  const updateSettings = (newPartial: Partial<BibleSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newPartial };
      try {
        localStorage.setItem('rci_bible_display_settings', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Fetch verses
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/bible/verses?bookId=${selectedBookId}&chapter=${selectedChapter}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setVerses(data);
        } else {
          setVerses([]);
        }
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    // Save reading history locally
    try {
      const history = JSON.parse(localStorage.getItem('rci_reading_history') || '[]');
      const newEntry = {
        bookId: selectedBookId,
        chapter: selectedChapter,
        bookNameEn: selectedBook?.name_english,
        bookNameTe: selectedBook?.name_telugu,
        timestamp: new Date().toISOString()
      };
      const filtered = history.filter((h: any) => !(h.bookId === selectedBookId && h.chapter === selectedChapter));
      localStorage.setItem('rci_reading_history', JSON.stringify([newEntry, ...filtered.slice(0, 9)]));
    } catch (e) {}

    return () => { isMounted = false; };
  }, [selectedBookId, selectedChapter, selectedBook]);

  // Scroll to verse if target verse specified
  useEffect(() => {
    if (!loading && verses.length > 0 && selectedVerseNumber) {
      setTimeout(() => {
        const el = document.getElementById(`verse-${selectedVerseNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 250);
    }
  }, [loading, verses, selectedVerseNumber]);

  // Prominent Search handler (Requirement 7 & 8)
  const handleQuickSearch = (queryText: string) => {
    const q = (queryText || searchQuery).trim();
    if (!q) return;

    // 1. Try reference parser
    const parsed = parseBibleReference(q);
    if (parsed) {
      setSelectedBookId(parsed.bookId);
      setSelectedChapter(parsed.chapter);
      if (parsed.verse) {
        setSelectedVerseNumber(parsed.verse);
        router.replace(`/bible?bookId=${parsed.bookId}&chapter=${parsed.chapter}&verse=${parsed.verse}`);
      } else {
        setSelectedVerseNumber(null);
        router.replace(`/bible?bookId=${parsed.bookId}&chapter=${parsed.chapter}`);
      }
      showToast(`Opened ${parsed.bookEnglish} ${parsed.chapter}${parsed.verse ? `:${parsed.verse}` : ''}`);
      return;
    }

    // 2. Otherwise navigate to full scripture search page
    router.push(`/bible/search?q=${encodeURIComponent(q)}`);
  };

  const handleBookChange = (bookId: number) => {
    setSelectedBookId(bookId);
    setSelectedChapter(1);
    setSelectedVerseNumber(null);
    router.replace(`/bible?bookId=${bookId}&chapter=1`);
  };

  const handleChapterChange = (chapter: number) => {
    setSelectedChapter(chapter);
    setSelectedVerseNumber(null);
    router.replace(`/bible?bookId=${selectedBookId}&chapter=${chapter}`);
  };

  const handleVerseSelect = (verseNum: number) => {
    setSelectedVerseNumber(verseNum);
    const el = document.getElementById(`verse-${verseNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      handleChapterChange(selectedChapter - 1);
    } else {
      const currentIndex = books.findIndex(b => b.id === selectedBookId);
      if (currentIndex > 0) {
        const prevBook = books[currentIndex - 1];
        setSelectedBookId(prevBook.id);
        setSelectedChapter(prevBook.total_chapters);
        router.replace(`/bible?bookId=${prevBook.id}&chapter=${prevBook.total_chapters}`);
      }
    }
  };

  const handleNextChapter = () => {
    if (selectedChapter < selectedBook.total_chapters) {
      handleChapterChange(selectedChapter + 1);
    } else {
      const currentIndex = books.findIndex(b => b.id === selectedBookId);
      if (currentIndex < books.length - 1) {
        const nextBook = books[currentIndex + 1];
        setSelectedBookId(nextBook.id);
        setSelectedChapter(1);
        router.replace(`/bible?bookId=${nextBook.id}&chapter=1`);
      }
    }
  };

  const handlePrevVerse = () => {
    if (selectedVerseNumber && selectedVerseNumber > 1) {
      handleVerseSelect(selectedVerseNumber - 1);
    } else if (verses.length > 0) {
      handleVerseSelect(1);
    }
  };

  const handleNextVerse = () => {
    if (selectedVerseNumber && selectedVerseNumber < verses.length) {
      handleVerseSelect(selectedVerseNumber + 1);
    } else if (verses.length > 0) {
      handleVerseSelect(1);
    }
  };

  const handleCopyVerse = (verse: BibleVerse) => {
    const text = `${selectedBook.name_english} ${verse.chapter_number}:${verse.verse_number} (${selectedBook.name_telugu})

Telugu: ${verse.telugu_text}

English: ${verse.english_text}

— Revival Chapel`;
    navigator.clipboard.writeText(text);
    setCopiedVerseId(verse.id);
    showToast('Verse copied to clipboard!');
    setTimeout(() => setCopiedVerseId(null), 2500);
  };

  const handleShareVerse = async (verse: BibleVerse) => {
    const title = `${selectedBook.name_english} ${verse.chapter_number}:${verse.verse_number}`;
    const text = `${title} (${selectedBook.name_telugu})\n"${verse.telugu_text}"\n"${verse.english_text}"`;
    const url = typeof window !== 'undefined' ? `${window.location.origin}/bible?bookId=${selectedBookId}&chapter=${selectedChapter}&verse=${verse.verse_number}` : '';

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      showToast('Verse share link copied!');
    }
  };

  const toggleFavoriteVerse = (verse: BibleVerse) => {
    const isFav = !!favoritedVerses[verse.id];
    const newFavs = { ...favoritedVerses, [verse.id]: !isFav };
    setFavoritedVerses(newFavs);
    try {
      localStorage.setItem('rci_favorite_verses', JSON.stringify(newFavs));
    } catch (e) {}
    showToast(isFav ? 'Removed bookmark' : 'Saved bookmark');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Font size adjustments
  const decreaseFontSize = () => {
    const p = Math.max(settings.fontPercent - 10, 70);
    updateSettings({ fontPercent: p });
  };

  const increaseFontSize = () => {
    const p = Math.min(settings.fontPercent + 10, 160);
    updateSettings({ fontPercent: p });
  };

  const resetFontSize = () => {
    updateSettings({ fontPercent: 100 });
  };

  const baseFontSizePx = Math.round(18 * (settings.fontPercent / 100));
  const teluguFontSizePx = Math.round(20 * (settings.fontPercent / 100));

  // Line spacing
  const lineHeightVal = settings.textSpacing === 'loose' ? 2.1 : settings.textSpacing === 'normal' ? 1.6 : 1.85;

  // Column width ratio
  const teluguColSpan = settings.columnWidth === '60-40' ? 'md:col-span-7' : settings.columnWidth === '40-60' ? 'md:col-span-5' : 'md:col-span-6';
  const englishColSpan = settings.columnWidth === '60-40' ? 'md:col-span-5' : settings.columnWidth === '40-60' ? 'md:col-span-7' : 'md:col-span-6';

  const filteredBooks = books.filter(b => {
    if (selectedTestament === 'OT') return b.testament === 'OT';
    if (selectedTestament === 'NT') return b.testament === 'NT';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 px-4 py-2.5 bg-slate-900 text-amber-300 border border-amber-500/40 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          PROMINENT BIBLE SEARCH BAR AT TOP OF BIBLE PAGE (Requirement 7 & 8)
          ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-md space-y-3">
        <form
          onSubmit={(e) => { e.preventDefault(); handleQuickSearch(searchQuery); }}
          className="relative flex items-center"
        >
          <Search className="w-5 h-5 text-amber-500 absolute left-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search Bible — Book, Chapter, Verse, or Word"
            className="w-full pl-12 pr-28 py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm sm:text-base rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow hover:scale-105 transition-all"
          >
            Search
          </button>
        </form>

        {/* Examples shown under search box (Requirement 7) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-0.5">
          <span className="font-semibold text-slate-400 mr-1">Examples:</span>
          {[
            { label: 'John 3:16', val: 'John 3:16' },
            { label: 'Genesis 1', val: 'Genesis 1' },
            { label: 'Psalm 23', val: 'Psalm 23' },
            { label: 'Matthew 5:3', val: 'Matthew 5:3' },
            { label: 'ప్రేమ', val: 'ప్రేమ' },
            { label: 'God', val: 'God' },
            { label: 'యోహాను 3:16', val: 'యోహాను 3:16' }
          ].map((ex) => (
            <button
              key={ex.val}
              type="button"
              onClick={() => { setSearchQuery(ex.val); handleQuickSearch(ex.val); }}
              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-500/20 font-medium transition-colors"
            >
              "{ex.label}"
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          BIBLE NAVIGATION TOOLBAR (Requirement 10)
          ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-4 sm:p-5 shadow-xs transition-colors space-y-4">
        
        {/* Navigation Row 1: Testament, Book, Chapter, Verse */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          
          <div className="flex flex-wrap items-center gap-3">
            
            {/* TESTAMENT (Requirement 10) */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setSelectedTestament('OT')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedTestament === 'OT' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                Old Testament (39)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTestament('NT')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedTestament === 'NT' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                New Testament (27)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTestament('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedTestament === 'ALL' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                All 66
              </button>
            </div>

            {/* BOOK SELECTOR (Requirement 10) */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold uppercase text-slate-400">Book:</span>
              <select
                value={selectedBookId}
                onChange={(e) => handleBookChange(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {filteredBooks.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name_english} ({b.name_telugu})
                  </option>
                ))}
              </select>
            </div>

            {/* CHAPTER SELECTOR - SHOWS ALL CHAPTERS (Requirement 10) */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold uppercase text-slate-400">Chapter:</span>
              <select
                value={selectedChapter}
                onChange={(e) => handleChapterChange(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {Array.from({ length: selectedBook.total_chapters }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    Chapter {num}
                  </option>
                ))}
              </select>
            </div>

            {/* VERSE SELECTOR (Requirement 10) */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold uppercase text-slate-400">Verse:</span>
              <select
                value={selectedVerseNumber || ''}
                onChange={(e) => e.target.value ? handleVerseSelect(Number(e.target.value)) : setSelectedVerseNumber(null)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="">All Verses</option>
                {verses.map(v => (
                  <option key={v.verse_number} value={v.verse_number}>
                    Verse {v.verse_number}
                  </option>
                ))}
              </select>
            </div>

            {/* Previous & Next Chapter Navigation (Requirement 10) */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevChapter}
                title="Previous Chapter"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 hover:text-amber-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextChapter}
                title="Next Chapter"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 hover:text-amber-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right: Projector & Settings */}
          <div className="flex items-center space-x-2 justify-end">
            <Link
              href={`/bible/projector?bookId=${selectedBookId}&chapter=${selectedChapter}`}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-950 text-amber-300 border border-amber-500/50 hover:bg-slate-900 font-bold text-xs sm:text-sm rounded-xl shadow hover:scale-105 transition-all"
            >
              <Tv className="w-4 h-4 text-amber-400" />
              <span>[ BIBLE PROJECTOR ]</span>
            </Link>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-500 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
              title="Open Bible Settings"
            >
              <Settings className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>

        </div>

        {/* Row 2: MANDATED LANGUAGE SWITCHING BUTTONS & FONT SIZE & LAYOUT (Requirement 6 & 12) */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Three clear options mandated by Requirement 6:
              [ తెలుగు మాత్రమే ]  [ English Only ]  [ తెలుగు + English ] */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Language:</span>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => updateSettings({ language: 'telugu' })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  settings.language === 'telugu'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                [ తెలుగు మాత్రమే ]
              </button>

              <button
                onClick={() => updateSettings({ language: 'english' })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  settings.language === 'english'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                [ English Only ]
              </button>

              <button
                onClick={() => updateSettings({ language: 'both' })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  settings.language === 'both'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                [ తెలుగు + English ]
              </button>
            </div>
          </div>

          {/* FONT SIZE CONTROLS: Font Size: [-] [100%] [+] (Requirement 6 & 12) */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Font Size:</span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={decreaseFontSize}
                className="px-2.5 py-1 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
                title="Decrease font size"
              >
                [-]
              </button>
              <button
                onClick={resetFontSize}
                className="px-2 py-1 font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline text-xs"
                title="Reset to 100%"
              >
                [{settings.fontPercent}%]
              </button>
              <button
                onClick={increaseFontSize}
                className="px-2.5 py-1 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
                title="Increase font size"
              >
                [+]
              </button>
            </div>
          </div>

          {/* LAYOUT CONTROLS: [ Side by Side ] [ Stacked ] (Requirement 5, 6, 12) */}
          {settings.language === 'both' && (
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Layout:</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => updateSettings({ layout: 'side-by-side' })}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                    settings.layout === 'side-by-side'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>[ Side by Side ]</span>
                </button>
                <button
                  onClick={() => updateSettings({ layout: 'stacked' })}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                    settings.layout === 'stacked'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                  }`}
                >
                  <Rows className="w-3.5 h-3.5" />
                  <span>[ Stacked ]</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* =========================================================================
          CHAPTER SUMMARY & BOOK INFO (Requirement 12)
          ========================================================================= */}
      {settings.showBookInfo && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              <span>{selectedBook.testament === 'OT' ? 'Old Testament (పాత నిబంధన)' : 'New Testament (క్రొత్త నిబంధన)'}</span>
              <span>•</span>
              <span>Book #{selectedBook.book_order} of 66</span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-4xl font-black text-slate-900 dark:text-amber-100 mt-1">
              {selectedBook.name_english} • Chapter {selectedChapter}
            </h1>
            <p className="font-telugu text-lg sm:text-xl font-bold text-amber-800 dark:text-amber-300 mt-0.5">
              {selectedBook.name_telugu} • {selectedChapter}వ అధ్యాయము
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 shrink-0">
            <p className="font-bold text-slate-800 dark:text-slate-200">
              Total Chapters: {selectedBook.total_chapters}
            </p>
            <p className="text-amber-600 dark:text-amber-400 font-semibold">
              Verses in Chapter: {verses.length}
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          MANDATED PARALLEL / SIDE-BY-SIDE BIBLE DISPLAY (Requirement 5 & 12)
          ========================================================================= */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Opening Holy Scriptures...</p>
        </div>
      ) : verses.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-amber-500/20 p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No verses found for {selectedBook.name_english} {selectedChapter}
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Desktop Table Headers when Side-by-Side (Requirement 5) */}
          {settings.language === 'both' && settings.layout === 'side-by-side' && (
            <div className="hidden md:grid md:grid-cols-12 gap-6 px-6 py-3 text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 border-b-2 border-amber-500/30 bg-amber-50/60 dark:bg-slate-800/60 rounded-2xl shadow-xs">
              <div className={teluguColSpan}>
                TELUGU BIBLE (పరిశుద్ధ గ్రంథము)
              </div>
              <div className={englishColSpan}>
                ENGLISH BIBLE (King James Version)
              </div>
            </div>
          )}

          {/* Verses Loop */}
          {verses.map((verse) => {
            const isFav = !!favoritedVerses[verse.id];
            const isTarget = selectedVerseNumber === verse.verse_number;

            return (
              <div
                key={verse.id}
                id={`verse-${verse.verse_number}`}
                className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 transition-all ${
                  isTarget
                    ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-lg bg-amber-50/30 dark:bg-slate-800/80'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-amber-500/40 hover:shadow-md'
                }`}
              >
                {/* Verse Header Badge with Quick Action Tools */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center space-x-2">
                    {settings.showVerseNumbers && (
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs sm:text-sm font-mono">
                        VERSE {verse.verse_number}
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-slate-400">
                      {selectedBook.name_english} {verse.chapter_number}:{verse.verse_number}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 opacity-90 md:opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleFavoriteVerse(verse)}
                      title={isFav ? 'Remove Bookmark' : 'Save Bookmark Locally'}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isFav
                          ? 'bg-rose-500/10 border-rose-500/40 text-rose-500'
                          : 'border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleCopyVerse(verse)}
                      title="Copy Verse"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      {copiedVerseId === verse.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleShareVerse(verse)}
                      title="Share Verse"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* =========================================================================
                    LAYOUT 1: MANDATED PARALLEL SIDE-BY-SIDE (Requirement 5)
                    Desktop/Tablet: TELUGU | ENGLISH
                    Mobile: Two synchronized columns or clean stacked
                    ========================================================================= */}
                {settings.language === 'both' && settings.layout === 'side-by-side' ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-baseline">
                    
                    {/* Column 1: Telugu Bible */}
                    <div
                      style={{ fontSize: `${teluguFontSizePx}px`, lineHeight: lineHeightVal }}
                      className={`${teluguColSpan} text-slate-900 dark:text-slate-100 font-telugu font-semibold`}
                    >
                      {verse.telugu_text}
                    </div>

                    {/* Column 2: English Bible */}
                    <div
                      style={{ fontSize: `${baseFontSizePx}px`, lineHeight: lineHeightVal * 0.9 }}
                      className={`${englishColSpan} text-slate-700 dark:text-slate-300 font-normal pl-0 md:pl-2 md:border-l border-slate-100 dark:border-slate-800`}
                    >
                      {verse.english_text}
                    </div>

                  </div>
                ) : settings.language === 'both' && settings.layout === 'stacked' ? (
                  /* LAYOUT 2: Stacked Bilingual */
                  <div className="space-y-3">
                    <div
                      style={{ fontSize: `${teluguFontSizePx}px`, lineHeight: lineHeightVal }}
                      className="font-telugu font-semibold text-slate-900 dark:text-slate-100"
                    >
                      {verse.telugu_text}
                    </div>
                    <div
                      style={{ fontSize: `${baseFontSizePx}px`, lineHeight: lineHeightVal * 0.9 }}
                      className="text-slate-700 dark:text-slate-300 font-normal pl-3 border-l-2 border-amber-500/40"
                    >
                      {verse.english_text}
                    </div>
                  </div>
                ) : settings.language === 'telugu' ? (
                  /* LAYOUT 3: Telugu Only */
                  <div
                    style={{ fontSize: `${teluguFontSizePx}px`, lineHeight: lineHeightVal }}
                    className="font-telugu font-semibold text-slate-900 dark:text-slate-100"
                  >
                    {verse.telugu_text}
                  </div>
                ) : (
                  /* LAYOUT 4: English Only */
                  <div
                    style={{ fontSize: `${baseFontSizePx}px`, lineHeight: lineHeightVal * 0.9 }}
                    className="text-slate-800 dark:text-slate-200 font-normal"
                  >
                    {verse.english_text}
                  </div>
                )}

              </div>
            );
          })}

          {/* Chapter Bottom Navigation */}
          <div className="pt-6 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-500/20">
            <button
              onClick={handlePrevChapter}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all hover:scale-105"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Chapter</span>
            </button>

            <div className="text-center">
              <p className="font-cinzel text-xs font-bold text-amber-700 dark:text-amber-400">
                {selectedBook.name_english} Chapter {selectedChapter} of {selectedBook.total_chapters}
              </p>
              <p className="font-telugu text-[11px] text-slate-400">
                {selectedBook.name_telugu} {selectedChapter}వ అధ్యాయము
              </p>
            </div>

            <button
              onClick={handleNextChapter}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all hover:scale-105 shadow-md"
            >
              <span>Next Chapter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Bible Settings Modal (Requirement 14) */}
      <BibleSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
      />

    </div>
  );
}
