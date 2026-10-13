'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tv, Search, Menu, X, Sparkles, Settings as SettingsIcon } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LiveClock from './LiveClock';
import { useSettings } from '@/context/SettingsContext';
import { useBranding } from '@/context/BrandingContext';
import JbmBrandLogo from './JbmBrandLogo';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openSettings } = useSettings();
  const { branding } = useBranding();

  // Navigation Links including dedicated POSTERS and POSTER PROJECTOR
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/bible', label: 'Bible' },
    { href: '/songs', label: 'Songs' },
    { href: '/posters', label: 'Posters' },
    { href: '/bible/projector', label: 'Bible Projector' },
    { href: '/songs/projector', label: 'Song Projector' },
    { href: '/posters/projector', label: 'Poster Projector' },
    { href: '/#daily-verse', label: 'Daily Verse' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-amber-500/20 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: JBM Brand & Subtitle */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <JbmBrandLogo variant="header" showSubtitle={true} />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isDailyVerse = link.href.includes('#daily-verse');
              const isActive = !isDailyVerse && (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10'
                      : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions, Live Date/Time & Official Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Live Date and Time */}
            <div className="hidden md:flex flex-col text-right text-xs">
              <LiveClock stacked showSeconds={false} className="text-slate-600 dark:text-slate-300" />
            </div>

            {/* Quick Bible Search */}
            <Link
              href="/bible/search"
              title="Search Bible"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition-all"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Dark/Light Mode Toggle */}
            <ThemeToggle />

            {/* Centralized SETTINGS Icon Button */}
            <button
              type="button"
              onClick={() => openSettings()}
              title="Open Website & Bible Settings"
              className="p-2 rounded-xl border border-amber-500/30 hover:border-amber-500 bg-amber-50/50 dark:bg-slate-800/80 text-amber-700 dark:text-amber-300 hover:scale-105 transition-all shadow-xs flex items-center space-x-1"
              aria-label="Open Settings"
            >
              <SettingsIcon className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 pr-1">Settings</span>
            </button>

            {/* OWNER CONFIGURABLE CHURCH LOGO (TOP-RIGHT CORNER) */}
            {branding.show_logo_header && !branding.use_text_logo && Boolean(branding.logo_url) && (
              <Link
                href="/"
                title={`${branding.website_name} Official Logo`}
                className="hidden sm:flex items-center justify-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 shadow-xs hover:shadow-md transition-all hover:scale-105 ml-1"
              >
                <img
                  src={branding.logo_url}
                  alt={`${branding.website_name} Official Logo`}
                  className="h-10 sm:h-12 w-auto object-contain rounded-md"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-amber-500/15 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
          
          {/* Live Clock on mobile */}
          <div className="px-3 py-2 text-xs border-b border-slate-200 dark:border-slate-800 mb-2 text-slate-600 dark:text-slate-400">
            <LiveClock showSeconds={true} />
          </div>

          {navLinks.map((link) => {
            const isDailyVerse = link.href.includes('#daily-verse');
            const isActive = !isDailyVerse && (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openSettings();
              }}
              className="flex items-center justify-center space-x-2 py-2.5 bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold text-sm rounded-lg"
            >
              <SettingsIcon className="w-4 h-4 text-amber-500" />
              <span>Website & Bible Settings</span>
            </button>
            <Link
              href="/bible/projector"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 py-2.5 bg-slate-900 text-amber-300 font-semibold text-sm rounded-lg"
            >
              <Tv className="w-4 h-4 text-amber-400" />
              <span>Launch Bible Projector</span>
            </Link>
            <Link
              href="/songs/projector"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 py-2.5 bg-amber-500 text-slate-950 font-bold text-sm rounded-lg"
            >
              <Tv className="w-4 h-4 text-slate-950" />
              <span>Launch Song Projector</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
