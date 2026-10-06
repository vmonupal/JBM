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

  if (loading || songs.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#040810] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
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
