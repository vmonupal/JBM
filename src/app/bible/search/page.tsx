'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Tv, ArrowRight, Sparkles, Check, Copy } from 'lucide-react';
import { BibleVerse } from '@/lib/types';

export default function BibleSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const popularSearches = [
    { label: 'Love (ప్రేమ)', q: 'love' },
    { label: 'Peace (సమాధానము)', q: 'peace' },
    { label: 'Grace (కృప)', q: 'grace' },
    { label: 'Faith (విశ్వాసము)', q: 'faith' },
    { label: 'Light (వెలుగు)', q: 'light' },
    { label: 'Eternal life (నిత్యజీవము)', q: 'life' },
    { label: 'Salvation (రక్షణ)', q: 'salvation' }
  ];

  const handleSearch = async (searchTerm = query) => {
    if (!searchTerm || !searchTerm.trim()) return;
    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/bible/search?q=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (verse: BibleVerse) => {
    const text = `${verse.book_english} ${verse.chapter_number}:${verse.verse_number} (${verse.book_telugu})

Telugu: ${verse.telugu_text}

English: ${verse.english_text}

— Revival Chapel`;
    navigator.clipboard.writeText(text);
    setCopiedId(verse.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Search Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <Search className="w-3.5 h-3.5 text-amber-500" />
          <span>Scripture Concordance & Search</span>
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-slate-900 dark:text-amber-100">
          Search the Bilingual Bible
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Search verses in **Telugu Unicode words**, **English words**, or book references across the Old and New Testaments.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="relative flex items-center"
        >
          <Search className="w-5 h-5 text-slate-400 absolute left-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a Telugu word (e.g. ప్రేమ, కృప) or English word (e.g. love, peace, faith)..."
            className="w-full pl-12 pr-28 py-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm sm:text-base rounded-2xl border-2 border-amber-500/30 hover:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 shadow-md transition-all font-telugu"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-all hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Popular Search Suggestions */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Quick Searches:</span>
          {popularSearches.map((s) => (
            <button
              key={s.q}
              onClick={() => { setQuery(s.q); handleSearch(s.q); }}
              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-500/20 font-medium transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-500 text-sm">Searching Bible passages...</p>
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              No verses found matching "{query}"
            </p>
            <p className="text-xs text-slate-500">
              Try searching with a shorter keyword or check spelling.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400 px-2">
              <span>Found {results.length} matching verses for "{query}"</span>
              <span>Bilingual Telugu & English</span>
            </div>

            {results.map((verse) => (
              <div
                key={verse.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 hover:shadow-md transition-all space-y-3"
              >
                {/* Result Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-cinzel font-black text-amber-700 dark:text-amber-400 text-base">
                      {verse.book_english} {verse.chapter_number}:{verse.verse_number}
                    </span>
                    <span className="font-telugu text-sm text-slate-500 font-semibold">
                      ({verse.book_telugu} {verse.chapter_number}:{verse.verse_number})
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopy(verse)}
                      title="Copy Verse"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-600 transition-colors"
                    >
                      {copiedId === verse.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <Link
                      href={`/bible/projector?bookId=${verse.book_id}&chapter=${verse.chapter_number}&verse=${verse.verse_number}`}
                      title="Open in Projector Mode"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-600 transition-colors"
                    >
                      <Tv className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/bible?bookId=${verse.book_id}&chapter=${verse.chapter_number}`}
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-colors"
                    >
                      <span>Read Chapter</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Telugu Text */}
                <p className="font-telugu text-base sm:text-lg text-slate-800 dark:text-slate-100 font-semibold leading-relaxed">
                  {verse.telugu_text}
                </p>

                {/* English Text */}
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                  {verse.english_text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
