'use client';

import React, { useState } from 'react';
import { useBranding } from '@/context/BrandingContext';

interface JbmBrandLogoProps {
  variant?: 'header' | 'footer' | 'projector' | 'hero' | 'inline' | 'compact';
  showSubtitle?: boolean;
  className?: string;
  forceTextOnly?: boolean;
  customLogoUrl?: string;
}

export default function JbmBrandLogo({
  variant = 'header',
  showSubtitle = true,
  className = '',
  forceTextOnly = false,
  customLogoUrl
}: JbmBrandLogoProps) {
  const { branding } = useBranding();
  const [imageError, setImageError] = useState(false);

  // Check location-specific toggles
  const showLogoInThisLocation = (() => {
    if (variant === 'header') return branding.show_logo_header ?? true;
    if (variant === 'projector') return (branding.show_logo_projector_bible || branding.show_logo_projector_song) ?? true;
    if (variant === 'footer') return branding.show_logo_footer ?? true;
    return true;
  })();

  const brandName = 'JBM';
  const activeLogoUrl = customLogoUrl !== undefined ? customLogoUrl : branding.logo_url;
  const hasCustomLogo = !forceTextOnly && !branding.use_text_logo && !imageError && Boolean(activeLogoUrl && activeLogoUrl.trim());

  // Size styling based on variant (Never stretch, distort, or modify aspect ratio)
  const logoHeight = (() => {
    switch (variant) {
      case 'hero': return 'h-16 sm:h-20';
      case 'projector': return 'h-10 sm:h-12';
      case 'footer': return 'h-10 sm:h-12';
      case 'compact': return 'h-7 sm:h-8';
      default: return 'h-9 sm:h-11';
    }
  })();

  // 1. If custom logo is active and enabled for this location
  if (hasCustomLogo && showLogoInThisLocation) {
    return (
      <div className={`flex items-center space-x-2.5 sm:space-x-3 ${className}`}>
        <div className="flex items-center justify-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 shadow-xs hover:shadow-md transition-all shrink-0">
          <img
            src={activeLogoUrl}
            alt={brandName}
            className={`${logoHeight} w-auto max-w-[140px] sm:max-w-[200px] object-contain rounded-md`}
            onError={() => setImageError(true)}
          />
        </div>
        {showSubtitle && variant !== 'compact' && (
          <div className="flex items-center text-left">
            <span className="font-cinzel font-black tracking-widest text-lg sm:text-2xl text-slate-900 dark:text-amber-100 uppercase">
              {brandName}
            </span>
          </div>
        )}
      </div>
    );
  }

  // 2. Official "JBM" Wordmark & Emblem Badge (Clean Text Fallback & Modern Identity)
  return (
    <div className={`flex items-center space-x-2 sm:space-x-2.5 group ${className}`}>
      {/* Modern JBM Monogram Emblem */}
      <div 
        className={`relative flex items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-black shadow-md shadow-amber-500/20 border border-amber-400/50 group-hover:scale-105 transition-transform shrink-0 ${
          variant === 'hero' ? 'w-14 h-14 sm:w-16 sm:h-16 text-2xl sm:text-3xl' :
          variant === 'projector' ? 'w-10 h-10 sm:w-11 sm:h-11 text-base sm:text-lg' :
          variant === 'compact' ? 'w-7 h-7 text-xs' :
          'w-9 h-9 sm:w-10 sm:h-10 text-sm sm:text-base'
        }`}
      >
        <span className="font-cinzel font-black tracking-wider text-white drop-shadow-xs">
          {brandName}
        </span>
      </div>

      {/* Brand Name Text: Exactly "JBM" */}
      {showSubtitle && (
        <div className="flex items-center text-left">
          <span className="font-cinzel font-black tracking-widest text-lg sm:text-2xl text-slate-900 dark:text-amber-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors uppercase">
            {brandName}
          </span>
        </div>
      )}
    </div>
  );
}
