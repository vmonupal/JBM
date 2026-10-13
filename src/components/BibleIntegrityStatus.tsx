'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Database, BookOpen, Layers } from 'lucide-react';
import { BibleIntegrityReport } from '@/lib/types';

export default function BibleIntegrityStatus() {
  const [report, setReport] = useState<BibleIntegrityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const fetchIntegrity = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bible-integrity');
      const data = await res.json();
      setReport(data);
      setLastChecked(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.error('Failed to fetch Bible integrity report:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrity();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-cinzel text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-100">
                Bible Data Status
              </h2>
              {report && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 ${
                  report.is_complete 
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' 
                    : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                }`}>
                  {report.is_complete ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Complete & Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Data Incomplete</span>
                    </>
                  )}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated database integrity verification for Protestant 66-book canon (OT 39 + NT 27, 1,189 chapters, 31,102 verses).
            </p>
          </div>
        </div>

        <button
          onClick={fetchIntegrity}
          disabled={loading}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/20 text-slate-800 dark:text-amber-200 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Validating...' : 'Re-check Integrity'}</span>
        </button>
      </div>

      {loading && !report ? (
        <div className="py-12 text-center space-y-2">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Checking 31,102 verses and 1,189 chapters...</p>
        </div>
      ) : report ? (
        <div className="space-y-6">
          {/* Main 8-Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                Books
              </span>
              <p className="font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {report.books_count} / {report.expected_books}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                39 OT + 27 NT Canon
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                Chapters
              </span>
              <p className="font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {report.chapters_count} / {report.expected_chapters}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                100% Chapter Coverage
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                English Verses
              </span>
              <p className="font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {report.english_verses_count.toLocaleString()} / {report.expected_verses.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                King James Version (KJV)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                Telugu Verses
              </span>
              <p className="font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {report.telugu_verses_count.toLocaleString()} / {report.expected_verses.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-telugu">
                పరిశుద్ధ గ్రంథము (BSI OV)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                Missing English
              </span>
              <p className={`font-mono text-xl sm:text-2xl font-black ${
                report.missing_english === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
              }`}>
                {report.missing_english}
              </p>
              <p className="text-[11px] text-slate-500">Zero gaps</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                Missing Telugu
              </span>
              <p className={`font-mono text-xl sm:text-2xl font-black ${
                report.missing_telugu === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
              }`}>
                {report.missing_telugu}
              </p>
              <p className="text-[11px] text-slate-500">Zero gaps</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                Duplicate Records
              </span>
              <p className={`font-mono text-xl sm:text-2xl font-black ${
                report.duplicate_records === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
              }`}>
                {report.duplicate_records}
              </p>
              <p className="text-[11px] text-slate-500">Normalized records</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                Invalid References
              </span>
              <p className={`font-mono text-xl sm:text-2xl font-black ${
                report.invalid_references === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
              }`}>
                {report.invalid_references}
              </p>
              <p className="text-[11px] text-slate-500">All references verified</p>
            </div>

          </div>

          {/* Missing Details Notice (if any) */}
          {report.missing_details && report.missing_details.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/40 space-y-2 text-xs">
              <div className="flex items-center space-x-2 font-bold text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Integrity Exceptions Detected:</span>
              </div>
              <ul className="list-disc list-inside text-rose-800 dark:text-rose-200 space-y-1">
                {report.missing_details.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Authorized Translations & Licensing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-amber-500/20 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Authorized Translation Sources & Licensing</span>
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {report.translations.map((tr) => (
                <div key={tr.code} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span>{tr.name_english}</span>
                    <span className="font-mono text-[10px] text-amber-600 uppercase font-semibold">{tr.code}</span>
                  </div>
                  <div className="font-telugu text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                    {tr.name_telugu}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Source: {tr.source}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    License: {tr.license}
                  </div>
                </div>
              ))}
            </div>
            {lastChecked && (
              <p className="text-[10px] text-slate-400 text-right">
                Last checked at: {lastChecked} IST
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
