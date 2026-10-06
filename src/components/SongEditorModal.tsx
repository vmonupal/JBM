'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Check, AlertTriangle, Music, Globe, Image as ImageIcon, Sparkles, BookOpen } from 'lucide-react';
import { Song, Category } from '@/lib/types';

interface SongEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (songId: number) => void;
  songToEdit?: Song | null;
  categories: Category[];
  onCategoryAdded?: (newCat: Category) => void;
}

const SUPPORTED_LANGUAGES = [
  'Telugu + English',
  'Telugu',
  'English',
  'Hindi',
  'Tamil',
  'Kannada',
  'Malayalam',
  'Other Indian languages',
  'Other'
];

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
  const [songTitle, setSongTitle] = useState(''); // General title
  const [language, setLanguage] = useState<string>('Telugu + English');
  const [customLanguageName, setCustomLanguageName] = useState('');
  const [lyricsTelugu, setLyricsTelugu] = useState('');
  const [lyricsEnglish, setLyricsEnglish] = useState('');
  const [lyricsOther, setLyricsOther] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [author, setAuthor] = useState('');
  const [composer, setComposer] = useState('');
  const [sourceOrigin, setSourceOrigin] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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
      setSongTitle(songToEdit.title_english || songToEdit.title_telugu || '');
      
      const lang = songToEdit.language || 'Telugu + English';
      if (SUPPORTED_LANGUAGES.includes(lang)) {
        setLanguage(lang);
        setCustomLanguageName('');
      } else {
        setLanguage('Other');
        setCustomLanguageName(lang);
      }

      setLyricsTelugu(songToEdit.lyrics_telugu || '');
      setLyricsEnglish(songToEdit.lyrics_english || '');
      setLyricsOther(songToEdit.lyrics_other || '');
      setCategoryId(songToEdit.category_id || (categories[0]?.id || 1));
      setAuthor(songToEdit.author || '');
      setComposer(songToEdit.composer || '');
      setSourceOrigin(songToEdit.source_origin || '');
      setImageUrl(songToEdit.image_url || '');
      setAudioUrl(songToEdit.audio_url || '');
      setVideoUrl(songToEdit.video_url || '');
      setBibleReference(songToEdit.bible_reference || '');
      setChangeSummary('');
    } else {
      // Default new song
      setTitleEnglish('');
      setTitleTelugu('');
      setSongTitle('');
      setLanguage('Telugu + English');
      setCustomLanguageName('');
      setLyricsTelugu('');
      setLyricsEnglish('');
      setLyricsOther('');
      setAuthor('');
      setComposer('');
      setSourceOrigin('');
      setImageUrl('');
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
    
    const chosenTitleEn = (titleEnglish || songTitle || titleTelugu || '').trim();
    const chosenTitleTe = (titleTelugu || songTitle || titleEnglish || '').trim();

    if (!chosenTitleEn && !chosenTitleTe) {
      setErrorMsg('Please enter a Song Title.');
      return;
    }

    const hasAnyLyrics = lyricsTelugu.trim() || lyricsEnglish.trim() || lyricsOther.trim();
    if (!hasAnyLyrics) {
      setErrorMsg('Please enter lyrics for the song.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const resolvedLanguage = language === 'Other' 
      ? (customLanguageName.trim() || 'Other') 
      : language;

    const payload = {
      song_number: Number(songNumber) || 101,
      title_english: chosenTitleEn,
      title_telugu: chosenTitleTe,
      lyrics_english: lyricsEnglish.trim(),
      lyrics_telugu: lyricsTelugu.trim(),
      lyrics_other: lyricsOther.trim(),
      language: resolvedLanguage,
      other_language_name: customLanguageName.trim() || null,
      category_id: Number(categoryId),
      author: author.trim() || null,
      composer: composer.trim() || null,
      source_origin: sourceOrigin.trim() || null,
      image_url: imageUrl.trim() || null,
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

  const displayOtherLyrics = language !== 'Telugu' && language !== 'English';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-black text-slate-900 dark:text-amber-100">
                {isEditing ? `Edit Song #${songNumber}` : '+ Add New Church Song'}
              </h2>
              <p className="text-xs text-slate-500">
                Public Song Editor • Multi-language Worship Hymnal (Telugu, English, Hindi, Tamil, etc.)
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
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Row 1: Song Number, Category, Language */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Song Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Song Number (#)
              </label>
              <input
                type="number"
                min="1"
                value={songNumber}
                onChange={(e) => setSongNumber(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-amber-700 dark:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                required
              />
            </div>

            {/* Category */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(true)}
                  className="text-[11px] font-bold text-amber-600 hover:underline flex items-center space-x-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>New</span>
                </button>
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selection (Requirement 2: Telugu, English, Hindi, Tamil, Kannada, Malayalam, etc.) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>Language</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Custom Language Name if "Other" selected */}
          {language === 'Other' && (
            <div className="p-4 bg-amber-50/50 dark:bg-slate-800/40 rounded-2xl border border-amber-500/30">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Specify Custom Language Name
              </label>
              <input
                type="text"
                value={customLanguageName}
                onChange={(e) => setCustomLanguageName(e.target.value)}
                placeholder="e.g. Marathi, Bengali, Spanish, French..."
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Inline Add Category modal */}
          {showAddCategory && (
            <div className="p-4 bg-amber-50/70 dark:bg-slate-800/80 rounded-2xl border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">+ Add New Category</span>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Revival, Special)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Short Description"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl text-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleCreateCategory}
                className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow"
              >
                Save Category
              </button>
            </div>
          )}

          {/* Titles: Song Title / Telugu Title / English Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Telugu Title (తెలుగు శీర్షిక)
              </label>
              <input
                type="text"
                value={titleTelugu}
                onChange={(e) => setTitleTelugu(e.target.value)}
                placeholder="ఉదా: యెహోవా నా కాపరి..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-telugu font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                English / Main Title
              </label>
              <input
                type="text"
                value={titleEnglish}
                onChange={(e) => setTitleEnglish(e.target.value)}
                placeholder="e.g. The Lord is My Shepherd..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Lyrics Sections: Telugu, English, and Other Languages */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Song Lyrics (గీత సాహిత్యం • Unlimited Length)
              </span>
              <span className="text-[11px] text-slate-400">Supports full verses & chorus</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Telugu Lyrics */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Telugu Lyrics (తెలుగు సాహిత్యం)
                </label>
                <textarea
                  rows={9}
                  value={lyricsTelugu}
                  onChange={(e) => setLyricsTelugu(e.target.value)}
                  placeholder="యెహోవా నా కాపరి నాకు లేమి కలుగదు...&#10;&#10;పల్లవి:&#10;ఆయన నన్ను పచ్చికగల చోట్ల పరుండజేయుచున్నాడు..."
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-telugu leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* English Lyrics */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  English Lyrics
                </label>
                <textarea
                  rows={9}
                  value={lyricsEnglish}
                  onChange={(e) => setLyricsEnglish(e.target.value)}
                  placeholder="The Lord is my shepherd; I shall not want...&#10;&#10;Chorus:&#10;He maketh me to lie down in green pastures..."
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Other Language Lyrics Section (Requirement 2 & 3) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {language === 'Hindi' ? 'Hindi Lyrics (हिंदी साहित्य)' :
                   language === 'Tamil' ? 'Tamil Lyrics (தமிழ் வரிகள்)' :
                   language === 'Kannada' ? 'Kannada Lyrics (ಕನ್ನಡ ಸಾಹಿತ್ಯ)' :
                   language === 'Malayalam' ? 'Malayalam Lyrics (മലയാളം വരികൾ)' :
                   language === 'Other' && customLanguageName ? `${customLanguageName} Lyrics` :
                   'Other Language Lyrics (Hindi / Tamil / Kannada / Other)'}
                </span>
              </label>
              <textarea
                rows={5}
                value={lyricsOther}
                onChange={(e) => setLyricsOther(e.target.value)}
                placeholder={`Enter ${language === 'Other' && customLanguageName ? customLanguageName : 'other language'} lyrics here...`}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Author, Composer, Source/Origin, Bible Verse (Requirement 2 & 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. John Newton"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Composer
              </label>
              <input
                type="text"
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
                placeholder="e.g. Traditional Melody"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Source / Origin
              </label>
              <input
                type="text"
                value={sourceOrigin}
                onChange={(e) => setSourceOrigin(e.target.value)}
                placeholder="e.g. Andhra Christian Hymnal"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Related Bible Verse
              </label>
              <input
                type="text"
                value={bibleReference}
                onChange={(e) => setBibleReference(e.target.value)}
                placeholder="e.g. Psalm 23:1"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Media Links: Audio, Video, Song Image (Requirement 2 & 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Audio File / URL (MP3)
              </label>
              <input
                type="url"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://example.com/song.mp3"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                YouTube / Video Link
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Song Image / Photo URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/song-cover.jpg or URL"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Version change summary */}
          {isEditing && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Edit Summary (For Version History & Undo)
              </label>
              <input
                type="text"
                value={changeSummary}
                onChange={(e) => setChangeSummary(e.target.value)}
                placeholder="e.g. Corrected verse 2 lyrics, added composer name..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
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
