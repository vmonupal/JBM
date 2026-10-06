'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, Maximize, Minimize, X, 
  Settings, Type, Columns, Rows, BookOpen, Clock, Eye, EyeOff,
  SkipBack, SkipForward
} from 'lucide-react';
import { BibleBook, BibleVerse } from '@/lib/types';
import LiveClock from './LiveClock';

interface BibleProjectorProps {
  books: BibleBook[];
  initialBookId?: number;
  initialChapter?: number;
  initialVerseIndex?: number;
}

export default function BibleProjector({
  books,
  initialBookId = 43, // Default to Gospel of John
  initialChapter = 3,
  initialVerseIndex = 15 // John 3:16 (0-indexed = 15)
}: BibleProjectorProps) {
  const router = useRouter();

  const [selectedBookId, setSelectedBookId] = useState<number>(initialBookId);
  const [selectedChapter, setSelectedChapter] = useState<number>(initialChapter);
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number>(initialVerseIndex);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);

  // Presentation Settings
  const [languageMode, setLanguageMode] = useState<'both' | 'telugu' | 'english'>('both');
  const [textSize, setTextSize] = useState<number>(44); // Base font size in px for back of church visibility
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showClock, setShowClock] = useState(true); // Requirement 17: Show/Hide clock in Projector Mode

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedBook = books.find(b => b.id === selectedBookId) || books[0];
  const currentVerse = verses[currentVerseIndex] || verses[0];

  // Fetch verses
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/bible/verses?bookId=${selectedBookId}&chapter=${selectedChapter}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setVerses(data);
          if (currentVerseIndex >= data.length) {
            setCurrentVerseIndex(0);
          }
        } else {
          setVerses([]);
        }
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedBookId, selectedChapter]);

  // Auto-hide controls after 3.5 seconds of mouse inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setShowControls(true);
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
      } else if (e.key.toLowerCase() === 'c') {
        setShowClock(prev => !prev);
      } else if (e.key === 'Escape') {
        if (!document.fullscreenElement) {
          router.push(`/bible?bookId=${selectedBookId}&chapter=${selectedChapter}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleNextVerse = () => {
    if (verses.length === 0) return;
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1);
    } else {
      handleNextChapter();
    }
  };

  const handlePrevVerse = () => {
    if (verses.length === 0) return;
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(currentVerseIndex - 1);
    } else {
      handlePrevChapter();
    }
  };

  const handleNextChapter = () => {
    if (selectedChapter < selectedBook.total_chapters) {
      setSelectedChapter(selectedChapter + 1);
      setCurrentVerseIndex(0);
    } else {
      const idx = books.findIndex(b => b.id === selectedBookId);
      if (idx < books.length - 1) {
        setSelectedBookId(books[idx + 1].id);
        setSelectedChapter(1);
        setCurrentVerseIndex(0);
      }
    }
  };

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
      setCurrentVerseIndex(0);
    } else {
      const idx = books.findIndex(b => b.id === selectedBookId);
      if (idx > 0) {
        const prev = books[idx - 1];
        setSelectedBookId(prev.id);
        setSelectedChapter(prev.total_chapters);
        setCurrentVerseIndex(0);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030712] text-slate-100 flex flex-col justify-between select-none overflow-hidden font-sans">
      
      {/* Top Header: Logo in TOP-RIGHT, Book & Chapter & Verse Reference Header */}
      <header className="relative w-full px-6 sm:px-12 py-5 flex items-center justify-between border-b border-amber-500/15 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
        
        {/* Left: Indicator & Live Clock */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-cinzel text-xs sm:text-sm tracking-widest text-amber-300 font-bold uppercase">
              Sanctuary Scripture
            </span>
          </div>

          {/* Live Date and Time in Projector Mode (Requirement 17) */}
          {showClock && (
            <div className="hidden sm:flex items-center pl-4 border-l border-slate-800 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-500 mr-2" />
              <LiveClock showSeconds={true} />
            </div>
          )}
        </div>

        {/* Center: Book Name, Chapter, Verse (Requirement 15) */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none max-w-xl px-4 truncate">
          {currentVerse && (
            <div className="flex flex-col items-center">
              <h2 className="font-cinzel font-black tracking-wider text-amber-200 text-lg sm:text-2xl drop-shadow-md truncate">
                {selectedBook.name_english} {currentVerse.chapter_number}:{currentVerse.verse_number}
              </h2>
              <p className="font-telugu text-amber-400 font-bold text-base sm:text-xl truncate mt-0.5">
                {selectedBook.name_telugu} {currentVerse.chapter_number}:{currentVerse.verse_number}
              </p>
            </div>
          )}
        </div>

        {/* UPPER-RIGHT CORNER: OFFICIAL REVIVAL CHAPEL CHURCH LOGO (Requirement 15 & 16) */}
        <div className="flex items-center space-x-3">
          <div className="p-1 rounded-xl bg-white border border-amber-400/50 shadow-xl">
            <img
              src="/images/revival-chapel-logo.jpg"
              alt="Revival Chapel Official Logo"
              className="h-10 sm:h-14 w-auto object-contain rounded"
            />
          </div>
        </div>

      </header>

      {/* Main Sanctuary Verse Projection Display (Requirement 15: Large Telugu text, Large English text) */}
      <main className="flex-1 flex items-center justify-center px-6 sm:px-16 lg:px-24 py-8">
        {loading ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-cinzel text-amber-300 text-lg">Preparing Scripture for Presentation...</p>
          </div>
        ) : !currentVerse ? (
          <div className="text-center text-slate-400 space-y-3">
            <p className="text-xl">No verse selected</p>
            <p className="text-sm">Please switch chapters or books using the controls below.</p>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center space-y-8">
            
            {/* Large Telugu text */}
            {(languageMode === 'both' || languageMode === 'telugu') && (
              <div
                style={{ fontSize: `${textSize}px`, lineHeight: 1.75 }}
                className="font-telugu font-bold text-amber-100 tracking-wide drop-shadow-2xl max-w-5xl"
              >
                {currentVerse.telugu_text}
              </div>
            )}

            {/* Subtle Divider */}
            {languageMode === 'both' && (
              <div className="w-36 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            )}

            {/* Large English text */}
            {(languageMode === 'both' || languageMode === 'english') && (
              <div
                style={{ fontSize: `${textSize * 0.85}px`, lineHeight: 1.55 }}
                className="font-normal text-slate-100 drop-shadow-xl max-w-5xl italic"
              >
                "{currentVerse.english_text}"
              </div>
            )}

          </div>
        )}
      </main>

      {/* Floating Presentation Control Panel (Requirement 15: Auto-hides during presentation) */}
      <footer
        className={`transition-all duration-500 ease-in-out px-6 py-4 bg-slate-950/95 border-t border-amber-500/30 backdrop-blur-md ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Controls: Book & Chapter & Verse Stepper (Requirement 15) */}
          <div className="flex items-center space-x-2">
            
            {/* Previous Chapter */}
            <button
              onClick={handlePrevChapter}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-300"
              title="Previous Chapter (Page Up)"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Previous Verse */}
            <button
              onClick={handlePrevVerse}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-300 font-bold"
              title="Previous Verse (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Current Reference Label */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 font-bold text-sm">
              <span>{selectedBook.name_english} {selectedChapter}:{currentVerse ? currentVerse.verse_number : 1}</span>
              <span className="text-slate-400 text-xs font-normal">({currentVerseIndex + 1}/{verses.length})</span>
            </div>

            {/* Next Verse */}
            <button
              onClick={handleNextVerse}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-300 font-bold"
              title="Next Verse (Right Arrow / Space)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Next Chapter */}
            <button
              onClick={handleNextChapter}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-300"
              title="Next Chapter (Page Down)"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Selectors for Book & Chapter */}
          <div className="hidden lg:flex items-center space-x-2">
            <select
              value={selectedBookId}
              onChange={(e) => { setSelectedBookId(Number(e.target.value)); setSelectedChapter(1); setCurrentVerseIndex(0); }}
              className="px-2.5 py-1.5 bg-slate-900 rounded-xl border border-slate-700 text-xs font-semibold text-slate-200"
            >
              {books.map(b => (
                <option key={b.id} value={b.id}>{b.name_english}</option>
              ))}
            </select>

            <select
              value={selectedChapter}
              onChange={(e) => { setSelectedChapter(Number(e.target.value)); setCurrentVerseIndex(0); }}
              className="px-2.5 py-1.5 bg-slate-900 rounded-xl border border-slate-700 text-xs font-semibold text-slate-200"
            >
              {Array.from({ length: selectedBook.total_chapters }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>Ch {num}</option>
              ))}
            </select>

            {verses.length > 0 && (
              <select
                value={currentVerseIndex}
                onChange={(e) => setCurrentVerseIndex(Number(e.target.value))}
                className="px-2.5 py-1.5 bg-slate-900 rounded-xl border border-slate-700 text-xs font-semibold text-slate-200"
              >
                {verses.map((v, i) => (
                  <option key={v.id} value={i}>v{v.verse_number}</option>
                ))}
              </select>
            )}
          </div>

          {/* Controls: Language Selection (Telugu, English, Both - Requirement 15) */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setLanguageMode('telugu')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                languageMode === 'telugu' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Telugu
            </button>
            <button
              onClick={() => setLanguageMode('both')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                languageMode === 'both' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setLanguageMode('english')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                languageMode === 'english' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          {/* Controls: Font Size (Requirement 15) */}
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="text-[11px] font-semibold">Font:</span>
            <button
              onClick={() => setTextSize(s => Math.max(s - 4, 24))}
              className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 hover:text-white font-bold"
            >
              A-
            </button>
            <span className="font-mono text-amber-300 w-10 text-center font-bold">{textSize}px</span>
            <button
              onClick={() => setTextSize(s => Math.min(s + 4, 84))}
              className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 hover:text-white font-bold"
            >
              A+
            </button>
          </div>

          {/* Controls: Clock, Full Screen & Exit (Requirement 15) */}
          <div className="flex items-center space-x-2">
            {/* Show/Hide Clock */}
            <button
              onClick={() => setShowClock(!showClock)}
              className={`p-2 rounded-xl border transition-colors ${
                showClock
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
              title={showClock ? 'Hide Clock (C)' : 'Show Live Clock (C)'}
            >
              {showClock ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            {/* Full Screen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-white"
              title="Toggle Fullscreen (F)"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Exit */}
            <Link
              href={`/bible?bookId=${selectedBookId}&chapter=${selectedChapter}`}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 hover:bg-rose-900 font-semibold transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Exit Projector</span>
            </Link>
          </div>

        </div>
      </footer>

    </div>
  );
}
