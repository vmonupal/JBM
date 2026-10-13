'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Maximize, Minimize, ChevronLeft, ChevronRight, X, 
  ZoomIn, ZoomOut, RotateCcw, Search, Info, Sliders, 
  Calendar, Clock, MapPin, BookOpen, User, RefreshCw, 
  AlertTriangle, Layers, ArrowLeft, Download, Check
} from 'lucide-react';
import { Poster, PosterDisplaySettings, PosterFitMode, PosterBackground } from '@/lib/types';
import JbmBrandLogo from './JbmBrandLogo';

interface PosterProjectorProps {
  posters: Poster[];
  initialPosterId?: number;
  initialSettings?: PosterDisplaySettings;
}

export default function PosterProjector({
  posters,
  initialPosterId,
  initialSettings
}: PosterProjectorProps) {
  const router = useRouter();

  // Find index of starting poster
  const initialIndex = useMemo(() => {
    if (!posters || posters.length === 0) return 0;
    if (initialPosterId) {
      const idx = posters.findIndex(p => p.id === initialPosterId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  }, [posters, initialPosterId]);

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  // Display Settings
  const [fitMode, setFitMode] = useState<PosterFitMode>(initialSettings?.fit_mode || 'contain');
  const [background, setBackground] = useState<PosterBackground>(initialSettings?.background || 'black');
  const [customBgColor, setCustomBgColor] = useState<string>(initialSettings?.custom_bg_color || '#1e293b');
  const [zoom, setZoom] = useState<number>(1.0); // 1.0 = fit/100%
  const [showInfo, setShowInfo] = useState<boolean>(initialSettings?.show_poster_info ?? false);
  const [showLogo, setShowLogo] = useState<boolean>(initialSettings?.show_jbm_logo ?? true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  const [showSelectorDrawer, setShowSelectorDrawer] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Image loading / fallback state
  const [imageError, setImageError] = useState<boolean>(false);
  const [useFallbackUrl, setUseFallbackUrl] = useState<boolean>(false);
  const [retryKey, setRetryKey] = useState<number>(0);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [settingsSavedAlert, setSettingsSavedAlert] = useState<boolean>(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPoster = posters[currentIndex] || posters[0];

  // Derive optimal image URL (large optimized display image, or original)
  const currentImageUrl = useMemo(() => {
    if (!currentPoster) return '';
    if (useFallbackUrl) {
      return currentPoster.image_url;
    }
    return currentPoster.large_url || currentPoster.image_url;
  }, [currentPoster, useFallbackUrl]);

  // Reset errors and fallback on poster change
  useEffect(() => {
    setImageError(false);
    setUseFallbackUrl(false);
    setZoom(1.0);
  }, [currentIndex, retryKey]);

  // Handle Fullscreen state change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls after 3.5s of mouse inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        // Keep controls visible if a drawer or modal is open
        if (!showSettingsDrawer && !showSelectorDrawer) {
          setShowControls(false);
        }
      }, 3500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [showSettingsDrawer, showSelectorDrawer]);

  // Keyboard navigation & controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (showSelectorDrawer) setShowSelectorDrawer(false);
        else if (showSettingsDrawer) setShowSettingsDrawer(false);
        else if (zoom !== 1.0) setZoom(1.0);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        setZoom(1.0);
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setShowInfo(prev => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setShowSelectorDrawer(prev => !prev);
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setShowLogo(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, posters.length, showSelectorDrawer, showSettingsDrawer, zoom]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleNext = () => {
    if (posters.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % posters.length);
  };

  const handlePrev = () => {
    if (posters.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + posters.length) % posters.length);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(Number((prev + 0.25).toFixed(2)), 3.0));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(Number((prev - 0.25).toFixed(2)), 0.5));
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      const payload: PosterDisplaySettings = {
        fit_mode: fitMode,
        background: background,
        custom_bg_color: customBgColor,
        default_zoom: `${Math.round(zoom * 100)}%`,
        show_poster_info: showInfo,
        show_jbm_logo: showLogo,
        fullscreen_default: isFullscreen,
        remember_settings: true
      };

      const res = await fetch('/api/posters/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSettingsSavedAlert(true);
        setTimeout(() => setSettingsSavedAlert(false), 3000);
      }
    } catch (e) {
      console.error('Failed to save poster settings:', e);
    } finally {
      setSavingSettings(false);
    }
  };

  // Background styling
  const bgStyle = useMemo(() => {
    switch (background) {
      case 'black': return 'bg-black text-white';
      case 'dark': return 'bg-[#090d16] text-slate-100';
      case 'light': return 'bg-[#f8fafc] text-slate-900';
      case 'custom': return 'text-white';
      default: return 'bg-black text-white';
    }
  }, [background]);

  // Image Fit Classes and Styling
  const getImageContainerStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      transform: `scale(${zoom})`,
      transformOrigin: 'center center',
      transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)'
    };
    return base;
  };

  const getImageClasses = (): string => {
    // Preserve original aspect ratio at all costs! Never stretch!
    switch (fitMode) {
      case 'contain':
        // Show complete poster, never crop, centered horizontally and vertically
        return 'max-w-full max-h-full w-auto h-auto object-contain';
      case 'cover':
        // Fill entire screen, cropping allowed (labeled "May crop poster")
        return 'w-full h-full object-cover';
      case 'original':
        // Native pixel size, no scaling down or up
        return 'max-w-none max-h-none object-none';
      case 'fit-width':
        // Scale to available screen width, preserve aspect ratio
        return 'w-full h-auto object-contain';
      case 'fit-height':
        // Scale to available screen height, preserve aspect ratio
        return 'h-full w-auto object-contain';
      default:
        return 'max-w-full max-h-full w-auto h-auto object-contain';
    }
  };

  // Filtered posters for drawer
  const filteredPosters = useMemo(() => {
    if (!searchQuery.trim()) return posters;
    const q = searchQuery.toLowerCase();
    return posters.filter(p => 
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.event_name && p.event_name.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.bible_reference && p.bible_reference.toLowerCase().includes(q))
    );
  }, [posters, searchQuery]);

  if (!currentPoster) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 text-center text-white">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold font-cinzel">No Posters Available for Projection</h2>
        <p className="text-slate-400 mt-2 max-w-md text-sm">
          There are currently no active church posters in the system. Add a poster from the Gallery first.
        </p>
        <Link
          href="/posters"
          className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all"
        >
          Return to Poster Gallery
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 overflow-hidden select-none flex flex-col items-center justify-center ${bgStyle}`}
      style={background === 'custom' ? { backgroundColor: customBgColor } : undefined}
    >
      {/* 1. TOP HEADER OVERLAY (Auto-hiding) */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-gradient-to-b from-black/90 via-black/60 to-transparent p-4 sm:p-6 flex items-center justify-between backdrop-blur-xs">
          
          {/* Left: Back to Gallery + JBM Brand / Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/posters"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center space-x-1.5 text-xs font-semibold transition-all border border-white/10"
              title="Exit Projector to Gallery"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Projector</span>
            </Link>

            {/* JBM Logo branding overlay */}
            {showLogo && (
              <div className="flex items-center space-x-2 pl-2 border-l border-white/20">
                <JbmBrandLogo variant="projector" showSubtitle={false} />
              </div>
            )}

            {/* Poster Index indicator */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 text-xs text-slate-300">
              <span className="font-bold text-emerald-400">Poster {currentIndex + 1}</span>
              <span>/</span>
              <span>{posters.length}</span>
              {currentPoster.aspect_ratio && (
                <span className="ml-1.5 px-2 py-0.5 rounded-md bg-white/10 text-[10px] text-amber-300 font-mono">
                  {currentPoster.aspect_ratio}
                </span>
              )}
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center space-x-2">
            {/* Poster Selector Drawer Toggle */}
            <button
              onClick={() => {
                setShowSelectorDrawer(prev => !prev);
                setShowSettingsDrawer(false);
              }}
              className={`p-2.5 rounded-xl border backdrop-blur-md transition-all flex items-center space-x-1.5 text-xs font-semibold ${
                showSelectorDrawer
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
              }`}
              title="Select Poster (S)"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden lg:inline">Posters</span>
            </button>

            {/* Poster Info Toggle */}
            <button
              onClick={() => setShowInfo(prev => !prev)}
              className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
                showInfo
                  ? 'bg-amber-600 text-white border-amber-500'
                  : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
              }`}
              title="Show / Hide Poster Info (I)"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Display Settings Toggle */}
            <button
              onClick={() => {
                setShowSettingsDrawer(prev => !prev);
                setShowSelectorDrawer(false);
              }}
              className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
                showSettingsDrawer
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
              }`}
              title="Display & Projector Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-all"
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN POSTER DISPLAY CANVAS */}
      <div className="relative w-full h-full flex items-center justify-center p-0 overflow-hidden">
        {imageError ? (
          <div className="max-w-md p-8 rounded-3xl bg-slate-900/90 border border-rose-500/30 text-center space-y-4 backdrop-blur-md shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">Poster image could not be loaded.</h3>
            <p className="text-xs text-slate-400">
              The requested poster file could not be rendered from the media server.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setImageError(false);
                  setRetryKey(k => k + 1);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              {!useFallbackUrl && currentPoster.image_url && (
                <button
                  onClick={() => {
                    setUseFallbackUrl(true);
                    setImageError(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <span>Load Original</span>
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Next Poster
              </button>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={getImageContainerStyle()}
          >
            <img
              key={`${currentPoster.id}-${retryKey}-${useFallbackUrl}`}
              src={currentImageUrl}
              alt={currentPoster.title || 'Church Poster'}
              className={`${getImageClasses()} transition-opacity duration-300 drop-shadow-2xl`}
              onError={() => {
                if (!useFallbackUrl && currentPoster.image_url && currentPoster.large_url) {
                  // Attempt automatic fallback to original image
                  setUseFallbackUrl(true);
                } else {
                  setImageError(true);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* 3. POSTER INFORMATION FLOATING OVERLAY (When enabled) */}
      {showInfo && !imageError && (
        <div className="absolute bottom-20 left-6 max-w-md z-30 pointer-events-none animate-fade-in">
          <div className="p-5 rounded-2xl bg-black/85 border border-white/15 text-white shadow-2xl backdrop-blur-md space-y-2 pointer-events-auto">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {currentPoster.category}
              </span>
              {currentPoster.language && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentPoster.language}
                </span>
              )}
            </div>
            
            <h2 className="font-cinzel text-base sm:text-lg font-bold text-white line-clamp-2">
              {currentPoster.title || currentPoster.event_name}
            </h2>

            {(currentPoster.event_date || currentPoster.event_time) && (
              <p className="text-xs text-amber-300 flex items-center space-x-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{currentPoster.event_date} {currentPoster.event_time ? `• ${currentPoster.event_time}` : ''}</span>
              </p>
            )}

            {currentPoster.location && (
              <p className="text-xs text-slate-300 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>{currentPoster.location}</span>
              </p>
            )}

            {currentPoster.speaker && (
              <p className="text-xs text-emerald-300 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Speaker: {currentPoster.speaker}</span>
              </p>
            )}

            {currentPoster.bible_reference && (
              <p className="text-xs text-emerald-400 font-semibold italic flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>{currentPoster.bible_reference}</span>
              </p>
            )}

            {currentPoster.description && (
              <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed pt-1 border-t border-white/10">
                {currentPoster.description}
              </p>
            )}

            {/* Poster Resolution Specs */}
            {(currentPoster.width || currentPoster.aspect_ratio) && (
              <div className="pt-1.5 text-[10px] text-slate-500 font-mono flex items-center space-x-2 border-t border-white/10">
                {currentPoster.width && <span>{currentPoster.width} × {currentPoster.height} px</span>}
                {currentPoster.aspect_ratio && <span>• {currentPoster.aspect_ratio}</span>}
                {currentPoster.file_size && <span>• {currentPoster.file_size}</span>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. PREV / NEXT NAV BUTTONS (Floating Left / Right) */}
      <button
        onClick={handlePrev}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/60 hover:bg-black/90 text-white border border-white/15 backdrop-blur-md transition-all shadow-xl hover:scale-105 active:scale-95 ${
          showControls ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'
        }`}
        title="Previous Poster (Left Arrow)"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      <button
        onClick={handleNext}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/60 hover:bg-black/90 text-white border border-white/15 backdrop-blur-md transition-all shadow-xl hover:scale-105 active:scale-95 ${
          showControls ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'
        }`}
        title="Next Poster (Right Arrow)"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* 5. BOTTOM BAR CONTROLS (Auto-hiding) */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex items-center justify-between backdrop-blur-xs">
          
          {/* Left: Fit Mode Selector */}
          <div className="flex items-center space-x-1.5 bg-black/60 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
            <span className="text-[11px] text-slate-400 font-bold px-2 hidden sm:inline">FIT:</span>
            {(['contain', 'cover', 'original', 'fit-width', 'fit-height'] as PosterFitMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setFitMode(mode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  fitMode === mode
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
                title={mode === 'cover' ? 'Cover Screen (May crop poster edges)' : `Fit: ${mode}`}
              >
                {mode === 'contain' ? 'Contain' :
                 mode === 'cover' ? 'Cover (Crop)' :
                 mode === 'original' ? 'Native' :
                 mode === 'fit-width' ? 'Fit W' : 'Fit H'}
              </button>
            ))}
          </div>

          {/* Center: Zoom Controls */}
          <div className="flex items-center space-x-1.5 bg-black/60 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setZoom(1.0)}
              className="px-2 py-1 text-xs font-mono font-bold text-emerald-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              title="Reset Zoom (0)"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {zoom !== 1.0 && (
              <button
                onClick={() => setZoom(1.0)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/10 transition-colors ml-1"
                title="Reset Zoom to Fit"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right: Background quick switch + Download */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-1 bg-black/60 p-1.5 rounded-xl border border-white/10">
              <span className="text-[11px] text-slate-400 font-bold px-1.5">BG:</span>
              {(['black', 'dark', 'light'] as PosterBackground[]).map(bg => (
                <button
                  key={bg}
                  onClick={() => setBackground(bg)}
                  className={`w-6 h-6 rounded-md border text-[10px] font-bold capitalize transition-all ${
                    background === bg ? 'ring-2 ring-emerald-500 scale-105' : 'opacity-70 hover:opacity-100'
                  } ${
                    bg === 'black' ? 'bg-black border-slate-700' :
                    bg === 'dark' ? 'bg-[#0f172a] border-slate-600' :
                    'bg-slate-100 text-slate-900 border-slate-300'
                  }`}
                  title={`Background: ${bg}`}
                />
              ))}
            </div>

            <a
              href={currentPoster.image_url}
              download={`jbm-poster-${currentPoster.id}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md flex items-center space-x-1.5 text-xs font-semibold transition-all"
              title="Download Original High-Res Poster"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>

        </div>
      </div>

      {/* 6. DRAWER: POSTER SELECTOR & SEARCH */}
      {showSelectorDrawer && (
        <div className="absolute top-0 right-0 bottom-0 w-full sm:w-96 z-40 bg-slate-950/95 border-l border-white/15 backdrop-blur-xl flex flex-col shadow-2xl animate-fade-in text-white">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm font-cinzel">Select Poster</h3>
              <span className="text-xs text-slate-400 font-mono">({posters.length})</span>
            </div>
            <button
              onClick={() => setShowSelectorDrawer(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Posters */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search posters..."
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Poster List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredPosters.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-8">No matching posters found</p>
            ) : (
              filteredPosters.map((p, idx) => {
                const globalIndex = posters.findIndex(item => item.id === p.id);
                const isSelected = globalIndex === currentIndex;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setCurrentIndex(globalIndex);
                      setShowSelectorDrawer(false);
                    }}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 ${
                      isSelected
                        ? 'bg-emerald-950/50 border-emerald-500 ring-1 ring-emerald-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-xl bg-black overflow-hidden shrink-0 flex items-center justify-center border border-white/10">
                      <img
                        src={p.thumbnail_url || p.image_url}
                        alt={p.title || 'Thumbnail'}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-white truncate">
                        {p.title || p.event_name || 'Church Poster'}
                      </h4>
                      <p className="text-[11px] text-emerald-400 truncate">{p.category}</p>
                      {p.event_date && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          📅 {p.event_date}
                        </p>
                      )}
                      {p.aspect_ratio && (
                        <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-amber-300">
                          {p.aspect_ratio}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 7. DRAWER: PROJECTOR & DISPLAY SETTINGS */}
      {showSettingsDrawer && (
        <div className="absolute top-0 right-0 bottom-0 w-full sm:w-96 z-40 bg-slate-950/95 border-l border-white/15 backdrop-blur-xl flex flex-col shadow-2xl animate-fade-in text-white">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm font-cinzel">Poster Projector Settings</h3>
            </div>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
            
            {/* Image Fit Mode */}
            <div className="space-y-2">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Image Fit Mode
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'contain', label: 'Contain (Recommended)', desc: 'Show complete poster, no cropping, centered with black space' },
                  { id: 'cover', label: 'Cover Screen', desc: 'Fill entire display. May crop poster edges.' },
                  { id: 'original', label: 'Native / Original', desc: 'Display at actual pixel dimensions without scaling' },
                  { id: 'fit-width', label: 'Fit Width', desc: 'Scale to screen width while maintaining aspect ratio' },
                  { id: 'fit-height', label: 'Fit Height', desc: 'Scale to screen height while maintaining aspect ratio' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setFitMode(opt.id as PosterFitMode)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                      fitMode === opt.id
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt.label}</span>
                      {fitMode === opt.id && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-normal">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Projector Background
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'black', label: 'Black (Default)' },
                  { id: 'dark', label: 'Dark Navy' },
                  { id: 'light', label: 'Light' },
                  { id: 'custom', label: 'Custom Color' }
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBackground(b.id as PosterBackground)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      background === b.id
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              {background === 'custom' && (
                <div className="pt-2 flex items-center space-x-2">
                  <input
                    type="color"
                    value={customBgColor}
                    onChange={e => setCustomBgColor(e.target.value)}
                    className="w-10 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customBgColor}
                    onChange={e => setCustomBgColor(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-mono"
                    placeholder="#1e293b"
                  />
                </div>
              )}
            </div>

            {/* Overlay Toggles */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Overlays & Visibility
              </label>
              
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span>Show JBM Logo Branding</span>
                <input
                  type="checkbox"
                  checked={showLogo}
                  onChange={e => setShowLogo(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span>Show Poster Information</span>
                <input
                  type="checkbox"
                  checked={showInfo}
                  onChange={e => setShowInfo(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </div>
            </div>

            {/* Persistent Save Button for Authorized Users / Admins */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg"
              >
                {savingSettings ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Settings...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save as Default Projector Settings</span>
                  </>
                )}
              </button>

              {settingsSavedAlert && (
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-semibold text-[11px] animate-fade-in">
                  ✓ Display settings saved persistently!
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
