'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, Music, Search, Tv, Sparkles, Copy, 
  Share2, Check, ArrowRight, Play, Flame, Clock, Image as ImageIcon, Plus
} from 'lucide-react';
import { BibleBook, Song, Poster } from '@/lib/types';
import { usePlayer } from '@/components/MusicPlayer';
import { useBranding } from '@/context/BrandingContext';
import JbmBrandLogo from '@/components/JbmBrandLogo';
import LiveClock from '@/components/LiveClock';

export default function HomePage() {
  const router = useRouter();
  const { playSong } = usePlayer();
  const { branding } = useBranding();

  const [books, setBooks] = useState<BibleBook[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [activeTestament, setActiveTestament] = useState<'NT' | 'OT'>('NT');
  const [copiedVerse, setCopiedVerse] = useState(false);
  const [bibleSearchQuery, setBibleSearchQuery] = useState('');
  const [songSearchQuery, setSongSearchQuery] = useState('');

  // Daily Bible Verse (Authorized KJV + Public Domain Telugu)
  const dailyVerse = {
    refEnglish: 'John 3:16',
    refTelugu: 'యోహాను 3:16',
    bookId: 43,
    chapter: 3,
    verse: 16,
    teluguText: 'దేవుడు లోకమును ఎంతో ప్రేమించెను. కాగా ఆయన తన అద్వితీయకుమారునిగా పుట్టిన వానియందు విశ్వాసముంచు ప్రతివాడును నశింపక నిత్యజీవము పొందునట్లు ఆయనను అనుగ్రహించెను.',
    englishText: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.'
  };

  useEffect(() => {
    // Fetch books
    fetch('/api/bible/books')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setBooks(data); })
      .catch(() => {});

    // Fetch songs
    fetch('/api/songs')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setSongs(data); })
      .catch(() => {});

    // Fetch posters
    fetch('/api/posters')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPosters(data); })
      .catch(() => {});
  }, []);

  const handleCopyVerse = () => {
    const text = `${dailyVerse.refEnglish} (${dailyVerse.refTelugu})

Telugu: ${dailyVerse.teluguText}

English: ${dailyVerse.englishText}

— ${branding.website_name || 'JBM'}`;
    navigator.clipboard.writeText(text);
    setCopiedVerse(true);
    setTimeout(() => setCopiedVerse(false), 2000);
  };

  const handleShareVerse = async () => {
    const text = `${dailyVerse.refEnglish} (${dailyVerse.refTelugu})

Telugu: ${dailyVerse.teluguText}

English: ${dailyVerse.englishText}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: dailyVerse.refEnglish, text, url: window.location.href });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(text);
      setCopiedVerse(true);
      setTimeout(() => setCopiedVerse(false), 2000);
    }
  };

  // Recently added songs (newest created / highest ID)
  const recentlyAddedSongs = [...songs].reverse().slice(0, 6);
  // Popular songs (by views or catalog order)
  const popularSongs = [...songs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      
      {/* 1. HERO SECTION (JBM Visual Identity & Quick Actions) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-sky-900/5 to-transparent pt-10 sm:pt-16 pb-14 border-b border-amber-500/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* JBM OFFICIAL LOGO / WORDMARK BADGE */}
          <div className="flex justify-center">
            <JbmBrandLogo variant="hero" showSubtitle={false} />
          </div>

          {/* Welcome Text */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Bilingual Holy Bible & Worship Songs</span>
            </div>
            
            <h1 className="font-cinzel text-4xl sm:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Welcome to JBM
            </h1>
            
            <p className="font-telugu text-amber-700 dark:text-amber-400 font-semibold text-lg sm:text-xl">
              పరిశుద్ధ గ్రంథము & కీర్తనల గ్రంథాలయం
            </p>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Read God's Word in Telugu and English, worship through church hymns, explore Church posters, and project lyrics and scriptures on sanctuary displays. Open to everyone with no account required.
            </p>
          </div>

          {/* Live Date and Time Badge */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-xs text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <LiveClock showSeconds={true} />
            </div>
          </div>

          {/* CORE ACTION BUTTONS:
              [ BIBLE ] [ SONGS ] [ POSTERS ] [ BIBLE PROJECTOR ] [ SONG PROJECTOR ] [ SEARCH ] */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            
            {/* [ BIBLE ] */}
            <Link
              href="/bible"
              className="px-6 py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>BIBLE</span>
            </Link>

            {/* [ SONGS ] */}
            <Link
              href="/songs"
              className="px-6 py-3.5 bg-white dark:bg-slate-900 border-2 border-amber-500/40 hover:border-amber-500 text-slate-900 dark:text-slate-100 font-bold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Music className="w-5 h-5 text-amber-500" />
              <span>SONGS</span>
            </Link>

            {/* [ POSTERS ] */}
            <Link
              href="/posters"
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
            >
              <ImageIcon className="w-5 h-5" />
              <span>POSTERS</span>
            </Link>

            {/* [ BIBLE PROJECTOR ] */}
            <Link
              href="/bible/projector"
              className="px-6 py-3.5 bg-slate-950 text-amber-300 border border-amber-500/50 hover:bg-slate-900 font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Tv className="w-5 h-5 text-amber-400" />
              <span>BIBLE PROJECTOR</span>
            </Link>

            {/* [ SONG PROJECTOR ] */}
            <Link
              href="/songs/projector"
              className="px-6 py-3.5 bg-slate-900 text-sky-300 border border-sky-500/40 hover:bg-slate-800 font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Tv className="w-5 h-5 text-sky-400" />
              <span>SONG PROJECTOR</span>
            </Link>

            {/* [ SEARCH ] */}
            <Link
              href="/bible/search"
              className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base rounded-2xl shadow-md hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Search className="w-5 h-5 text-amber-500" />
              <span>SEARCH</span>
            </Link>

          </div>

          {/* VISIBLE INSTANT SEARCH BARS (Requirement 19: Instant Bible Search & Song Search) */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto text-left">
            {/* Instant Bible Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (bibleSearchQuery.trim()) {
                  router.push(`/bible/search?q=${encodeURIComponent(bibleSearchQuery.trim())}`);
                }
              }}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-2xl p-2.5 shadow-md flex items-center gap-2 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all"
            >
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={bibleSearchQuery}
                onChange={(e) => setBibleSearchQuery(e.target.value)}
                placeholder="Instant Bible search (e.g. John 3:16, యోహాను 3:16)..."
                className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Instant Song Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (songSearchQuery.trim()) {
                  router.push(`/songs?q=${encodeURIComponent(songSearchQuery.trim())}`);
                }
              }}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-sky-500/30 rounded-2xl p-2.5 shadow-md flex items-center gap-2 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all"
            >
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
                <Music className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={songSearchQuery}
                onChange={(e) => setSongSearchQuery(e.target.value)}
                placeholder="Instant Song search (title, lyrics, number, author)..."
                className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 2. DAILY BIBLE VERSE (Requirement 18) */}
      <section id="daily-verse" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50/40 to-white dark:from-slate-900 dark:via-slate-900 dark:to-sky-950 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-xl">
          
          {/* Card Top Label */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="font-cinzel text-xs sm:text-sm font-bold tracking-widest text-amber-800 dark:text-amber-300 uppercase">
                Daily Bible Verse • నేటి దైవ వాక్యము
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyVerse}
                title="Copy Verse"
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition-colors"
              >
                {copiedVerse ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleShareVerse}
                title="Share Verse"
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reference & Bilingual Verses */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-200">
                {dailyVerse.refEnglish}
              </h2>
              <span className="font-telugu text-lg sm:text-xl font-bold text-amber-700 dark:text-amber-400">
                {dailyVerse.refTelugu}
              </span>
            </div>

            {/* Telugu Verse Text */}
            <p className="font-telugu text-lg sm:text-2xl text-slate-900 dark:text-slate-100 font-semibold leading-relaxed">
              "{dailyVerse.teluguText}"
            </p>

            <div className="h-px bg-amber-500/20" />

            {/* English Verse Text */}
            <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 font-normal leading-relaxed italic">
              "{dailyVerse.englishText}"
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-amber-500/20 text-xs">
            <span className="text-slate-500">Holy Bible • Authorized Public Domain Telugu & KJV</span>
            <div className="flex items-center space-x-3">
              <Link
                href={`/bible?bookId=${dailyVerse.bookId}&chapter=${dailyVerse.chapter}`}
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1"
              >
                <span>Read Full Chapter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/bible/projector?bookId=${dailyVerse.bookId}&chapter=${dailyVerse.chapter}&verse=${dailyVerse.verse}`}
                className="px-3.5 py-1.5 bg-slate-950 text-amber-300 font-semibold rounded-lg hover:bg-slate-900 transition-colors flex items-center space-x-1.5"
              >
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>Present on Projector</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. RECENTLY ADDED SONGS (Requirement 18) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Hymnal Additions</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              Recently Added Songs (ఇటీవల చేర్చిన కీర్తనలు)
            </h2>
          </div>
          <Link
            href="/songs"
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            <span>View All Songs & Add New</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentlyAddedSongs.map((song) => (
            <div
              key={song.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-cinzel text-xs font-black text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    Song #{song.song_number}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    {song.category_name || 'Worship'}
                  </span>
                </div>

                <Link href={`/songs/${song.id}`}>
                  <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                    {song.title_english}
                  </h3>
                  <p className="font-telugu text-sm text-amber-800 dark:text-amber-300 mt-1 line-clamp-1 font-medium">
                    {song.title_telugu}
                  </p>
                </Link>

                <p className="font-telugu text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2">
                  {song.lyrics_telugu.slice(0, 100)}...
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => playSong(song, songs)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold text-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play</span>
                </button>

                <div className="flex items-center space-x-1">
                  <Link
                    href={`/songs/projector?songId=${song.id}`}
                    title="Present Lyrics on Projector"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-500 hover:text-amber-600 transition-colors"
                  >
                    <Tv className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/songs/${song.id}`}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-500 hover:text-amber-600 transition-colors"
                    title="View Full Lyrics"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. POPULAR SONGS (Requirement 18) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Sacred Worship</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              Popular Songs (ప్రసిద్ధ కీర్తనలు)
            </h2>
          </div>
          <Link
            href="/songs"
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            <span>Browse Complete Library</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularSongs.map((song) => (
            <div
              key={song.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-cinzel text-xs font-black text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    Song #{song.song_number}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    {song.category_name || 'Worship'}
                  </span>
                </div>

                <Link href={`/songs/${song.id}`}>
                  <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                    {song.title_english}
                  </h3>
                  <p className="font-telugu text-sm text-amber-800 dark:text-amber-300 mt-1 line-clamp-1 font-medium">
                    {song.title_telugu}
                  </p>
                </Link>

                <p className="font-telugu text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2">
                  {song.lyrics_telugu.slice(0, 100)}...
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => playSong(song, songs)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold text-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play</span>
                </button>

                <div className="flex items-center space-x-1">
                  <Link
                    href={`/songs/projector?songId=${song.id}`}
                    title="Present Lyrics on Projector"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-500 hover:text-amber-600 transition-colors"
                  >
                    <Tv className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/songs/${song.id}`}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-500 hover:text-amber-600 transition-colors"
                    title="View Full Lyrics"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CHURCH POSTERS SHOWCASE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ImageIcon className="w-4 h-4" />
              <span>Church Events & Media</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              Church Posters (ప్రకటనలు & పోస్టర్లు)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Upcoming sanctuary services, fasting prayers, youth rallies, and ministry celebrations.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/posters"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20 transition-all"
            >
              <span>View All Posters ({posters.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posters.slice(0, 4).map((p) => (
            <Link
              key={p.id}
              href={`/posters?id=${p.id}`}
              className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden">
                <img
                  src={p.image_url}
                  alt={p.title || 'Church Poster'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-emerald-300 backdrop-blur-xs border border-emerald-500/30">
                    {p.category}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {p.title || p.event_name || 'Church Event'}
                  </h3>
                  {p.event_date && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{p.event_date} {p.event_time ? `• ${p.event_time}` : ''}</span>
                    </p>
                  )}
                  {p.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>View Poster</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. BIBLE BOOKS (Requirement 18) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-10 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                Scripture Navigation
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                Bible Books (పరిశుద్ధ గ్రంథము - 66 గ్రంథాలు)
              </h2>
            </div>

            {/* Testament Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                onClick={() => setActiveTestament('NT')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTestament === 'NT'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                New Testament (27 Books)
              </button>
              <button
                onClick={() => setActiveTestament('OT')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTestament === 'OT'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                Old Testament (39 Books)
              </button>
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {books
              .filter(b => b.testament === activeTestament)
              .map((b) => (
                <Link
                  key={b.id}
                  href={`/bible?bookId=${b.id}&chapter=1`}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-slate-800 transition-all text-center group"
                >
                  <p className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {b.name_english}
                  </p>
                  <p className="font-telugu text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 truncate">
                    {b.name_telugu}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {b.total_chapters} Chapters
                  </span>
                </Link>
              ))}
          </div>

        </div>
      </section>

    </div>
  );
}
