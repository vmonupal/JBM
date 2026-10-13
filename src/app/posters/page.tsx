'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  Image as ImageIcon, Plus, Search, Filter, Calendar, Clock, 
  MapPin, X, Download, Trash2, Edit, AlertTriangle, Check, 
  Sparkles, Maximize2, Minimize2, RefreshCw, Upload, Eye, BookOpen, 
  Layers, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw,
  Tv, User, Phone, HelpCircle, CheckCircle2
} from 'lucide-react';
import { Poster } from '@/lib/types';
import { useBranding } from '@/context/BrandingContext';

const POSTER_CATEGORIES = [
  'All',
  'Sunday Service',
  'Prayer Meeting',
  'Worship',
  'Youth',
  'Children',
  'Christmas',
  'Easter',
  'Special Event',
  'Bible Study',
  'Church Announcement',
  'Other'
];

const POSTER_LANGUAGES = [
  'All',
  'Telugu',
  'English',
  'Telugu + English',
  'Other'
];

// Helper: Calculate gcd for aspect ratio
function getAspectRatioString(width: number, height: number): string {
  if (!width || !height) return '';
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const wRatio = Math.round(width / divisor);
  const hRatio = Math.round(height / divisor);
  
  const decimal = width / height;
  if (Math.abs(decimal - 16 / 9) < 0.05) return '16:9';
  if (Math.abs(decimal - 16 / 10) < 0.05) return '16:10';
  if (Math.abs(decimal - 4 / 3) < 0.05) return '4:3';
  if (Math.abs(decimal - 1) < 0.05) return '1:1';
  if (Math.abs(decimal - 4 / 5) < 0.05) return '4:5';
  if (Math.abs(decimal - 9 / 16) < 0.05) return '9:16';
  
  return `${wRatio}:${hRatio}`;
}

// Helper: Format bytes to human readable
function formatFileSize(bytes: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Client-side Canvas resized blob creator
async function createResizedBlob(img: HTMLImageElement, maxDim: number, quality = 0.88): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;
      if (!origW || !origH) {
        resolve(null);
        return;
      }

      let targetW = origW;
      let targetH = origH;
      if (origW > maxDim || origH > maxDim) {
        if (origW >= origH) {
          targetW = maxDim;
          targetH = Math.round((origH * maxDim) / origW);
        } else {
          targetH = maxDim;
          targetW = Math.round((origW * maxDim) / origH);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetW, targetH);

      canvas.toBlob(
        (blob) => resolve(blob),
        'image/webp',
        quality
      );
    } catch {
      resolve(null);
    }
  });
}

