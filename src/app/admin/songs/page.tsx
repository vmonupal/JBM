'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Plus, Edit3, Trash2, Check, Music, 
  Search, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { Song, Category } from '@/lib/types';

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Form State
  const [isEditing, setIsEditing] = useState<Song | null>(null);
  const [songNumber, setSongNumber] = useState(111);
  const [titleEnglish, setTitleEnglish] = useState('');
  const [titleTelugu, setTitleTelugu] = useState('');
  const [lyricsEnglish, setLyricsEnglish] = useState('');
  const [lyricsTelugu, setLyricsTelugu] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [author, setAuthor] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [bibleReference, setBibleReference] = useState('');

  const loadData = () => {
    setLoading(true);
    fetch('/api/songs')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setSongs(data); setLoading(false); })
      .catch(() => setLoading(false));

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEnglish || !titleTelugu || !lyricsTelugu) return;

    if (isEditing) {
      // Update
      const res = await fetch(`/api/songs/${isEditing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          song_number: songNumber,
          title_english: titleEnglish,
          title_telugu: titleTelugu,
          lyrics_english: lyricsEnglish,
          lyrics_telugu: lyricsTelugu,
          category_id: categoryId,
          author,
          audio_url: audioUrl,
          video_url: videoUrl,
          bible_reference: bibleReference
        })
      });
      if (res.ok) {
        setStatusMsg('Song updated successfully!');
        resetForm();
        loadData();
      }
    } else {
      // Add
      const res = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          song_number: songNumber,
          title_english: titleEnglish,
          title_telugu: titleTelugu,
          lyrics_english: lyricsEnglish,
          lyrics_telugu: lyricsTelugu,
          category_id: categoryId,
          author,
          audio_url: audioUrl,
          video_url: videoUrl,
          bible_reference: bibleReference
        })
      });
      if (res.ok) {
        setStatusMsg('New song added to hymnal!');
        resetForm();
        loadData();
      }
    }
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const resetForm = () => {
    setIsEditing(null);
    setTitleEnglish('');
    setTitleTelugu('');
    setLyricsEnglish('');
    setLyricsTelugu('');
    setAuthor('');
    setAudioUrl('');
    setVideoUrl('');
    setBibleReference('');
    setSongNumber(s => s + 1);
  };

  const handleEdit = (song: Song) => {
    setIsEditing(song);
    setSongNumber(song.song_number);
    setTitleEnglish(song.title_english);
    setTitleTelugu(song.title_telugu);
    setLyricsEnglish(song.lyrics_english);
    setLyricsTelugu(song.lyrics_telugu);
    setCategoryId(song.category_id);
    setAuthor(song.author || '');
    setAudioUrl(song.audio_url || '');
    setVideoUrl(song.video_url || '');
    setBibleReference(song.bible_reference || '');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this song from the church library?')) return;
    const res = await fetch(`/api/songs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setStatusMsg('Song deleted');
      loadData();
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Overview</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-100">
            Hymnal & Songs Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add, update, or remove church songs, upload audio MP3 links, and configure YouTube worship videos.
          </p>
        </div>

        {statusMsg && (
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Song Add/Edit Form */}
      <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-cinzel text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Plus className="w-4 h-4 text-amber-500" />
          <span>{isEditing ? `Editing Song #${isEditing.song_number}` : 'Add New Church Worship Song'}</span>
        </h3>

        <form onSubmit={handleSaveSong} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Song Number
              </label>
              <input
                type="number"
                required
                value={songNumber}
                onChange={(e) => setSongNumber(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Author / Composer
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Bro. Bakht Singh"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Telugu Title (తెలుగు శీర్షిక)
              </label>
              <input
                type="text"
                required
                value={titleTelugu}
                onChange={(e) => setTitleTelugu(e.target.value)}
                placeholder="e.g. యెహోవా నా బలమా"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-telugu"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                English Title
              </label>
              <input
                type="text"
                required
                value={titleEnglish}
                onChange={(e) => setTitleEnglish(e.target.value)}
                placeholder="e.g. The Lord is My Strength"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Telugu Lyrics (తెలుగు సాహిత్యం)
              </label>
              <textarea
                rows={6}
                required
                value={lyricsTelugu}
                onChange={(e) => setLyricsTelugu(e.target.value)}
                placeholder="పల్లవి మరియు చరణాలు ఇక్కడ నమోదు చేయండి..."
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-telugu"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                English Lyrics / Translation
              </label>
              <textarea
                rows={6}
                value={lyricsEnglish}
                onChange={(e) => setLyricsEnglish(e.target.value)}
                placeholder="Chorus and verses in English..."
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Audio Stream / MP3 URL
              </label>
              <input
                type="url"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://example.com/audio/song.mp3"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                YouTube Video URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Related Bible Verse
              </label>
              <input
                type="text"
                value={bibleReference}
                onChange={(e) => setBibleReference(e.target.value)}
                placeholder="e.g. Psalm 18:1-2, John 3:16"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
            >
              {isEditing ? 'Save Song Changes' : 'Publish Song to Church Library'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Songs List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="font-cinzel text-sm font-bold text-slate-900 dark:text-slate-100">
            Current Songs Library ({songs.length})
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading songs...</div>
        ) : songs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">No songs in library.</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {songs.map(song => (
              <div key={song.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-cinzel text-xs font-bold text-amber-600 dark:text-amber-400">
                      Song #{song.song_number}
                    </span>
                    <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                      {song.category_name}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-1">
                    {song.title_english}
                  </h4>
                  <p className="font-telugu text-xs text-amber-800 dark:text-amber-300">
                    {song.title_telugu}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(song)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600"
                    title="Edit Song"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(song.id)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-500"
                    title="Delete Song"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
