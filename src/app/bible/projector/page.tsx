'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BibleProjector from '@/components/BibleProjector';
import { BibleBook } from '@/lib/types';

function ProjectorContent() {
  const searchParams = useSearchParams();
  
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

  // Support bookId or book name
  const bookParam = searchParams.get('bookId') || searchParams.get('book');
  let bookId = 43; // Default to John
  if (bookParam) {
    const num = Number(bookParam);
    if (!isNaN(num) && num >= 1 && num <= 66) {
      bookId = num;
    } else if (books.length > 0) {
      const q = bookParam.toLowerCase().trim();
      const found = books.find(b => 
        b.name_english.toLowerCase() === q ||
        b.name_telugu.toLowerCase() === q ||
        b.name_english.toLowerCase().startsWith(q)
      );
      if (found) bookId = found.id;
    }
  }

  // Chapter
  const chapterParam = searchParams.get('chapter');
  const chapter = chapterParam ? Math.max(1, Number(chapterParam)) : (bookParam ? 1 : 3);

  // Verse (start of passage)
  const verseParam = searchParams.get('verse') || searchParams.get('startVerse');
  const verse = verseParam ? Math.max(1, Number(verseParam)) : (bookParam || chapterParam ? 1 : 16);

  // End Verse (end of passage if range specified)
  const endVerseParam = searchParams.get('endVerse');
  const endVerse = endVerseParam ? Number(endVerseParam) : undefined;

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
      initialEndVerseIndex={endVerse && endVerse >= verse ? endVerse - 1 : undefined}
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
