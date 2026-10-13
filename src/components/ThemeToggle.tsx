'use client';

import { Sun, Moon } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function ThemeToggle() {
  const { settings, updateSection } = useSettings();
  const isDark = settings.appearance.theme === 'dark' || 
    (settings.appearance.theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggle = () => {
    if (isDark) {
      updateSection('appearance', { theme: 'light' });
    } else {
      updateSection('appearance', { theme: 'dark' });
    }
  };

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="p-2 rounded-full border border-amber-500/20 hover:border-amber-500/50 bg-amber-50/50 dark:bg-slate-800/80 text-amber-700 dark:text-amber-300 transition-all hover:scale-105"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
    </button>
  );
}
