'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Tv, ArrowRight, Sparkles, Check, Copy, Compass } from 'lucide-react';
import { BibleVerse } from '@/lib/types';
import { ParsedBibleReference } from '@/lib/bible-reference-parser';

export default function BibleSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BibleVerse[]>([]);
  const [referenceMatch, setReferenceMatch] = useState<ParsedBibleReference | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const searchExamples = [
    { label: 'John 3:16', q: 'John 3:16' },
    { label: 'Genesis 1', q: 'Genesis 1' },
    { label: 'Psalm 23', q: 'Psalm 23' },
    { label: 'Matthew 5:3', q: 'Matthew 5:3' },
    { label: 'ప్రేమ (Love)', q: 'ప్రేమ' },
    { label: 'God (దేవుడు)', q: 'God' },
    { label: 'యోహాను 3:16', q: 'యోహాను 3:16' }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) {
        setQuery(q);
        handleSearch(q);
      }
    }
  }, []);

  const handleSearch = async (searchTerm = query) => {
    if (!searchTerm || !searchTerm.trim()) return;
    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/bible/search?q=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();
      if (data && typeof data === 'object') {
        setReferenceMatch(data.reference || null);
        setResults(Array.isArray(data.verses) ? data.verses : (Array.isArray(data) ? data : []));
      } else if (Array.isArray(data)) {
        setResults(data);
        setReferenceMatch(null);
      } else {
        setResults([]);
        setReferenceMatch(null);
      }
    } catch (e) {
      setResults([]);
      setReferenceMatch(null);
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Search Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <Search className="w-3.5 h-3.5 text-amber-500" />
          <span>Bible Scripture Concordance & Reference Search</span>
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-slate-900 dark:text-amber-100">
          Search the Bilingual Bible
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Search by exact reference (e.g. <strong>John 3:16</strong>, <strong>Genesis 1</strong>, <strong>యోహాను 3:16</strong>) or search words and phrases across all 66 books.
        </p>
      </div>

      {/* Prominent Search Bar (Requirement 7 & 8) */}
      <div className="max-w-3xl mx-auto space-y-3">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="relative flex items-center shadow-lg rounded-2xl"
        >
          <Search className="w-5 h-5 text-amber-500 absolute left-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Search Bible — Book, Chapter, Verse, or Word"
            className="w-full pl-12 pr-28 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm sm:text-base rounded-2xl border-2 border-amber-500/40 hover:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2.5 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-all hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Examples inside / under search box (Requirement 7) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-1">
          <span className="font-semibold text-slate-400 mr-1">Examples:</span>
          {searchExamples.map((ex) => (
            <button
              key={ex.q}
              type="button"
              onClick={() => { setQuery(ex.q); handleSearch(ex.q); }}
              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-500/20 font-medium transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Direct Reference Match Box (Requirement 8) */}
      {referenceMatch && (
        <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border-2 border-amber-500/40 rounded-3xl shadow-lg space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Direct Bible Reference Match
              </span>
            </div>
            <Link
              href={`/bible?bookId=${referenceMatch.bookId}&chapter=${referenceMatch.chapter}${referenceMatch.verse ? `&verse=${referenceMatch.verse}` : ''}`}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1 hover:scale-105"
            >
              <span>Open Scripture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div>
            <h3 className="font-cinzel text-2xl font-black text-slate-900 dark:text-amber-100">
              {referenceMatch.bookEnglish} Chapter {referenceMatch.chapter}
              {referenceMatch.verse ? ` : Verse ${referenceMatch.verse}` : ''}
            </h3>
            <p className="font-telugu text-lg text-amber-700 dark:text-amber-400 font-semibold">
              {referenceMatch.bookTelugu} {referenceMatch.chapter}వ అధ్యాయము
              {referenceMatch.verse ? ` : ${referenceMatch.verse}వ వచనము` : ''}
            </p>
          </div>

          {referenceMatch.exactVerse && (
            <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-amber-500/20 space-y-2">
              <p className="font-telugu text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                {referenceMatch.exactVerse.telugu_text}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {referenceMatch.exactVerse.english_text}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-500 text-sm">Searching across all 66 Bible books...</p>
          </div>
        )}

        {!loading && hasSearched && !referenceMatch && results.length === 0 && (
          <div className="py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              No verses found matching "{query}"
            </p>
            <p className="text-xs text-slate-500">
              Try searching with an exact reference like <strong>John 3:16</strong>, <strong>Genesis 1</strong>, or keywords like <strong>love</strong> or <strong>ప్రేమ</strong>.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400 px-2">
              <span>Found {results.length} matching verses across the Holy Bible</span>
              <span>Bilingual Telugu & English</span>
            </div>

            {results.map((verse) => (
              <div
                key={verse.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 hover:shadow-md transition-all space-y-3 group"
              >
                {/* Result Header */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/bible?bookId=${verse.book_id}&chapter=${verse.chapter_number}&verse=${verse.verse_number}`}
                    className="flex items-center space-x-2 group-hover:text-amber-600 transition-colors"
                  >
                    <span className="font-cinzel font-black text-amber-700 dark:text-amber-400 text-base">
                      {verse.book_english} {verse.chapter_number}:{verse.verse_number}
                    </span>
                    <span className="font-telugu text-sm text-slate-500 font-semibold">
                      ({verse.book_telugu} {verse.chapter_number}:{verse.verse_number})
                    </span>
                  </Link>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopy(verse)}
                      title="Copy Verse"
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-500 hover:text-amber-600 transition-colors"
                    >
                      {copiedId === verse.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <Link
                      href={`/bible?bookId=${verse.book_id}&chapter=${verse.chapter_number}&verse=${verse.verse_number}`}
                      className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl transition-all flex items-center space-x-1"
                    >
                      <span>Read Chapter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Parallel Verse Text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="font-telugu text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                    {verse.telugu_text}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {verse.english_text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
