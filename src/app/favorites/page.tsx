'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, BookOpen, Music, Trash2, ArrowRight, Play, Tv } from 'lucide-react';
import { usePlayer } from '@/components/MusicPlayer';

export default function FavoritesPage() {
  const { playSong } = usePlayer();
  const [activeTab, setActiveTab] = useState<'bible' | 'songs'>('bible');
  const [favoriteVerses, setFavoriteVerses] = useState<any[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = () => {
    setLoading(true);
    // Try to fetch from server if logged in
    fetch('/api/favorites')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const v = data.filter((f: any) => f.item_type === 'verse').map((f: any) => ({
            id: f.item_id,
            ...JSON.parse(f.details_json || '{}')
          }));
          const s = data.filter((f: any) => f.item_type === 'song').map((f: any) => ({
            id: f.item_id,
            ...JSON.parse(f.details_json || '{}')
          }));
          setFavoriteVerses(v);
          setFavoriteSongs(s);
        } else {
          // Fallback to local storage
          loadLocalFavorites();
        }
        setLoading(false);
      })
      .catch(() => {
        loadLocalFavorites();
        setLoading(false);
      });
  };

  const loadLocalFavorites = () => {
    try {
      const vMap = JSON.parse(localStorage.getItem('rci_favorite_verses') || '{}');
      const vIds = Object.keys(vMap).filter(k => vMap[k]);
      // Demo fallback verses if locally favored
      setFavoriteVerses(vIds.map(id => ({
        id,
        book_english: 'John',
        book_telugu: 'యోహాను',
        chapter: 3,
        verse: 16,
        telugu_text: 'దేవుడు లోకమును ఎంతో ప్రేమించెను...',
        english_text: 'For God so loved the world, that he gave his only begotten Son...'
      })));

      const sMap = JSON.parse(localStorage.getItem('rci_favorite_songs') || '{}');
      const sIds = Object.keys(sMap).filter(k => sMap[k]);
      setFavoriteSongs(sIds.map(id => ({
        id,
        song_number: 101,
        title_english: 'The Lord is My Strength',
        title_telugu: 'యెహోవా నా బలమా',
        category_name: 'Praise'
      })));
    } catch (e) {}
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeVerseFavorite = (id: any) => {
    setFavoriteVerses(prev => prev.filter(v => v.id !== id));
    try {
      const saved = JSON.parse(localStorage.getItem('rci_favorite_verses') || '{}');
      delete saved[id];
      localStorage.setItem('rci_favorite_verses', JSON.stringify(saved));
      fetch(`/api/favorites?type=verse&id=${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
  };

  const removeSongFavorite = (id: any) => {
    setFavoriteSongs(prev => prev.filter(s => s.id !== id));
    try {
      const saved = JSON.parse(localStorage.getItem('rci_favorite_songs') || '{}');
      delete saved[id];
      localStorage.setItem('rci_favorite_songs', JSON.stringify(saved));
      fetch(`/api/favorites?type=song&id=${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>My Personal Sanctuary Collection</span>
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-slate-900 dark:text-amber-100">
          Saved Favorites (ఇష్టమైనవి)
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Quickly access your bookmarked Bible verses and beloved worship songs in one peaceful place.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex justify-center">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('bible')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl transition-all ${
              activeTab === 'bible'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Bible Favorites ({favoriteVerses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('songs')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl transition-all ${
              activeTab === 'songs'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Song Favorites ({favoriteSongs.length})</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading your favorites...</p>
        </div>
      ) : activeTab === 'bible' ? (
        <div className="space-y-4">
          {favoriteVerses.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No favorite Bible verses yet</p>
              <p className="text-xs text-slate-500">
                While reading the Bible, click the heart icon on any verse to save it here!
              </p>
              <Link href="/bible" className="inline-block px-4 py-2 bg-amber-500 text-white font-semibold text-xs rounded-xl shadow">
                Explore Bible Reader
              </Link>
            </div>
          ) : (
            favoriteVerses.map((v) => (
              <div
                key={v.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-cinzel font-black text-amber-700 dark:text-amber-400 text-base">
                      {v.book_english} {v.chapter}:{v.verse}
                    </span>
                    <span className="font-telugu text-sm text-slate-500 font-semibold">
                      ({v.book_telugu} {v.chapter}:{v.verse})
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/bible?bookId=43&chapter=${v.chapter}#verse-${v.verse}`}
                      className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold text-xs flex items-center space-x-1 hover:bg-amber-500/20"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => removeVerseFavorite(v.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-red-400"
                      title="Remove Favorite"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {v.telugu_text && (
                  <p className="font-telugu text-base text-slate-800 dark:text-slate-100 font-medium">
                    {v.telugu_text}
                  </p>
                )}
                {v.english_text && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                    "{v.english_text}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {favoriteSongs.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <Music className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No favorite songs yet</p>
              <p className="text-xs text-slate-500">
                Browse our church hymnal and click the heart icon on any song to save it here!
              </p>
              <Link href="/songs" className="inline-block px-4 py-2 bg-amber-500 text-white font-semibold text-xs rounded-xl shadow">
                Browse Songs Library
              </Link>
            </div>
          ) : (
            favoriteSongs.map((s) => (
              <div
                key={s.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 hover:shadow-md transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-cinzel text-xs font-bold text-amber-600 dark:text-amber-400">
                      Song #{s.song_number}
                    </span>
                    <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                      {s.category_name}
                    </span>
                  </div>
                  <Link href={`/songs/${s.id}`}>
                    <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 hover:text-amber-600 mt-1">
                      {s.title_english}
                    </h3>
                    <p className="font-telugu text-sm text-amber-800 dark:text-amber-400">
                      {s.title_telugu}
                    </p>
                  </Link>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/songs/${s.id}`}
                    className="px-3 py-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-semibold hover:bg-amber-500/20"
                  >
                    View Lyrics
                  </Link>
                  <button
                    onClick={() => removeSongFavorite(s.id)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-400"
                    title="Remove Favorite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
