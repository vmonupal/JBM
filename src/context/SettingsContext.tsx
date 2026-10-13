'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type BibleLanguageMode = 'telugu' | 'english' | 'both';
export type BibleLayoutMode = 'side-by-side' | 'stacked';
export type TextSizePreset = 'very-small' | 'small' | 'medium' | 'large' | 'very-large' | 'extra-large';
export type SpacingPreset = 'normal' | 'relaxed' | 'loose';
export type VerseSpacingPreset = 'compact' | 'normal' | 'spacious';
export type ColumnSpacingPreset = 'tight' | 'normal' | 'wide';
export type TextWidthPreset = 'standard' | 'wide' | 'full';
export type ColumnWidthRatio = '50-50' | '60-40' | '40-60';

export interface AppSettings {
  // A. Appearance
  appearance: {
    theme: ThemeMode;
  };

  // B. Bible Reading
  bibleReading: {
    continuousReading: boolean;
    autoScroll: boolean;
    autoScrollSpeed: number; // 1 to 5
    rememberLastLocation: boolean;
    openLastReadChapter: boolean;
    keepScreenAwake: boolean;
    highlightSelectedVerse: boolean;
    lastLocation: {
      bookId: number;
      chapter: number;
      verse: number | null;
      timestamp?: string;
    };
  };

  // C. Bible Language
  bibleLanguage: {
    language: BibleLanguageMode;
  };

  // D. Bible Text
  bibleText: {
    textSizePreset: TextSizePreset;
    fontPercent: number; // 70 to 160%
    teluguFontSize: number; // in px
    englishFontSize: number; // in px
    lineSpacing: SpacingPreset;
    paragraphSpacing: SpacingPreset;
    verseSpacing: VerseSpacingPreset;
    columnSpacing: ColumnSpacingPreset;
    textWidth: TextWidthPreset;
    readingWidth: number; // in max-width px e.g. 1200
    layout: BibleLayoutMode;
    columnWidth: ColumnWidthRatio;
  };

  // E. Bible Navigation
  bibleNavigation: {
    autoAdvanceBook: boolean;
    showTestamentTabs: boolean;
    navigationStyle: 'dropdown' | 'buttons' | 'both';
  };

  // F. Bible Search
  bibleSearch: {
    scope: 'entire' | 'book' | 'chapter';
    searchExactRef: boolean;
    searchWords: boolean;
    searchPhrases: boolean;
    searchTelugu: boolean;
    searchEnglish: boolean;
    resultsPerPage: number; // 10, 25, 50, 100
    showSurroundingVerses: boolean;
    highlightWord: boolean;
    showBookName: boolean;
    showChapter: boolean;
    showVerseNumber: boolean;
  };

  // G. Verse Display / Bible Display
  verseDisplay: {
    showVerseNumbers: boolean;
    showChapterNumber: boolean;
    showBookName: boolean;
    showChapterTitle: boolean;
    showChapterSummary: boolean;
    showBookInfo: boolean;
    showSectionHeadings: boolean;
    showCrossReferences: boolean;
    showRelatedVerses: boolean;
  };

  // H. Projector
  projector: {
    bible: {
      language: BibleLanguageMode;
      fontSize: number; // 32 to 72 px
      lineSpacing: SpacingPreset;
      showVerseNumber: boolean;
      showBookChapter: boolean;
      showClock: boolean;
      showLogo: boolean;
      fullscreen: boolean;
      autoHideControls: boolean;
      screenBrightnessFriendly: boolean;
      highContrast: boolean;
    };
    song: {
      language: 'both' | 'telugu' | 'english' | 'other';
      fontSize: number; // 32 to 72 px
      lineSpacing: SpacingPreset;
      showSongTitle: boolean;
      showSongNumber: boolean;
      showLogo: boolean;
      showClock: boolean;
      autoHideControls: boolean;
    };
  };

  // I. Date & Time
  dateTime: {
    showDate: boolean;
    showTime: boolean;
    showBoth: boolean;
    timeFormat: '12h' | '24h';
    timezone: 'IST';
  };

