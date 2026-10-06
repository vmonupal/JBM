'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Play, Pause, Heart, Share2, Copy, Tv, ArrowLeft, 
  Check, Volume2, Video, Music, Edit3, Trash2, 
  History, RotateCcw, AlertTriangle, BookOpen, Clock, Copy as DuplicateIcon
} from 'lucide-react';
import { Song, Category } from '@/lib/types';
import { usePlayer } from '@/components/MusicPlayer';
import SongEditorModal from '@/components/SongEditorModal';
import SongVersionHistoryModal from '@/components/SongVersionHistoryModal';

export default function SongDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { playSong, isPlaying, currentSong, togglePlay } = usePlayer();

  const [song, setSong] = useState<Song | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Requirement 5: Song Language Display Buttons
  // [ Telugu ] [ English ] [ Telugu + English ]
  const [languageOption, setLanguageOption] = useState<'telugu' | 'english' | 'both'>('both');
  const [layoutMode, setLayoutMode] = useState<'stacked' | 'side-by-side'>('stacked');

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [undoing, setUndoing] = useState(false);

  const loadSong = () => {
    fetch(`/api/songs/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setSong(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  };

  useEffect(() => {
    loadSong();
  }, [id]);

  const handleCopy = () => {
    if (!song) return;
    const text = `Song #${song.song_number}: ${song.title_english}
${song.title_telugu}

[Telugu Lyrics]
${song.lyrics_telugu}

[English Lyrics]
${song.lyrics_english}

— Revival Chapel`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!song) return;
    const title = `Song #${song.song_number}: ${song.title_english} (${song.title_telugu})`;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDuplicate = async () => {
    if (!song) return;
    try {
      const res = await fetch(`/api/songs/${song.id}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.id) {
        router.push(`/songs/${data.id}`);
      }
    } catch (e) {
      alert('Failed to duplicate song.');
    }
  };

  // Requirement 19: Undo last change
  const handleUndo = async () => {
    if (!song) return;
    if (!confirm('Undo the last modification to this song?')) return;

    setUndoing(true);
    try {
      const res = await fetch(`/api/songs/${song.id}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'undo' })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg('Successfully reverted to previous version!');
        loadSong();
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        alert('No earlier revision available to undo.');
      }
    } catch (e) {
      alert('Failed to undo.');
    } finally {
      setUndoing(false);
    }
  };

  // Requirement 7: Delete confirmation
  const handleDelete = async () => {
    if (!song) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/songs/${song.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        router.push('/songs');
      }
    } catch (e) {
      alert('Failed to delete song.');
    } finally {
      setDeleting(false);
    }
  };

  const getYouTubeEmbedUrl = (url: string | null | undefined) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Opening song...</p>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="py-24 text-center space-y-4">
        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">Song not found</p>
        <Link href="/songs" className="px-5 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-xs">
          Return to Songs Library
        </Link>
      </div>
    );
  }

  const isCurrentAudioPlaying = currentSong?.id === song.id && isPlaying;
  const youtubeEmbed = getYouTubeEmbedUrl(song.video_url);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <Link
          href="/songs"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Songs Library</span>
        </Link>

        {/* Last Updated Date/Time (Requirement 19) */}
        {(song.updated_at || song.created_at) && (
          <div className="flex items-center space-x-1 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Last Updated: {formatDateTime(song.updated_at || song.created_at)}</span>
          </div>
        )}
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2 animate-fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Song Header & Controls Card */}
      <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-amber-500/20">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-cinzel text-xs font-black text-amber-600 dark:text-amber-400 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                Song #{song.song_number}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {song.category_name || 'Worship'}
              </span>
              {song.bible_reference && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center space-x-1">
                  <BookOpen className="w-3 h-3" />
                  <span>Ref: {song.bible_reference}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold font-cinzel text-slate-900 dark:text-amber-100">
              {song.title_english}
            </h1>
            <p className="text-xl sm:text-2xl font-telugu text-amber-700 dark:text-amber-400 font-semibold">
              {song.title_telugu}
            </p>
            {song.author && (
              <p className="text-xs text-slate-400">Written / Composed by: {song.author}</p>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Play audio */}
            <button
              onClick={() => {
                if (currentSong?.id === song.id) togglePlay();
                else playSong(song);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-all flex items-center space-x-1.5 hover:scale-105"
            >
              {isCurrentAudioPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isCurrentAudioPlaying ? 'Pause Audio' : 'Play Audio'}</span>
            </button>

            {/* PROJECTOR BUTTON (Requirement 10) */}
            <Link
              href={`/songs/projector?songId=${song.id}`}
              className="px-4 py-2.5 bg-slate-950 text-amber-300 hover:bg-slate-900 border border-amber-500/40 font-bold text-xs sm:text-sm rounded-xl shadow transition-all flex items-center space-x-1.5 hover:scale-105"
            >
              <Tv className="w-4 h-4 text-amber-400" />
              <span>PROJECTOR</span>
            </Link>

            {/* [ Edit ] BUTTON (Requirement 6) */}
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-amber-500 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center space-x-1.5 hover:scale-105"
            >
              <Edit3 className="w-4 h-4 text-amber-500" />
              <span>Edit</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600 transition-colors"
              title="Copy Full Lyrics"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600 transition-colors"
              title="Share Song"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Public Editing Safety Toolbar (Requirement 19 & 20) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Song Actions:</span>
            
            {/* [ UNDO ] */}
            <button
              onClick={handleUndo}
              disabled={undoing}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 flex items-center space-x-1 transition-colors"
              title="Undo last change"
            >
              <RotateCcw className="w-3 h-3 text-amber-500" />
              <span>[ UNDO ]</span>
            </button>

            {/* [ RESTORE PREVIOUS VERSION ] / [ VERSION HISTORY ] */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 flex items-center space-x-1 transition-colors"
              title="Open full version history to restore past revisions"
            >
              <History className="w-3 h-3 text-purple-500" />
              <span>[ VERSION HISTORY ]</span>
            </button>

            {/* Duplicate */}
            <button
              onClick={handleDuplicate}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 flex items-center space-x-1 transition-colors"
              title="Create a duplicate copy of this song"
            >
              <DuplicateIcon className="w-3 h-3 text-sky-500" />
              <span>Duplicate</span>
            </button>
          </div>

          <div>
            {/* [ Delete ] */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold flex items-center space-x-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Song</span>
            </button>
          </div>
        </div>

        {/* REQUIREMENT 5: SONG LANGUAGE OPTIONS DISPLAY BUTTONS
            [ Telugu ] [ English ] [ Telugu + English ] */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-500">Lyrics Language:</span>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setLanguageOption('telugu')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  languageOption === 'telugu'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                [ Telugu ]
              </button>

              <button
                onClick={() => setLanguageOption('english')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  languageOption === 'english'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                [ English ]
              </button>

              <button
                onClick={() => setLanguageOption('both')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  languageOption === 'both'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                }`}
              >
                [ Telugu + English ]
              </button>
            </div>
          </div>

          {/* Side-by-side vs Stacked layout for bilingual view */}
          {languageOption === 'both' && (
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Layout:</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setLayoutMode('stacked')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    layoutMode === 'stacked' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:text-amber-600'
                  }`}
                >
                  Stacked
                </button>
                <button
                  onClick={() => setLayoutMode('side-by-side')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    layoutMode === 'side-by-side' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:text-amber-600'
                  }`}
                >
                  Side-by-Side
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Embedded Video (if available) */}
      {youtubeEmbed && (
        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-4 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-200">
            <Video className="w-4 h-4 text-red-500" />
            <span>Worship Recording & Video</span>
          </div>
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner">
            <iframe
              src={youtubeEmbed}
              title={song.title_english}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* Lyrics Display (Requirement 5) */}
      <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-10 shadow-xs">
        
        {/* Title Heading in Lyrics Card */}
        <div className="text-center pb-6 border-b border-amber-500/20 mb-8 space-y-1">
          <h2 className="font-cinzel text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            {song.title_english}
          </h2>
          <p className="font-telugu text-lg sm:text-xl font-bold text-amber-700 dark:text-amber-400">
            {song.title_telugu}
          </p>
        </div>

        {/* Scenario 1: Telugu Only */}
        {languageOption === 'telugu' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <h3 className="font-cinzel text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest pb-2 border-b border-amber-500/20">
              Telugu Lyrics (తెలుగు సాహిత్యం)
            </h3>
            <div className="font-telugu text-base sm:text-xl text-slate-900 dark:text-slate-100 whitespace-pre-line leading-loose">
              {song.lyrics_telugu}
            </div>
          </div>
        )}

        {/* Scenario 2: English Only */}
        {languageOption === 'english' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <h3 className="font-cinzel text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest pb-2 border-b border-amber-500/20">
              English Lyrics / Translation
            </h3>
            <div className="text-base sm:text-lg text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-normal">
              {song.lyrics_english || 'No English lyrics available.'}
            </div>
          </div>
        )}

        {/* Scenario 3: Telugu + English (Requirement 5: Display corresponding lyrics together) */}
        {languageOption === 'both' && (
          layoutMode === 'side-by-side' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
              {/* Telugu Side */}
              <div className="space-y-4">
                <h3 className="font-cinzel text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest pb-2 border-b border-amber-500/20 font-telugu">
                  Telugu Lyrics (తెలుగు సాహిత్యం)
                </h3>
                <div className="font-telugu text-base sm:text-lg text-slate-900 dark:text-slate-100 whitespace-pre-line leading-loose">
                  {song.lyrics_telugu}
                </div>
              </div>

              {/* English Side */}
              <div className="pt-6 md:pt-0 md:pl-8 space-y-4">
                <h3 className="font-cinzel text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest pb-2 border-b border-amber-500/20">
                  English Lyrics / Translation
                </h3>
                <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                  {song.lyrics_english || 'No English lyrics available.'}
                </div>
              </div>
            </div>
          ) : (
            /* Stacked Bilingual (Telugu first, English underneath) */
            <div className="space-y-8 max-w-3xl mx-auto">
              <div className="space-y-4">
                <h3 className="font-cinzel text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest pb-2 border-b border-amber-500/20 font-telugu">
                  Telugu Lyrics (తెలుగు సాహిత్యం)
                </h3>
                <div className="font-telugu text-lg sm:text-xl text-slate-900 dark:text-slate-100 whitespace-pre-line leading-loose">
                  {song.lyrics_telugu}
                </div>
              </div>

              {song.lyrics_english && (
                <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="font-cinzel text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest pb-2 border-b border-amber-500/20">
                    English Lyrics / Translation
                  </h3>
                  <div className="text-base text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    {song.lyrics_english}
                  </div>
                </div>
              )}
            </div>
          )
        )}

      </div>

      {/* SONG EDITOR MODAL (Requirement 6) */}
      <SongEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSaved={() => {
          setStatusMsg('Song updated successfully!');
          loadSong();
          setTimeout(() => setStatusMsg(null), 3000);
        }}
        songToEdit={song}
        categories={categories}
        onCategoryAdded={(newCat) => setCategories(prev => [...prev, newCat])}
      />

      {/* VERSION HISTORY MODAL (Requirement 19 & 20) */}
      <SongVersionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        songId={song.id}
        songTitle={`#${song.song_number} ${song.title_english}`}
        onVersionRestored={() => {
          setStatusMsg('Restored previous song version successfully!');
          loadSong();
          setTimeout(() => setStatusMsg(null), 3000);
        }}
      />

      {/* DELETE CONFIRMATION DIALOG (Requirement 7) */}
      {showDeleteConfirm && (
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
                Song #{song.song_number}: <strong>{song.title_english}</strong> ({song.title_telugu})
              </p>
              <p className="text-[11px] text-slate-400">
                Do not delete accidentally. If deleted, this song will be removed from the church catalog.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                [ Cancel ]
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? 'Deleting...' : '[ Delete ]'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
