'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, Maximize, Minimize, X, 
  Tv, Type, SkipBack, SkipForward, Clock, Eye, EyeOff
} from 'lucide-react';
import { Song } from '@/lib/types';
import LiveClock from './LiveClock';

interface SongProjectorProps {
  songs: Song[];
  initialSongId?: number;
}

export default function SongProjector({
  songs,
  initialSongId = 1
}: SongProjectorProps) {
  const router = useRouter();

  const [currentSongIndex, setCurrentSongIndex] = useState<number>(
    songs.findIndex(s => s.id === initialSongId) >= 0 ? songs.findIndex(s => s.id === initialSongId) : 0
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Presentation Settings
  const [languageMode, setLanguageMode] = useState<'both' | 'telugu' | 'english' | 'other'>('both');
  const [textSize, setTextSize] = useState<number>(44); // High visibility for sanctuary
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showClock, setShowClock] = useState(true); // Requirement 17: Show/Hide clock in Projector Mode

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentSong = songs[currentSongIndex] || songs[0];

  // Parse lyrics into presentation slides (stanzas separated by double newline)
  const parseSlides = (lyrics: string) => {
    if (!lyrics) return [];
    return lyrics.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
  };

  const teluguSlides = parseSlides(currentSong?.lyrics_telugu || '');
  const englishSlides = parseSlides(currentSong?.lyrics_english || '');
  const otherSlides = parseSlides(currentSong?.lyrics_other || '');
  const maxSlides = Math.max(teluguSlides.length, englishSlides.length, otherSlides.length, 1);

  const currentTelugu = teluguSlides[currentSlideIndex] || (teluguSlides.length > 0 ? teluguSlides[0] : '');
  const currentEnglish = englishSlides[currentSlideIndex] || (englishSlides.length > 0 ? englishSlides[0] : '');
  const currentOther = otherSlides[currentSlideIndex] || (otherSlides.length > 0 ? otherSlides[0] : '');

  // Auto-hide controls after 3.5s of mouse inactivity
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleNextSong = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
      setCurrentSlideIndex(0);
    }
  };

  const handlePrevSong = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
      setCurrentSlideIndex(0);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < maxSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      handleNextSong();
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setShowControls(true);
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === 'PageDown' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextSong();
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevSong();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'c') {
        setShowClock(prev => !prev);
      } else if (e.key === 'Escape') {
        if (!document.fullscreenElement) {
          router.push(`/songs/${currentSong?.id || ''}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#030712] text-slate-100 flex flex-col justify-between select-none overflow-hidden font-sans">
      
      {/* Top Header: Logo in TOP-RIGHT, Song Title & Optional Live Clock */}
      <header className="relative w-full px-6 sm:px-12 py-5 flex items-center justify-between border-b border-amber-500/15 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
        
        {/* Left: Song Indicator & Live Clock */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-cinzel text-xs sm:text-sm tracking-widest text-amber-300 font-bold uppercase">
              Song #{currentSong?.song_number}
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

        {/* Center: Song Titles */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none max-w-xl px-4 truncate">
          <h2 className="font-cinzel font-black tracking-wider text-amber-200 text-lg sm:text-2xl drop-shadow-md truncate">
            {currentSong?.title_english}
          </h2>
          <p className="font-telugu text-amber-400 font-bold text-base sm:text-xl truncate mt-0.5">
            {currentSong?.title_telugu}
          </p>
        </div>

        {/* UPPER-RIGHT CORNER: OFFICIAL REVIVAL CHAPEL CHURCH LOGO (Requirement 10 & 16) */}
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

      {/* Main Lyrics Presentation Display (High Visibility for Sanctuary) */}
      <main className="flex-1 flex items-center justify-center px-6 sm:px-16 lg:px-24 py-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center space-y-8">
          
          {/* Telugu Lyrics */}
          {(languageMode === 'both' || languageMode === 'telugu') && currentTelugu && (
            <div
              style={{ fontSize: `${textSize}px`, lineHeight: 1.75 }}
              className="font-telugu font-bold text-amber-100 tracking-wide drop-shadow-2xl whitespace-pre-line max-w-5xl"
            >
              {currentTelugu}
            </div>
          )}

          {/* Divider between bilingual stanzas */}
          {languageMode === 'both' && currentTelugu && (currentEnglish || currentOther) && (
            <div className="w-36 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
          )}

          {/* English Lyrics */}
          {(languageMode === 'both' || languageMode === 'english') && currentEnglish && (
            <div
              style={{ fontSize: `${textSize * 0.85}px`, lineHeight: 1.55 }}
              className="font-semibold text-slate-100 drop-shadow-xl whitespace-pre-line max-w-5xl"
            >
              {currentEnglish}
            </div>
          )}

          {/* Other Language Lyrics */}
          {(languageMode === 'both' || languageMode === 'other') && currentOther && (
            <div
              style={{ fontSize: `${textSize * 0.85}px`, lineHeight: 1.55 }}
              className="font-semibold text-sky-200 drop-shadow-xl whitespace-pre-line max-w-5xl"
            >
              {currentOther}
            </div>
          )}

        </div>
      </main>

      {/* Floating Presentation Control Panel (Auto-hiding after 3.5s) */}
      <footer
        className={`transition-all duration-500 ease-in-out px-6 py-4 bg-slate-950/95 border-t border-amber-500/30 backdrop-blur-md ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Slide & Song Stepper */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevSong}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-300"
              title="Previous Song (Page Up)"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrevSlide}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-300 font-bold"
              title="Previous Stanza (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 font-bold text-sm">
              Stanza {currentSlideIndex + 1} of {maxSlides}
            </span>

            <button
              onClick={handleNextSlide}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-300 font-bold"
              title="Next Stanza (Right Arrow / Space)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleNextSong}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-300"
              title="Next Song (Page Down)"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Language Options */}
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
              {currentSong?.lyrics_other ? 'All' : 'Both'}
            </button>
            <button
              onClick={() => setLanguageMode('english')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                languageMode === 'english' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            {currentSong?.lyrics_other && (
              <button
                onClick={() => setLanguageMode('other')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  languageMode === 'other' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {currentSong?.language || 'Other'}
              </button>
            )}
          </div>

          {/* Text Size Control */}
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

          {/* Clock Toggle & Fullscreen & Exit */}
          <div className="flex items-center space-x-2">
            {/* Show/Hide Clock button (Requirement 17) */}
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

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-white"
              title="Toggle Fullscreen (F)"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Exit Projector Button */}
            <Link
              href={`/songs/${currentSong?.id || ''}`}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 hover:bg-rose-900 font-semibold"
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
