'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SongProjector from '@/components/SongProjector';
import { Song } from '@/lib/types';

function SongProjectorContent() {
  const searchParams = useSearchParams();
  const initialSongId = Number(searchParams.get('songId')) || 1;

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/songs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSongs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#040810] flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="font-cinzel text-amber-300 text-sm">Loading songs...</p>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#040810] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h2 className="font-cinzel text-xl text-slate-100 font-bold">
          No songs have been added yet.
        </h2>
        <a
          href="/songs"
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-sm rounded-2xl shadow-lg hover:scale-105 transition"
        >
          + Add Song
        </a>
      </div>
    );
  }

  return <SongProjector songs={songs} initialSongId={initialSongId} />;
}

export default function SongProjectorPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-[#040810] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SongProjectorContent />
    </Suspense>
  );
}
