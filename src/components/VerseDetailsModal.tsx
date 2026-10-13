'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Copy, Heart, Share2, BookOpen, FileEdit, Check, Sparkles, Layers, Tag, Tv } from 'lucide-react';
import { BibleVerse } from '@/lib/types';
import { getVerseCrossReferences } from '@/lib/bible-details-data';

interface VerseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: BibleVerse | null;
  bookNameEnglish: string;
  bookNameTelugu: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  highlightColor: string | null;
  onSetHighlight: (color: string | null) => void;
  onCopyReference: () => void;
  onShareVerse: () => void;
}

const HIGHLIGHT_COLORS = [
  { name: 'None', value: null, bgClass: 'bg-transparent border border-slate-300 dark:border-slate-700' },
  { name: 'Amber Gold', value: 'yellow', bgClass: 'bg-amber-300/40 border border-amber-400' },
  { name: 'Emerald Green', value: 'green', bgClass: 'bg-emerald-300/40 border border-emerald-400' },
  { name: 'Sky Blue', value: 'blue', bgClass: 'bg-sky-300/40 border border-sky-400' },
  { name: 'Rose Pink', value: 'rose', bgClass: 'bg-rose-300/40 border border-rose-400' },
  { name: 'Purple', value: 'purple', bgClass: 'bg-purple-300/40 border border-purple-400' },
];

export default function VerseDetailsModal({
  isOpen,
  onClose,
  verse,
  bookNameEnglish,
  bookNameTelugu,
  isBookmarked,
  onToggleBookmark,
  highlightColor,
  onSetHighlight,
  onCopyReference,
  onShareVerse,
}: VerseDetailsModalProps) {
  const [noteText, setNoteText] = useState('');
  const [savedNote, setSavedNote] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (verse) {
      try {
        const notes = JSON.parse(localStorage.getItem('rci_verse_notes') || '{}');
        const key = `${verse.book_id}_${verse.chapter_number}_${verse.verse_number}`;
        setNoteText(notes[key] || '');
      } catch (e) {
        setNoteText('');
      }
    }
  }, [verse]);

  if (!isOpen || !verse) return null;

  const crossReferences = getVerseCrossReferences(bookNameEnglish, verse.chapter_number, verse.verse_number);

  const handleSaveNote = () => {
    try {
      const notes = JSON.parse(localStorage.getItem('rci_verse_notes') || '{}');
      const key = `${verse.book_id}_${verse.chapter_number}_${verse.verse_number}`;
      if (noteText.trim()) {
        notes[key] = noteText.trim();
      } else {
        delete notes[key];
      }
      localStorage.setItem('rci_verse_notes', JSON.stringify(notes));
      setSavedNote(true);
      setTimeout(() => setSavedNote(false), 2000);
    } catch (e) {}
  };

  const handleCopyFull = () => {
    const text = `${bookNameEnglish} ${verse.chapter_number}:${verse.verse_number} (${bookNameTelugu})\n\nTelugu: ${verse.telugu_text}\n\nEnglish: ${verse.english_text}\n\n— JBM`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="verse-details-title"
        className="bg-white dark:bg-slate-900 border border-amber-500/30 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                Verse Detail & Study
              </span>
              <h2 id="verse-details-title" className="font-cinzel text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-100">
                {bookNameEnglish} {verse.chapter_number}:{verse.verse_number}
              </h2>
              <p className="text-xs font-telugu text-amber-700 dark:text-amber-300">
                {bookNameTelugu} {verse.chapter_number}:{verse.verse_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close verse details"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs sm:text-sm">
          {/* Quick Actions Row */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 font-bold text-xs transition-all ${
                isBookmarked 
                  ? 'bg-rose-500/15 border-rose-500/50 text-rose-500' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyFull}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-1.5 transition-all"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copied!' : 'Copy Verse'}</span>
            </button>

            <button
              type="button"
              onClick={onCopyReference}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-1.5 transition-all"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Copy Ref Only</span>
            </button>

            <button
              type="button"
              onClick={onShareVerse}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>

          {/* Scripture Texts */}
          <div className="space-y-4">
            {/* Telugu Scripture */}
            <div className="p-4 rounded-2xl bg-amber-50/30 dark:bg-slate-800/40 border border-amber-500/20 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Telugu Bible (పరిశుద్ధ గ్రంథము)
              </span>
              <p className="font-telugu text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                {verse.telugu_text}
              </p>
            </div>

            {/* English Scripture */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                English Bible (King James Version)
              </span>
              <p className="font-serif text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                {verse.english_text}
              </p>
            </div>
          </div>

          {/* Verse Highlighting */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Verse Highlight Color
            </h3>
            <div className="flex flex-wrap gap-2">
              {HIGHLIGHT_COLORS.map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onSetHighlight(c.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${c.bgClass} ${
                    highlightColor === c.value ? 'ring-2 ring-amber-500 shadow-xs' : ''
                  }`}
                >
                  <span className="text-slate-800 dark:text-slate-200">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cross References */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Related Cross-References</span>
            </h3>
            <div className="space-y-2">
              {crossReferences.map((cr, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <span className="text-amber-500 font-bold mr-1.5">•</span>
                  <span>{cr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Verse Notes */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <FileEdit className="w-3.5 h-3.5 text-amber-500" />
              <span>Personal Verse Notes (Saved Locally)</span>
            </h3>
            <div className="space-y-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write your personal reflections, study notes, or sermon notes for this verse..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Notes are stored privately in your browser storage.
                </span>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1"
                >
                  {savedNote ? <Check className="w-3.5 h-3.5 text-slate-950" /> : null}
                  <span>{savedNote ? 'Saved!' : 'Save Note'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <Link
            href={`/bible/projector?bookId=${verse.book_id}&chapter=${verse.chapter_number}&verse=${verse.verse_number}`}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-950 text-amber-300 border border-amber-500/50 hover:bg-slate-900 font-bold text-xs rounded-xl shadow transition-all"
            title="Open and display this verse in Bible Projector mode"
          >
            <Tv className="w-3.5 h-3.5 text-amber-400" />
            <span>Present in Projector</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
