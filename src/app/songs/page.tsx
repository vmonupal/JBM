'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Music, Search, Play, Heart, Tv, ArrowRight, Plus, 
  Edit3, Trash2, Copy, History, Check, AlertTriangle, Sparkles, Filter
} from 'lucide-react';
import { Song, Category } from '@/lib/types';
import { usePlayer } from '@/components/MusicPlayer';
import SongEditorModal from '@/components/SongEditorModal';
import SongVersionHistoryModal from '@/components/SongVersionHistoryModal';

export default function SongsPage() {
  const { playSong } = usePlayer();

  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [songToEdit, setSongToEdit] = useState<Song | null>(null);

  const [historySong, setHistorySong] = useState<Song | null>(null);

  // Deletion Confirmation state (Requirement 7)
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Feedback notifications
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadData = () => {
    let url = '/api/songs?';
    if (selectedCategory) url += `categoryId=${selectedCategory}&`;
    if (searchQuery.trim()) url += `q=${encodeURIComponent(searchQuery.trim())}`;

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSongs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) setSearchQuery(q);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  const handleOpenAdd = () => {
    setSongToEdit(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (song: Song) => {
    setSongToEdit(song);
    setIsEditorOpen(true);
  };

  const handleDuplicate = async (song: Song) => {
    try {
      const res = await fetch(`/api/songs/${song.id}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionNotice(`Duplicated "${song.title_english}" successfully.`);
        loadData();
        setTimeout(() => setActionNotice(null), 3000);
      }
    } catch (e) {
      alert('Failed to duplicate song.');
    }
  };

  const confirmDelete = async () => {
    if (!songToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/songs/${songToDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setActionNotice(`Song #${songToDelete.song_number} deleted.`);
        setSongToDelete(null);
        loadData();
        setTimeout(() => setActionNotice(null), 3000);
      }
    } catch (e) {
      alert('Failed to delete song.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header with prominent + ADD SONG button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-amber-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <Music className="w-3.5 h-3.5 text-amber-500" />
            <span>Public Worship Hymnal & Songbook</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-slate-900 dark:text-amber-100">
            Church Songs (కీర్తనల గ్రంథం)
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-normal">
            Browse, search, edit, and add songs in Telugu and English. Present on sanctuary projector displays with one click.
          </p>
        </div>

        {/* PROMINENT + ADD SONG BUTTON (Requirement 3 & 4) */}
        <div>
          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>+ ADD SONG (నూతన కీర్తన)</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2 animate-fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Search and Category Filter Toolbar (Requirement 4 & 9) */}
      <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-5 shadow-xs space-y-4">
        {/* Search Input across entire song database */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs by title, lyrics, number, language, category or author..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              selectedCategory === null
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-600'
            }`}
          >
            All Categories ({songs.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Songs Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading songs library...</p>
        </div>
      ) : songs.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
          <p className="text-base text-slate-600 dark:text-slate-400">
            No songs found matching "{searchQuery}".
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md"
          >
            + Add This Song Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top: Song Number, Category & Language Badge */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-cinzel text-xs font-black text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      Song #{song.song_number}
                    </span>
                    {song.language && (
                      <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20">
                        {song.language}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0">
                    {song.category_name || 'Worship'}
                  </span>
                </div>

                {/* Song Titles */}
                <Link href={`/songs/${song.id}`}>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                    {song.title_english}
                  </h3>
                  <p className="font-telugu text-sm text-amber-800 dark:text-amber-300 mt-1 line-clamp-1 font-semibold">
                    {song.title_telugu}
                  </p>
                </Link>

                {/* Author / Composer / Bible Ref */}
                {(song.author || song.composer || song.bible_reference) && (
                  <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-1">
                    {song.author && `By ${song.author}`}
                    {song.composer && ` • Comp: ${song.composer}`}
                    {song.bible_reference && ` • Ref: ${song.bible_reference}`}
                  </p>
                )}

                {/* Lyrics Preview */}
                <p className="font-telugu text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {song.lyrics_telugu.slice(0, 100)}...
                </p>
              </div>

              {/* Action Toolbar on Card */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  {/* Play audio button */}
                  <button
                    onClick={() => playSong(song, songs)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold text-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </button>

                  {/* PROJECTOR BUTTON (Requirement 10) */}
                  <Link
                    href={`/songs/projector?songId=${song.id}`}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-950 text-amber-300 hover:bg-slate-900 border border-amber-500/30 text-xs font-bold transition-all hover:scale-105"
                  >
                    <Tv className="w-3.5 h-3.5 text-amber-400" />
                    <span>PROJECTOR</span>
                  </Link>

                  {/* View Details */}
                  <Link
                    href={`/songs/${song.id}`}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-500 hover:text-amber-600 transition-colors"
                    title="View Full Lyrics"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Secondary management buttons (Public Editing - Requirement 3, 6, 7, 19, 20) */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(song)}
                      className="hover:text-amber-600 flex items-center space-x-1 font-semibold"
                      title="Edit song lyrics and information"
                    >
                      <Edit3 className="w-3 h-3 text-amber-500" />
                      <span>Edit</span>
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => handleDuplicate(song)}
                      className="hover:text-amber-600 flex items-center space-x-1"
                      title="Duplicate this song"
                    >
                      <Copy className="w-3 h-3 text-sky-500" />
                      <span>Duplicate</span>
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => setHistorySong(song)}
                      className="hover:text-amber-600 flex items-center space-x-1"
                      title="View Version History & Restore"
                    >
                      <History className="w-3 h-3 text-purple-500" />
                      <span>History</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setSongToDelete(song)}
                    className="hover:text-rose-500 text-slate-400 transition-colors p-1"
                    title="Delete Song"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SONG EDITOR MODAL */}
      <SongEditorModal
        isOpen={isEditorOpen}
        onClose={() => { setIsEditorOpen(false); setSongToEdit(null); }}
        onSaved={(id) => {
          setActionNotice('Song saved successfully!');
          loadData();
          setTimeout(() => setActionNotice(null), 3000);
        }}
        songToEdit={songToEdit}
        categories={categories}
        onCategoryAdded={(newCat) => setCategories(prev => [...prev, newCat])}
      />

      {/* VERSION HISTORY MODAL */}
      {historySong && (
        <SongVersionHistoryModal
          isOpen={!!historySong}
          onClose={() => setHistorySong(null)}
          songId={historySong.id}
          songTitle={`#${historySong.song_number} ${historySong.title_english}`}
          onVersionRestored={() => {
            setActionNotice('Version restored successfully!');
            loadData();
            setTimeout(() => setActionNotice(null), 3000);
          }}
        />
      )}

      {/* CONFIRMATION BEFORE DELETING MODAL (Requirement 7) */}
      {songToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-rose-500/30 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-slate-100">
                Are you sure you want to delete this song?
              </h3>
              <p className="text-xs text-slate-500">
                Song #{songToDelete.song_number}: <strong>{songToDelete.title_english}</strong> ({songToDelete.title_telugu})
              </p>
              <p className="text-[11px] text-slate-400">
                This will remove the song from the church hymnal. Earlier revisions can still be restored by church administrators if needed.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center space-x-3">
              <button
                onClick={() => setSongToDelete(null)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
