'use client';

import { Suspense, useState, useEffect } from 'react';
import BibleReader from '@/components/BibleReader';
import { BibleBook } from '@/lib/types';

function BiblePageContent() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bible/books')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
