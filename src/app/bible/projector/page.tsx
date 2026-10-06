'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BibleProjector from '@/components/BibleProjector';
import { BibleBook } from '@/lib/types';

function ProjectorContent() {
  const searchParams = useSearchParams();
  const bookId = Number(searchParams.get('bookId')) || 43; // John
  const chapter = Number(searchParams.get('chapter')) || 3;
  const verse = Number(searchParams.get('verse')) || 16;

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
      <div className="fixed inset-0 bg-[#040810] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BibleProjector
      books={books}
      initialBookId={bookId}
      initialChapter={chapter}
      initialVerseIndex={verse - 1 >= 0 ? verse - 1 : 0}
    />
  );
}

export default function BibleProjectorPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-[#040810] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProjectorContent />
    </Suspense>
  );
}
