'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, Maximize, Minimize, X, 
  Settings, Type, Columns, Rows, BookOpen, Clock, Eye, EyeOff,
  SkipBack, SkipForward, Search, Sparkles, Check, Sun, Moon,
  Sliders, ShieldCheck, ArrowRight, Smartphone, Volume2,
  RotateCcw, Compass, Layers, ListOrdered, ArrowLeft, Play, Pause, Square
} from 'lucide-react';
import { BibleBook, BibleVerse } from '@/lib/types';
import LiveClock from './LiveClock';
import { useSettings } from '@/context/SettingsContext';
import { useBranding } from '@/context/BrandingContext';
import JbmBrandLogo from './JbmBrandLogo';
import { useBibleTTS } from '@/hooks/useBibleTTS';
import { BibleTTSControlsSettingsPanel, BibleTTSFloatingIndicator } from './BibleTTSControls';

interface BibleProjectorProps {
  books: BibleBook[];
  initialBookId?: number;
  initialChapter?: number;
  initialVerseIndex?: number;
  initialEndVerseIndex?: number;
}

export default function BibleProjector({
  books,
  initialBookId = 43, // Default to Gospel of John
  initialChapter = 3,
  initialVerseIndex = 15, // John 3:16 (0-indexed = 15)
  initialEndVerseIndex
}: BibleProjectorProps) {
  const router = useRouter();
  const { settings, updateSection } = useSettings();
  const { branding } = useBranding();

  // Root container ref for Fullscreen API
  const containerRef = useRef<HTMLDivElement>(null);

  // Core navigation state
  const [selectedBookId, setSelectedBookId] = useState<number>(initialBookId);
  const [selectedChapter, setSelectedChapter] = useState<number>(initialChapter);
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number>(initialVerseIndex);
  
  // Passage boundaries (e.g. Acts 2:1-4 or specific passage selection)
  const [passageStartVerseIndex, setPassageStartVerseIndex] = useState<number | null>(
    initialVerseIndex !== undefined ? initialVerseIndex : null
  );
  const [passageEndVerseIndex, setPassageEndVerseIndex] = useState<number | null>(
    initialEndVerseIndex !== undefined ? initialEndVerseIndex : null
  );

  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  // "WHAT DO YOU WANT TO SEE NEXT?" PANEL STATE (CRITICAL REQUIREMENT)
  const [isWhatNextOpen, setIsWhatNextOpen] = useState(false);
  const [whatNextView, setWhatNextView] = useState<'menu' | 'selectChapter' | 'selectVerse' | 'selectBook'>('menu');
  const [customRangeStart, setCustomRangeStart] = useState<number>(1);
  const [customRangeEnd, setCustomRangeEnd] = useState<number>(1);
  const [bookSearchQuery, setBookSearchQuery] = useState('');

  // Bottom sheet settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Screen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const wakeLockSentinelRef = useRef<any>(null);

  // Quick Scripture Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // Projector settings from context
  const projSettings = settings.projector.bible;
  const languageMode = projSettings.language || 'both';
  const masterFontSize = projSettings.fontSize || 46;
  const showClock = projSettings.showClock ?? true;
  const showLogo = projSettings.showLogo ?? true;
  const highContrast = projSettings.highContrast ?? false;

  // Local fine-grained presentation preferences
  const [teluguFontSize, setTeluguFontSize] = useState<number>(masterFontSize);
  const [englishFontSize, setEnglishFontSize] = useState<number>(Math.round(masterFontSize * 0.85));
  const [lineSpacing, setLineSpacing] = useState<number>(1.65);
  const [verseSpacing, setVerseSpacing] = useState<'normal' | 'relaxed' | 'spacious'>('normal');
  const [bilingualLayout, setBilingualLayout] = useState<'stacked' | 'parallel'>('stacked');
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'contrast'>(highContrast ? 'contrast' : 'dark');

  // Display toggles
  const [showVerseNumber, setShowVerseNumber] = useState<boolean>(projSettings.showVerseNumber ?? true);
  const [showBookName, setShowBookName] = useState<boolean>(true);
  const [showChapterNumber, setShowChapterNumber] = useState<boolean>(true);
  const [showVerseRef, setShowVerseRef] = useState<boolean>(projSettings.showBookChapter ?? true);
  const [showChapterInfo, setShowChapterInfo] = useState<boolean>(true);
  const [showDate, setShowDate] = useState<boolean>(settings.dateTime?.showDate ?? true);
  const [showTime, setShowTime] = useState<boolean>(showClock);
  const [showLogoToggle, setShowLogoToggle] = useState<boolean>(showLogo);

  // Subtle tap hint flag
  const [showTapHint, setShowTapHint] = useState<boolean>(true);
  const tapHintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedBook = books.find(b => b.id === selectedBookId) || books[0] || {
    id: 43,
    name_english: 'John',
    name_telugu: 'యోహాను సువార్త',
    total_chapters: 21,
    testament: 'NT'
  };

  const currentVerse = verses[currentVerseIndex] || verses[0];

  // Sync master font size changes to language font sizes
  useEffect(() => {
    setTeluguFontSize(masterFontSize);
    setEnglishFontSize(Math.round(masterFontSize * 0.85));
  }, [masterFontSize]);

  // Hide tap hint after 4 seconds of initial load
  useEffect(() => {
    tapHintTimeoutRef.current = setTimeout(() => {
      setShowTapHint(false);
    }, 4000);
    return () => {
      if (tapHintTimeoutRef.current) clearTimeout(tapHintTimeoutRef.current);
    };
  }, []);

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

  // Resilient multi-tier verse fetcher for projector (Cache -> API -> Static Public JSON)
  useEffect(() => {
    let isMounted = true;
    const cacheKey = `rci_verses_${selectedBookId}_${selectedChapter}`;

    // 1. Try local cache first for instant projector display
    let cachedVerses: BibleVerse[] | null = null;
    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        cachedVerses = JSON.parse(stored);
        if (Array.isArray(cachedVerses) && cachedVerses.length > 0) {
          setVerses(cachedVerses);
          setLoading(false);
          setLoadError(null);
          setCustomRangeEnd(cachedVerses.length);
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
            if (currentVerseIndex >= data.length) {
              setCurrentVerseIndex(0);
            }
            setCustomRangeEnd(data.length);
            try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch (e) {}
            return;
          }
        }
      } catch (err) {
        console.warn('Projector API fetch failed, attempting static public JSON fallback:', err);
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
            if (currentVerseIndex >= filtered.length) {
              setCurrentVerseIndex(0);
            }
            setCustomRangeEnd(filtered.length);
            try { localStorage.setItem(cacheKey, JSON.stringify(filtered)); } catch (e) {}
            return;
          }
        }
      } catch (fallbackErr) {
        console.warn('Projector static public JSON fetch failed:', fallbackErr);
      }

      // 4. If all failed and no cache exists:
      if (isMounted && (!cachedVerses || cachedVerses.length === 0)) {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          setLoadError('This content is not currently available offline. Please reconnect to load it.');
        } else {
          setLoadError('Unable to load scripture for projector.');
        }
        setVerses([]);
        setLoading(false);
      }
    };

    fetchScripture();

    return () => { isMounted = false; };
  }, [selectedBookId, selectedChapter, retryCount]);

  // Fullscreen change detection
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // WakeLock management for scripture presentation
  const toggleWakeLock = async () => {
    if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
      try {
        if (!wakeLockSentinelRef.current) {
          const sentinel = await (navigator as any).wakeLock.request('screen');
          wakeLockSentinelRef.current = sentinel;
          setWakeLockActive(true);
          sentinel.addEventListener('release', () => {
            wakeLockSentinelRef.current = null;
            setWakeLockActive(false);
          });
        } else {
          await wakeLockSentinelRef.current.release();
          wakeLockSentinelRef.current = null;
          setWakeLockActive(false);
        }
      } catch (e) {
        console.warn('WakeLock unavailable or denied:', e);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const el = containerRef.current || document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // EXPLICIT EXIT: The ONLY way to navigate back to normal Bible reader
  const handleExplicitExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    router.push(`/bible?bookId=${selectedBookId}&chapter=${selectedChapter}`);
  };

  // Chapter & Verse Navigation Handlers (Continuous Sanctuary Reading)
  const handleNextChapter = () => {
    if (selectedChapter < selectedBook.total_chapters) {
      setSelectedChapter(prev => prev + 1);
      setCurrentVerseIndex(0);
      setPassageStartVerseIndex(null);
      setPassageEndVerseIndex(null);
      setIsWhatNextOpen(false);
      setWhatNextView('menu');
    } else {
      const idx = books.findIndex(b => b.id === selectedBookId);
      if (idx < books.length - 1) {
        setSelectedBookId(books[idx + 1].id);
        setSelectedChapter(1);
        setCurrentVerseIndex(0);
        setPassageStartVerseIndex(null);
        setPassageEndVerseIndex(null);
        setIsWhatNextOpen(false);
        setWhatNextView('menu');
      }
    }
  };

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1);
      setCurrentVerseIndex(0);
      setPassageStartVerseIndex(null);
      setPassageEndVerseIndex(null);
      setIsWhatNextOpen(false);
      setWhatNextView('menu');
    } else {
      const idx = books.findIndex(b => b.id === selectedBookId);
      if (idx > 0) {
        const prev = books[idx - 1];
        setSelectedBookId(prev.id);
        setSelectedChapter(prev.total_chapters);
        setCurrentVerseIndex(0);
        setPassageStartVerseIndex(null);
        setPassageEndVerseIndex(null);
        setIsWhatNextOpen(false);
        setWhatNextView('menu');
      }
    }
  };

  // When passage or chapter finishes, NEVER exit automatically -> SHOW "WHAT NEXT?" PANEL!
  const handleNextVerse = () => {
    if (verses.length === 0) return;

    // 1. If reading a bounded passage (e.g. Acts 2:1-4):
    if (passageEndVerseIndex !== null && currentVerseIndex >= passageEndVerseIndex) {
      setIsWhatNextOpen(true);
      setWhatNextView('menu');
      return;
    }

    // 2. If reading through normal chapter:
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(prev => prev + 1);
    } else {
      // Reached the final verse of chapter -> Display "What do you want to see next?" panel!
      setIsWhatNextOpen(true);
      setWhatNextView('menu');
    }
  };

  const handlePrevVerse = () => {
    if (verses.length === 0) return;
    if (currentVerseIndex > 0) {
      if (passageStartVerseIndex !== null && currentVerseIndex <= passageStartVerseIndex) {
        return;
      }
      setCurrentVerseIndex(prev => prev - 1);
    }
  };

  // Direct selections from the "What next?" panel
  const selectDirectChapter = (chapNum: number) => {
    setSelectedChapter(chapNum);
    setCurrentVerseIndex(0);
    setPassageStartVerseIndex(null);
    setPassageEndVerseIndex(null);
    setIsWhatNextOpen(false);
    setWhatNextView('menu');
  };

  const selectDirectVerse = (verseNum: number, endNum?: number) => {
    const vIdx = Math.max(0, verseNum - 1);
    setCurrentVerseIndex(vIdx);
    setPassageStartVerseIndex(vIdx);
    setPassageEndVerseIndex(endNum && endNum >= verseNum ? endNum - 1 : null);
    setIsWhatNextOpen(false);
    setWhatNextView('menu');
  };

  const selectDirectBook = (bookId: number) => {
    setSelectedBookId(bookId);
    setSelectedChapter(1);
    setCurrentVerseIndex(0);
    setPassageStartVerseIndex(null);
    setPassageEndVerseIndex(null);
    setIsWhatNextOpen(false);
    setWhatNextView('menu');
  };

  // ONE TAP ANYWHERE ON MAIN SCREEN OPENS SETTINGS
  const handleMainScreenClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isSettingsOpen && !isWhatNextOpen) {
      setIsSettingsOpen(true);
      setShowTapHint(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNextVerse();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevVerse();
      } else if (e.key === 'PageDown' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextChapter();
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevChapter();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 's') {
        setIsSettingsOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'n') {
        setIsWhatNextOpen(prev => !prev);
        setWhatNextView('menu');
      } else if (e.key.toLowerCase() === 'c') {
        setShowTime(prev => !prev);
      } else if (e.key === 'Escape') {
        // Close overlays only, NEVER navigate away to Bible screen on Escape
        if (isWhatNextOpen) {
          setIsWhatNextOpen(false);
        } else if (isSettingsOpen) {
          setIsSettingsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, isWhatNextOpen, verses.length, currentVerseIndex, selectedChapter, selectedBookId, passageEndVerseIndex]);

  // Execute quick scripture search
  const handleSearchExecute = async (queryText = searchQuery) => {
    const q = queryText.trim();
    if (!q) return;

    setIsSearching(true);
    setSearchFeedback(null);

    try {
      const res = await fetch(`/api/bible/search?q=${encodeURIComponent(q)}&limit=15`);
      const data = await res.json();
      
      let list: BibleVerse[] = [];
      if (data && typeof data === 'object') {
        list = Array.isArray(data.verses) ? data.verses : (Array.isArray(data) ? data : []);
      } else if (Array.isArray(data)) {
        list = data;
      }

      setSearchResults(list);
      if (list.length === 0) {
        setSearchFeedback(`No verses found for "${q}". Try John 3:16, ప్రేమ, or Acts 2.`);
      } else {
        setSearchFeedback(`Found ${list.length} scripture match${list.length > 1 ? 'es' : ''}. Tap any verse to display.`);
      }
    } catch {
      setSearchFeedback('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Jump immediately to searched verse on the projector
  const jumpToVerse = (verse: BibleVerse) => {
    setSelectedBookId(verse.book_id);
    setSelectedChapter(verse.chapter_number);
    setCurrentVerseIndex(Math.max(0, verse.verse_number - 1));
    setPassageStartVerseIndex(null);
    setPassageEndVerseIndex(null);
    setSearchFeedback(`Jumped to ${verse.book_english} ${verse.chapter_number}:${verse.verse_number}!`);
    setIsSettingsOpen(false);
    setIsWhatNextOpen(false);
  };

  // Quick preset jump
  const jumpToPreset = (bookId: number, chapter: number, verseNum: number) => {
    setSelectedBookId(bookId);
    setSelectedChapter(chapter);
    setCurrentVerseIndex(verseNum - 1);
    setPassageStartVerseIndex(null);
    setPassageEndVerseIndex(null);
    setIsSettingsOpen(false);
    setIsWhatNextOpen(false);
  };

  // Active verses to display (single verse or requested passage range)
  const displayVerses: BibleVerse[] = (passageStartVerseIndex !== null && passageEndVerseIndex !== null && passageEndVerseIndex > passageStartVerseIndex)
    ? verses.slice(passageStartVerseIndex, passageEndVerseIndex + 1)
    : (currentVerse ? [currentVerse] : []);

  // Text-To-Speech (READ ALOUD) Controller — Brand New Implementation
  const tts = useBibleTTS({
    selectedBook,
    selectedChapter,
    displayVerses,
    onNextChapter: handleNextChapter,
    onPrevChapter: handlePrevChapter,
    onNextVerse: handleNextVerse,
    onPrevVerse: handlePrevVerse,
  });

  // Read Aloud Primary Button
  const renderReadAloudButton = (compact = false) => {
    let content = null;
    let btnClasses = '';
    let btnTitle = '';

    if (tts.isPlaying && !tts.isPaused) {
      btnClasses = 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse';
      btnTitle = 'చదువుతోంది — నిలపడానికి తాకండి / Reading Aloud — Tap to Pause';
      content = (
        <>
          <Pause className="w-3.5 h-3.5 fill-current" />
          <span>⏸ పాజ్ • PAUSE</span>
        </>
      );
    } else if (tts.isPaused) {
      btnClasses = 'bg-amber-600/90 hover:bg-amber-500 text-white border-amber-400 font-extrabold shadow-md';
      btnTitle = 'నిలిపివేయబడింది — కొనసాగించడానికి తాకండి / Paused — Tap to Resume';
      content = (
        <>
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>▶ కొనసాగించు • RESUME</span>
        </>
      );
    } else {
      // idle or stopped
      btnClasses = 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border-amber-400/80 text-white font-extrabold shadow-lg hover:shadow-amber-500/20';
      btnTitle = 'బైబిల్ వచనాలను చదివి వినిపించండి / Read current passage aloud';
      const readBtnLabel = tts.readingLanguageMode === 'telugu_only' 
        ? '🔊 చదవండి (తెలుగు)' 
        : tts.readingLanguageMode === 'english_only' 
        ? '🔊 READ ALOUD (English)' 
        : '🔊 చదవండి • READ ALOUD';
      content = (
        <>
          <Volume2 className="w-4 h-4 text-amber-200" />
          <span className="font-telugu font-bold text-xs sm:text-sm">{readBtnLabel}</span>
        </>
      );
    }

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (tts.isPlaying && !tts.isPaused) {
            tts.pauseTTS();
          } else if (tts.isPaused) {
            tts.resumeTTS();
          } else {
            tts.startReading();
          }
        }}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs sm:text-sm tracking-wide transition active:scale-95 ${btnClasses}`}
        title={btnTitle}
      >
        {content}
      </button>
    );
  };

  // Theme style classes
  const themeClasses = {
    dark: 'bg-[#030712] text-slate-100',
    contrast: 'bg-black text-white',
    light: 'bg-stone-100 text-stone-900'
  }[themeMode];

  const scriptureColorTelugu = {
    dark: 'text-amber-100',
    contrast: 'text-white',
    light: 'text-stone-950 font-bold'
  }[themeMode];

  const scriptureColorEnglish = {
    dark: 'text-slate-200',
    contrast: 'text-yellow-300',
    light: 'text-stone-800'
  }[themeMode];

  // Helper label for passage range
  const passageLabel = passageEndVerseIndex !== null && passageStartVerseIndex !== null
    ? `${selectedBook.name_english} ${selectedChapter}:${passageStartVerseIndex + 1}–${passageEndVerseIndex + 1}`
    : `${selectedBook.name_english} ${selectedChapter}:${currentVerse ? currentVerse.verse_number : 1}`;

  return (
    <div
      ref={containerRef}
      onClick={handleMainScreenClick}
      className={`fixed inset-0 z-50 flex flex-col justify-between select-none overflow-hidden font-sans transition-colors duration-200 ${themeClasses}`}
    >
      
      {/* ============================================================== */}
      {/* TOP HEADER: Logo, Sanctuary Reference Header, Clock            */}
      {/* ============================================================== */}
      <header 
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full px-4 sm:px-10 py-4 flex items-center justify-between border-b border-amber-500/15 bg-gradient-to-b from-black/85 via-black/40 to-transparent z-10"
      >
        
        {/* Left: Indicator & Sanctuary Clock */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-cinzel text-[11px] sm:text-xs tracking-widest text-amber-300 font-bold uppercase truncate max-w-[140px] sm:max-w-none">
              Revival Sanctuary
            </span>
            {isOffline && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                Offline
              </span>
            )}
          </div>

          {/* Date & Time in IST */}
          {(showTime || showDate) && (
            <div className="hidden md:flex items-center pl-3 border-l border-slate-700/60 text-xs text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
              <LiveClock showSeconds={true} />
            </div>
          )}
        </div>

        {/* Center: Book Name, Chapter, Verse Reference */}
        <div className="text-center pointer-events-none max-w-md sm:max-w-xl px-2 truncate">
          {currentVerse && showVerseRef && (
            <div className="flex flex-col items-center">
              <h2 className="font-cinzel font-black tracking-wider text-amber-200 text-base sm:text-xl md:text-2xl drop-shadow-md truncate">
                {passageLabel}
              </h2>
              {showChapterInfo && (
                <p className="font-telugu text-amber-400 font-bold text-xs sm:text-base md:text-lg truncate">
                  {showBookName && selectedBook.name_telugu} {showChapterNumber && selectedChapter}{showVerseNumber ? `:${currentVerse.verse_number}` : ''}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Corner: Quick Action Buttons & Official Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Clearly Visible Read Aloud Button */}
          {renderReadAloudButton()}

          {/* Quick "What Next?" Button (Always Accessible) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWhatNextOpen(true);
              setWhatNextView('menu');
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 text-xs font-bold shadow-sm transition active:scale-95"
            title="What do you want to see next? (Press N)"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">What Next?</span>
          </button>

          {/* Quick Settings Icon Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSettingsOpen(true);
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5 text-xs font-semibold shadow-sm transition active:scale-95"
            title="Open Projector Settings (Tap screen or click)"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Official JBM Brand / Logo */}
          {showLogoToggle && (
            <div className="flex items-center">
              <JbmBrandLogo variant="projector" showSubtitle={false} />
            </div>
          )}

          {/* Explicit Exit Projector Button (Requirement 8: Only exit on explicit click) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExplicitExit();
            }}
            className="p-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 transition"
            title="Exit Projector (Return to Bible reader)"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </header>

      {/* ============================================================== */}
      {/* MAIN SANCTUARY VERSE PROJECTION DISPLAY (CLICK TO OPEN SETTINGS) */}
      {/* ============================================================== */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-12 md:px-20 lg:px-28 py-6 text-center cursor-pointer relative overflow-hidden">
        
        {loading ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-cinzel text-amber-300 text-lg">Loading Scripture for Presentation...</p>
          </div>
        ) : loadError ? (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="text-center text-rose-300 space-y-4 max-w-md mx-auto p-6 bg-slate-900/90 rounded-2xl border border-rose-500/40"
          >
            <p className="text-lg font-bold">Unable to load this Bible chapter.</p>
            <p className="text-xs text-slate-400">{loadError}</p>
            <button
              onClick={() => setRetryCount(c => c + 1)}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition active:scale-95"
            >
              Retry Loading
            </button>
          </div>
        ) : !currentVerse ? (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="text-center text-slate-400 space-y-4 max-w-md mx-auto p-6 bg-slate-900/90 rounded-2xl border border-amber-500/20"
          >
            <p className="text-lg text-amber-200 font-bold">No verse available for this chapter</p>
            <button
              onClick={() => setRetryCount(c => c + 1)}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition active:scale-95"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            
            {/* Multi-verse range presentation or single verse */}
            {displayVerses.length > 1 ? (
              bilingualLayout === 'stacked' ? (
                /* MULTI-VERSE STACKED LAYOUT */
                <div className="w-full max-h-[75vh] overflow-y-auto space-y-8 pr-2">
                  {displayVerses.map((verse) => {
                    const isVerseSpoken = tts.highlightSpokenVerse && (tts.isPlaying || tts.isPaused) && tts.currentSpeakingVerseNumber === verse.verse_number;
                    return (
                    <div 
                      key={verse.verse_number} 
                      className={`w-full flex flex-col items-center justify-center space-y-4 py-3 px-4 border-b border-amber-500/15 last:border-b-0 transition-all duration-300 rounded-2xl ${
                        isVerseSpoken 
                          ? 'bg-amber-500/15 ring-2 ring-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.25)]' 
                          : ''
                      }`}
                    >
                      {/* Telugu Scripture Text */}
                      {(languageMode === 'both' || languageMode === 'telugu') && (
                        <div
                          style={{ 
                            fontSize: `${teluguFontSize}px`, 
                            lineHeight: lineSpacing 
                          }}
                          className={`font-telugu font-bold tracking-wide drop-shadow-2xl max-w-5xl transition-all ${scriptureColorTelugu}`}
                        >
                          {showVerseNumber && (
                            <span className="inline-block text-amber-400/90 font-cinzel mr-3 text-[0.85em] select-none">
                              {verse.verse_number}.
                            </span>
                          )}
                          <span>{verse.telugu_text}</span>
                        </div>
                      )}

                      {/* Subtle Sanctuary Divider */}
                      {languageMode === 'both' && (
                        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent my-1" />
                      )}

                      {/* English Scripture Text */}
                      {(languageMode === 'both' || languageMode === 'english') && (
                        <div
                          style={{ 
                            fontSize: `${englishFontSize}px`, 
                            lineHeight: lineSpacing 
                          }}
                          className={`font-normal drop-shadow-xl max-w-5xl italic transition-all ${scriptureColorEnglish}`}
                        >
                          {showVerseNumber && (
                            <span className="inline-block text-amber-400/70 font-cinzel mr-2 text-[0.8em] not-italic select-none">
                              {verse.verse_number}.
                            </span>
                          )}
                          <span>"{verse.english_text}"</span>
                        </div>
                      )}
                    </div>
                  );
                  })}
                </div>
              ) : (
                /* MULTI-VERSE PARALLEL SIDE-BY-SIDE LAYOUT */
                <div className="w-full max-h-[75vh] overflow-y-auto space-y-6 pr-2">
                  {displayVerses.map((verse) => {
                    const isVerseSpoken = tts.highlightSpokenVerse && (tts.isPlaying || tts.isPaused) && tts.currentSpeakingVerseNumber === verse.verse_number;
                    return (
                    <div 
                      key={verse.verse_number} 
                      className={`w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start text-left py-3 px-4 border-b border-amber-500/15 last:border-b-0 transition-all duration-300 rounded-2xl ${
                        isVerseSpoken 
                          ? 'bg-amber-500/15 ring-2 ring-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.25)]' 
                          : ''
                      }`}
                    >
                      {/* Telugu Column */}
                      <div
                        style={{ 
                          fontSize: `${teluguFontSize}px`, 
                          lineHeight: lineSpacing 
                        }}
                        className={`font-telugu font-bold tracking-wide drop-shadow-2xl transition-all ${scriptureColorTelugu}`}
                      >
                        <div className="text-xs uppercase font-cinzel tracking-widest text-amber-500 mb-2">
                          TELUGU • తెలుగు
                        </div>
                        {showVerseNumber && (
                          <span className="inline-block text-amber-400/90 font-cinzel mr-2 text-[0.85em] select-none">
                            {verse.verse_number}.
                          </span>
                        )}
                        <span>{verse.telugu_text}</span>
                      </div>

                      {/* English Column */}
                      <div
                        style={{ 
                          fontSize: `${englishFontSize}px`, 
                          lineHeight: lineSpacing 
                        }}
                        className={`font-normal drop-shadow-xl italic md:border-l md:border-amber-500/20 md:pl-8 transition-all ${scriptureColorEnglish}`}
                      >
                        <div className="text-xs uppercase font-cinzel tracking-widest text-blue-400 mb-2 not-italic">
                          ENGLISH • KJV
                        </div>
                        {showVerseNumber && (
                          <span className="inline-block text-amber-400/70 font-cinzel mr-2 text-[0.8em] not-italic select-none">
                            {verse.verse_number}.
                          </span>
                        )}
                        <span>"{verse.english_text}"</span>
                      </div>
                    </div>
                  );
                  })}
                </div>
              )
            ) : (
              /* SINGLE VERSE PRESENTATION */
              bilingualLayout === 'stacked' ? (
                <div className={`w-full flex flex-col items-center justify-center space-y-6 transition-all duration-300 p-4 rounded-3xl ${
                  tts.highlightSpokenVerse && (tts.isPlaying || tts.isPaused) && tts.currentSpeakingVerseNumber === currentVerse?.verse_number
                    ? 'bg-amber-500/15 ring-2 ring-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.25)]'
                    : ''
                }`}>
                  {/* Telugu Scripture Text */}
                  {(languageMode === 'both' || languageMode === 'telugu') && (
                    <div
                      style={{ 
                        fontSize: `${teluguFontSize}px`, 
                        lineHeight: lineSpacing 
                      }}
                      className={`font-telugu font-bold tracking-wide drop-shadow-2xl max-w-5xl transition-all ${scriptureColorTelugu}`}
                    >
                      {showVerseNumber && (
                        <span className="inline-block text-amber-400/90 font-cinzel mr-3 text-[0.85em] select-none">
                          {currentVerse.verse_number}.
                        </span>
                      )}
                      <span>{currentVerse.telugu_text}</span>
                    </div>
                  )}

                  {/* Subtle Sanctuary Divider */}
                  {languageMode === 'both' && (
                    <div className="w-40 sm:w-56 h-0.5 bg-gradient-to-r from-transparent via-amber-500/70 to-transparent my-1" />
                  )}

                  {/* English Scripture Text */}
                  {(languageMode === 'both' || languageMode === 'english') && (
                    <div
                      style={{ 
                        fontSize: `${englishFontSize}px`, 
                        lineHeight: lineSpacing 
                      }}
                      className={`font-normal drop-shadow-xl max-w-5xl italic transition-all ${scriptureColorEnglish}`}
                    >
                      {showVerseNumber && (
                        <span className="inline-block text-amber-400/70 font-cinzel mr-2 text-[0.8em] not-italic select-none">
                          {currentVerse.verse_number}.
                        </span>
                      )}
                      <span>"{currentVerse.english_text}"</span>
                    </div>
                  )}
                </div>
              ) : (
                /* PARALLEL SIDE-BY-SIDE LAYOUT */
                <div className={`w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center text-left transition-all duration-300 p-4 rounded-3xl ${
                  tts.highlightSpokenVerse && (tts.isPlaying || tts.isPaused) && tts.currentSpeakingVerseNumber === currentVerse?.verse_number
                    ? 'bg-amber-500/15 ring-2 ring-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.25)]'
                    : ''
                }`}>
                  {/* Telugu Column */}
                  <div
                    style={{ 
                      fontSize: `${teluguFontSize}px`, 
                      lineHeight: lineSpacing 
                    }}
                    className={`font-telugu font-bold tracking-wide drop-shadow-2xl transition-all ${scriptureColorTelugu}`}
                  >
                    <div className="text-xs uppercase font-cinzel tracking-widest text-amber-500 mb-2">
                      TELUGU • తెలుగు
                    </div>
                    {showVerseNumber && (
                      <span className="inline-block text-amber-400/90 font-cinzel mr-2 text-[0.85em] select-none">
                        {currentVerse.verse_number}.
                      </span>
                    )}
                    <span>{currentVerse.telugu_text}</span>
                  </div>

                  {/* English Column */}
                  <div
                    style={{ 
                      fontSize: `${englishFontSize}px`, 
                      lineHeight: lineSpacing 
                    }}
                    className={`font-normal drop-shadow-xl italic md:border-l md:border-amber-500/20 md:pl-8 transition-all ${scriptureColorEnglish}`}
                  >
                    <div className="text-xs uppercase font-cinzel tracking-widest text-blue-400 mb-2 not-italic">
                      ENGLISH • KJV
                    </div>
                    {showVerseNumber && (
                      <span className="inline-block text-amber-400/70 font-cinzel mr-2 text-[0.8em] not-italic select-none">
                        {currentVerse.verse_number}.
                      </span>
                    )}
                    <span>"{currentVerse.english_text}"</span>
                  </div>
                </div>
              )
            )}

          </div>
        )}

        {/* ONE-TAP HINT PILL */}
        {showTapHint && !isSettingsOpen && !isWhatNextOpen && (
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-xl backdrop-blur-md pointer-events-none animate-pulse">
            <span>👆</span>
            <span>Tap anywhere to open Settings & Search • Click "What Next?" for options</span>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* QUICK FLOATING NAVIGATION BAR (Screen Bottom)                   */}
      {/* ============================================================== */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="fixed bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none"
      >
        {/* Previous Chapter & Verse Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevChapter();
            }}
            className="p-3 sm:px-3.5 sm:py-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700 text-slate-300 shadow-xl backdrop-blur-md transition active:scale-95 text-xs font-bold flex items-center gap-1"
            title="Previous Chapter"
          >
            <SkipBack className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Prev Chapter</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevVerse();
            }}
            className="p-3 sm:px-3.5 sm:py-2.5 rounded-2xl bg-slate-900/85 hover:bg-amber-600 border border-amber-500/30 text-amber-200 hover:text-white shadow-xl backdrop-blur-md transition active:scale-95 text-xs font-bold flex items-center gap-1"
            title="Previous Verse (Arrow Left)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev Verse</span>
          </button>
        </div>

        {/* Center Pill: Current Verse Index & Dedicated "What Next?" Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {renderReadAloudButton(true)}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWhatNextOpen(true);
              setWhatNextView('menu');
            }}
            className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white border border-amber-400 text-xs font-bold shadow-2xl backdrop-blur-md transition flex items-center gap-1.5 active:scale-95 animate-pulse-slow"
            title="Open 'What do you want to see next?' options"
          >
            <Compass className="w-4 h-4" />
            <span>What Next?</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSettingsOpen(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold shadow-xl backdrop-blur-md transition active:scale-95"
            title="Projector Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentVerseIndex + 1}/{verses.length}</span>
          </button>
        </div>

        {/* Next Verse & Next Chapter Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextVerse();
            }}
            className="p-3 sm:px-3.5 sm:py-2.5 rounded-2xl bg-slate-900/85 hover:bg-amber-600 border border-amber-500/30 text-amber-200 hover:text-white shadow-xl backdrop-blur-md transition active:scale-95 text-xs font-bold flex items-center gap-1"
            title="Next Verse (Arrow Right / Space) — Opens What Next at chapter end"
          >
            <span className="hidden sm:inline">Next Verse</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextChapter();
            }}
            className="p-3 sm:px-3.5 sm:py-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700 text-slate-300 shadow-xl backdrop-blur-md transition active:scale-95 text-xs font-bold flex items-center gap-1"
            title="Next Chapter"
          >
            <span className="hidden md:inline">Next Chapter</span>
            <SkipForward className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* "WHAT DO YOU WANT TO SEE NEXT?" PANEL (STAYS INSIDE PROJECTOR)  */}
      {/* Never exits to Bible reader; accessible in Fullscreen!         */}
      {/* ============================================================== */}
      {isWhatNextOpen && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="bg-slate-950 border-2 border-amber-500/70 text-slate-100 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.25)] max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/15 via-transparent to-transparent flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-400">
                  <Compass className="w-6 h-6 animate-spin-hover" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-amber-200 uppercase tracking-wide">
                    What Do You Want to See Next?
                  </h3>
                  <p className="font-telugu text-xs text-amber-400/90 font-medium">
                    మరుసటిగా ఏమి చూడాలనుకుంటున్నారు?
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsWhatNextOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Dismiss and view current verse"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-header / Status of finished passage */}
            <div className="px-6 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  Finished: <strong className="text-amber-300">{selectedBook.name_english} {selectedChapter}</strong> ({selectedBook.name_telugu} {selectedChapter})
                </span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                {verses.length} verses read
              </span>
            </div>

            {/* Dynamic View Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              
              {/* VIEW 1: MAIN MENU (Default) */}
              {whatNextView === 'menu' && (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-slate-300">
                    Choose what to project next on the sanctuary screen. The projector will remain active and continuous:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* 1. Next Chapter (e.g. Acts 3) */}
                    <button
                      onClick={handleNextChapter}
                      className="p-4 rounded-2xl bg-gradient-to-br from-amber-600/30 to-amber-700/10 hover:from-amber-600/50 hover:to-amber-700/30 border border-amber-500/50 text-left transition group active:scale-95 shadow-md flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 group-hover:scale-110 transition">
                        <SkipForward className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-amber-200">
                          Next Chapter ({selectedChapter < selectedBook.total_chapters ? `${selectedBook.name_english} ${selectedChapter + 1}` : 'Next Book'})
                        </div>
                        <div className="text-xs text-slate-400 font-telugu mt-0.5">
                          తరువాతి అధ్యాయమును నేరుగా ప్రదర్శించండి
                        </div>
                      </div>
                    </button>

                    {/* 2. Previous Chapter (e.g. Acts 1) */}
                    <button
                      onClick={handlePrevChapter}
                      className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700 hover:border-amber-500/50 text-left transition group active:scale-95 shadow-md flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:scale-110 transition">
                        <SkipBack className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-slate-200">
                          Previous Chapter ({selectedChapter > 1 ? `${selectedBook.name_english} ${selectedChapter - 1}` : 'Previous Book'})
                        </div>
                        <div className="text-xs text-slate-400 font-telugu mt-0.5">
                          మునుపటి అధ్యాయమును చదవండి
                        </div>
                      </div>
                    </button>

                    {/* 3. Select Another Chapter */}
                    <button
                      onClick={() => setWhatNextView('selectChapter')}
                      className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700 hover:border-amber-500/50 text-left transition group active:scale-95 shadow-md flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-slate-800 text-amber-400 group-hover:scale-110 transition">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-slate-200">
                          Select Another Chapter
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Choose any of {selectedBook.total_chapters} chapters in {selectedBook.name_english}
                        </div>
                      </div>
                    </button>

                    {/* 4. Select Another Verse / Passage */}
                    <button
                      onClick={() => setWhatNextView('selectVerse')}
                      className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700 hover:border-amber-500/50 text-left transition group active:scale-95 shadow-md flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-slate-800 text-amber-400 group-hover:scale-110 transition">
                        <ListOrdered className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-slate-200">
                          Select Another Verse / Passage
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Pick a specific verse or range in {selectedBook.name_english} {selectedChapter}
                        </div>
                      </div>
                    </button>

                    {/* 5. Select Another Book */}
                    <button
                      onClick={() => setWhatNextView('selectBook')}
                      className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700 hover:border-amber-500/50 text-left transition group active:scale-95 shadow-md flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-slate-800 text-blue-400 group-hover:scale-110 transition">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-slate-200">
                          Switch Bible Book
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Browse all 66 Old & New Testament books
                        </div>
                      </div>
                    </button>

                    {/* 6. Quick Scripture Search */}
                    <button
                      onClick={() => {
                        setIsWhatNextOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700 hover:border-amber-500/50 text-left transition group active:scale-95 shadow-md flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-slate-800 text-emerald-400 group-hover:scale-110 transition">
                        <Search className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-slate-200">
                          Search Bible Database
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Find any passage by word or reference
                        </div>
                      </div>
                    </button>

                    {/* 7. Read Chapter Again */}
                    <button
                      onClick={() => {
                        setCurrentVerseIndex(0);
                        setIsWhatNextOpen(false);
                      }}
                      className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700 hover:border-amber-500/50 text-left transition group active:scale-95 shadow-md flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-slate-800 text-purple-400 group-hover:scale-110 transition">
                        <RotateCcw className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-slate-200">
                          Read Chapter Again
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Restart {selectedBook.name_english} {selectedChapter} from Verse 1
                        </div>
                      </div>
                    </button>

                    {/* 8. Explicit Exit to Normal Bible Reader */}
                    <button
                      onClick={handleExplicitExit}
                      className="p-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-left transition group active:scale-95 shadow-md flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-rose-900/50 text-rose-300 group-hover:scale-110 transition">
                        <X className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-rose-200">
                          Exit Projector
                        </div>
                        <div className="text-xs text-rose-400/80 mt-0.5">
                          Return to normal website Bible reading screen
                        </div>
                      </div>
                    </button>

                  </div>
                </div>
              )}

              {/* VIEW 2: SELECT ANOTHER CHAPTER IN CURRENT BOOK */}
              {whatNextView === 'selectChapter' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setWhatNextView('menu')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Options</span>
                    </button>
                    <span className="text-xs font-bold text-amber-300">
                      {selectedBook.name_english} ({selectedBook.name_telugu})
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Tap any chapter to project it directly in Bible Projector:
                  </p>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-64 overflow-y-auto p-1">
                    {Array.from({ length: selectedBook.total_chapters }, (_, i) => i + 1).map((c) => (
                      <button
                        key={c}
                        onClick={() => selectDirectChapter(c)}
                        className={`py-3 rounded-xl text-xs font-bold border transition active:scale-95 ${
                          c === selectedChapter
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105'
                            : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'
                        }`}
                      >
                        Ch. {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 3: SELECT ANOTHER VERSE / PASSAGE IN CURRENT CHAPTER */}
              {whatNextView === 'selectVerse' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setWhatNextView('menu')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Options</span>
                    </button>
                    <span className="text-xs font-bold text-amber-300">
                      {selectedBook.name_english} Chapter {selectedChapter}
                    </span>
                  </div>

                  {/* Passage Range Selector */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-300">Passage Range:</span>
                      <span>Verse</span>
                      <select
                        value={customRangeStart}
                        onChange={(e) => setCustomRangeStart(Number(e.target.value))}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-bold"
                      >
                        {verses.map(v => (
                          <option key={v.verse_number} value={v.verse_number}>{v.verse_number}</option>
                        ))}
                      </select>
                      <span>to</span>
                      <select
                        value={customRangeEnd}
                        onChange={(e) => setCustomRangeEnd(Number(e.target.value))}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-bold"
                      >
                        {verses.map(v => (
                          <option key={v.verse_number} value={v.verse_number}>{v.verse_number}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => selectDirectVerse(customRangeStart, customRangeEnd)}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow transition"
                    >
                      Project Passage
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">
                    Or tap any single verse to present immediately:
                  </p>

                  <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 max-h-60 overflow-y-auto p-1">
                    {verses.map((v) => (
                      <button
                        key={v.verse_number}
                        onClick={() => selectDirectVerse(v.verse_number)}
                        className={`py-2 rounded-xl text-xs font-bold border transition active:scale-95 ${
                          v.verse_number === (currentVerse ? currentVerse.verse_number : 1)
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                            : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'
                        }`}
                      >
                        {v.verse_number}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 4: SELECT ANOTHER BOOK (66 BOOKS) */}
              {whatNextView === 'selectBook' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setWhatNextView('menu')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Options</span>
                    </button>
                    <span className="text-xs font-bold text-amber-300">
                      Select Bible Book
                    </span>
                  </div>

                  <input
                    type="text"
                    value={bookSearchQuery}
                    onChange={(e) => setBookSearchQuery(e.target.value)}
                    placeholder="Filter books (e.g. Acts, John, ఆదికాండము)..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
                    {books
                      .filter(b => 
                        !bookSearchQuery.trim() ||
                        b.name_english.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
                        b.name_telugu.includes(bookSearchQuery)
                      )
                      .map((b) => (
                        <button
                          key={b.id}
                          onClick={() => selectDirectBook(b.id)}
                          className={`p-2.5 rounded-xl text-left border transition active:scale-95 flex flex-col ${
                            b.id === selectedBookId
                              ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                              : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-amber-500/40'
                          }`}
                        >
                          <span className="font-bold text-xs">{b.name_english}</span>
                          <span className="font-telugu text-[11px] text-slate-400 truncate">{b.name_telugu}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

            </div>

            {/* Panel Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Continuous Sanctuary Mode Active
              </span>
              <button
                onClick={() => setIsWhatNextOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition"
              >
                Close & View Screen
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FIXED BOTTOM SHEET SETTINGS PANEL (TAP SCREEN TO TOGGLE)       */}
      {/* ============================================================== */}
      
      {/* Dimmed Backdrop */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsSettingsOpen(false);
        }}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isSettingsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Bottom Sheet Drawer */}
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[86vh] sm:max-h-[82vh] flex flex-col bg-slate-950/98 text-slate-100 border-t-2 border-amber-500/80 shadow-[0_-15px_40px_rgba(0,0,0,0.8)] rounded-t-3xl backdrop-blur-2xl transition-transform duration-300 ease-out transform ${
          isSettingsOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 16px)'
        }}
      >
        
        {/* Grab Handle & Top Header */}
        <div className="px-5 sm:px-8 pt-3 pb-3 border-b border-slate-800/80 flex flex-col gap-2 bg-slate-900/90 rounded-t-3xl flex-shrink-0">
          <div className="w-12 h-1.5 bg-slate-700 hover:bg-amber-500 rounded-full mx-auto cursor-pointer transition" onClick={() => setIsSettingsOpen(false)} />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-cinzel text-amber-200 leading-tight">
                  Bible Projector Settings
                </h3>
                <p className="text-[11px] text-slate-400">
                  Tap anywhere on screen to toggle • Instant adjustments for sanctuary presentation
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 shadow transition"
            >
              <X className="w-4 h-4 text-amber-400" />
              <span>Done / Close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Settings Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 space-y-6 overscroll-contain">

          {/* TEXT-TO-SPEECH (READ ALOUD) CONTROLS — BRAND NEW IMPLEMENTATION */}
          <BibleTTSControlsSettingsPanel
            isSupported={tts.isSupported}
            isPlaying={tts.isPlaying}
            isPaused={tts.isPaused}
            ttsStatusText={tts.ttsStatusText}
            voiceNotice={tts.voiceNotice}
            testingVoiceURI={tts.testingVoiceURI}
            readingLanguageMode={tts.readingLanguageMode}
            onSelectLanguageMode={tts.updateReadingLanguageMode}
            selectedTeluguVoiceURI={tts.selectedTeluguVoiceURI}
            teluguSpeed={tts.teluguSpeed}
            teluguVolume={tts.teluguVolume}
            teluguPitch={tts.teluguPitch}
            teluguVoices={tts.teluguVoices}
            rankedTeluguVoices={tts.rankedTeluguVoices}
            onChangeTeluguVoice={tts.updateSelectedTeluguVoice}
            onChangeTeluguSpeed={tts.updateTeluguSpeed}
            onChangeTeluguVolume={tts.updateTeluguVolume}
            onChangeTeluguPitch={tts.updateTeluguPitch}
            selectedEnglishVoiceURI={tts.selectedEnglishVoiceURI}
            englishSpeed={tts.englishSpeed}
            englishVolume={tts.englishVolume}
            englishPitch={tts.englishPitch}
            englishVoices={tts.englishVoices}
            rankedEnglishVoices={tts.rankedEnglishVoices}
            onChangeEnglishVoice={tts.updateSelectedEnglishVoice}
            onChangeEnglishSpeed={tts.updateEnglishSpeed}
            onChangeEnglishVolume={tts.updateEnglishVolume}
            onChangeEnglishPitch={tts.updateEnglishPitch}
            autoRead={tts.autoRead}
            verseHighlight={tts.verseHighlight}
            onToggleAutoRead={tts.updateAutoRead}
            onToggleVerseHighlight={tts.updateVerseHighlight}
            onStart={tts.startReading}
            onPause={tts.pauseTTS}
            onResume={tts.resumeTTS}
            onStop={tts.stopTTS}
            onRestart={tts.restartTTS}
            onPrev={tts.prevVerseAction}
            onNext={tts.nextVerseAction}
            onTestVoice={tts.testVoice}
            onTestSpecificVoice={tts.testSpecificVoice}
            onStopVoiceTest={tts.stopVoiceTest}
            onRefreshVoices={tts.refreshVoices}
          />

          {/* 1. SCRIPTURE SEARCH BAR */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Quick Scripture Search
              </span>
              <span className="text-[11px] text-slate-400">Search words or exact references</span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchExecute();
                }}
                placeholder="Search Bible — e.g. Acts 2, John 3:16, Psalm 23, ప్రేమ, Love..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              
              <button
                onClick={() => handleSearchExecute()}
                disabled={isSearching}
                className="absolute right-1.5 top-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Quick preset reference chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Quick Jumps:</span>
              <button onClick={() => jumpToPreset(44, 2, 1)} className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs border border-amber-500/40 font-bold transition">Acts 2:1</button>
              <button onClick={() => jumpToPreset(43, 3, 16)} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-600/40 text-amber-300 text-xs border border-slate-700 transition">John 3:16</button>
              <button onClick={() => jumpToPreset(19, 23, 1)} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-600/40 text-amber-300 text-xs border border-slate-700 transition">Psalm 23:1</button>
              <button onClick={() => jumpToPreset(1, 1, 1)} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-600/40 text-amber-300 text-xs border border-slate-700 transition">Genesis 1:1</button>
              <button onClick={() => jumpToPreset(45, 8, 28)} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-600/40 text-amber-300 text-xs border border-slate-700 transition">Romans 8:28</button>
            </div>

            {searchFeedback && (
              <div className="text-xs text-amber-300 font-medium pt-1">
                {searchFeedback}
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-1.5 pt-2 border-t border-slate-800">
                {searchResults.map((verse) => (
                  <div
                    key={verse.id}
                    onClick={() => jumpToVerse(verse)}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 truncate">
                      <div className="font-bold text-amber-300">
                        {verse.book_english} {verse.chapter_number}:{verse.verse_number} ({verse.book_telugu})
                      </div>
                      <div className="text-slate-300 truncate font-telugu text-[11px] mt-0.5">
                        {verse.telugu_text}
                      </div>
                    </div>
                    <button className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[11px] font-bold flex-shrink-0">
                      Project
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. SCRIPTURE NAVIGATION */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Book, Chapter & Verse Selection
              </span>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsWhatNextOpen(true);
                  setWhatNextView('menu');
                }}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>What Next Menu</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Book Picker */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400 font-medium">Select Book:</label>
                <select
                  value={selectedBookId}
                  onChange={(e) => {
                    const bId = Number(e.target.value);
                    setSelectedBookId(bId);
                    setSelectedChapter(1);
                    setCurrentVerseIndex(0);
                    setPassageStartVerseIndex(null);
                    setPassageEndVerseIndex(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name_english} ({b.name_telugu})
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter Picker */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400 font-medium">Select Chapter:</label>
                <select
                  value={selectedChapter}
                  onChange={(e) => {
                    setSelectedChapter(Number(e.target.value));
                    setCurrentVerseIndex(0);
                    setPassageStartVerseIndex(null);
                    setPassageEndVerseIndex(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                >
                  {Array.from({ length: selectedBook.total_chapters }, (_, i) => i + 1).map((c) => (
                    <option key={c} value={c}>
                      Chapter {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verse Picker */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400 font-medium">Select Verse:</label>
                <select
                  value={currentVerseIndex}
                  onChange={(e) => {
                    const vIdx = Number(e.target.value);
                    setCurrentVerseIndex(vIdx);
                    setPassageStartVerseIndex(vIdx);
                    setPassageEndVerseIndex(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                >
                  {verses.map((v, idx) => (
                    <option key={v.id || idx} value={idx}>
                      Verse {v.verse_number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                onClick={handlePrevChapter}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition"
              >
                <SkipBack className="w-3.5 h-3.5 text-amber-400" />
                <span>Prev Chapter</span>
              </button>
              <button
                onClick={handlePrevVerse}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-amber-600/40 text-amber-200 text-xs font-bold border border-amber-500/40 flex items-center justify-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Verse</span>
              </button>
              <button
                onClick={handleNextVerse}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-amber-600/40 text-amber-200 text-xs font-bold border border-amber-500/40 flex items-center justify-center gap-1.5 transition"
              >
                <span>Next Verse</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextChapter}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition"
              >
                <span>Next Chapter</span>
                <SkipForward className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>

          {/* 3. BIBLE LANGUAGE */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Bible Language & Layout
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => updateSection('projector', { bible: { ...projSettings, language: 'telugu' } })}
                className={`py-3 px-2 rounded-xl text-xs font-bold border transition ${
                  languageMode === 'telugu'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                Telugu Only
              </button>
              <button
                onClick={() => updateSection('projector', { bible: { ...projSettings, language: 'english' } })}
                className={`py-3 px-2 rounded-xl text-xs font-bold border transition ${
                  languageMode === 'english'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                English Only
              </button>
              <button
                onClick={() => updateSection('projector', { bible: { ...projSettings, language: 'both' } })}
                className={`py-3 px-2 rounded-xl text-xs font-bold border transition ${
                  languageMode === 'both'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                Telugu + English
              </button>
            </div>

            {languageMode === 'both' && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 mt-2">
                <span className="text-xs font-medium text-slate-300">Bilingual Arrangement:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setBilingualLayout('stacked')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      bilingualLayout === 'stacked'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Stacked
                  </button>
                  <button
                    onClick={() => setBilingualLayout('parallel')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      bilingualLayout === 'parallel'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Side-by-Side Parallel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. BIBLE TEXT SIZE */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Text Sizing & Spacing
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                Master: {masterFontSize}px
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateSection('projector', { bible: { ...projSettings, fontSize: Math.max(24, masterFontSize - 4) } })}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 transition"
                >
                  A−
                </button>
                <input
                  type="range"
                  min="24"
                  max="80"
                  step="2"
                  value={masterFontSize}
                  onChange={(e) => updateSection('projector', { bible: { ...projSettings, fontSize: Number(e.target.value) } })}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <button
                  onClick={() => updateSection('projector', { bible: { ...projSettings, fontSize: Math.min(84, masterFontSize + 4) } })}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 transition"
                >
                  A+
                </button>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 px-1 font-medium">
                <span>Small (24px)</span>
                <span>Normal (44px)</span>
                <span>Large (60px)</span>
                <span>Huge (80px)</span>
              </div>
            </div>

            {/* Independent Font Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Telugu Font Size:</span>
                  <span className="font-mono text-amber-400 font-bold">{teluguFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="84"
                  step="2"
                  value={teluguFontSize}
                  onChange={(e) => setTeluguFontSize(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">English Font Size:</span>
                  <span className="font-mono text-amber-400 font-bold">{englishFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="76"
                  step="2"
                  value={englishFontSize}
                  onChange={(e) => setEnglishFontSize(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                />
              </div>
            </div>

            {/* Line Spacing */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-medium text-slate-300">Line Spacing:</span>
              <div className="flex items-center gap-1.5">
                {[1.35, 1.65, 1.95, 2.25].map((spacing) => (
                  <button
                    key={spacing}
                    onClick={() => setLineSpacing(spacing)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                      lineSpacing === spacing
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {spacing}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. DISPLAY TOGGLES */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Display Elements (ON / OFF)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-200">Show Verse Numbers</span>
                <input
                  type="checkbox"
                  checked={showVerseNumber}
                  onChange={(e) => {
                    setShowVerseNumber(e.target.checked);
                    updateSection('projector', { bible: { ...projSettings, showVerseNumber: e.target.checked } });
                  }}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-200">Show Book Name</span>
                <input
                  type="checkbox"
                  checked={showBookName}
                  onChange={(e) => setShowBookName(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-200">Show Chapter Number</span>
                <input
                  type="checkbox"
                  checked={showChapterNumber}
                  onChange={(e) => setShowChapterNumber(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-200">Show Verse Reference</span>
                <input
                  type="checkbox"
                  checked={showVerseRef}
                  onChange={(e) => {
                    setShowVerseRef(e.target.checked);
                    updateSection('projector', { bible: { ...projSettings, showBookChapter: e.target.checked } });
                  }}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-200">Show Chapter Info</span>
                <input
                  type="checkbox"
                  checked={showChapterInfo}
                  onChange={(e) => setShowChapterInfo(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-200">Show Live Clock (IST)</span>
                <input
                  type="checkbox"
                  checked={showTime}
                  onChange={(e) => {
                    setShowTime(e.target.checked);
                    updateSection('projector', { bible: { ...projSettings, showClock: e.target.checked } });
                  }}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer sm:col-span-2">
                <div className="flex flex-col">
                  <span className="text-slate-200">Show Church Logo</span>
                  <span className="text-[10px] text-slate-400">Display brand logo in header</span>
                </div>
                <input
                  type="checkbox"
                  checked={showLogoToggle}
                  onChange={(e) => {
                    setShowLogoToggle(e.target.checked);
                    updateSection('projector', { bible: { ...projSettings, showLogo: e.target.checked } });
                  }}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* 6. THEMES */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Presentation Theme
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setThemeMode('dark');
                  updateSection('projector', { bible: { ...projSettings, highContrast: false } });
                }}
                className={`py-3 px-2 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                  themeMode === 'dark'
                    ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>🌙</span>
                <span>Dark Mode</span>
              </button>

              <button
                onClick={() => {
                  setThemeMode('contrast');
                  updateSection('projector', { bible: { ...projSettings, highContrast: true } });
                }}
                className={`py-3 px-2 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                  themeMode === 'contrast'
                    ? 'bg-white text-black border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>⚡</span>
                <span>High Contrast</span>
              </button>

              <button
                onClick={() => {
                  setThemeMode('light');
                  updateSection('projector', { bible: { ...projSettings, highContrast: false } });
                }}
                className={`py-3 px-2 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                  themeMode === 'light'
                    ? 'bg-amber-100 text-stone-900 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>☀️</span>
                <span>Light Mode</span>
              </button>
            </div>
          </div>

          {/* 7. FULLSCREEN & WAKELOCK */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Sanctuary Display & Screen Controls
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={toggleFullscreen}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs font-bold text-slate-200 transition"
              >
                <div className="flex items-center gap-2">
                  {isFullscreen ? <Minimize className="w-4 h-4 text-amber-400" /> : <Maximize className="w-4 h-4 text-amber-400" />}
                  <span>{isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">(F)</span>
              </button>

              <button
                onClick={toggleWakeLock}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold transition ${
                  wakeLockActive
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>Keep Screen Awake</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${wakeLockActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  {wakeLockActive ? 'ACTIVE' : 'OFF'}
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Sheet Footer */}
        <div className="px-5 sm:px-8 py-3.5 border-t border-slate-800/80 bg-slate-900/90 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => {
              setIsSettingsOpen(false);
              setIsWhatNextOpen(true);
              setWhatNextView('menu');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Open What Next Menu</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg transition"
          >
            Apply & Close
          </button>
        </div>

      </div>

      {/* ============================================================== */}
      {/* TEXT-TO-SPEECH FLOATING STATUS INDICATOR                       */}
      {/* ============================================================== */}
      {tts.showStatusIndicator && (
        <BibleTTSFloatingIndicator
          isPlaying={tts.isPlaying}
          isPaused={tts.isPaused}
          ttsStatusText={tts.ttsStatusText}
          onPause={tts.pauseTTS}
          onResume={tts.resumeTTS}
          onStop={tts.stopTTS}
          onRestart={tts.restartTTS}
        />
      )}

    </div>
  );
}