export default function PostersPage() {
  const { branding } = useBranding();
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  // Modals & Active states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activePosterForView, setActivePosterForView] = useState<Poster | null>(null);
  const [activePosterForEdit, setActivePosterForEdit] = useState<Poster | null>(null);
  const [posterToDelete, setPosterToDelete] = useState<Poster | null>(null);

  // Form states for Add / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formEventName, setFormEventName] = useState('');
  const [formEventDate, setFormEventDate] = useState('');
  const [formEventTime, setFormEventTime] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCategory, setFormCategory] = useState('Special Event');
  const [formLanguage, setFormLanguage] = useState('Telugu + English');
  const [formBibleRef, setFormBibleRef] = useState('');
  const [formSpeaker, setFormSpeaker] = useState('');
  const [formContactInfo, setFormContactInfo] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formFile, setFormFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Detected Image Metadata
  const [detectedMeta, setDetectedMeta] = useState<{
    width: number;
    height: number;
    aspect_ratio: string;
    file_type: string;
    file_size: string;
    file_size_bytes: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);

  // Lightbox Viewer state (Section 8)
  const [viewerZoom, setViewerZoom] = useState<number>(1.0);
  const [viewerFullscreen, setViewerFullscreen] = useState(false);
  const [viewerShowInfo, setViewerShowInfo] = useState(true);
  const [viewerImageError, setViewerImageError] = useState(false);
  const [viewerUseFallback, setViewerUseFallback] = useState(false);
  const [viewerRetryKey, setViewerRetryKey] = useState(0);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Fetch Posters
  const fetchPosters = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posters', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosters(data);
        }
      }
    } catch (e) {
      console.error('Error fetching posters:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  // Filtered Posters
  const filteredPosters = useMemo(() => {
    return posters.filter(p => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesLang = selectedLanguage === 'All' || p.language === selectedLanguage;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || (
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.event_name && p.event_name.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.speaker && p.speaker.toLowerCase().includes(q)) ||
        (p.bible_reference && p.bible_reference.toLowerCase().includes(q))
      );
      return matchesCat && matchesLang && matchesSearch;
    });
  }, [posters, selectedCategory, selectedLanguage, searchQuery]);

  // Handle File Select for Add/Edit with dimension detection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (JPG, PNG, WebP)
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        setFormError('Please select a valid image file (JPG, PNG, or WebP).');
        return;
      }

      setFormFile(file);
      setFormError(null);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);

        // Detect dimensions & aspect ratio
        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          const ratio = getAspectRatioString(w, h);
          setDetectedMeta({
            width: w,
            height: h,
            aspect_ratio: ratio,
            file_type: file.type.replace('image/', '').toUpperCase(),
            file_size: formatFileSize(file.size),
            file_size_bytes: file.size
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormTitle('');
    setFormDescription('');
    setFormEventName('');
    setFormEventDate('');
    setFormEventTime('');
    setFormLocation('');
    setFormCategory('Sunday Service');
    setFormLanguage('Telugu + English');
    setFormBibleRef('');
    setFormSpeaker('');
    setFormContactInfo('');
    setFormImageUrl('');
    setFormFile(null);
    setImagePreview(null);
    setDetectedMeta(null);
    setFormError(null);
    setShowGuidelines(false);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p: Poster) => {
    setActivePosterForEdit(p);
    setFormTitle(p.title || '');
    setFormDescription(p.description || '');
    setFormEventName(p.event_name || '');
    setFormEventDate(p.event_date || '');
    setFormEventTime(p.event_time || '');
    setFormLocation(p.location || '');
    setFormCategory(p.category || 'Special Event');
    setFormLanguage(p.language || 'Telugu + English');
    setFormBibleRef(p.bible_reference || '');
    setFormSpeaker(p.speaker || '');
    setFormContactInfo(p.contact_info || '');
    setFormImageUrl(p.image_url || '');
    setFormFile(null);
    setImagePreview(p.image_url || null);
    setDetectedMeta(p.width && p.height ? {
      width: p.width,
      height: p.height,
      aspect_ratio: p.aspect_ratio || getAspectRatioString(p.width, p.height),
      file_type: p.file_type || 'IMG',
      file_size: p.file_size || '',
      file_size_bytes: p.file_size_bytes || 0
    } : null);
    setFormError(null);
  };

  // Submit Add Poster with Multi-Resolution Generation
  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFile && !formImageUrl && !imagePreview) {
      setFormError('Please select a poster image file or enter an image URL.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      let res: Response;
      if (formFile && imagePreview) {
        const formData = new FormData();
        // Original uncompressed file preserved at 100% quality
        formData.append('file', formFile);
        formData.append('title', formTitle);
        formData.append('description', formDescription);
        formData.append('event_name', formEventName);
        formData.append('event_date', formEventDate);
        formData.append('event_time', formEventTime);
        formData.append('location', formLocation);
        formData.append('category', formCategory);
        formData.append('language', formLanguage);
        formData.append('bible_reference', formBibleRef);
        formData.append('speaker', formSpeaker);
        formData.append('contact_info', formContactInfo);

        if (detectedMeta) {
          formData.append('width', String(detectedMeta.width));
          formData.append('height', String(detectedMeta.height));
          formData.append('aspect_ratio', detectedMeta.aspect_ratio);
        }

        // Generate optimized thumbnail and large display blobs via Canvas
        try {
          const img = new Image();
          await new Promise((resolve) => {
            img.onload = resolve;
            img.src = imagePreview;
          });

          const thumbBlob = await createResizedBlob(img, 640, 0.85);
          if (thumbBlob) {
            formData.append('thumbnail', thumbBlob, 'thumbnail.webp');
          }

          const largeBlob = await createResizedBlob(img, 1920, 0.90);
          if (largeBlob) {
            formData.append('large', largeBlob, 'large.webp');
          }
        } catch (canvasErr) {
          console.warn('Canvas optimization skipped:', canvasErr);
        }

        res = await fetch('/api/posters', {
          method: 'POST',
          body: formData
        });
      } else {
        res = await fetch('/api/posters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: formImageUrl || imagePreview,
            image_data: imagePreview?.startsWith('data:') ? imagePreview : undefined,
            title: formTitle,
            description: formDescription,
            event_name: formEventName,
            event_date: formEventDate,
            event_time: formEventTime,
            location: formLocation,
            category: formCategory,
            language: formLanguage,
            bible_reference: formBibleRef,
            speaker: formSpeaker,
            contact_info: formContactInfo,
            width: detectedMeta?.width,
            height: detectedMeta?.height,
            aspect_ratio: detectedMeta?.aspect_ratio
          })
        });
      }

      const result = await res.json();
      if (res.ok && result.success) {
        setIsAddModalOpen(false);
        setActionSuccess('Poster added successfully with original quality preserved!');
        setTimeout(() => setActionSuccess(null), 4000);
        await fetchPosters();
      } else {
        setFormError(result.error || 'Failed to add poster');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error uploading poster');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit Poster
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePosterForEdit) return;

    try {
      setIsSubmitting(true);
      setFormError(null);

      const res = await fetch(`/api/posters/${activePosterForEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          event_name: formEventName,
          event_date: formEventDate,
          event_time: formEventTime,
          location: formLocation,
          category: formCategory,
          language: formLanguage,
          bible_reference: formBibleRef,
          speaker: formSpeaker,
          contact_info: formContactInfo,
          image_url: formImageUrl || activePosterForEdit.image_url
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setActivePosterForEdit(null);
        setActionSuccess('Poster information updated!');
        setTimeout(() => setActionSuccess(null), 4000);
        await fetchPosters();
      } else {
        setFormError(result.error || 'Failed to update poster');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error updating poster');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm and Delete Poster
  const handleConfirmDelete = async () => {
    if (!posterToDelete) return;
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/posters/${posterToDelete.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setPosterToDelete(null);
        setActionSuccess('Poster deleted permanently.');
        setTimeout(() => setActionSuccess(null), 4000);
        await fetchPosters();
      }
    } catch (e) {
      console.error('Error deleting poster:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lightbox Navigation (Previous / Next)
  const handleViewerPrev = () => {
    if (!activePosterForView || posters.length === 0) return;
    const curIdx = posters.findIndex(p => p.id === activePosterForView.id);
    const prevIdx = (curIdx - 1 + posters.length) % posters.length;
    setActivePosterForView(posters[prevIdx]);
    setViewerZoom(1.0);
    setViewerImageError(false);
    setViewerUseFallback(false);
  };

  const handleViewerNext = () => {
    if (!activePosterForView || posters.length === 0) return;
    const curIdx = posters.findIndex(p => p.id === activePosterForView.id);
    const nextIdx = (curIdx + 1) % posters.length;
    setActivePosterForView(posters[nextIdx]);
    setViewerZoom(1.0);
    setViewerImageError(false);
    setViewerUseFallback(false);
  };

  // Viewer keyboard navigation
  useEffect(() => {
    if (!activePosterForView) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleViewerPrev();
      else if (e.key === 'ArrowRight') handleViewerNext();
      else if (e.key === 'Escape') setActivePosterForView(null);
      else if (e.key === '+' || e.key === '=') setViewerZoom(z => Math.min(z + 0.25, 2.5));
      else if (e.key === '-' || e.key === '_') setViewerZoom(z => Math.max(z - 0.25, 0.5));
      else if (e.key === '0') setViewerZoom(1.0);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activePosterForView, posters]);

  return (
    <div className="min-h-screen pb-24 bg-[#FCFBF7] dark:bg-[#060B13] text-slate-900 dark:text-slate-100">
      
      {/* 1. Header Banner */}
      <section className="border-b border-amber-500/20 bg-gradient-to-b from-amber-500/10 via-emerald-900/5 to-transparent pt-8 sm:pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>JBM Church Media & Event Posters</span>
              </div>
              
              <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100">
                Church Posters (ప్రకటనలు & పోస్టర్లు)
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Browse announcements for worship services, prayer conventions, gospel events, youth rallies, and ministry celebrations. All church members and visitors are welcome to view, project, and download.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/posters/projector"
                className="px-4 py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 text-amber-400 border border-amber-500/30 hover:border-amber-400 font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:scale-105 transition-all flex items-center space-x-2"
                title="Launch Fullscreen Poster Projector"
              >
                <Tv className="w-4 h-4" />
                <span>LAUNCH PROJECTOR</span>
              </Link>

              <button
                onClick={handleOpenAddModal}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ ADD POSTER</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2 animate-fade-in shadow-xs">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold">{actionSuccess}</span>
          </div>
        </div>
      )}

      {/* 2. Filter & Search Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posters by title, event, speaker, location..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Language filter dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:inline">
              Language:
            </span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              aria-label="Filter posters by language"
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {POSTER_LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
          {POSTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Posters Gallery Grid (Preserves aspect ratio, contains image, responsive 1/2/3/4 cols) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-xs text-slate-500">Loading Church Posters...</p>
          </div>
        ) : filteredPosters.length === 0 ? (
          <div className="min-h-[40vh] bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">No posters found</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                {searchQuery || selectedCategory !== 'All' || selectedLanguage !== 'All'
                  ? 'No posters match your current search or category filter. Try clearing filters.'
                  : 'No church posters have been uploaded yet. Be the first to add one!'}
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              + Add First Poster
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosters.map((poster) => (
              <div
                key={poster.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                {/* Poster Image Preview: Object-contain, NO forced crop */}
                <div 
                  onClick={() => {
                    setActivePosterForView(poster);
                    setViewerZoom(1.0);
                    setViewerImageError(false);
                    setViewerUseFallback(false);
                  }}
                  className="relative h-64 sm:h-72 w-full bg-slate-950 flex items-center justify-center p-2 overflow-hidden cursor-pointer"
                >
                  <img
                    src={poster.thumbnail_url || poster.image_url}
                    alt={poster.title || 'Church Poster'}
                    className="max-h-full max-w-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (poster.image_url && target.src !== poster.image_url) {
                        target.src = poster.image_url;
                      }
                    }}
                  />
                  
                  {/* Category & Language Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/85 text-emerald-300 backdrop-blur-xs border border-emerald-500/30">
                      {poster.category}
                    </span>
                    {poster.language && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/85 text-amber-300 backdrop-blur-xs border border-amber-500/30">
                        {poster.language}
                      </span>
                    )}
                  </div>

                  {/* Resolution & Aspect Ratio Badge (Section 10) */}
                  {(poster.aspect_ratio || poster.width) && (
                    <div className="absolute bottom-2 right-2 pointer-events-none">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950/85 text-slate-300 backdrop-blur-xs border border-white/10">
                        {poster.aspect_ratio || (poster.width && poster.height ? `${poster.width}×${poster.height}` : '')}
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay with View Action */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <span className="px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 font-bold text-xs flex items-center space-x-1.5 shadow-lg backdrop-blur-xs">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View High-Res</span>
                    </span>
                  </div>
                </div>

                {/* Poster Details Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {poster.title && (
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 hover:text-emerald-600 transition-colors">
                        {poster.title}
                      </h3>
                    )}
                    
                    {poster.event_name && poster.event_name !== poster.title && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                        {poster.event_name}
                      </p>
                    )}

                    <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                      {poster.event_date && (
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{poster.event_date} {poster.event_time ? `• ${poster.event_time}` : ''}</span>
                        </div>
                      )}
                      
                      {poster.location && (
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{poster.location}</span>
                        </div>
                      )}

                      {poster.speaker && (
                        <div className="flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate font-medium">{poster.speaker}</span>
                        </div>
                      )}

                      {poster.bible_reference && (
                        <div className="flex items-center space-x-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="italic font-medium truncate">{poster.bible_reference}</span>
                        </div>
                      )}
                    </div>

                    {poster.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {poster.description}
                      </p>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          setActivePosterForView(poster);
                          setViewerZoom(1.0);
                          setViewerImageError(false);
                          setViewerUseFallback(false);
                        }}
                        className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <Link
                        href={`/posters/projector?id=${poster.id}`}
                        className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] hover:bg-emerald-100 transition-colors flex items-center space-x-1"
                        title="Open in Projector Mode"
                      >
                        <Tv className="w-3 h-3" />
                        <span>Project</span>
                      </Link>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <a
                        href={poster.image_url}
                        download={`jbm-poster-${poster.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Download Original High-Res Poster"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleOpenEditModal(poster)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Poster Info"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPosterToDelete(poster)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Poster"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Fullscreen High-Resolution Lightbox Modal (Section 8) */}
      {activePosterForView && (
        <div 
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fade-in text-white select-none"
        >
          {/* Lightbox Header Bar */}
          <div className="p-3 sm:p-4 bg-black/80 border-b border-white/10 flex items-center justify-between z-10 backdrop-blur-md">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 shrink-0">
                {activePosterForView.category}
              </span>
              <h3 className="font-bold text-xs sm:text-base text-slate-100 truncate">
                {activePosterForView.title || activePosterForView.event_name || 'Church Poster'}
              </h3>
              {activePosterForView.aspect_ratio && (
                <span className="hidden md:inline px-2 py-0.5 rounded-md bg-white/10 text-[10px] text-amber-300 font-mono">
                  {activePosterForView.aspect_ratio}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {/* Direct Open in Projector button */}
              <Link
                href={`/posters/projector?id=${activePosterForView.id}`}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                title="Open in Projector Mode"
              >
                <Tv className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Projector</span>
              </Link>

              {/* Download Original button */}
              <a
                href={activePosterForView.image_url}
                download={`jbm-poster-${activePosterForView.id}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white/10 text-slate-200 hover:text-white hover:bg-white/20 transition-colors flex items-center space-x-1 text-xs font-bold"
                title="Download Original High-Res Poster"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Download Original</span>
              </a>

              {/* Toggle Info Overlay */}
              <button
                onClick={() => setViewerShowInfo(prev => !prev)}
                className={`p-2 rounded-xl border transition-colors ${
                  viewerShowInfo ? 'bg-amber-600 border-amber-500 text-white' : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/20'
                }`}
                title="Toggle Poster Details"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Close Viewer */}
              <button
                onClick={() => setActivePosterForView(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image Canvas with Prev / Next */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
            
            {/* Prev Button */}
            <button
              onClick={handleViewerPrev}
              className="absolute left-3 sm:left-6 z-20 p-3 sm:p-4 rounded-2xl bg-black/60 hover:bg-black/90 text-white border border-white/15 backdrop-blur-md transition-all hover:scale-105"
              title="Previous Poster (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleViewerNext}
              className="absolute right-3 sm:right-6 z-20 p-3 sm:p-4 rounded-2xl bg-black/60 hover:bg-black/90 text-white border border-white/15 backdrop-blur-md transition-all hover:scale-105"
              title="Next Poster (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Poster Image */}
            {viewerImageError ? (
              <div className="max-w-md p-6 rounded-3xl bg-slate-900 border border-rose-500/30 text-center space-y-3 z-10">
                <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
                <h4 className="font-bold text-sm text-white">Poster image could not be loaded.</h4>
                <p className="text-xs text-slate-400">Unable to load the display version from the media server.</p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setViewerImageError(false);
                      setViewerRetryKey(k => k + 1);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Retry
                  </button>
                  {!viewerUseFallback && (
                    <button
                      onClick={() => {
                        setViewerUseFallback(true);
                        setViewerImageError(false);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                    >
                      Reload Original Image
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-200"
                style={{
                  transform: `scale(${viewerZoom})`,
                  transformOrigin: 'center center'
                }}
              >
                <img
                  key={`${activePosterForView.id}-${viewerRetryKey}-${viewerUseFallback}`}
                  src={
                    viewerUseFallback
                      ? activePosterForView.image_url
                      : (activePosterForView.large_url || activePosterForView.image_url)
                  }
                  alt={activePosterForView.title || 'Church Poster'}
                  className="max-h-[80vh] max-w-full w-auto h-auto object-contain rounded-xl drop-shadow-2xl"
                  onError={() => {
                    if (!viewerUseFallback && activePosterForView.image_url && activePosterForView.large_url) {
                      setViewerUseFallback(true);
                    } else {
                      setViewerImageError(true);
                    }
                  }}
                />
              </div>
            )}

            {/* Floating Info Drawer if enabled */}
            {viewerShowInfo && !viewerImageError && (
              <div className="absolute bottom-6 left-6 max-w-sm z-20 pointer-events-none animate-fade-in">
                <div className="p-4 rounded-2xl bg-black/85 border border-white/15 text-white shadow-2xl backdrop-blur-md space-y-1.5 pointer-events-auto text-xs">
                  <h4 className="font-bold text-sm text-emerald-300">
                    {activePosterForView.title || activePosterForView.event_name}
                  </h4>
                  {activePosterForView.event_date && (
                    <p className="text-amber-300 flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{activePosterForView.event_date} {activePosterForView.event_time ? `• ${activePosterForView.event_time}` : ''}</span>
                    </p>
                  )}
                  {activePosterForView.location && (
                    <p className="text-slate-300 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{activePosterForView.location}</span>
                    </p>
                  )}
                  {activePosterForView.speaker && (
                    <p className="text-emerald-300 flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Speaker: {activePosterForView.speaker}</span>
                    </p>
                  )}
                  {activePosterForView.bible_reference && (
                    <p className="text-emerald-400 italic">
                      📖 {activePosterForView.bible_reference}
                    </p>
                  )}
                  {(activePosterForView.width || activePosterForView.file_size) && (
                    <div className="pt-1 text-[10px] text-slate-400 font-mono border-t border-white/10 flex items-center space-x-2">
                      {activePosterForView.width && <span>{activePosterForView.width} × {activePosterForView.height} px</span>}
                      {activePosterForView.file_size && <span>• {activePosterForView.file_size}</span>}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Lightbox Bottom Toolbar (Zoom controls & index) */}
          <div className="p-3 bg-black/80 border-t border-white/10 flex items-center justify-between z-10 backdrop-blur-md text-xs">
            <div className="text-slate-400">
              Poster <span className="font-bold text-emerald-400">
                {posters.findIndex(p => p.id === activePosterForView.id) + 1}
              </span> of {posters.length}
            </div>

            <div className="flex items-center space-x-2 bg-white/10 p-1 rounded-xl">
              <button
                onClick={() => setViewerZoom(z => Math.max(z - 0.25, 0.5))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-emerald-400 px-2">
                {Math.round(viewerZoom * 100)}%
              </span>
              <button
                onClick={() => setViewerZoom(z => Math.min(z + 0.25, 2.5))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {viewerZoom !== 1.0 && (
                <button
                  onClick={() => setViewerZoom(1.0)}
                  className="p-1.5 rounded-lg text-amber-400 hover:bg-white/10"
                  title="Reset Zoom (0)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-400 hidden sm:block">
              Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">→</kbd> to navigate
            </div>
          </div>
        </div>
      )}

      {/* 5. Add / Upload Poster Modal (Sections 1, 2, 10) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-cinzel text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                    Add New Church Poster
                  </h2>
                  <p className="text-xs text-slate-500">Upload JPG, PNG, or WebP. Original quality is preserved permanently.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Poster Content & Size Guidelines Toggle (Section 1 & 2) */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-3.5 text-xs space-y-2">
              <button
                type="button"
                onClick={() => setShowGuidelines(prev => !prev)}
                className="w-full flex items-center justify-between font-bold text-amber-800 dark:text-amber-300"
              >
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Poster Creation & Upload Guidelines</span>
                </div>
                <span className="text-[11px] underline">
                  {showGuidelines ? 'Hide Guidelines' : 'View Recommended Specs'}
                </span>
              </button>

              {showGuidelines && (
                <div className="pt-2 text-slate-700 dark:text-slate-300 space-y-2 border-t border-amber-500/20 leading-relaxed">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-amber-500/20">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">Recommended Resolutions:</p>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400 mt-1">
                        <li><strong>1920 × 1080 px</strong> (Landscape Projector 16:9)</li>
                        <li><strong>1920 × 1200 px</strong> (16:10 Displays)</li>
                        <li><strong>1080 × 1350 px</strong> (Portrait 4:5)</li>
                        <li><strong>1080 × 1920 px</strong> (Portrait 9:16)</li>
                        <li>Min resolution: 1280 × 720 px</li>
                      </ul>
                    </div>

                    <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-amber-500/20">
                      <p className="font-bold text-amber-600 dark:text-amber-400">Recommended Content:</p>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400 mt-1">
                        <li>JBM branding & event title</li>
                        <li>Date, Day & Time</li>
                        <li>Venue / Location</li>
                        <li>Speaker / Pastor name</li>
                        <li>Theme Scripture reference</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    Note: The upload system will never stretch, distort, or compress your original file. Valid aspect ratios are preserved.
                  </p>
                </div>
              )}
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitAdd} className="space-y-4 text-xs">
              
              {/* Image Upload Area */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Poster Image * (JPG, PNG, WebP)
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-emerald-500 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={imagePreview}
                        alt="Upload Preview"
                        className="max-h-48 mx-auto rounded-xl object-contain border border-slate-200 dark:border-slate-800"
                      />
                      
                      {/* Detected Resolution Banner (Section 10) */}
                      {detectedMeta && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs inline-flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>
                            Detected: <strong>{detectedMeta.width} × {detectedMeta.height} px</strong> ({detectedMeta.aspect_ratio}) • {detectedMeta.file_type} • {detectedMeta.file_size}
                          </span>
                        </div>
                      )}

                      <div>
                        <button
                          type="button"
                          onClick={() => { setFormFile(null); setImagePreview(null); setDetectedMeta(null); }}
                          className="px-3 py-1 bg-rose-500/10 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-500/20"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
                      <p className="text-slate-600 dark:text-slate-400">
                        Choose an image from your device (JPG, PNG, WebP)
                      </p>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleFileChange}
                        className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Event Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Poster Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Sunday Miracle Service"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={formEventName}
                    onChange={(e) => setFormEventName(e.target.value)}
                    placeholder="e.g. Annual Revival Convention"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Category & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {POSTER_CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Language
                  </label>
                  <select
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {POSTER_LANGUAGES.filter(l => l !== 'All').map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date, Time, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={formEventDate}
                    onChange={(e) => setFormEventDate(e.target.value)}
                    placeholder="e.g. Sunday, Oct 25"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={formEventTime}
                    onChange={(e) => setFormEventTime(e.target.value)}
                    placeholder="e.g. 9:30 AM"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Main Sanctuary"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Speaker & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Speaker / Pastor Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formSpeaker}
                    onChange={(e) => setFormSpeaker(e.target.value)}
                    placeholder="e.g. Pastor John"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact / Social Info (Optional)
                  </label>
                  <input
                    type="text"
                    value={formContactInfo}
                    onChange={(e) => setFormContactInfo(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Bible Reference & Description */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Theme Bible Verse (Optional)
                  </label>
                  <input
                    type="text"
                    value={formBibleRef}
                    onChange={(e) => setFormBibleRef(e.target.value)}
                    placeholder="e.g. Psalm 122:1 or John 3:16"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Description / Main Announcement (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Additional event details, speaker bio, instructions..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading & Processing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Store Poster</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 6. Edit Poster Modal */}
      {activePosterForEdit && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-amber-500/30 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 my-auto text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="font-cinzel text-lg font-bold text-slate-900 dark:text-slate-100">
                Edit Poster Details
              </h2>
              <button onClick={() => setActivePosterForEdit(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    {POSTER_CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Language</label>
                  <select
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    {POSTER_LANGUAGES.filter(l => l !== 'All').map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="text"
                    value={formEventDate}
                    onChange={(e) => setFormEventDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={formEventTime}
                    onChange={(e) => setFormEventTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Speaker</label>
                  <input
                    type="text"
                    value={formSpeaker}
                    onChange={(e) => setFormSpeaker(e.target.value)}
                    placeholder="Speaker / Pastor name"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contact</label>
                  <input
                    type="text"
                    value={formContactInfo}
                    onChange={(e) => setFormContactInfo(e.target.value)}
                    placeholder="Phone or social"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActivePosterForEdit(null)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 7. Delete Confirmation Modal */}
      {posterToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-rose-500/40 max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-5 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-cinzel text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                Are you sure you want to delete this poster?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Poster "{posterToDelete.title || posterToDelete.event_name || 'Church Poster'}" will be permanently removed from website database and disk storage.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => setPosterToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Yes, Delete Poster'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
