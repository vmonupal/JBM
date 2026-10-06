'use client';

import { useState, useEffect } from 'react';
import { X, RotateCcw, Clock, Check, History, AlertCircle } from 'lucide-react';
import { SongVersion } from '@/lib/types';

interface SongVersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  songId: number;
  songTitle: string;
  onVersionRestored: () => void;
}

export default function SongVersionHistoryModal({
  isOpen,
  onClose,
  songId,
  songTitle,
  onVersionRestored
}: SongVersionHistoryModalProps) {
  const [versions, setVersions] = useState<SongVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [previewVersion, setPreviewVersion] = useState<SongVersion | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && songId) {
      setLoading(true);
      fetch(`/api/songs/${songId}/versions`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setVersions(data);
            if (data.length > 0) setPreviewVersion(data[0]);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, songId]);

  if (!isOpen) return null;

  const handleRestore = async (version: SongVersion) => {
    if (!confirm(`Restore Version #${version.version_number}? This will recover the lyrics and details from this date.`)) return;

    setRestoringId(version.id);
    try {
      const res = await fetch(`/api/songs/${songId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore', versionId: version.id })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(`Successfully restored Version #${version.version_number}`);
        onVersionRestored();
        setTimeout(() => {
          setStatusMsg(null);
          onClose();
        }, 1500);
      }
    } catch (e) {
      alert('Failed to restore version.');
    } finally {
      setRestoringId(null);
    }
  };

  const formatDate = (dateStr: string) => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-amber-500/30 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-100">
                Song Version History (గత వెర్షన్ల చరిత్ర)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {songTitle} • Recover earlier lyrics if changes were made accidentally
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

        {statusMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Content Body: Left Column Versions list, Right Column Preview */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto flex-1">
          
          {/* Versions List */}
          <div className="space-y-3 md:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Saved Revisions ({versions.length})
            </span>

            {loading ? (
              <div className="py-8 text-center">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : versions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 text-center">
                No past revisions recorded yet.
              </div>
            ) : (
              versions.map((ver, idx) => (
                <div
                  key={ver.id}
                  onClick={() => setPreviewVersion(ver)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    previewVersion?.id === ver.id
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      Version #{ver.version_number} {idx === 0 && '(Current)'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      #{ver.song_number}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 font-medium">
                    {ver.change_summary || 'Song update'}
                  </p>
                  <div className="mt-2 flex items-center space-x-1 text-[10px] text-amber-700 dark:text-amber-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(ver.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Version Preview & Restore Button */}
          <div className="md:col-span-2 space-y-4">
            {previewVersion ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold font-mono">
                      Version #{previewVersion.version_number}
                    </span>
                    <span className="ml-2 text-xs text-slate-400">
                      Saved on {formatDate(previewVersion.created_at)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRestore(previewVersion)}
                    disabled={restoringId !== null}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{restoringId === previewVersion.id ? 'Restoring...' : 'Restore This Version'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {previewVersion.title_english}
                  </h3>
                  <p className="font-telugu text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {previewVersion.title_telugu}
                  </p>
                  <p className="text-xs text-slate-500">
                    Category: {previewVersion.category_name || 'Worship'} • Author: {previewVersion.author || 'N/A'} • Bible Ref: {previewVersion.bible_reference || 'N/A'}
                  </p>
                </div>

                {/* Lyrics Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-2 font-telugu">
                      Telugu Lyrics
                    </p>
                    <div className="font-telugu text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
                      {previewVersion.lyrics_telugu}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-2">
                      English Lyrics
                    </p>
                    <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
                      {previewVersion.lyrics_english || 'No English lyrics recorded in this version.'}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-20 text-center text-xs text-slate-400">
                Select a revision from the left to preview details.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
