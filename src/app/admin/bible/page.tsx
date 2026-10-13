'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Plus, Edit3, Trash2, Check, BookOpen, 
  Search, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { BibleBook, BibleVerse } from '@/lib/types';
import BibleIntegrityStatus from '@/components/BibleIntegrityStatus';

export default function AdminBiblePage() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBookId, setSelectedBookId] = useState(43); // John
  const [selectedChapter, setSelectedChapter] = useState(3);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);

  // New verse form modal state
  const [newVerseNumber, setNewVerseNumber] = useState(1);
  const [newTeluguText, setNewTeluguText] = useState('');
  const [newEnglishText, setNewEnglishText] = useState('');
  const [editingVerse, setEditingVerse] = useState<BibleVerse | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/bible/books')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setBooks(data); });
  }, []);

  const loadVerses = () => {
    setLoading(true);
    fetch(`/api/bible/verses?bookId=${selectedBookId}&chapter=${selectedChapter}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVerses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadVerses();
  }, [selectedBookId, selectedChapter]);

  const handleSaveVerse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeluguText || !newEnglishText) return;

    if (editingVerse) {
      // Update
      const res = await fetch('/api/bible/verses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingVerse.id,
          telugu_text: newTeluguText,
          english_text: newEnglishText
        })
      });
      if (res.ok) {
        setStatusMsg('Verse updated successfully!');
        setEditingVerse(null);
        setNewTeluguText('');
        setNewEnglishText('');
        loadVerses();
      }
    } else {
      // Insert
      const res = await fetch('/api/bible/verses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: selectedBookId,
          chapter_number: selectedChapter,
          verse_number: newVerseNumber,
          telugu_text: newTeluguText,
          english_text: newEnglishText
        })
      });
      if (res.ok) {
        setStatusMsg('Verse added successfully!');
        setNewTeluguText('');
        setNewEnglishText('');
        setNewVerseNumber(n => n + 1);
        loadVerses();
      }
    }
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDeleteVerse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this verse?')) return;
    const res = await fetch(`/api/bible/verses?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setStatusMsg('Verse deleted');
      loadVerses();
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const selectedBook = books.find(b => b.id === selectedBookId) || books[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Overview</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-100">
            Bible Content & Verse Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage Telugu and English Bible verses and chapters in the unified database.
          </p>
        </div>

        {statusMsg && (
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Bible Data Integrity Report & Validator (Requirement 3) */}
      <BibleIntegrityStatus />

      {/* Book & Chapter Selector Bar */}
      <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-2xl p-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Book:</label>
          <select
            value={selectedBookId}
            onChange={(e) => { setSelectedBookId(Number(e.target.value)); setSelectedChapter(1); }}
            className="px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold"
          >
            {books.map(b => (
              <option key={b.id} value={b.id}>
                {b.name_english} ({b.name_telugu})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Chapter:</label>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(Number(e.target.value))}
            className="px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold"
          >
            {Array.from({ length: selectedBook?.total_chapters || 1 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                Chapter {num}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:ml-auto">
          <Link
            href={`/bible?bookId=${selectedBookId}&chapter=${selectedChapter}`}
            className="px-3.5 py-2 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold text-xs rounded-xl hover:bg-amber-500/20"
          >
            View in Reader &rarr;
          </Link>
        </div>
      </div>

      {/* Add / Edit Verse Form */}
      <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-cinzel text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Plus className="w-4 h-4 text-amber-500" />
          <span>{editingVerse ? `Editing Verse ${editingVerse.verse_number}` : 'Add New Bilingual Verse'}</span>
        </h3>

        <form onSubmit={handleSaveVerse} className="space-y-4">
          {!editingVerse && (
            <div className="w-32">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Verse Number
              </label>
              <input
                type="number"
                min={1}
                value={newVerseNumber}
                onChange={(e) => setNewVerseNumber(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Telugu Verse Text (తెలుగు వాక్యము)
              </label>
              <textarea
                rows={3}
                required
                value={newTeluguText}
                onChange={(e) => setNewTeluguText(e.target.value)}
                placeholder="తెలుగు వాక్యమును ఇక్కడ నమోదు చేయండి..."
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-telugu"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                English Verse Text (KJV / WEB)
              </label>
              <textarea
                rows={3}
                required
                value={newEnglishText}
                onChange={(e) => setNewEnglishText(e.target.value)}
                placeholder="Enter English scripture translation here..."
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
            >
              {editingVerse ? 'Save Verse Changes' : 'Add Verse to Database'}
            </button>
            {editingVerse && (
              <button
                type="button"
                onClick={() => { setEditingVerse(null); setNewTeluguText(''); setNewEnglishText(''); }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Verses Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="font-cinzel text-sm font-bold text-slate-900 dark:text-slate-100">
            Verses in {selectedBook?.name_english} Chapter {selectedChapter} ({verses.length})
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading verses...</div>
        ) : verses.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No verses in this chapter yet. Use the form above to add verses.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {verses.map(v => (
              <div key={v.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-baseline justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-xs">
                      Verse {v.verse_number}
                    </span>
                  </div>
                  <p className="font-telugu text-sm text-slate-800 dark:text-slate-100 font-medium">
                    {v.telugu_text}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {v.english_text}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingVerse(v);
                      setNewTeluguText(v.telugu_text);
                      setNewEnglishText(v.english_text);
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600"
                    title="Edit Verse"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteVerse(v.id)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-500"
                    title="Delete Verse"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
