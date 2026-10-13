'use client';

import { Suspense, useState, useEffect } from 'react';
import BibleReader from '@/components/BibleReader';
import { BibleBook } from '@/lib/types';

function BiblePageContent() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      // 1. Try local cache first for instant offline render
      try {
        const cached = localStorage.getItem('rci_cached_bible_books');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length === 66) {
            setBooks(parsed);
            setLoading(false);
          }
        }
      } catch (e) {}

      // 2. Fetch from API
      try {
        const res = await fetch('/api/bible/books');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setBooks(data);
            setLoading(false);
            try { localStorage.setItem('rci_cached_bible_books', JSON.stringify(data)); } catch (e) {}
            return;
          }
        }
      } catch (e) {}

      // 3. Fallback to static public JSON
      try {
        const res = await fetch('/data/bible/books.json');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setBooks(data);
            setLoading(false);
            try { localStorage.setItem('rci_cached_bible_books', JSON.stringify(data)); } catch (e) {}
            return;
          }
        }
      } catch (e) {}

      setLoading(false);
    };

    loadBooks();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-cinzel text-amber-600 text-sm">Opening Holy Scriptures...</p>
      </div>
    );
  }

  return <BibleReader initialBooks={books} />;
}

export default function BiblePage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    }>
      <BiblePageContent />
    </Suspense>
  );
}
