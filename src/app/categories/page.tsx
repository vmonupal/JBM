'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Music, Flame, Sparkles, HeartHandshake, Sun, Zap, 
  Smile, BookOpen, Scroll, Globe, ArrowRight, Plus, X, Check
} from 'lucide-react';
import { Category } from '@/lib/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Requirement 9: + Add Category
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadCategories = () => {
    setLoading(true);
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), icon: 'Music' })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Category "${name}" added successfully.`);
        setName('');
        setDescription('');
        setShowAddModal(false);
        loadCategories();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (e) {
      alert('Failed to add category.');
    } finally {
      setCreating(false);
    }
  };

  const getCategoryIcon = (catName: string) => {
    switch (catName.toLowerCase()) {
      case 'worship': return <Flame className="w-6 h-6 text-amber-500" />;
      case 'praise': return <Music className="w-6 h-6 text-sky-500" />;
      case 'prayer': return <HeartHandshake className="w-6 h-6 text-rose-500" />;
      case 'christmas': return <Sparkles className="w-6 h-6 text-emerald-500" />;
      case 'easter': return <Sun className="w-6 h-6 text-amber-400" />;
      case 'youth': return <Zap className="w-6 h-6 text-purple-500" />;
      case 'sunday school': return <Smile className="w-6 h-6 text-orange-500" />;
      case 'traditional': return <BookOpen className="w-6 h-6 text-indigo-500" />;
      case 'telugu songs': return <Scroll className="w-6 h-6 text-teal-500" />;
      case 'english songs': return <Globe className="w-6 h-6 text-blue-500" />;
      default: return <Music className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header with + Add Category Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div className="space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <Music className="w-3.5 h-3.5 text-amber-500" />
            <span>Curated Hymnal Collections</span>
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-slate-900 dark:text-amber-100">
            Song Categories (కీర్తనల విభాగాలు)
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
            Explore and organize songs categorized for worship, praise, prayer, Christmas, Easter, youth, Sunday school, and more.
          </p>
        </div>

        {/* Requirement 9: + Add Category */}
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-1.5 hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Category</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs flex items-center space-x-2 shadow-xs">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/songs?categoryId=${cat.id}`}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:border-amber-500 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(cat.name)}
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {cat.description || 'Devotional songs and church worship hymns.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>{cat.song_count || 0} Songs Available</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-amber-500/30 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <h3 className="font-cinzel font-bold text-lg text-slate-900 dark:text-slate-100">
                + Add Song Category
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Special Revival, Choir"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of when these songs are sung..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
                >
                  {creating ? 'Saving...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
