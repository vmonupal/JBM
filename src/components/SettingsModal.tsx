'use client';

import React, { useState } from 'react';
import { 
  X, Sun, Moon, Monitor, Sliders, Type, BookOpen, Search, 
  Tv, Clock, Music, Eye, RotateCcw, Check, Sparkles, 
  Columns, Rows, Shield, HelpCircle, ChevronRight, AlertCircle, Compass, ListFilter
} from 'lucide-react';
import { useSettings, TextSizePreset, BibleLanguageMode, SpacingPreset, VerseSpacingPreset, ColumnSpacingPreset, ColumnWidthRatio } from '@/context/SettingsContext';

const SECTIONS = [
  { id: 'appearance', label: 'Appearance', icon: Sun, desc: 'Theme & site styling' },
  { id: 'bibleReading', label: 'Bible Reading', icon: BookOpen, desc: 'Auto-scroll & screen wake' },
  { id: 'bibleLanguage', label: 'Bible Language', icon: Compass, desc: 'Telugu / English / Parallel' },
  { id: 'bibleText', label: 'Bible Text', icon: Type, desc: 'Font sizes, spacing & preview' },
  { id: 'bibleNavigation', label: 'Bible Navigation', icon: ListFilter, desc: 'Book & chapter flow' },
  { id: 'bibleSearch', label: 'Bible Search', icon: Search, desc: 'Search scopes & criteria' },
  { id: 'verseDisplay', label: 'Verse Display', icon: Eye, desc: 'Scripture elements visibility' },
  { id: 'projector', label: 'Projector', icon: Tv, desc: 'Sanctuary presentation mode' },
  { id: 'dateTime', label: 'Date & Time', icon: Clock, desc: 'Clocks & IST timezone' },
  { id: 'songs', label: 'Songs', icon: Music, desc: 'Worship lyrics & media' },
  { id: 'accessibility', label: 'Accessibility', icon: Shield, desc: 'High contrast & easy reading' },
  { id: 'savedPreferences', label: 'Saved Preferences', icon: Sparkles, desc: 'Browser local storage' },
  { id: 'resetSettings', label: 'Reset Settings', icon: RotateCcw, desc: 'Restore defaults' },
];

