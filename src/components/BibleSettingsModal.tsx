'use client';

import { X, Settings, Check, Sun, Moon, Type, Layout, Eye, EyeOff } from 'lucide-react';

export interface BibleSettings {
  language: 'telugu' | 'english' | 'both';
  textSize: 'small' | 'medium' | 'large' | 'xlarge';
  fontPercent: number; // e.g. 100%
  layout: 'side-by-side' | 'stacked';
  theme: 'light' | 'dark';
  showVerseNumbers: boolean;
  showChapterSummary: boolean;
  showBookInfo: boolean;
}

interface BibleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BibleSettings;
  onUpdate: (newSettings: Partial<BibleSettings>) => void;
}

export default function BibleSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdate
}: BibleSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-amber-500/30 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-100">
                Bible Display Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize your reading layout, language, text size, and view options
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

        {/* Settings Body (Requirement 14) */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh] text-xs sm:text-sm">
          
          {/* 1. Language Option: Telugu / English / Both */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs block">
              Language (భాష)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onUpdate({ language: 'telugu' })}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition-all ${
                  settings.language === 'telugu'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-600 dark:text-slate-400'
                }`}
              >
                Telugu (తెలుగు)
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ language: 'english' })}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition-all ${
                  settings.language === 'english'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-600 dark:text-slate-400'
                }`}
              >
                English
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ language: 'both' })}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition-all ${
                  settings.language === 'both'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-600 dark:text-slate-400'
                }`}
              >
                Both (ఉభయ)
              </button>
            </div>
          </div>

          {/* 2. Text Size: Small / Medium / Large / Extra Large */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs block">
              Text Size (అక్షర పరిమాణం)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'small', label: 'Small', pct: 90 },
                { key: 'medium', label: 'Medium', pct: 100 },
                { key: 'large', label: 'Large', pct: 115 },
                { key: 'xlarge', label: 'Extra Large', pct: 135 }
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => onUpdate({ textSize: s.key as any, fontPercent: s.pct })}
                  className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-all ${
                    settings.textSize === s.key
                      ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Layout: Side by Side / Stacked */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs block">
              Layout (లేఅవుట్)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdate({ layout: 'side-by-side' })}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition-all ${
                  settings.layout === 'side-by-side'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-600 dark:text-slate-400'
                }`}
              >
                Side by Side (TELUGU | ENGLISH)
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ layout: 'stacked' })}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition-all ${
                  settings.layout === 'stacked'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-600 dark:text-slate-400'
                }`}
              >
                Stacked (TELUGU / ENGLISH)
              </button>
            </div>
          </div>

          {/* 4. Theme: Light / Dark */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs block">
              Theme (థీమ్)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onUpdate({ theme: 'light' });
                  document.documentElement.classList.remove('dark');
                  localStorage.setItem('rci_theme', 'light');
                }}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold flex items-center justify-center space-x-2 transition-all ${
                  settings.theme === 'light'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Theme</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdate({ theme: 'dark' });
                  document.documentElement.classList.add('dark');
                  localStorage.setItem('rci_theme', 'dark');
                }}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold flex items-center justify-center space-x-2 transition-all ${
                  settings.theme === 'dark'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-4 h-4 text-sky-400" />
                <span>Dark Theme</span>
              </button>
            </div>
          </div>

          {/* 5. Toggles: Verse Numbers, Chapter Summary, Book Information */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <label className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs block">
              Display Elements
            </label>

            {/* Verse Numbers: Show / Hide */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Verse Numbers</p>
                <p className="text-[11px] text-slate-400">Show numeric labels on scripture verses</p>
              </div>
              <div className="flex bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => onUpdate({ showVerseNumbers: true })}
                  className={`px-3 py-1 rounded-md font-bold text-xs ${settings.showVerseNumbers ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Show
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ showVerseNumbers: false })}
                  className={`px-3 py-1 rounded-md font-bold text-xs ${!settings.showVerseNumbers ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Hide
                </button>
              </div>
            </div>

            {/* Chapter Summary: Show / Hide */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Chapter Summary</p>
                <p className="text-[11px] text-slate-400">Display chapter outline and context header</p>
              </div>
              <div className="flex bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => onUpdate({ showChapterSummary: true })}
                  className={`px-3 py-1 rounded-md font-bold text-xs ${settings.showChapterSummary ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Show
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ showChapterSummary: false })}
                  className={`px-3 py-1 rounded-md font-bold text-xs ${!settings.showChapterSummary ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Hide
                </button>
              </div>
            </div>

            {/* Book Information: Show / Hide */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Book Information</p>
                <p className="text-[11px] text-slate-400">Show testament, total chapters, and background</p>
              </div>
              <div className="flex bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => onUpdate({ showBookInfo: true })}
                  className={`px-3 py-1 rounded-md font-bold text-xs ${settings.showBookInfo ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Show
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ showBookInfo: false })}
                  className={`px-3 py-1 rounded-md font-bold text-xs ${!settings.showBookInfo ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Hide
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Settings are saved in your browser immediately.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
