'use client';

import React, { useState } from 'react';
import { X, BookOpen, User, ListFilter, Bookmark, Layers, Sparkles, Languages } from 'lucide-react';
import { getBookDetails } from '@/lib/bible-details-data';

interface BookDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    id: number;
    name_english: string;
    name_telugu: string;
    testament: 'OT' | 'NT';
    total_chapters: number;
    book_order: number;
  } | null;
}

export default function BookDetailsModal({ isOpen, onClose, book }: BookDetailsModalProps) {
  const [langTab, setLangTab] = useState<'both' | 'telugu' | 'english'>('both');

  if (!isOpen || !book) return null;

  const details = getBookDetails(book);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-details-title"
        className="bg-white dark:bg-slate-900 border border-amber-500/30 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  {book.testament === 'OT' ? 'Old Testament (పాత నిబంధన)' : 'New Testament (క్రొత్త నిబంధన)'} • Book #{book.book_order}
                </span>
              </div>
              <h2 id="book-details-title" className="font-cinzel text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-100">
                {book.name_english} ({book.name_telugu})
              </h2>
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
              aria-label="Close book details"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs sm:text-sm">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Chapters</span>
              <span className="text-base font-bold text-amber-600 dark:text-amber-400">{details.total_chapters} అధ్యాయములు</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Authorship / కర్త</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2" title={details.authorship}>
                {langTab === 'telugu' ? (details.authorship_telugu || details.authorship) : details.authorship}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Approx. Date / కాలము</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2" title={details.date_written}>
                {langTab === 'telugu' ? (details.date_written_telugu || details.date_written) : details.date_written}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Testament / నిబంధన</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {book.testament === 'OT' ? 'Old Testament (పాత నిబంధన)' : 'New Testament (క్రొత్త నిబంధన)'}
              </span>
            </div>
          </div>

          {/* Book Overview & Background */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Book Overview & Background / గ్రంథ పరిచయము</span>
            </h3>

            {/* Telugu Overview */}
            {(langTab === 'both' || langTab === 'telugu') && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">తెలుగు వివరణ</span>
                <p className="font-telugu text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
                  {details.overview_telugu || details.overview}
                </p>
                {details.background_telugu && (
                  <p className="font-telugu text-xs text-slate-600 dark:text-slate-400 pt-1 italic">
                    {details.background_telugu}
                  </p>
                )}
              </div>
            )}

            {/* English Overview */}
            {(langTab === 'both' || langTab === 'english') && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">English Overview</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {details.overview}
                </p>
                {details.background && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 italic">
                    {details.background}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Main Themes */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <ListFilter className="w-3.5 h-3.5 text-amber-500" />
              <span>Main Spiritual Themes / ముఖ్య అంశాలు</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {details.main_themes.map((theme, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{theme}</span>
                  </div>
                  {details.main_themes_telugu && details.main_themes_telugu[idx] && (
                    <div className="font-telugu text-[11px] text-amber-700 dark:text-amber-400 pl-3">
                      {details.main_themes_telugu[idx]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Key People & Related Books */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>Important People / ముఖ్య వ్యక్తులు</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {details.key_people.map((person, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px] font-semibold border border-amber-500/20">
                    {person} {details.key_people_telugu && details.key_people_telugu[idx] ? `(${details.key_people_telugu[idx]})` : ''}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span>Related Books / సంబంధిత గ్రంథాలు</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {details.related_books.map((rb, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
                    {rb}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Key Chapters */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Key Chapters / ముఖ్య అధ్యాయములు</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {details.key_chapters.map((kc, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-50/20 dark:bg-slate-800/40 flex items-center justify-between">
                  <span className="font-bold text-amber-700 dark:text-amber-300">Chapter {kc.chapter}</span>
                  <div className="text-right">
                    <span className="text-xs text-slate-700 dark:text-slate-300 block">{kc.title}</span>
                    {kc.title_telugu && (
                      <span className="text-[11px] font-telugu text-slate-400 block">{kc.title_telugu}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 italic">
            * Historical dates and traditional authorship are presented in alignment with authorized conservative biblical scholarship.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {book.name_english} ({book.name_telugu}) • {book.total_chapters} Chapters
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            Close Book Details
          </button>
        </div>
      </div>
    </div>
  );
}