export default function SettingsModal() {
  const { 
    settings, 
    updateSettings, 
    updateSection, 
    resetSettings, 
    isSettingsOpen, 
    closeSettings, 
    activeSection, 
    setActiveSection 
  } = useSettings();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetFeedback, setResetFeedback] = useState(false);

  if (!isSettingsOpen) return null;

  const handleReset = () => {
    resetSettings();
    setShowResetConfirm(false);
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 2500);
  };

  // Preset font size helpers
  const textSizePresets: { key: TextSizePreset; label: string; pct: number }[] = [
    { key: 'very-small', label: 'Very Small', pct: 80 },
    { key: 'small', label: 'Small', pct: 90 },
    { key: 'medium', label: 'Medium', pct: 100 },
    { key: 'large', label: 'Large', pct: 115 },
    { key: 'very-large', label: 'Very Large', pct: 135 },
    { key: 'extra-large', label: 'Extra Large', pct: 155 },
  ];

  const handlePresetSelect = (preset: TextSizePreset, pct: number) => {
    updateSection('bibleText', {
      textSizePreset: preset,
      fontPercent: pct,
      teluguFontSize: Math.round(20 * (pct / 100)),
      englishFontSize: Math.round(18 * (pct / 100)),
    });
  };

  const handleSliderChange = (newPct: number) => {
    let preset: TextSizePreset = 'medium';
    if (newPct <= 85) preset = 'very-small';
    else if (newPct <= 95) preset = 'small';
    else if (newPct <= 105) preset = 'medium';
    else if (newPct <= 125) preset = 'large';
    else if (newPct <= 145) preset = 'very-large';
    else preset = 'extra-large';

    updateSection('bibleText', {
      fontPercent: newPct,
      textSizePreset: preset,
      teluguFontSize: Math.round(20 * (newPct / 100)),
      englishFontSize: Math.round(18 * (newPct / 100)),
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSettings();
      }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-panel-title"
        className="bg-white dark:bg-slate-900 border border-amber-500/30 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  JBM
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">• Central Display & Reading Control</span>
              </div>
              <h2 id="settings-panel-title" className="font-cinzel text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-100">
                SETTINGS
              </h2>
            </div>
          </div>
          <button
            onClick={closeSettings}
            aria-label="Close Settings"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Reset Feedback Notification */}
        {resetFeedback && (
          <div className="bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>All personal display and reading preferences reset to defaults.</span>
          </div>
        )}

        {/* Main Content: Left Nav & Right Panel */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* Left Navigation (Sidebar on Desktop, Horizontal Tabs / Selector on Mobile) */}
          <div className="md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-2 md:p-3 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col gap-1">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all shrink-0 md:shrink md:w-full ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-500'}`} />
                  <div className="hidden md:flex flex-col flex-1 truncate">
                    <span className="truncate">{sec.label}</span>
                    <span className={`text-[10px] font-normal truncate ${isActive ? 'text-slate-900/80' : 'text-slate-400'}`}>
                      {sec.desc}
                    </span>
                  </div>
                  <span className="md:hidden truncate">{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Panel: Active Section Body */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm">
            
            {/* =========================================================================
                A. APPEARANCE SETTINGS
                ========================================================================= */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-100">
                    A. Appearance Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choose your website color theme. Applies consistently across homepage, Bible, search, songs, projector, menus, and dialogs.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs block">
                    Website Theme
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => updateSection('appearance', { theme: 'light' })}
                      className={`p-4 rounded-2xl border text-center font-bold flex flex-col items-center space-y-2 transition-all ${
                        settings.appearance.theme === 'light'
                          ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Sun className="w-6 h-6 text-amber-500" />
                      <span>Light Mode</span>
                      <span className="text-[11px] font-normal text-slate-500">Clear bright sanctuary look</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSection('appearance', { theme: 'dark' })}
                      className={`p-4 rounded-2xl border text-center font-bold flex flex-col items-center space-y-2 transition-all ${
                        settings.appearance.theme === 'dark'
                          ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Moon className="w-6 h-6 text-sky-400" />
                      <span>Dark Mode</span>
                      <span className="text-[11px] font-normal text-slate-500">Soft night reading & low glare</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSection('appearance', { theme: 'system' })}
                      className={`p-4 rounded-2xl border text-center font-bold flex flex-col items-center space-y-2 transition-all ${
                        settings.appearance.theme === 'system'
                          ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Monitor className="w-6 h-6 text-slate-400" />
                      <span>System Default</span>
                      <span className="text-[11px] font-normal text-slate-500">Matches device OS preferences</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-slate-800/40 border border-amber-500/20 text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Local Theme Memory</p>
                  <p>Your theme selection is saved locally in this browser. You do not need an account or login to retain your choice.</p>
                </div>
              </div>
            )}

            {/* =========================================================================
                B. BIBLE READING SETTINGS
                ========================================================================= */}
            {activeSection === 'bibleReading' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-100">
                    B. Bible Reading Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Personalized reading preferences saved locally without requiring an account.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Continuous Reading */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Continuous Reading</p>
                      <p className="text-[11px] text-slate-400">Automatically advance to the next chapter upon reaching the bottom</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.bibleReading.continuousReading}
                      onChange={(e) => updateSection('bibleReading', { continuousReading: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Auto Scroll */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Auto Scroll</p>
                      <p className="text-[11px] text-slate-400">Hands-free smooth vertical scrolling while reading scripture</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.bibleReading.autoScroll}
                      onChange={(e) => updateSection('bibleReading', { autoScroll: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Auto Scroll Speed Slider */}
                  {settings.bibleReading.autoScroll && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/30 dark:bg-slate-800/30 border border-amber-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">Auto Scroll Speed</span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">Level {settings.bibleReading.autoScrollSpeed} of 5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={settings.bibleReading.autoScrollSpeed}
                        onChange={(e) => updateSection('bibleReading', { autoScrollSpeed: Number(e.target.value) })}
                        className="w-full accent-amber-500"
                      />
                    </div>
                  )}

                  {/* Remember Last Location */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Remember Last Bible Location</p>
                      <p className="text-[11px] text-slate-400">Automatically save your last read book, chapter, and verse</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.bibleReading.rememberLastLocation}
                      onChange={(e) => updateSection('bibleReading', { rememberLastLocation: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Open Last Read Chapter */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Open Last Read Chapter on Start</p>
                      <p className="text-[11px] text-slate-400">Resume directly from your saved book & chapter when opening the Bible</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.bibleReading.openLastReadChapter}
                      onChange={(e) => updateSection('bibleReading', { openLastReadChapter: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Keep Screen Awake */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Keep Screen Awake while Reading</p>
                      <p className="text-[11px] text-slate-400">Prevents phone or tablet screen from sleeping during scripture study</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.bibleReading.keepScreenAwake}
                      onChange={(e) => updateSection('bibleReading', { keepScreenAwake: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Highlight Selected Verse */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Highlight Selected Verse</p>
                      <p className="text-[11px] text-slate-400">Display distinct border and golden glow on the actively focused verse</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.bibleReading.highlightSelectedVerse}
                      onChange={(e) => updateSection('bibleReading', { highlightSelectedVerse: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                C. BIBLE LANGUAGE SETTINGS
                ========================================================================= */}
            {activeSection === 'bibleLanguage' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-100">
                    C. Bible Language Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select your preferred language. Parallel mode places Telugu and English side-by-side with synchronized verses.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        updateSection('bibleLanguage', { language: 'telugu' });
                      }}
                      className={`p-4 rounded-2xl border text-center font-bold flex flex-col items-center space-y-2 transition-all ${
                        settings.bibleLanguage.language === 'telugu'
                          ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-telugu text-lg">తెలుగు మాత్రమే</span>
                      <span className="text-xs font-semibold">Telugu Only</span>
                      <span className="text-[11px] font-normal text-slate-500">Original Telugu Holy Bible text</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        updateSection('bibleLanguage', { language: 'english' });
                      }}
                      className={`p-4 rounded-2xl border text-center font-bold flex flex-col items-center space-y-2 transition-all ${
                        settings.bibleLanguage.language === 'english'
                          ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-serif text-lg">English Only</span>
                      <span className="text-xs font-semibold">King James Version</span>
                      <span className="text-[11px] font-normal text-slate-500">Classical English scripture</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        updateSection('bibleLanguage', { language: 'both' });
                      }}
                      className={`p-4 rounded-2xl border text-center font-bold flex flex-col items-center space-y-2 transition-all ${
                        settings.bibleLanguage.language === 'both'
                          ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-cinzel text-lg">Telugu + English</span>
                      <span className="text-xs font-semibold">Side-by-Side Parallel</span>
                      <span className="text-[11px] font-normal text-slate-500">Synchronized bilingual columns</span>
                    </button>
                  </div>
                </div>

                {settings.bibleLanguage.language === 'both' && (
                  <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-slate-800/40 border border-amber-500/20 space-y-3">
                    <p className="font-bold text-amber-800 dark:text-amber-300 text-xs">
                      Mandated Parallel Desktop Display:
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs font-bold border-b border-amber-500/20 pb-2">
                      <span className="font-telugu text-amber-700 dark:text-amber-300">TELUGU (పరిశుద్ధ గ్రంథము)</span>
                      <span className="font-serif text-amber-700 dark:text-amber-300">ENGLISH (King James Version)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      On desktop and tablet screens, Telugu and English are presented side-by-side in parallel columns with synchronized verse numbers. On mobile phones, responsive stacking maintains clean reading flow.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                D. BIBLE TEXT SETTINGS (WITH LIVE PREVIEW!)
                ========================================================================= */}
            {activeSection === 'bibleText' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-100">
                    D. Bible Text Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fine-tune typography, size presets, line spacing, and column layouts with live preview.
                  </p>
                </div>

                {/* Font Size Presets */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs block">
                    Font Size Preset
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {textSizePresets.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => handlePresetSelect(p.key, p.pct)}
                        className={`py-2 px-1 rounded-xl border text-center font-bold text-xs transition-all ${
                          settings.bibleText.textSizePreset === p.key
                            ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size Slider with [A-] and [A+] buttons */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                      Size Slider
                    </span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                      {settings.bibleText.fontPercent}%
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handleSliderChange(Math.max(settings.bibleText.fontPercent - 10, 70))}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200 hover:border-amber-500"
                    >
                      [ A− ]
                    </button>
                    <input
                      type="range"
                      min="70"
                      max="160"
                      step="5"
                      value={settings.bibleText.fontPercent}
                      onChange={(e) => handleSliderChange(Number(e.target.value))}
                      className="flex-1 accent-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleSliderChange(Math.min(settings.bibleText.fontPercent + 10, 160))}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200 hover:border-amber-500"
                    >
                      [ A+ ]
                    </button>
                  </div>
                </div>

                {/* Specific Language Font Sizes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Telugu Font Size</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{settings.bibleText.teluguFontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="14"
                      max="36"
                      value={settings.bibleText.teluguFontSize}
                      onChange={(e) => updateSection('bibleText', { teluguFontSize: Number(e.target.value) })}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 dark:text-slate-200">English Font Size</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{settings.bibleText.englishFontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="14"
                      max="36"
                      value={settings.bibleText.englishFontSize}
                      onChange={(e) => updateSection('bibleText', { englishFontSize: Number(e.target.value) })}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>

                {/* Spacings: Line Spacing, Paragraph Spacing, Verse Spacing, Column Spacing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Line Spacing */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block">Line Spacing</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['normal', 'relaxed', 'loose'] as SpacingPreset[]).map(sp => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => updateSection('bibleText', { lineSpacing: sp })}
                          className={`py-1.5 rounded-lg border font-bold capitalize text-xs ${
                            settings.bibleText.lineSpacing === sp
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {sp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Verse Spacing */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block">Verse Spacing</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['compact', 'normal', 'spacious'] as VerseSpacingPreset[]).map(vs => (
                        <button
                          key={vs}
                          type="button"
                          onClick={() => updateSection('bibleText', { verseSpacing: vs })}
                          className={`py-1.5 rounded-lg border font-bold capitalize text-xs ${
                            settings.bibleText.verseSpacing === vs
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {vs}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column Width & Text Width */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Column Spacing / Width Ratio */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block">Column Width Ratio (Parallel)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: '50-50', label: '50% / 50%' },
                        { key: '60-40', label: '60% Te / 40% En' },
                        { key: '40-60', label: '40% Te / 60% En' }
                      ].map(cw => (
                        <button
                          key={cw.key}
                          type="button"
                          onClick={() => updateSection('bibleText', { columnWidth: cw.key as ColumnWidthRatio })}
                          className={`py-1.5 rounded-lg border font-bold text-xs ${
                            settings.bibleText.columnWidth === cw.key
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {cw.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reading Width Preset */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block">Reading Max Width</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'standard', label: 'Standard (1280px)', w: 1280 },
                        { key: 'wide', label: 'Wide (1500px)', w: 1500 },
                        { key: 'full', label: 'Full Screen', w: 1920 }
                      ].map(tw => (
                        <button
                          key={tw.key}
                          type="button"
                          onClick={() => updateSection('bibleText', { textWidth: tw.key as any, readingWidth: tw.w })}
                          className={`py-1.5 rounded-lg border font-bold text-xs ${
                            settings.bibleText.textWidth === tw.key
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {tw.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    MANDATED LIVE PREVIEW INSIDE SETTINGS PANEL (Requirement 5)
                    ========================================================================= */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Live Bible Text Preview</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Updates live with your changes</span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/20 dark:bg-slate-950 border-2 border-amber-500/30 space-y-3">
                    <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      John 3:16 (యోహాను 3:16)
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Telugu Preview */}
                      <div 
                        style={{ 
                          fontSize: `${settings.bibleText.teluguFontSize}px`,
                          lineHeight: settings.bibleText.lineSpacing === 'loose' ? 2.1 : settings.bibleText.lineSpacing === 'normal' ? 1.5 : 1.85
                        }}
                        className="font-telugu font-semibold text-slate-900 dark:text-slate-100"
                      >
                        దేవుడు లోకమును ఎంతో ప్రేమించెను. కాగా ఆయన తన అద్వితీయకుమారునిగా పుట్టిన వానియందు విశ్వాసముంచు ప్రతివాడును నశింపక నిత్యజీవము పొందునట్లు ఆయనను అనుగ్రహించెను.
                      </div>

                      {/* English Preview */}
                      <div 
                        style={{ 
                          fontSize: `${settings.bibleText.englishFontSize}px`,
                          lineHeight: settings.bibleText.lineSpacing === 'loose' ? 2.0 : settings.bibleText.lineSpacing === 'normal' ? 1.4 : 1.75
                        }}
                        className="font-serif text-slate-800 dark:text-slate-200 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-4"
                      >
                        For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                E. BIBLE NAVIGATION SETTINGS
                ========================================================================= */}
            {activeSection === 'bibleNavigation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-100">
                    E. Bible Navigation Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure book crossing and chapter flow. The Bible page maintains direct book, chapter, and verse dropdowns and arrow buttons.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Auto Advance to Next Book</p>
                      <p className="text-[11px] text-slate-400">At the final chapter of a book, 'Next Chapter' seamlessly moves to Chapter 1 of the next book</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.bibleNavigation.autoAdvanceBook}
                      onChange={(e) => updateSection('bibleNavigation', { autoAdvanceBook: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Show Old / New Testament Tabs</p>
                      <p className="text-[11px] text-slate-400">Filter book picker between Old Testament (39) and New Testament (27)</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.bibleNavigation.showTestamentTabs}
                      onChange={(e) => updateSection('bibleNavigation', { showTestamentTabs: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                F. BIBLE SEARCH SETTINGS
                ========================================================================= */}
            {activeSection === 'bibleSearch' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-100">
                    F. Bible Search Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Control how scripture searches are executed. Default scope is the complete Bible database (31,102 verses across all 66 books).
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Default Scope */}
                  <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs block">
                    Default Search Scope
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'entire', label: 'Entire Bible (Default)' },
                      { key: 'book', label: 'Current Book' },
                      { key: 'chapter', label: 'Current Chapter' }
                    ].map(sc => (
                      <button
                        key={sc.key}
                        type="button"
                        onClick={() => updateSection('bibleSearch', { scope: sc.key as any })}
                        className={`py-2 px-2 rounded-xl border text-center font-bold text-xs ${
                          settings.bibleSearch.scope === sc.key
                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {sc.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Options Switches */}
                <div className="space-y-2 pt-2">
                  <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs block">
                    Search Criteria & Matching
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { key: 'searchExactRef', label: 'Search Exact Reference (e.g. John 3:16)' },
                      { key: 'searchWords', label: 'Search Words (e.g. faith, love)' },
                      { key: 'searchPhrases', label: 'Search Phrases (exact word sequences)' },
                      { key: 'searchTelugu', label: 'Search Telugu Scripture' },
                      { key: 'searchEnglish', label: 'Search English Scripture' },
                      { key: 'highlightWord', label: 'Highlight Searched Word in Results' },
                      { key: 'showBookName', label: 'Show Book Name in Results' },
                      { key: 'showChapter', label: 'Show Chapter Number in Results' },
                      { key: 'showVerseNumber', label: 'Show Verse Number in Results' },
                      { key: 'showSurroundingVerses', label: 'Show Surrounding Context Verses' }
                    ].map(opt => (
                      <div key={opt.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">{opt.label}</span>
                        <input
                          type="checkbox"
                          checked={(settings.bibleSearch as any)[opt.key]}
                          onChange={(e) => updateSection('bibleSearch', { [opt.key]: e.target.checked } as any)}
                          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results Per Page */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Results Per Page</span>
                  <div className="flex gap-2">
                    {[10, 25, 50, 100].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => updateSection('bibleSearch', { resultsPerPage: cnt })}
                        className={`px-3 py-1 rounded-lg font-bold text-xs ${
                          settings.bibleSearch.resultsPerPage === cnt
                            ? 'bg-amber-500 text-slate-950'
                            : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                G. VERSE DISPLAY / BIBLE DISPLAY SETTINGS
                ========================================================================= */}
            {activeSection === 'verseDisplay' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-100">
                    G. Verse & Bible Display Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Toggle visibility of specific scripture headers, numbers, and reference details.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'showVerseNumbers', label: 'Show Verse Numbers', desc: 'Display numeric tags before scripture' },
                    { key: 'showChapterNumber', label: 'Show Chapter Number', desc: 'Display large chapter identifier' },
                    { key: 'showBookName', label: 'Show Book Name', desc: 'Display English and Telugu book title' },
                    { key: 'showChapterTitle', label: 'Show Chapter Title', desc: 'Show study title of the chapter' },
                    { key: 'showChapterSummary', label: 'Show Chapter Summary', desc: 'Overview outline header for chapter' },
                    { key: 'showBookInfo', label: 'Show Book Information', desc: 'Testament, order, and background banner' },
                    { key: 'showSectionHeadings', label: 'Show Section Headings', desc: 'Thematic pericope paragraph headers' },
                    { key: 'showCrossReferences', label: 'Show Cross References', desc: 'Parallel scripture citations' },
                    { key: 'showRelatedVerses', label: 'Show Related Verses', desc: 'Thematically connected Bible passages' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{item.label}</p>
                        <p className="text-[11px] text-slate-400">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={(settings.verseDisplay as any)[item.key]}
                        onChange={(e) => updateSection('verseDisplay', { [item.key]: e.target.checked } as any)}
                        className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                H. PROJECTOR SETTINGS
                ========================================================================= */}
            {activeSection === 'projector' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-100">
                    H. Sanctuary Projector Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Settings for Bible Projector and Song Projector presentation screens in church services.
                  </p>
                </div>

                {/* Bible Projector Sub-section */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="font-bold text-amber-700 dark:text-amber-300 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                    <Tv className="w-4 h-4 text-amber-500" />
                    <span>Bible Projector Options</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-xs text-slate-700 dark:text-slate-300">Projector Language</label>
                      <select
                        value={settings.projector.bible.language}
                        onChange={(e) => updateSection('projector', {
                          bible: { ...settings.projector.bible, language: e.target.value as any }
                        })}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                      >
                        <option value="both">Telugu + English (Side by Side)</option>
                        <option value="telugu">Telugu Only</option>
                        <option value="english">English Only</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Font Size</label>
                        <span className="font-mono text-amber-500 font-bold">{settings.projector.bible.fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="32"
                        max="72"
                        value={settings.projector.bible.fontSize}
                        onChange={(e) => updateSection('projector', {
                          bible: { ...settings.projector.bible, fontSize: Number(e.target.value) }
                        })}
                        className="w-full accent-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    {[
                      { key: 'showVerseNumber', label: 'Show Verse Number' },
                      { key: 'showBookChapter', label: 'Show Book & Chapter' },
                      { key: 'showClock', label: 'Show Date & Time Clock' },
                      { key: 'showLogo', label: 'Show Official Logo' },
                      { key: 'autoHideControls', label: 'Auto Hide Controls' },
                      { key: 'highContrast', label: 'High Contrast Mode' }
                    ].map(opt => (
                      <div key={opt.key} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{opt.label}</span>
                        <input
                          type="checkbox"
                          checked={(settings.projector.bible as any)[opt.key]}
                          onChange={(e) => updateSection('projector', {
                            bible: { ...settings.projector.bible, [opt.key]: e.target.checked }
                          })}
                          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Song Projector Sub-section */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="font-bold text-amber-700 dark:text-amber-300 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                    <Music className="w-4 h-4 text-amber-500" />
                    <span>Song Projector Options</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-xs text-slate-700 dark:text-slate-300">Lyrics Language</label>
                      <select
                        value={settings.projector.song.language}
                        onChange={(e) => updateSection('projector', {
                          song: { ...settings.projector.song, language: e.target.value as any }
                        })}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                      >
                        <option value="both">Telugu + English</option>
                        <option value="telugu">Telugu Only</option>
                        <option value="english">English Only</option>
                        <option value="other">Other Language</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Font Size</label>
                        <span className="font-mono text-amber-500 font-bold">{settings.projector.song.fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="32"
                        max="72"
                        value={settings.projector.song.fontSize}
                        onChange={(e) => updateSection('projector', {
                          song: { ...settings.projector.song, fontSize: Number(e.target.value) }
                        })}
                        className="w-full accent-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    {[
                      { key: 'showSongTitle', label: 'Show Song Title' },
                      { key: 'showSongNumber', label: 'Show Song Number' },
                      { key: 'showLogo', label: 'Show Official Logo' },
                      { key: 'showClock', label: 'Show Clock' },
                      { key: 'autoHideControls', label: 'Auto Hide Controls' }
                    ].map(opt => (
                      <div key={opt.key} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{opt.label}</span>
                        <input
                          type="checkbox"
                          checked={(settings.projector.song as any)[opt.key]}
                          onChange={(e) => updateSection('projector', {
                            song: { ...settings.projector.song, [opt.key]: e.target.checked }
                          })}
                          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official Logo Policy (Requirement 15) */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/20 text-amber-500 font-black font-cinzel text-sm shrink-0">
                    JBM
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-amber-100 text-xs">Official JBM Logo & Emblem</h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      The official JBM brand emblem is rendered cleanly across the website header, Bible projector, and Song projector. Logo assets and toggles are managed through the sanctuary owner control panel.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                I. DATE & TIME SETTINGS
                ========================================================================= */}
            {activeSection === 'dateTime' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-100">
                    I. Date & Time Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Control the live date and time indicators displayed across the website header and sanctuary projectors.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => updateSection('dateTime', { showDate: true, showTime: false, showBoth: false })}
                      className={`p-3.5 rounded-2xl border text-center font-bold text-xs ${
                        settings.dateTime.showDate && !settings.dateTime.showTime
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Show Date Only
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSection('dateTime', { showDate: false, showTime: true, showBoth: false })}
                      className={`p-3.5 rounded-2xl border text-center font-bold text-xs ${
                        !settings.dateTime.showDate && settings.dateTime.showTime
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Show Time Only
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSection('dateTime', { showDate: true, showTime: true, showBoth: true })}
                      className={`p-3.5 rounded-2xl border text-center font-bold text-xs ${
                        settings.dateTime.showBoth || (settings.dateTime.showDate && settings.dateTime.showTime)
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Show Date + Time (Default)
                    </button>
                  </div>

                  {/* 12-hour vs 24-hour format */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Time Format</p>
                      <p className="text-[11px] text-slate-400">Choose between standard 12-hour (AM/PM) or 24-hour military clock</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateSection('dateTime', { timeFormat: '12h' })}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                          settings.dateTime.timeFormat === '12h'
                            ? 'bg-amber-500 text-slate-950'
                            : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        12-Hour (AM/PM)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateSection('dateTime', { timeFormat: '24h' })}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                          settings.dateTime.timeFormat === '24h'
                            ? 'bg-amber-500 text-slate-950'
                            : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        24-Hour
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-amber-600 dark:text-amber-400">Default Timezone: </span>
                    <span>India Standard Time (IST) is active by default for JBM services.</span>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                J. SONG SETTINGS
                ========================================================================= */}
            {activeSection === 'songs' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-100">
                    J. Song & Worship Lyrics Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Customization for church songs library, lyrics display, media player, and metadata tags.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-xs text-slate-700 dark:text-slate-300">Preferred Song Language</label>
                    <select
                      value={settings.songs.songLanguage}
                      onChange={(e) => updateSection('songs', { songLanguage: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    >
                      <option value="both">Both Telugu & English</option>
                      <option value="telugu">Telugu Lyrics Only</option>
                      <option value="english">English Lyrics Only</option>
                      <option value="other">Other Language</option>
                    </select>
                  </div>

                  {/* Font Size & Line Spacing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">Lyrics Font Size</span>
                        <span className="font-mono text-amber-500 font-bold">{settings.songs.fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="14"
                        max="28"
                        value={settings.songs.fontSize}
                        onChange={(e) => updateSection('songs', { fontSize: Number(e.target.value) })}
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">Lyrics Spacing</span>
                      <div className="grid grid-cols-3 gap-2">
                        {(['normal', 'relaxed', 'loose'] as SpacingPreset[]).map(sp => (
                          <button
                            key={sp}
                            type="button"
                            onClick={() => updateSection('songs', { lyricsSpacing: sp })}
                            className={`py-1.5 rounded-lg border font-bold capitalize text-xs ${
                              settings.songs.lyricsSpacing === sp
                                ? 'bg-amber-500 text-slate-950 border-amber-500'
                                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {sp}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Song Metadata Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {[
                      { key: 'showSongNumber', label: 'Show Song Number' },
                      { key: 'showAuthor', label: 'Show Author' },
                      { key: 'showComposer', label: 'Show Composer' },
                      { key: 'showRelatedBibleVerse', label: 'Show Related Bible Verse' },
                      { key: 'showSongImage', label: 'Show Song Artwork / Image' },
                      { key: 'showAudioControls', label: 'Show Audio Player Controls' },
                      { key: 'showVideoControls', label: 'Show Video Player Controls' }
                    ].map(opt => (
                      <div key={opt.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{opt.label}</span>
                        <input
                          type="checkbox"
                          checked={(settings.songs as any)[opt.key]}
                          onChange={(e) => updateSection('songs', { [opt.key]: e.target.checked } as any)}
                          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                K. ACCESSIBILITY SETTINGS
                ========================================================================= */}
            {activeSection === 'accessibility' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-100">
                    K. Accessibility Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Optimizations for high readability, screen reader friendliness, keyboard navigation, and reduced strain.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'largerText', label: 'Larger Text Mode', desc: 'Increases base system font sizes site-wide' },
                    { key: 'highContrast', label: 'High Contrast', desc: 'Maximizes contrast between text and background' },
                    { key: 'reducedMotion', label: 'Reduced Motion', desc: 'Disables animations for sensitive eyes' },
                    { key: 'largerButtons', label: 'Larger Touch Buttons', desc: 'Expands button padding for comfortable tapping' },
                    { key: 'easyReadingMode', label: 'Easy Reading Mode', desc: 'Serif font with sepia warmth and calm margins' },
                    { key: 'screenReaderFriendly', label: 'Screen Reader Optimization', desc: 'Explicit semantic aria announcements' },
                    { key: 'keyboardNavigation', label: 'Keyboard Navigation Helpers', desc: 'Enhanced Tab and shortcut handling' },
                    { key: 'focusIndicators', label: 'High Visibility Focus Rings', desc: 'Bold amber focus outlines for keyboard navigation' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{item.label}</p>
                        <p className="text-[11px] text-slate-400">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={(settings.accessibility as any)[item.key]}
                        onChange={(e) => updateSection('accessibility', { [item.key]: e.target.checked } as any)}
                        className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                L. SAVED PREFERENCES
                ========================================================================= */}
            {activeSection === 'savedPreferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-100">
                    L. Saved Personal Preferences
                  </h3>
                  <p className="text-xs text-slate-500">
                    All your preferences are kept directly on your device storage without requiring login credentials.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    <Check className="w-4 h-4" />
                    <span>LocalStorage Storage Active & Synchronized</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5">
                    <li>Theme: <strong>{settings.appearance.theme}</strong></li>
                    <li>Language: <strong>{settings.bibleLanguage.language}</strong></li>
                    <li>Bible Text Scale: <strong>{settings.bibleText.fontPercent}%</strong> ({settings.bibleText.textSizePreset})</li>
                    <li>Reading Width: <strong>{settings.bibleText.readingWidth}px</strong></li>
                    <li>Bible Layout: <strong>{settings.bibleText.layout}</strong> ({settings.bibleText.columnWidth})</li>
                    <li>Search Scope: <strong>{settings.bibleSearch.scope}</strong></li>
                    <li>Projector Font Size: <strong>{settings.projector.bible.fontSize}px</strong></li>
                    <li>Time Format: <strong>{settings.dateTime.timeFormat}</strong></li>
                  </ul>
                </div>
              </div>
            )}

            {/* =========================================================================
                M. RESET SETTINGS
                ========================================================================= */}
            {activeSection === 'resetSettings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-100">
                    M. Reset Personal Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Restore all personal display, reading, and projector preferences to their default states.
                  </p>
                </div>

                {!showResetConfirm ? (
                  <div className="p-6 rounded-2xl bg-amber-50/40 dark:bg-slate-800/40 border border-amber-500/30 space-y-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          Reset All Personal Display & Reading Settings?
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          This will reset your font size, theme, column layouts, and presentation choices to default. It will NOT delete Bible texts, songs, church database items, or administrator website data.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(true)}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>RESET ALL SETTINGS</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500/50 space-y-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-base text-rose-900 dark:text-rose-200">
                          Confirm Settings Reset
                        </h4>
                        <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                          Are you sure you want to reset all personal display and reading settings to default?
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(false)}
                        className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                      >
                        CANCEL
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>RESET</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Changes take effect immediately across all website pages.
          </span>
          <button
            type="button"
            onClick={closeSettings}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
