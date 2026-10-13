'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteSettings } from '@/lib/types';

export const DEFAULT_BRANDING: SiteSettings = {
  website_name: 'JBM',
  church_display_name: 'JBM',
  website_title: 'JBM',
  website_description: 'JBM - Holy Bible in Telugu and English, sacred worship hymns, church posters, and live sanctuary presentation projector mode.',
  tagline: '',
  logo_url: '',
  use_text_logo: true,
  show_logo_header: true,
  show_logo_projector_bible: true,
  show_logo_projector_song: true,
  show_logo_footer: true,
  custom_domain: 'jbm.org'
};

const STORAGE_KEY = 'jbm_site_branding';

interface BrandingContextValue {
  branding: SiteSettings;
  updateBrandingState: (newSettings: Partial<SiteSettings>) => void;
  refreshBranding: () => Promise<void>;
  isLoaded: boolean;
}

const BrandingContext = createContext<BrandingContextValue>({
  branding: DEFAULT_BRANDING,
  updateBrandingState: () => {},
  refreshBranding: async () => {},
  isLoaded: false
});

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<SiteSettings>(DEFAULT_BRANDING);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshBranding = useCallback(async () => {
    try {
      const res = await fetch('/api/site-settings', { cache: 'no-store' });
      if (res.ok) {
        const data: SiteSettings = await res.json();
        setBranding(prev => ({
          ...prev,
          ...data,
          website_name: 'JBM',
          church_display_name: data.church_display_name && !data.church_display_name.includes('Ministr') && !data.church_display_name.includes('Church') ? data.church_display_name : 'JBM',
          website_title: 'JBM'
        }));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
      }
    } catch (e) {
      console.warn('Could not refresh branding from API, using default branding');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setBranding({
          ...DEFAULT_BRANDING,
          ...parsed,
          website_name: 'JBM',
          church_display_name: 'JBM',
          website_title: 'JBM'
        });
      }
    } catch (e) {}

    refreshBranding();
  }, [refreshBranding]);

  // Keep browser tab title clean: "JBM" or "<Page> | JBM"
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (!document.title || document.title.includes('Ministr') || document.title.includes('Revival')) {
        document.title = 'JBM';
      }
    }
  }, []);

  const updateBrandingState = useCallback((newSettings: Partial<SiteSettings>) => {
    setBranding(prev => {
      const merged = { ...prev, ...newSettings, website_name: 'JBM' };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch (e) {}
      return merged;
    });
  }, []);

  return (
    <BrandingContext.Provider
      value={{
        branding,
        updateBrandingState,
        refreshBranding,
        isLoaded
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