  // J. Songs
  songs: {
    songLanguage: 'both' | 'telugu' | 'english' | 'other';
    fontSize: number; // 14 to 28 px
    lyricsSpacing: SpacingPreset;
    showSongNumber: boolean;
    showAuthor: boolean;
    showComposer: boolean;
    showRelatedBibleVerse: boolean;
    showSongImage: boolean;
    showAudioControls: boolean;
    showVideoControls: boolean;
  };

  // K. Accessibility
  accessibility: {
    largerText: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
    largerButtons: boolean;
    easyReadingMode: boolean;
    screenReaderFriendly: boolean;
    keyboardNavigation: boolean;
    focusIndicators: boolean;
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  appearance: {
    theme: 'system',
  },
  bibleReading: {
    continuousReading: false,
    autoScroll: false,
    autoScrollSpeed: 2,
    rememberLastLocation: true,
    openLastReadChapter: false,
    keepScreenAwake: false,
    highlightSelectedVerse: true,
    lastLocation: {
      bookId: 43, // John
      chapter: 3,
      verse: 16,
    },
  },
  bibleLanguage: {
    language: 'both',
  },
  bibleText: {
    textSizePreset: 'large',
    fontPercent: 115,
    teluguFontSize: 22,
    englishFontSize: 20,
    lineSpacing: 'relaxed',
    paragraphSpacing: 'relaxed',
    verseSpacing: 'normal',
    columnSpacing: 'normal',
    textWidth: 'standard',
    readingWidth: 1280,
    layout: 'side-by-side',
    columnWidth: '50-50',
  },
  bibleNavigation: {
    autoAdvanceBook: true,
    showTestamentTabs: true,
    navigationStyle: 'both',
  },
  bibleSearch: {
    scope: 'entire',
    searchExactRef: true,
    searchWords: true,
    searchPhrases: true,
    searchTelugu: true,
    searchEnglish: true,
    resultsPerPage: 25,
    showSurroundingVerses: false,
    highlightWord: true,
    showBookName: true,
    showChapter: true,
    showVerseNumber: true,
  },
  verseDisplay: {
    showVerseNumbers: true,
    showChapterNumber: true,
    showBookName: true,
    showChapterTitle: true,
    showChapterSummary: true,
    showBookInfo: true,
    showSectionHeadings: true,
    showCrossReferences: true,
    showRelatedVerses: true,
  },
  projector: {
    bible: {
      language: 'both',
      fontSize: 44,
      lineSpacing: 'relaxed',
      showVerseNumber: true,
      showBookChapter: true,
      showClock: true,
      showLogo: true,
      fullscreen: false,
      autoHideControls: true,
      screenBrightnessFriendly: false,
      highContrast: false,
    },
    song: {
      language: 'both',
      fontSize: 44,
      lineSpacing: 'relaxed',
      showSongTitle: true,
      showSongNumber: true,
      showLogo: true,
      showClock: true,
      autoHideControls: true,
    },
  },
  dateTime: {
    showDate: true,
    showTime: true,
    showBoth: true,
    timeFormat: '12h',
    timezone: 'IST',
  },
  songs: {
    songLanguage: 'both',
    fontSize: 18,
    lyricsSpacing: 'relaxed',
    showSongNumber: true,
    showAuthor: true,
    showComposer: true,
    showRelatedBibleVerse: true,
    showSongImage: true,
    showAudioControls: true,
    showVideoControls: true,
  },
  accessibility: {
    largerText: false,
    highContrast: false,
    reducedMotion: false,
    largerButtons: false,
    easyReadingMode: false,
    screenReaderFriendly: false,
    keyboardNavigation: false,
    focusIndicators: false,
  },
};

const STORAGE_KEY = 'rci_global_settings';

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (updater: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => void;
  updateSection: <K extends keyof AppSettings>(section: K, values: Partial<AppSettings[K]>) => void;
  resetSettings: () => void;
  isSettingsOpen: boolean;
  openSettings: (sectionKey?: string) => void;
  closeSettings: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('appearance');

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Deep merge with DEFAULT_SETTINGS to ensure all keys exist
        setSettings(prev => {
          const merged: AppSettings = {
            ...prev,
            ...parsed,
            appearance: { ...prev.appearance, ...(parsed.appearance || {}) },
            bibleReading: { ...prev.bibleReading, ...(parsed.bibleReading || {}) },
            bibleLanguage: { ...prev.bibleLanguage, ...(parsed.bibleLanguage || {}) },
            bibleText: { ...prev.bibleText, ...(parsed.bibleText || {}) },
            bibleNavigation: { ...prev.bibleNavigation, ...(parsed.bibleNavigation || {}) },
            bibleSearch: { ...prev.bibleSearch, ...(parsed.bibleSearch || {}) },
            verseDisplay: { ...prev.verseDisplay, ...(parsed.verseDisplay || {}) },
            projector: {
              ...prev.projector,
              bible: { ...prev.projector.bible, ...(parsed.projector?.bible || {}) },
              song: { ...prev.projector.song, ...(parsed.projector?.song || {}) },
            },
            dateTime: { ...prev.dateTime, ...(parsed.dateTime || {}) },
            songs: { ...prev.songs, ...(parsed.songs || {}) },
            accessibility: { ...prev.accessibility, ...(parsed.accessibility || {}) },
          };
          return merged;
        });
      } else {
        // Fallback check legacy rci_bible_display_settings or rci_theme
        const legacyTheme = localStorage.getItem('rci_theme');
        if (legacyTheme === 'light' || legacyTheme === 'dark') {
          setSettings(prev => ({
            ...prev,
            appearance: { theme: legacyTheme }
          }));
        }
      }
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage on update
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  }, [settings, isLoaded]);

  // Apply Theme Mode (Light / Dark / System Default) consistently
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      const theme = settings.appearance.theme;

      if (theme === 'dark') {
        root.classList.add('dark');
        localStorage.setItem('rci_theme', 'dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
        localStorage.setItem('rci_theme', 'light');
      } else {
        // System default
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        localStorage.removeItem('rci_theme');
      }
    };

    applyTheme();

    // Listen to OS theme changes if on system
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (settings.appearance.theme === 'system') {
        applyTheme();
      }
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [settings.appearance.theme]);

  // Apply Accessibility Classes
  useEffect(() => {
    const root = document.documentElement;
    const { highContrast, reducedMotion, largerButtons, focusIndicators, easyReadingMode } = settings.accessibility;

    if (highContrast) root.classList.add('rci-high-contrast');
    else root.classList.remove('rci-high-contrast');

    if (reducedMotion) root.classList.add('rci-reduced-motion');
    else root.classList.remove('rci-reduced-motion');

    if (largerButtons) root.classList.add('rci-large-buttons');
    else root.classList.remove('rci-large-buttons');

    if (focusIndicators) root.classList.add('rci-focus-indicators');
    else root.classList.remove('rci-focus-indicators');

    if (easyReadingMode) root.classList.add('rci-easy-reading');
    else root.classList.remove('rci-easy-reading');
  }, [settings.accessibility]);

  // Screen Wake Lock API implementation for Reading Mode
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      if (settings.bibleReading.keepScreenAwake && 'wakeLock' in navigator) {
        try {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          // Wake lock request failed (not permitted or low battery)
        }
      }
    };

    requestWakeLock();

    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, [settings.bibleReading.keepScreenAwake]);

  const updateSettings = useCallback((updater: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => {
    setSettings(prev => {
      if (typeof updater === 'function') {
        return updater(prev);
      }
      return { ...prev, ...updater };
    });
  }, []);

  const updateSection = useCallback(<K extends keyof AppSettings>(section: K, values: Partial<AppSettings[K]>) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...values,
      },
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.removeItem('rci_theme');
      document.documentElement.classList.remove('rci-high-contrast', 'rci-reduced-motion', 'rci-large-buttons', 'rci-focus-indicators', 'rci-easy-reading');
      // Apply system default
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  }, []);

  const openSettings = useCallback((sectionKey?: string) => {
    if (sectionKey) {
      setActiveSection(sectionKey);
    }
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateSection,
        resetSettings,
        isSettingsOpen,
        openSettings,
        closeSettings,
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
