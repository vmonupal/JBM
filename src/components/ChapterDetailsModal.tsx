'use client';

import React, { useState } from 'react';
import { X, FileText, Sparkles, Users, ListFilter, Bookmark, Layers } from 'lucide-react';
import { getChapterDetails } from '@/lib/bible-details-data';

interface ChapterDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookNameEnglish: string;
  bookNameTelugu: string;
  chapterNumber: number;
  totalVerses: number;
  onSelectVerse?: (verseNum: number) => void;
}

export default function ChapterDetailsModal({
  isOpen,
  onClose,
  bookNameEnglish,
  bookNameTelugu,
  chapterNumber,
  totalVerses,
  onSelectVerse,
}: ChapterDetailsModalProps) {
  const [langTab, setLangTab] = useState<'both' | 'telugu' | 'english'>('both');

  if (!isOpen) return null;

  const details = getChapterDetails(bookNameEnglish, bookNameTelugu, chapterNumber, totalVerses);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="chapter-details-title"
        className="bg-white dark:bg-slate-900 border border-amber-500/30 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                Chapter Overview & Study Guide
              </span>
              <h2 id="chapter-details-title" className="font-cinzel text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-100">
                {bookNameEnglish} Chapter {chapterNumber}
              </h2>
              <p className="text-xs font-telugu text-amber-700 dark:text-amber-300">
                {bookNameTelugu} • {chapterNumber}వ అధ్యాయము ({totalVerses} వచనములు)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Switcher Tabs */}
            <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                onClick={() => setLangTab('both')}
                className={`px-2.5 py-1 rounded-lg transition ${langTab === 'both' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Both
              </button>
              <button
                onClick={() => setLangTab('telugu')}
                className={`px-2.5 py-1 rounded-lg transition ${langTab === 'telugu' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLangTab('english')}
                className={`px-2.5 py-1 rounded-lg transition ${langTab === 'english' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
              >
                English
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Close chapter details"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs sm:text-sm">
          {/* Summary Box */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Chapter Summary / అధ్యాయ సారాంశము</span>
            </h3>

            {/* Telugu Summary */}
            {(langTab === 'both' || langTab === 'telugu') && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                {details.title_telugu && (
                  <h4 className="font-telugu font-bold text-base text-amber-900 dark:text-amber-200">
                    {details.title_telugu}
                  </h4>
                )}
                <p className="font-telugu text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
                  {details.summary_telugu || details.summary}
                </p>
              </div>
            )}

            {/* English Summary */}
            {(langTab === 'both' || langTab === 'english') && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-amber-200">
                  {details.title}
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {details.summary}
                </p>
              </div>
            )}
          </div>

          {/* Main Events in Chapter */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Main Narrative & Doctrinal Events / ముఖ్య సంఘటనలు</span>
            </h3>
            <div className="space-y-2">
              {details.main_events.map((evt, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{evt}</span>
                  </div>
                  {details.main_events_telugu && details.main_events_telugu[idx] && (
                    <div className="font-telugu text-[11px] text-amber-800 dark:text-amber-300 pl-7">
                      {details.main_events_telugu[idx]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* People Mentioned & Main Themes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                <span>People Mentioned / పేర్కొనబడిన వ్యక్తులు</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {details.people_mentioned.map((person, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px] font-semibold border border-amber-500/20">
                    {person} {details.people_mentioned_telugu && details.people_mentioned_telugu[idx] ? `(${details.people_mentioned_telugu[idx]})` : ''}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <ListFilter className="w-3.5 h-3.5 text-amber-500" />
                <span>Main Themes / ముఖ్య సిద్ధాంతములు</span>
              </h3>
              <div className="space-y-1.5">
                {details.main_themes.map((th, idx) => (
                  <div key={idx} className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{th}</span>
                    </div>
                    {details.main_themes_telugu && details.main_themes_telugu[idx] && (
                      <div className="font-telugu text-[11px] text-amber-800 dark:text-amber-400 pl-3">
                        {details.main_themes_telugu[idx]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Verses */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Key Verses / ముఖ్య వచనములు</span>
            </h3>
            <div className="space-y-2">
              {details.key_verses.map((kv, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-amber-500/20 bg-amber-50/20 dark:bg-slate-800/40 text-xs text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                    Featured Scripture
                  </span>
                  <p className="italic">{kv}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Chapters */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Related Chapters for Further Study</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {details.related_chapters.map((rc, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700">
                  {rc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {bookNameEnglish} {chapterNumber} • {totalVerses} Verses
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            Read Chapter Verses
          </button>
        </div>
      </div>
    </div>
  );
}
