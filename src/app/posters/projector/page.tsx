'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PosterProjector from '@/components/PosterProjector';
import { Poster, PosterDisplaySettings } from '@/lib/types';
import Link from 'next/link';
import { Image as ImageIcon } from 'lucide-react';

function PosterProjectorContent() {
  const searchParams = useSearchParams();
  const initialPosterId = Number(searchParams.get('id')) || undefined;

  const [posters, setPosters] = useState<Poster[]>([]);
  const [settings, setSettings] = useState<PosterDisplaySettings | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/posters', { cache: 'no-store' }).then(res => res.json()).catch(() => []),
      fetch('/api/posters/settings', { cache: 'no-store' }).then(res => res.json()).catch(() => null)
    ]).then(([postersData, settingsData]) => {
      if (Array.isArray(postersData)) {
        setPosters(postersData);
      }
      if (settingsData && settingsData.settings) {
        setSettings(settingsData.settings);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-cinzel text-emerald-300 text-sm font-semibold tracking-wider">
          Initializing JBM Poster Projector...
        </p>
      </div>
    );
  }

  if (posters.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center space-y-4 text-center px-4">
        <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <ImageIcon className="w-10 h-10" />
        </div>
        <h2 className="font-cinzel text-xl text-slate-100 font-bold">
          No posters available for projection.
        </h2>
        <p className="text-xs text-slate-400 max-w-sm">
          Please add church event posters from the gallery before starting projector mode.
        </p>
        <Link
          href="/posters"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
        >
          Go to Poster Gallery
        </Link>
      </div>
    );
  }

  return (
    <PosterProjector
      posters={posters}
      initialPosterId={initialPosterId}
      initialSettings={settings}
    />
  );
}

export default function PosterProjectorPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PosterProjectorContent />
    </Suspense>
  );
}
