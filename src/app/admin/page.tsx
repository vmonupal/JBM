'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Music, Users, ShieldAlert, Sparkles, Plus, 
  Trash2, Edit3, Check, CheckCircle2, ArrowRight, BarChart3, Globe
} from 'lucide-react';
import { AdminStats } from '@/lib/types';
import BibleIntegrityStatus from '@/components/BibleIntegrityStatus';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(s => {
        setStats(s);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider">
              Church Administration (Public Access)
            </span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-slate-900 dark:text-amber-100">
            JBM CMS & Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Easily add, edit, or curate Bible scriptures, Telugu-English worship hymns, and categories.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/bible"
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-xs rounded-xl shadow hover:scale-105 transition-all flex items-center space-x-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Manage Bible</span>
          </Link>
          <Link
            href="/admin/songs"
            className="px-4 py-2 bg-slate-900 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xl shadow hover:bg-slate-800 transition-all flex items-center space-x-1.5"
          >
            <Music className="w-4 h-4" />
            <span>Manage Songs</span>
          </Link>
        </div>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Bible Books</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {stats?.totalBooks || 66}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">OT (39) + NT (27)</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Bilingual Verses</span>
            <BarChart3 className="w-4 h-4 text-sky-500" />
          </div>
          <p className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {stats?.totalVerses || 1392}
          </p>
          <p className="text-[11px] text-slate-500">Telugu & English Aligned</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Church Songs</span>
            <Music className="w-4 h-4 text-purple-500" />
          </div>
          <p className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {stats?.totalSongs || 10}
          </p>
          <p className="text-[11px] text-amber-600 font-medium">Hymnal & Worship</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Categories</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {stats?.totalCategories || 10}
          </p>
          <p className="text-[11px] text-slate-500">Curated Themes</p>
        </div>
      </div>

      {/* Bible Data Status & Integrity Verification Report (Requirement 3) */}
      <BibleIntegrityStatus />

      {/* Admin Modules Quick Launch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Module 1: Bible Content Manager */}
        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="font-cinzel text-xl font-bold text-slate-900 dark:text-slate-100">
            Bible Content & Translations
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Add new chapters, edit Telugu and English scripture translations, insert newly authorized translations, or modify individual verse texts.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/bible"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow hover:bg-amber-400 transition-all"
            >
              <span>Open Bible Content Manager</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Module 2: Songs Manager */}
        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center">
            <Music className="w-6 h-6 text-sky-600" />
          </div>
          <h3 className="font-cinzel text-xl font-bold text-slate-900 dark:text-slate-100">
            Hymns & Worship Songs
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Add authorized church songs with Telugu and English lyrics, upload or attach audio MP3 links, configure YouTube recordings, and assign song numbers.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/songs"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 hover:bg-slate-800 transition-all"
            >
              <span>Open Songs & Hymnal Manager</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
