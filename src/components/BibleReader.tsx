'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, Copy, Share2, Heart, 
  Tv, Type, Columns, Rows, Check, Search, BookOpen, Settings as SettingsIcon,
  Sparkles, Compass, Info, FileText, Bookmark, ArrowRight,
  Maximize, SkipBack, SkipForward, Play, Pause, AlertCircle, RefreshCw
} from 'lucide-react';
import { BibleBook, BibleVerse } from '@/lib/types';
import { useSettings } from '@/context/SettingsContext';
import { parseBibleReference } from '@/lib/bible-reference-parser';
import BookDetailsModal from './BookDetailsModal';
import ChapterDetailsModal from './ChapterDetailsModal';
import VerseDetailsModal from './VerseDetailsModal';

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
  const { settings, updateSection, openSettings } = useSettings();

  const [books] = useState<BibleBook[]>(initialBooks);
  const [selectedBookId, setSelectedBookId] = useState<number>(() => {
    const qBook = searchParams.get('bookId') || searchParams.get('book');
    if (qBook) {
      const num = Number(qBook);
      if (!isNaN(num) && num > 0) return num;
      const found = initialBooks.find(b =>
        b.name_english.toLowerCase() === qBook.trim().toLowerCase() ||
        b.name_telugu.toLowerCase() === qBook.trim().toLowerCase() ||
        b.name_english.toLowerCase().startsWith(qBook.trim().toLowerCase())
      );
      if (found) return found.id;
    }
    if (settings.bibleReading.openLastReadChapter && settings.bibleReading.lastLocation?.bookId) {
      return settings.bibleReading.lastLocation.bookId;
    }
    return initialBookId;
  });

  const [selectedChapter, setSelectedChapter] = useState<number>(() => {
    const qChap = searchParams.get('chapter');
    if (qChap) return Number(qChap);
    if (settings.bibleReading.openLastReadChapter && settings.bibleReading.lastLocation?.chapter) {
      return settings.bibleReading.lastLocation.chapter;
    }
    return initialChapter;
  });

  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(() => {
    const qVerse = searchParams.get('verse');
    if (qVerse) return Number(qVerse);
    return initialVerse || null;
  });

  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Offline status tracking (Requirement 19 & 20)
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Filter books by Testament tab
  const [selectedTestament, setSelectedTestament] = useState<'ALL' | 'OT' | 'NT'>('ALL');

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isBookDetailsOpen, setIsBookDetailsOpen] = useState(false);
  const [isChapterDetailsOpen, setIsChapterDetailsOpen] = useState(false);
  const [activeVerseForModal, setActiveVerseForModal] = useState<BibleVerse | null>(null);

  // Verse Highlights & Bookmarks state (saved in localStorage)
  const [verseHighlights, setVerseHighlights] = useState<Record<string, string>>({});
  const [favoritedVerses, setFavoritedVerses] = useState<Record<number, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedVerseId, setCopiedVerseId] = useState<number | null>(null);

  // Auto-scroll running state
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const selectedBook = books.find(b => b.id === selectedBookId) || books[0];

  // Load saved bookmarks and highlights
  useEffect(() => {
    try {
      const savedFavs = JSON.parse(localStorage.getItem('rci_favorite_verses') || '{}');
      setFavoritedVerses(savedFavs);
    } catch (e) {}

    try {
      const savedHighlights = JSON.parse(localStorage.getItem('rci_verse_highlights') || '{}');
      setVerseHighlights(savedHighlights);
    } catch (e) {}
  }, []);

  // Resilient multi-tier scripture fetching (Cache -> API -> Static Public JSON)
  useEffect(() => {
    let isMounted = true;
    const cacheKey = `rci_verses_${selectedBookId}_${selectedChapter}`;

    // 1. Try local cache first for instant render
    let cachedVerses: BibleVerse[] | null = null;
    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        cachedVerses = JSON.parse(stored);
        if (Array.isArray(cachedVerses) && cachedVerses.length > 0) {
          setVerses(cachedVerses);
          setLoading(false);
          setLoadError(null);
        }
      }
    } catch (e) {}

    if (!cachedVerses) {
      setLoading(true);
      setLoadError(null);
    }

    const fetchScripture = async () => {
      // 2. Try primary API
      try {
        const res = await fetch(`/api/bible/verses?bookId=${selectedBookId}&chapter=${selectedChapter}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setVerses(data);
            setLoadError(null);
            setLoading(false);
            try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch (e) {}
            return;
          }
        }
      } catch (err) {
        console.warn('API verse fetch failed, attempting static public JSON fallback:', err);
      }

      // 3. Fallback to static public JSON
      try {
        const res = await fetch(`/data/bible/${selectedBookId}.json`);
        if (res.ok) {
          const allVerses: BibleVerse[] = await res.json();
          const filtered = allVerses.filter(v => v.chapter_number === selectedChapter);
          if (isMounted && filtered.length > 0) {
            setVerses(filtered);
            setLoadError(null);
            setLoading(false);
            try { localStorage.setItem(cacheKey, JSON.stringify(filtered)); } catch (e) {}
            return;
          }
        }
      } catch (fallbackErr) {
        console.warn('Static public JSON fetch failed:', fallbackErr);
      }

      // 4. If nothing worked and no cache exists:
      if (isMounted && (!cachedVerses || cachedVerses.length === 0)) {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          setLoadError('This content is not currently available offline. Please reconnect to load it.');
        } else {
          setLoadError('Unable to load this Bible chapter.');
        }
        setVerses([]);
        setLoading(false);
      }
    };

    fetchScripture();

    // Save reading history locally & remember last location
    if (selectedBook) {
      try {
        const history = JSON.parse(localStorage.getItem('rci_reading_history') || '[]');
        const newEntry = {
          bookId: selectedBookId,
          chapter: selectedChapter,
          bookNameEn: selectedBook.name_english,
          bookNameTe: selectedBook.name_telugu,
          timestamp: new Date().toISOString()
        };
        const filtered = history.filter((h: any) => !(h.bookId === selectedBookId && h.chapter === selectedChapter));
        localStorage.setItem('rci_reading_history', JSON.stringify([newEntry, ...filtered.slice(0, 19)]));

        if (settings.bibleReading.rememberLastLocation) {
          updateSection('bibleReading', {
            lastLocation: {
              bookId: selectedBookId,
              chapter: selectedChapter,
              verse: selectedVerseNumber,
              timestamp: new Date().toISOString()
            }
          });
        }
      } catch (e) {}
    }

    return () => { isMounted = false; };
  }, [selectedBookId, selectedChapter, selectedBook, retryCount]);

  // Scroll to targeted verse if specified
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

  // Handle continuous reading on scroll to bottom
  useEffect(() => {
    if (!settings.bibleReading.continuousReading) return;

    let timeoutId: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight >= docHeight - 80) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          handleNextChapter();
        }, 600);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [settings.bibleReading.continuousReading, selectedBookId, selectedChapter]);

  // Handle Auto Scroll
  useEffect(() => {
    if (settings.bibleReading.autoScroll && isAutoScrolling) {
      const speed = settings.bibleReading.autoScrollSpeed || 2;
      const intervalMs = Math.max(30, 80 - speed * 10);
      autoScrollIntervalRef.current = setInterval(() => {
        window.scrollBy({ top: 1.5, behavior: 'smooth' });
      }, intervalMs);
    } else {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    }

    return () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    };
  }, [settings.bibleReading.autoScroll, isAutoScrolling, settings.bibleReading.autoScrollSpeed]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quick Reference / Keyword Search Handler
  const handleQuickSearch = (queryText: string) => {
    const q = (queryText || searchQuery).trim();
    if (!q) return;

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

    // Full search page
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

  // Chapter Navigation (stopping at end of Bible or moving to next book)
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
      } else {
        showToast('You are at the beginning of the Bible (Genesis 1).');
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
      } else {
        showToast('You have reached the end of the Holy Bible (Revelation 22).');
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

  // Copy Verse
  const handleCopyVerse = (verse: BibleVerse) => {
    const text = `${selectedBook.name_english} ${verse.chapter_number}:${verse.verse_number} (${selectedBook.name_telugu})\n\nTelugu: ${verse.telugu_text}\n\nEnglish: ${verse.english_text}\n\n— JBM`;
    navigator.clipboard.writeText(text);
    setCopiedVerseId(verse.id);
    showToast('Verse copied to clipboard!');
    setTimeout(() => setCopiedVerseId(null), 2500);
  };

  const handleCopyReference = (verse: BibleVerse) => {
    const ref = `${selectedBook.name_english} ${verse.chapter_number}:${verse.verse_number} (${selectedBook.name_telugu} ${verse.chapter_number}:${verse.verse_number})`;
    navigator.clipboard.writeText(ref);
    showToast('Reference copied!');
  };

  // Share Verse
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

  // Toggle Favorite
  const toggleFavoriteVerse = (verse: BibleVerse) => {
    const isFav = !!favoritedVerses[verse.id];
    const newFavs = { ...favoritedVerses, [verse.id]: !isFav };
    setFavoritedVerses(newFavs);
    try {
      localStorage.setItem('rci_favorite_verses', JSON.stringify(newFavs));
    } catch (e) {}
    showToast(isFav ? 'Bookmark removed' : 'Bookmark saved locally');
  };

  // Highlight verse color
  const setVerseHighlightColor = (verse: BibleVerse, color: string | null) => {
    const key = `${verse.book_id}_${verse.chapter_number}_${verse.verse_number}`;
    const updated = { ...verseHighlights };
    if (color) {
      updated[key] = color;
    } else {
      delete updated[key];
    }
    setVerseHighlights(updated);
    try {
      localStorage.setItem('rci_verse_highlights', JSON.stringify(updated));
    } catch (e) {}
    showToast(color ? `Highlighted verse with ${color}` : 'Highlight removed');
  };

  // Font size calculation from global settings
  const fontPercent = settings.bibleText.fontPercent || 100;
  const teluguFontSizePx = settings.bibleText.teluguFontSize || Math.round(20 * (fontPercent / 100));
  const englishFontSizePx = settings.bibleText.englishFontSize || Math.round(18 * (fontPercent / 100));

  // Line height
  const lineHeightVal = settings.bibleText.lineSpacing === 'loose' ? 2.1 : settings.bibleText.lineSpacing === 'normal' ? 1.55 : 1.85;

  // Column width ratio
  const teluguColSpan = settings.bibleText.columnWidth === '60-40' ? 'md:col-span-7' : settings.bibleText.columnWidth === '40-60' ? 'md:col-span-5' : 'md:col-span-6';
  const englishColSpan = settings.bibleText.columnWidth === '60-40' ? 'md:col-span-5' : settings.bibleText.columnWidth === '40-60' ? 'md:col-span-7' : 'md:col-span-6';

  // Filter books by Testament
  const filteredBooks = books.filter(b => {
    if (selectedTestament === 'OT') return b.testament === 'OT';
    if (selectedTestament === 'NT') return b.testament === 'NT';
    return true;
  });

  // Current language mode from settings
  const langMode = settings.bibleLanguage.language;

  // Max reading width style
  const readingMaxWidth = `${settings.bibleText.readingWidth || 1280}px`;

  return (
    <div style={{ maxWidth: readingMaxWidth }} className="mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 px-4 py-2.5 bg-slate-900 text-amber-300 border border-amber-500/40 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Offline Alert Pill (Requirement 19 & 20) */}
      {isOffline && (
        <div className="px-4 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Offline mode — using available saved Bible content.</span>
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 opacity-80">Locally Cached</span>
        </div>
      )}

      {/* =========================================================================
          12. MAIN PROMINENT BIBLE SEARCH BAR (Requirement 12)
          ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
        <form
          onSubmit={(e) => { e.preventDefault(); handleQuickSearch(searchQuery); }}
          className="relative flex items-center"
        >
          <Search className="w-5 h-5 text-amber-500 absolute left-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Bible — Book, Chapter, Verse, or Word"
            className="w-full pl-12 pr-28 py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm sm:text-base rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow hover:scale-105 transition-all"
          >
            Search
          </button>
        </form>

        {/* Examples shown under search box */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-0.5">
          <span className="font-semibold text-slate-400 mr-1">Examples:</span>
          {[
            { label: 'Genesis 1', val: 'Genesis 1' },
            { label: 'Genesis 1:1', val: 'Genesis 1:1' },
            { label: 'John 3:16', val: 'John 3:16' },
            { label: 'Psalm 23', val: 'Psalm 23' },
            { label: 'Matthew 5:3', val: 'Matthew 5:3' },
            { label: 'love', val: 'love' },
            { label: 'faith', val: 'faith' },
            { label: 'ప్రేమ', val: 'ప్రేమ' },
            { label: 'విశ్వాసం', val: 'విశ్వాసం' }
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
          8. BIBLE BOOK AND CHAPTER NAVIGATION TOOLBAR (Requirement 8)
          ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Navigation Controls: Testament, Book, Chapter, Verse, Prev/Next */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Testament Filter Tabs */}
            {settings.bibleNavigation.showTestamentTabs && (
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedTestament('OT')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    selectedTestament === 'OT' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                  }`}
                >
                  OT (39)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTestament('NT')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    selectedTestament === 'NT' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                  }`}
                >
                  NT (27)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTestament('ALL')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    selectedTestament === 'ALL' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                  }`}
                >
                  All 66
                </button>
              </div>
            )}

            {/* Book Selector */}
            <div className="flex items-center space-x-1">
              <span className="text-[11px] font-bold uppercase text-slate-400">Book:</span>
              <select
                value={selectedBookId}
                onChange={(e) => handleBookChange(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer max-w-[160px] sm:max-w-none"
              >
                {filteredBooks.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name_english} ({b.name_telugu})
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Selector */}
            <div className="flex items-center space-x-1">
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

            {/* Verse Selector */}
            <div className="flex items-center space-x-1">
              <span className="text-[11px] font-bold uppercase text-slate-400">Verse:</span>
              <select
                value={selectedVerseNumber || ''}
                onChange={(e) => e.target.value ? handleVerseSelect(Number(e.target.value)) : setSelectedVerseNumber(null)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="">All Verses</option>
                {verses.map(v => (
                  <option key={v.verse_number} value={v.verse_number}>
                    Verse {v.verse_number}
                  </option>
                ))}
              </select>
            </div>

            {/* Previous & Next Chapter & Verse Buttons */}
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
              <button
                onClick={handlePrevVerse}
                title="Previous Verse"
                className="hidden sm:inline-flex p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 hover:text-amber-600 transition-colors"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNextVerse}
                title="Next Verse"
                className="hidden sm:inline-flex p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 hover:text-amber-600 transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Right Toolbar: Book Details, Chapter Details, Projector, Central Settings */}
          <div className="flex items-center space-x-2 justify-end">
            
            {/* 9. Book Details Button */}
            <button
              onClick={() => setIsBookDetailsOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-amber-500/30 hover:border-amber-500 bg-amber-50/50 dark:bg-slate-800 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all"
              title="View Book Background & Details"
            >
              <Info className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Book Details</span>
            </button>

            {/* 9. Chapter Details Button */}
            <button
              onClick={() => setIsChapterDetailsOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-amber-500/30 hover:border-amber-500 bg-amber-50/50 dark:bg-slate-800 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all"
              title="View Chapter Summary & Themes"
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Chapter Details</span>
            </button>

            {/* Launch Sanctuary Projector */}
            <Link
              href={`/bible/projector?bookId=${selectedBookId}&chapter=${selectedChapter}${selectedVerseNumber ? `&verse=${selectedVerseNumber}` : ''}`}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-950 text-amber-300 border border-amber-500/50 hover:bg-slate-900 font-bold text-xs rounded-xl shadow hover:scale-105 transition-all"
            >
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">[ PROJECTOR ]</span>
            </Link>

            {/* Central SETTINGS Panel Trigger */}
            <button
              onClick={() => openSettings('bibleText')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all"
              title="Open Central Settings Panel"
            >
              <SettingsIcon className="w-4 h-4 text-amber-500" />
              <span>Settings</span>
            </button>

          </div>

        </div>

        {/* Row 2: Active Quick Controls for Language & Font Size & Auto Scroll */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Language Switcher */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Language:</span>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => updateSection('bibleLanguage', { language: 'telugu' })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  langMode === 'telugu'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                తెలుగు మాత్రమే
              </button>

              <button
                onClick={() => updateSection('bibleLanguage', { language: 'english' })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  langMode === 'english'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                English Only
              </button>

              <button
                onClick={() => updateSection('bibleLanguage', { language: 'both' })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  langMode === 'both'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                తెలుగు + English
              </button>
            </div>
          </div>

          {/* Font Size Quick Slider */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Text Size:</span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => updateSection('bibleText', { fontPercent: Math.max(fontPercent - 10, 70) })}
                className="px-2 py-1 rounded font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                title="Decrease font size"
              >
                [A−]
              </button>
              <button
                onClick={() => openSettings('bibleText')}
                className="px-2 py-1 font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline"
                title="Open Font Settings"
              >
                {fontPercent}%
              </button>
              <button
                onClick={() => updateSection('bibleText', { fontPercent: Math.min(fontPercent + 10, 160) })}
                className="px-2 py-1 rounded font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                title="Increase font size"
              >
                [A+]
              </button>
            </div>
          </div>

          {/* Auto Scroll Quick Toggle */}
          {settings.bibleReading.autoScroll && (
            <button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 font-bold transition-all ${
                isAutoScrolling 
                  ? 'bg-amber-500 text-slate-950 border-amber-500' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoScrolling ? 'Pause Auto Scroll' : 'Start Auto Scroll'}</span>
            </button>
          )}

          {/* Parallel Layout Switcher */}
          {langMode === 'both' && (
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Layout:</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => updateSection('bibleText', { layout: 'side-by-side' })}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                    settings.bibleText.layout === 'side-by-side'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Parallel</span>
                </button>
                <button
                  onClick={() => updateSection('bibleText', { layout: 'stacked' })}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                    settings.bibleText.layout === 'stacked'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                  }`}
                >
                  <Rows className="w-3.5 h-3.5" />
                  <span>Stacked</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* =========================================================================
          BOOK INFORMATION BANNER (Controlled by settings.verseDisplay.showBookInfo)
          ========================================================================= */}
      {settings.verseDisplay.showBookInfo && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              <span>{selectedBook.testament === 'OT' ? 'Old Testament (పాత నిబంధన)' : 'New Testament (క్రొత్త నిబంధన)'}</span>
              <span>•</span>
              <span>Book #{selectedBook.book_order} of 66</span>
            </div>

            {settings.verseDisplay.showBookName && (
              <h1 className="font-cinzel text-2xl sm:text-4xl font-black text-slate-900 dark:text-amber-100 mt-1">
                {selectedBook.name_english}
                {settings.verseDisplay.showChapterNumber && ` • Chapter ${selectedChapter}`}
              </h1>
            )}

            <p className="font-telugu text-lg sm:text-xl font-bold text-amber-800 dark:text-amber-300 mt-0.5">
              {selectedBook.name_telugu} • {selectedChapter}వ అధ్యాయము
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="text-right text-xs text-slate-500">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Total Chapters: {selectedBook.total_chapters}
              </p>
              <p className="text-amber-600 dark:text-amber-400 font-semibold">
                Verses in Chapter: {verses.length}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsBookDetailsOpen(true)}
                className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 transition-colors"
              >
                About {selectedBook.name_english}
              </button>
              <button
                onClick={() => setIsChapterDetailsOpen(true)}
                className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 transition-colors"
              >
                Chapter {selectedChapter} Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CHAPTER SUMMARY HEADER (Controlled by settings.verseDisplay.showChapterSummary)
          ========================================================================= */}
      {settings.verseDisplay.showChapterSummary && (
        <div className="p-4 rounded-2xl bg-amber-50/30 dark:bg-slate-800/40 border border-amber-500/20 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Reading {selectedBook.name_english} ({selectedBook.name_telugu}) Chapter {selectedChapter} • {verses.length} verses
            </span>
          </div>
          <button
            onClick={() => setIsChapterDetailsOpen(true)}
            className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
          >
            Study Guide →
          </button>
        </div>
      )}

      {/* =========================================================================
          4. MANDATED PARALLEL / SIDE-BY-SIDE BIBLE DISPLAY (Requirement 4)
          ========================================================================= */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-cinzel text-amber-600 dark:text-amber-400 font-bold text-sm">Loading Bible...</p>
        </div>
      ) : loadError ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-rose-500/40 p-8 space-y-4 shadow-sm max-w-xl mx-auto">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Unable to load this Bible chapter.
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {loadError}
          </p>
          <button
            onClick={() => setRetryCount(c => c + 1)}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 inline-flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : verses.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-amber-500/20 p-8 space-y-4 shadow-sm max-w-xl mx-auto">
          <BookOpen className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No verses found for {selectedBook.name_english} Chapter {selectedChapter}
          </h3>
          <button
            onClick={() => setRetryCount(c => c + 1)}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 inline-flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Desktop Table Headers when Side-by-Side */}
          {langMode === 'both' && settings.bibleText.layout === 'side-by-side' && (
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
            const highlightKey = `${verse.book_id}_${verse.chapter_number}_${verse.verse_number}`;
            const highlightColor = verseHighlights[highlightKey];

            // Color classes for highlights
            let highlightBg = '';
            if (highlightColor === 'yellow') highlightBg = 'bg-amber-100/60 dark:bg-amber-950/40 border-amber-400';
            else if (highlightColor === 'green') highlightBg = 'bg-emerald-100/60 dark:bg-emerald-950/40 border-emerald-400';
            else if (highlightColor === 'blue') highlightBg = 'bg-sky-100/60 dark:bg-sky-950/40 border-sky-400';
            else if (highlightColor === 'rose') highlightBg = 'bg-rose-100/60 dark:bg-rose-950/40 border-rose-400';
            else if (highlightColor === 'purple') highlightBg = 'bg-purple-100/60 dark:bg-purple-950/40 border-purple-400';

            return (
              <div
                key={verse.id}
                id={`verse-${verse.verse_number}`}
                onClick={() => {
                  if (settings.bibleReading.highlightSelectedVerse) {
                    setSelectedVerseNumber(verse.verse_number);
                  }
                }}
                className={`group relative rounded-2xl p-4 sm:p-5 transition-all cursor-pointer ${
                  highlightBg || (isTarget && settings.bibleReading.highlightSelectedVerse
                    ? 'border-2 border-amber-500 ring-2 ring-amber-500/40 shadow-lg bg-amber-50/30 dark:bg-slate-800/80'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-500/40 hover:shadow-md')
                }`}
              >
                {/* 10. Tap / Click Verse Header with Actions Panel */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center space-x-2">
                    {settings.verseDisplay.showVerseNumbers && (
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs sm:text-sm font-mono">
                        VERSE {verse.verse_number}
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-slate-400">
                      {selectedBook.name_english} {verse.chapter_number}:{verse.verse_number}
                    </span>
                  </div>

                  {/* Verse Interactive Tool Bar */}
                  <div className="flex items-center space-x-1.5 opacity-90 md:opacity-40 group-hover:opacity-100 transition-opacity">
                    
                    {/* View Verse Details Modal */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVerseForModal(verse);
                      }}
                      title="View Verse Details, Notes & Cross References"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-500 hover:text-amber-600 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteVerse(verse);
                      }}
                      title={isFav ? 'Remove Bookmark' : 'Bookmark Verse'}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isFav
                          ? 'bg-rose-500/10 border-rose-500/40 text-rose-500'
                          : 'border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Copy Scripture */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyVerse(verse);
                      }}
                      title="Copy Scripture"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      {copiedVerseId === verse.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {/* Share */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareVerse(verse);
                      }}
                      title="Share Verse"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* =========================================================================
                    LAYOUT: Side-by-Side vs Stacked vs Telugu Only vs English Only
                    ========================================================================= */}
                {langMode === 'both' && settings.bibleText.layout === 'side-by-side' ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-baseline">
                    
                    {/* Column 1: Telugu */}
                    <div
                      style={{ fontSize: `${teluguFontSizePx}px`, lineHeight: lineHeightVal }}
                      className={`${teluguColSpan} text-slate-900 dark:text-slate-100 font-telugu font-semibold`}
                    >
                      {verse.telugu_text}
                    </div>

                    {/* Column 2: English */}
                    <div
                      style={{ fontSize: `${englishFontSizePx}px`, lineHeight: lineHeightVal * 0.9 }}
                      className={`${englishColSpan} text-slate-700 dark:text-slate-300 font-serif font-normal pl-0 md:pl-3 md:border-l border-slate-100 dark:border-slate-800`}
                    >
                      {verse.english_text}
                    </div>

                  </div>
                ) : langMode === 'both' && settings.bibleText.layout === 'stacked' ? (
                  /* Stacked Bilingual */
                  <div className="space-y-3">
                    <div
                      style={{ fontSize: `${teluguFontSizePx}px`, lineHeight: lineHeightVal }}
                      className="font-telugu font-semibold text-slate-900 dark:text-slate-100"
                    >
                      {verse.telugu_text}
                    </div>
                    <div
                      style={{ fontSize: `${englishFontSizePx}px`, lineHeight: lineHeightVal * 0.9 }}
                      className="text-slate-700 dark:text-slate-300 font-serif font-normal pl-3 border-l-2 border-amber-500/40"
                    >
                      {verse.english_text}
                    </div>
                  </div>
                ) : langMode === 'telugu' ? (
                  /* Telugu Only */
                  <div
                    style={{ fontSize: `${teluguFontSizePx}px`, lineHeight: lineHeightVal }}
                    className="font-telugu font-semibold text-slate-900 dark:text-slate-100"
                  >
                    {verse.telugu_text}
                  </div>
                ) : (
                  /* English Only */
                  <div
                    style={{ fontSize: `${englishFontSizePx}px`, lineHeight: lineHeightVal * 0.9 }}
                    className="font-serif text-slate-800 dark:text-slate-200 font-normal"
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

      {/* Book Details Modal (Requirement 9) */}
      <BookDetailsModal
        isOpen={isBookDetailsOpen}
        onClose={() => setIsBookDetailsOpen(false)}
        book={selectedBook}
      />

      {/* Chapter Details Modal (Requirement 9) */}
      <ChapterDetailsModal
        isOpen={isChapterDetailsOpen}
        onClose={() => setIsChapterDetailsOpen(false)}
        bookNameEnglish={selectedBook.name_english}
        bookNameTelugu={selectedBook.name_telugu}
        chapterNumber={selectedChapter}
        totalVerses={verses.length}
        onSelectVerse={handleVerseSelect}
      />

      {/* Verse Details & Actions Modal (Requirement 9 & 10) */}
      <VerseDetailsModal
        isOpen={!!activeVerseForModal}
        onClose={() => setActiveVerseForModal(null)}
        verse={activeVerseForModal}
        bookNameEnglish={selectedBook.name_english}
        bookNameTelugu={selectedBook.name_telugu}
        isBookmarked={activeVerseForModal ? !!favoritedVerses[activeVerseForModal.id] : false}
        onToggleBookmark={() => activeVerseForModal && toggleFavoriteVerse(activeVerseForModal)}
        highlightColor={activeVerseForModal ? verseHighlights[`${activeVerseForModal.book_id}_${activeVerseForModal.chapter_number}_${activeVerseForModal.verse_number}`] || null : null}
        onSetHighlight={(color) => activeVerseForModal && setVerseHighlightColor(activeVerseForModal, color)}
        onCopyReference={() => activeVerseForModal && handleCopyReference(activeVerseForModal)}
        onShareVerse={() => activeVerseForModal && handleShareVerse(activeVerseForModal)}
      />

    </div>
  );
}
