'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('rci_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggle = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rci_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rci_theme', 'dark');
      setIsDark(true);
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
