'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Check, AlertTriangle, Music, Sparkles } from 'lucide-react';
import { Song, Category } from '@/lib/types';

interface SongEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (songId: number) => void;
  songToEdit?: Song | null;
  categories: Category[];
  onCategoryAdded?: (newCat: Category) => void;
}

export default function SongEditorModal({
  isOpen,
  onClose,
  onSaved,
  songToEdit,
  categories,
  onCategoryAdded
}: SongEditorModalProps) {
  const isEditing = !!songToEdit;

  // Form states
  const [songNumber, setSongNumber] = useState<number>(101);
  const [titleEnglish, setTitleEnglish] = useState('');
  const [titleTelugu, setTitleTelugu] = useState('');
  const [lyricsEnglish, setLyricsEnglish] = useState('');
  const [lyricsTelugu, setLyricsTelugu] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [author, setAuthor] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [bibleReference, setBibleReference] = useState('');
  const [changeSummary, setChangeSummary] = useState('');

  // Add Category inline modal state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize form when songToEdit changes or modal opens
  useEffect(() => {
    if (songToEdit) {
      setSongNumber(songToEdit.song_number);
      setTitleEnglish(songToEdit.title_english || '');
      setTitleTelugu(songToEdit.title_telugu || '');
      setLyricsEnglish(songToEdit.lyrics_english || '');
      setLyricsTelugu(songToEdit.lyrics_telugu || '');
      setCategoryId(songToEdit.category_id || (categories[0]?.id || 1));
      setAuthor(songToEdit.author || '');
      setAudioUrl(songToEdit.audio_url || '');
      setVideoUrl(songToEdit.video_url || '');
      setBibleReference(songToEdit.bible_reference || '');
      setChangeSummary('');
    } else {
      // Default new song
      setTitleEnglish('');
      setTitleTelugu('');
      setLyricsEnglish('');
      setLyricsTelugu('');
      setAuthor('');
      setAudioUrl('');
      setVideoUrl('');
      setBibleReference('');
      setChangeSummary('');
      if (categories.length > 0) setCategoryId(categories[0].id);
      
      // Auto pick next song number
      fetch('/api/songs')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const maxNum = Math.max(...data.map((s: Song) => s.song_number || 0));
            setSongNumber(maxNum + 1);
          }
        })
        .catch(() => {});
    }
    setErrorMsg(null);
  }, [songToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleTelugu.trim() && !titleEnglish.trim()) {
      setErrorMsg('Please enter at least a Telugu or English title.');
      return;
    }
    if (!lyricsTelugu.trim() && !lyricsEnglish.trim()) {
      setErrorMsg('Please enter song lyrics in Telugu or English.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const payload = {
      song_number: Number(songNumber) || 101,
      title_english: titleEnglish.trim() || titleTelugu.trim(),
      title_telugu: titleTelugu.trim() || titleEnglish.trim(),
      lyrics_english: lyricsEnglish.trim(),
      lyrics_telugu: lyricsTelugu.trim(),
      category_id: Number(categoryId),
      author: author.trim() || null,
      audio_url: audioUrl.trim() || null,
      video_url: videoUrl.trim() || null,
      bible_reference: bibleReference.trim() || null,
      change_summary: changeSummary.trim() || (isEditing ? 'Updated song lyrics and information' : 'Initial creation')
    };

    try {
      if (isEditing && songToEdit) {
        const res = await fetch(`/api/songs/${songToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          onSaved(songToEdit.id);
          onClose();
        }
      } else {
        const res = await fetch('/api/songs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          onSaved(data.id);
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save song.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim(), description: newCatDesc.trim() })
      });
      const data = await res.json();
      if (data.success && data.id) {
        const newCat: Category = {
          id: data.id,
          name: newCatName.trim(),
          description: newCatDesc.trim(),
          icon: 'Music'
        };
        if (onCategoryAdded) onCategoryAdded(newCat);
        setCategoryId(data.id);
        setShowAddCategory(false);
        setNewCatName('');
        setNewCatDesc('');
      }
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-amber-500/30 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-100">
                {isEditing ? 'Edit Song (కీర్తన మార్పు)' : '+ Add New Song (నూతన కీర్తన)'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing ? 'Modify song lyrics, translation, and media details' : 'Add Telugu & English Christian worship song to the library'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Basic Song Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Song Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={songNumber}
                onChange={(e) => setSongNumber(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="flex space-x-2">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  title="Add Category"
                  className="px-2.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Author / Composer
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Traditional, Bro. Bakht Singh"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Inline Add Category Drawer if toggled */}
          {showAddCategory && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">
                  + Add New Category (నూతన విభాగం)
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Special Revival)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-amber-500/30 bg-white dark:bg-slate-900 text-xs"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-amber-500/30 bg-white dark:bg-slate-900 text-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleCreateCategory}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
              >
                Save Category
              </button>
            </div>
          )}

          {/* Titles: English & Telugu (Unicode Supported) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Song Title / English Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={titleEnglish}
                onChange={(e) => setTitleEnglish(e.target.value)}
                placeholder="e.g. The Lord is My Strength"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Telugu Title (తెలుగు శీర్షిక) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={titleTelugu}
                onChange={(e) => setTitleTelugu(e.target.value)}
                placeholder="ఉదా: యెహోవా నా బలమా"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-telugu focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Telugu Lyrics (Long Unicode lyrics without restriction) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-telugu">
                Telugu Lyrics (తెలుగు సాహిత్యం - పల్లవి & చరణాలు) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-normal">
                Separate stanzas with blank lines for projector presentation
              </span>
            </div>
            <textarea
              rows={8}
              value={lyricsTelugu}
              onChange={(e) => setLyricsTelugu(e.target.value)}
              placeholder="పల్లవి:&#10;యెహోవా నా బలమా నా శైలమా...&#10;&#10;చరణం 1:&#10;ఆపత్కాలములో నమ్ముకొనదగిన దేవుడవు..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-telugu leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* English Lyrics (Long lyrics without restriction) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                English Lyrics / Translation (ఆంగ్ల సాహిత్యం)
              </label>
              <span className="text-[11px] text-slate-400 font-normal">
                Optional: English lyrics or phonetic transliteration
              </span>
            </div>
            <textarea
              rows={6}
              value={lyricsEnglish}
              onChange={(e) => setLyricsEnglish(e.target.value)}
              placeholder="Chorus:&#10;The Lord is my strength and my shield...&#10;&#10;Verse 1:&#10;My heart trusted in Him, and I am helped..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Media Links: Audio, Video, Related Bible Verse */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Audio Link / MP3 URL
              </label>
              <input
                type="text"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://example.com/audio.mp3"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                YouTube / Video Link
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Related Bible Verse
              </label>
              <input
                type="text"
                value={bibleReference}
                onChange={(e) => setBibleReference(e.target.value)}
                placeholder="e.g. Psalm 18:1-2, John 3:16"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Version Change Summary (if editing) */}
          {isEditing && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Edit Reason / Change Summary (for Version History)
              </label>
              <input
                type="text"
                value={changeSummary}
                onChange={(e) => setChangeSummary(e.target.value)}
                placeholder="e.g. Corrected stanza 2 lyrics, added English translation"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Song...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Save Song'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
