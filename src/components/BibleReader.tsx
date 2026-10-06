'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, Copy, Share2, Heart, Bookmark, 
  Tv, Type, Columns, Rows, Check, Search, BookOpen, Settings,
  Sparkles, Info
} from 'lucide-react';
import { BibleBook, BibleVerse } from '@/lib/types';
import BibleSettingsModal, { BibleSettings } from './BibleSettingsModal';

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
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings State (Requirement 12 & 14)
  const [settings, setSettings] = useState<BibleSettings>({
    language: 'both',
    textSize: 'large',
    fontPercent: 100,
    layout: 'side-by-side',
    theme: 'dark',
    showVerseNumbers: true,
    showChapterSummary: true,
    showBookInfo: true
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Favorites & Copy feedback
  const [copiedVerseId, setCopiedVerseId] = useState<number | null>(null);
  const [favoritedVerses, setFavoritedVerses] = useState<Record<number, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedBook = books.find(b => b.id === selectedBookId) || books[0];

  // Load saved settings from localStorage (Requirement 12 & 14: Save settings locally without account)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rci_bible_display_settings');
      if (saved) {
        setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (e) {}

    // Load local bookmarks
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

  // Fetch verses whenever selected book or chapter changes
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

  const handleBookChange = (bookId: number) => {
    setSelectedBookId(bookId);
    setSelectedChapter(1);
    router.replace(`/bible?bookId=${bookId}&chapter=1`);
  };

  const handleChapterChange = (chapter: number) => {
    setSelectedChapter(chapter);
    router.replace(`/bible?bookId=${selectedBookId}&chapter=${chapter}`);
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
    const text = `${title} (${selectedBook.name_telugu})
"${verse.telugu_text}"
"${verse.english_text}"`;
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

  // Font Size percent scale: [-] [100%] [+] (Requirement 12)
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

  // Base font size computed from percentage
  const baseFontSizePx = Math.round(18 * (settings.fontPercent / 100));
  const teluguFontSizePx = Math.round(20 * (settings.fontPercent / 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 px-4 py-2.5 bg-slate-900 text-amber-300 border border-amber-500/40 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reader Controls Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-4 sm:p-5 shadow-xs transition-colors space-y-4">
        
        {/* Row 1: Book & Chapter Picker + Projector & Settings */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          
          {/* Book & Chapter Pickers */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Book Dropdown (All 66 Books) */}
            <div className="relative">
              <select
                value={selectedBookId}
                onChange={(e) => handleBookChange(Number(e.target.value))}
                className="appearance-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm sm:text-base py-2 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <optgroup label="New Testament (క్రొత్త నిబంధన - 27 గ్రంథాలు)">
                  {books.filter(b => b.testament === 'NT').map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name_english} ({b.name_telugu})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Old Testament (పాత నిబంధన - 39 గ్రంథాలు)">
                  {books.filter(b => b.testament === 'OT').map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name_english} ({b.name_telugu})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Chapter Dropdown */}
            <div className="relative">
              <select
                value={selectedChapter}
                onChange={(e) => handleChapterChange(Number(e.target.value))}
                className="appearance-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm sm:text-base py-2 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {Array.from({ length: selectedBook.total_chapters }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    Chapter {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Prev / Next Chapter Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevChapter}
                title="Previous Chapter"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 hover:text-amber-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextChapter}
                title="Next Chapter"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 hover:text-amber-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right: [ BIBLE PROJECTOR ] & Settings & Search */}
          <div className="flex items-center space-x-2 sm:space-x-3 justify-end">
            {/* [ BIBLE PROJECTOR ] BUTTON (Requirement 15) */}
            <Link
              href={`/bible/projector?bookId=${selectedBookId}&chapter=${selectedChapter}`}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-950 text-amber-300 border border-amber-500/50 hover:bg-slate-900 font-bold text-xs sm:text-sm rounded-xl shadow hover:scale-105 transition-all"
            >
              <Tv className="w-4 h-4 text-amber-400" />
              <span>[ BIBLE PROJECTOR ]</span>
            </Link>

            {/* Bible Settings Button (Requirement 14) */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-500 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
              title="Open Bible Settings"
            >
              <Settings className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Search link */}
            <Link
              href="/bible/search"
              title="Search Bible"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition-colors"
            >
              <Search className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Row 2: MANDATED LANGUAGE DISPLAY BUTTONS & FONT SIZE & LAYOUT (Requirement 12) */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* BIBLE LANGUAGE DISPLAY BUTTONS:
              [ TELUGU ]  [ ENGLISH ]  [ TELUGU + ENGLISH ] */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Display:</span>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => updateSettings({ language: 'telugu' })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  settings.language === 'telugu'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                [ TELUGU ]
              </button>

              <button
                onClick={() => updateSettings({ language: 'english' })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  settings.language === 'english'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                [ ENGLISH ]
              </button>

              <button
                onClick={() => updateSettings({ language: 'both' })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  settings.language === 'both'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                [ TELUGU + ENGLISH ]
              </button>
            </div>
          </div>

          {/* FONT SIZE CONTROLS: Font Size: [-] [100%] [+] (Requirement 12) */}
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

          {/* LAYOUT CONTROLS: [ Side by Side ] [ Stacked ] (Requirement 12) */}
          {settings.language === 'both' && (
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Layout:</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => updateSettings({ layout: 'side-by-side' })}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    settings.layout === 'side-by-side'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                  }`}
                >
                  [ Side by Side ]
                </button>

                <button
                  onClick={() => updateSettings({ layout: 'stacked' })}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    settings.layout === 'stacked'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                  }`}
                >
                  [ Stacked ]
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Book Information Banner (toggled by settings.showBookInfo) */}
      {settings.showBookInfo && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {selectedBook.testament === 'NT' ? 'New Testament (క్రొత్త నిబంధన)' : 'Old Testament (పాత నిబంధన)'} • {selectedBook.total_chapters} Chapters in total
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Authorized Holy Scripture • Telugu & English King James Version
          </span>
        </div>
      )}

      {/* Chapter Title Header & Summary */}
      <div className="text-center pt-2 pb-4 border-b border-amber-500/20 space-y-1">
        <h1 className="text-2xl sm:text-4xl font-bold font-cinzel text-slate-900 dark:text-amber-100 tracking-wide">
          {selectedBook.name_english} {selectedChapter}
        </h1>
        <p className="text-xl sm:text-2xl font-telugu text-amber-700 dark:text-amber-400 font-semibold">
          {selectedBook.name_telugu} {selectedChapter}వ అధ్యాయము
        </p>

        {settings.showChapterSummary && (
          <p className="text-xs text-slate-500 max-w-lg mx-auto pt-1">
            Holy Bible Scripture • Chapter {selectedChapter} of {selectedBook.total_chapters}
          </p>
        )}
      </div>

      {/* Bilingual Bible Verses Display */}
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
          
          {/* Desktop Table Headers when Side-by-Side */}
          {settings.language === 'both' && settings.layout === 'side-by-side' && (
            <div className="hidden md:grid md:grid-cols-12 gap-6 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 border-b border-amber-500/20 bg-amber-50/40 dark:bg-slate-800/40 rounded-xl">
              {settings.showVerseNumbers && <div className="col-span-1 text-center">Verse</div>}
              <div className={settings.showVerseNumbers ? 'col-span-5' : 'col-span-6'}>
                TELUGU (పరిశుద్ధ గ్రంథము)
              </div>
              <div className={settings.showVerseNumbers ? 'col-span-5' : 'col-span-6'}>
                ENGLISH (King James Version)
              </div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
          )}

          {verses.map((verse) => {
            const isFav = !!favoritedVerses[verse.id];

            return (
              <div
                key={verse.id}
                id={`verse-${verse.verse_number}`}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-amber-500/40 hover:shadow-md transition-all"
              >
                {/* 1. Side-by-Side Bilingual Layout (Desktop: TELUGU | ENGLISH, Mobile: TELUGU / ENGLISH) */}
                {settings.language === 'both' && settings.layout === 'side-by-side' ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-baseline">
                    
                    {/* Verse Number */}
                    {settings.showVerseNumbers && (
                      <div className="md:col-span-1 flex items-center md:justify-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs sm:text-sm font-mono">
                          {verse.verse_number}
                        </span>
                      </div>
                    )}

                    {/* Telugu Column */}
                    <div
                      style={{ fontSize: `${teluguFontSizePx}px`, lineHeight: 1.8 }}
                      className={`md:col-span-5 text-slate-900 dark:text-slate-100 font-telugu font-semibold`}
                    >
                      {/* Mobile verse label if verse numbers on */}
                      {settings.showVerseNumbers && (
                        <span className="md:hidden text-xs font-bold text-amber-600 mr-2 font-mono">
                          v{verse.verse_number}
                        </span>
                      )}
                      {verse.telugu_text}
                    </div>

                    {/* English Column */}
                    <div
                      style={{ fontSize: `${baseFontSizePx}px`, lineHeight: 1.6 }}
                      className={`md:col-span-5 text-slate-700 dark:text-slate-300 font-normal`}
                    >
                      {verse.english_text}
                    </div>

                    {/* Verse Actions */}
                    <div className="md:col-span-1 flex md:flex-col items-center justify-end space-x-2 md:space-x-0 md:space-y-1.5 opacity-90 md:opacity-40 group-hover:opacity-100 transition-opacity">
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
                ) : settings.language === 'both' && settings.layout === 'stacked' ? (
                  /* 2. Stacked Bilingual Layout (Telugu on top, English underneath) */
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        {/* Telugu Text */}
                        <div
                          style={{ fontSize: `${teluguFontSizePx}px`, lineHeight: 1.8 }}
                          className="font-telugu font-semibold text-slate-900 dark:text-slate-100"
                        >
                          {settings.showVerseNumbers && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs font-mono mr-2.5">
                              {verse.verse_number}
                            </span>
                          )}
                          {verse.telugu_text}
                        </div>

                        {/* English Text */}
                        <div
                          style={{ fontSize: `${baseFontSizePx}px`, lineHeight: 1.6 }}
                          className="text-slate-700 dark:text-slate-300 font-normal pl-1 border-l-2 border-amber-500/30"
                        >
                          {verse.english_text}
                        </div>
                      </div>

                      {/* Verse Actions */}
                      <div className="flex items-center space-x-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleFavoriteVerse(verse)}
                          title="Save Bookmark"
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isFav ? 'bg-rose-500/10 border-rose-500 text-rose-500' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleCopyVerse(verse)}
                          title="Copy Verse"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500"
                        >
                          {copiedVerseId === verse.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleShareVerse(verse)}
                          title="Share Verse"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : settings.language === 'telugu' ? (
                  /* 3. Telugu Only Layout */
                  <div className="flex items-start justify-between gap-4">
                    <div
                      style={{ fontSize: `${teluguFontSizePx}px`, lineHeight: 1.85 }}
                      className="font-telugu font-semibold text-slate-900 dark:text-slate-100 flex-1"
                    >
                      {settings.showVerseNumbers && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs font-mono mr-2.5">
                          {verse.verse_number}
                        </span>
                      )}
                      {verse.telugu_text}
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleFavoriteVerse(verse)}
                        className={`p-1.5 rounded-lg border ${isFav ? 'text-rose-500 border-rose-500' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                      <button onClick={() => handleCopyVerse(verse)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 4. English Only Layout */
                  <div className="flex items-start justify-between gap-4">
                    <div
                      style={{ fontSize: `${baseFontSizePx}px`, lineHeight: 1.65 }}
                      className="text-slate-800 dark:text-slate-200 font-normal flex-1"
                    >
                      {settings.showVerseNumbers && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs font-mono mr-2.5">
                          {verse.verse_number}
                        </span>
                      )}
                      {verse.english_text}
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleFavoriteVerse(verse)}
                        className={`p-1.5 rounded-lg border ${isFav ? 'text-rose-500 border-rose-500' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                      <button onClick={() => handleCopyVerse(verse)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Chapter Stepper Bottom Navigation */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={handlePrevChapter}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-500 text-xs sm:text-sm font-semibold transition-all hover:scale-105"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Chapter</span>
        </button>

        <div className="text-center text-xs text-slate-500">
          <span>{selectedBook.name_english} {selectedChapter} / {selectedBook.total_chapters}</span>
        </div>

        <button
          onClick={handleNextChapter}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105"
        >
          <span>Next Chapter</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

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
