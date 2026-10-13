'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Globe, Image as ImageIcon, Check, 
  AlertTriangle, ArrowLeft, RefreshCw, LogOut, KeyRound, Sparkles,
  Upload, Trash2, Type, RotateCcw, CheckCircle2, Sliders, Info
} from 'lucide-react';
import { SiteSettings, PosterDisplaySettings, PosterFitMode, PosterBackground } from '@/lib/types';
import JbmBrandLogo from '@/components/JbmBrandLogo';
import { useBranding } from '@/context/BrandingContext';

export default function OwnerSettingsPage() {
  const { refreshBranding } = useBranding();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Settings form
  const [settings, setSettings] = useState<SiteSettings>({
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
  });
  const [newPasskey, setNewPasskey] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Section 11: Poster Display Settings
  const [posterSettings, setPosterSettings] = useState<PosterDisplaySettings>({
    fit_mode: 'contain',
    background: 'black',
    custom_bg_color: '#1e293b',
    default_zoom: '100%',
    show_poster_info: false,
    show_jbm_logo: true,
    fullscreen_default: false,
    remember_settings: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check auth on load
  const checkStatus = async () => {
    try {
      const res = await fetch('/api/owner/status');
      const data = await res.json();
      setAuthenticated(!!data.authenticated);
      if (data.authenticated) {
        loadSettings();
      }
    } catch (e) {
      setAuthenticated(false);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/owner/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          ...data,
          use_text_logo: data.use_text_logo ?? !data.logo_url,
          show_logo_header: data.show_logo_header ?? true,
          show_logo_projector_bible: data.show_logo_projector_bible ?? true,
          show_logo_projector_song: data.show_logo_projector_song ?? true,
          show_logo_footer: data.show_logo_footer ?? true,
        });
      }
      // Load poster display settings
      try {
        const pRes = await fetch('/api/posters/settings');
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.settings) {
            setPosterSettings(pData.settings);
          }
        }
      } catch (err) {}
    } catch (e) {}
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAuth(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/owner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkeyInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthenticated(true);
        setPasskeyInput('');
        loadSettings();
      } else {
        setAuthError(data.error || 'Invalid master passkey');
      }
    } catch (e) {
      setAuthError('Connection error while authenticating');
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/owner/logout', { method: 'POST' });
    setAuthenticated(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const payload: any = { ...settings };
      if (newPasskey.trim()) {
        payload.new_passkey = newPasskey.trim();
      }

      const res = await fetch('/api/owner/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSettings(data.settings);
        setNewPasskey('');
        
        // Also persist poster settings
        try {
          await fetch('/api/posters/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(posterSettings)
          });
        } catch (err) {}

        await refreshBranding();
        setSuccessMsg('Branding & Website Settings successfully updated across the entire site!');
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        setErrorMsg(data.error || 'Failed to update settings');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  // Logo file upload handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('logo', file);

      const res = await fetch('/api/owner/upload-logo', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSettings(prev => ({
          ...prev,
          logo_url: data.logo_url,
          use_text_logo: false
        }));
        setSuccessMsg('Logo uploaded successfully! Click "Save Owner Settings" to apply changes.');
      } else {
        setErrorMsg(data.error || 'Failed to upload logo image');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading logo image');
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Reset branding to JBM defaults
  const handleResetBranding = async () => {
    setResetting(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/owner/reset-branding', {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
        await refreshBranding();
        setShowResetConfirm(false);
        setSuccessMsg('Branding successfully reset to default JBM values!');
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        setErrorMsg(data.error || 'Failed to reset branding');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error resetting branding');
    } finally {
      setResetting(false);
    }
  };

  if (authenticated === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Passkey Login Gate
  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-cinzel text-2xl font-black text-slate-900 dark:text-slate-100">
              Owner Master Access
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Public visitors can freely browse Bible, songs, and posters. Website name, branding, logo, and domain settings are restricted strictly to the sanctuary owner.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center space-x-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Enter Master Passkey
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Master passkey (default: revival2026)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loadingAuth ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unlock Owner Settings</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2">
            <Link href="/" className="text-xs text-slate-400 hover:text-amber-500 transition-colors inline-flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Sanctuary</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // Authenticated Owner Settings Panel
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Owner Master Authorized</span>
          </div>
          <h1 className="font-cinzel text-3xl font-black text-slate-900 dark:text-slate-100">
            JBM Website Branding & Identity
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure website name, logo options, projector visibility, and domain settings.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2 border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="Reset Branding to default JBM settings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Branding</span>
          </button>
          <Link
            href="/"
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-amber-500 transition-colors"
          >
            Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-600 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2 animate-fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2 animate-fade-in shadow-xs">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Website & Church Branding */}
        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-cinzel text-lg font-bold text-slate-900 dark:text-slate-100">
                Church & Website Identity
              </h2>
              <p className="text-xs text-slate-500">
                Change the visible brand across all navigation bars, headers, and footers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Website Name (Primary Brand)
              </label>
              <input
                type="text"
                value={settings.website_name}
                onChange={(e) => setSettings({ ...settings, website_name: e.target.value })}
                placeholder="JBM"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Displays on header brand, mobile nav & copyright notices.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Church Display Name
              </label>
              <input
                type="text"
                value={settings.church_display_name}
                onChange={(e) => setSettings({ ...settings, church_display_name: e.target.value })}
                placeholder="JBM"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Church display name (default: JBM).</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="Holy Bible & Sacred Worship"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Optional tagline or leave empty.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Browser Page Title
              </label>
              <input
                type="text"
                value={settings.website_title}
                onChange={(e) => setSettings({ ...settings, website_title: e.target.value })}
                placeholder="JBM"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Appears in browser tabs and bookmarks.</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Website Description
              </label>
              <textarea
                rows={2}
                value={settings.website_description}
                onChange={(e) => setSettings({ ...settings, website_description: e.target.value })}
                placeholder="Public Bilingual Scripture, Worship Hymns, Posters & Sanctuary Projector"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Logo Controls & Visual Identity */}
        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-cinzel text-lg font-bold text-slate-900 dark:text-slate-100">
                Logo Controls & Brand Options
              </h2>
              <p className="text-xs text-slate-500">
                Upload a custom logo, replace it, remove it, or use the clean JBM wordmark badge.
              </p>
            </div>
          </div>

          {/* Logo Actions and Live Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            <div className="md:col-span-2 space-y-4">
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {uploadingLogo ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{settings.logo_url ? 'Replace Logo' : 'Upload Logo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSettings({ ...settings, use_text_logo: true });
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition flex items-center gap-1.5 ${
                    settings.use_text_logo
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-500'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span>Use JBM Text Instead</span>
                </button>

                {settings.logo_url && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setSettings({ ...settings, use_text_logo: false });
                      }}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition flex items-center gap-1.5 ${
                        !settings.use_text_logo
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Use Uploaded Logo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSettings({
                          ...settings,
                          logo_url: '',
                          use_text_logo: true
                        });
                      }}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30 transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Logo</span>
                    </button>
                  </>
                )}
              </div>

              {/* Logo URL input field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Logo Image URL / Path (Optional)
                </label>
                <input
                  type="text"
                  value={settings.logo_url || ''}
                  onChange={(e) => setSettings({ ...settings, logo_url: e.target.value, use_text_logo: !e.target.value })}
                  placeholder="/images/revival-chapel-logo.jpg or upload above"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-slate-400">
                  When empty or removed, the modern JBM emblem badge is automatically displayed without broken image links.
                </p>
              </div>

              {/* Status Notice */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <Info className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  Active rendering mode: <strong className="text-amber-500">{settings.use_text_logo || !settings.logo_url ? 'Modern JBM Badge (No Image)' : 'Custom Logo Image'}</strong>
                </span>
              </div>

            </div>

            {/* Live Logo Preview Box */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-amber-500/30 space-y-3">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                Active Live Preview
              </span>

              <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-center">
                <JbmBrandLogo 
                  variant="header" 
                  showSubtitle={true}
                  customLogoUrl={settings.use_text_logo ? '' : settings.logo_url}
                  forceTextOnly={settings.use_text_logo}
                />
              </div>

              <span className="text-[10px] text-slate-400 text-center">
                This exact emblem will appear across headers and projectors.
              </span>
            </div>

          </div>

          {/* Granular Location Toggles */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>Logo Display Locations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-amber-500/50 transition">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Show in Main Header</span>
                <input
                  type="checkbox"
                  checked={settings.show_logo_header}
                  onChange={(e) => setSettings({ ...settings, show_logo_header: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-amber-500/50 transition">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Show in Bible Projector</span>
                <input
                  type="checkbox"
                  checked={settings.show_logo_projector_bible}
                  onChange={(e) => setSettings({ ...settings, show_logo_projector_bible: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-amber-500/50 transition">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Show in Song Projector</span>
                <input
                  type="checkbox"
                  checked={settings.show_logo_projector_song}
                  onChange={(e) => setSettings({ ...settings, show_logo_projector_song: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-amber-500/50 transition">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Show in Footer</span>
                <input
                  type="checkbox"
                  checked={settings.show_logo_footer}
                  onChange={(e) => setSettings({ ...settings, show_logo_footer: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Section: Poster Display Settings (Section 11) */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-slate-900 dark:text-slate-100">
                Poster Display & Projector Settings
              </h2>
              <p className="text-xs text-slate-500">
                Persistent controls for laptop/sanctuary projector canvas, fit modes, backgrounds, and overlays.
              </p>
            </div>
          </div>

          <div className="space-y-6 text-xs">
            {/* Poster Fit Mode */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Poster Fit Mode (Projector Default)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {[
                  { id: 'contain', label: 'Contain', desc: 'No cropping (Default)' },
                  { id: 'cover', label: 'Cover', desc: 'May crop edges' },
                  { id: 'original', label: 'Original', desc: 'Native resolution' },
                  { id: 'fit-width', label: 'Fit Width', desc: 'Scale to width' },
                  { id: 'fit-height', label: 'Fit Height', desc: 'Scale to height' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPosterSettings({ ...posterSettings, fit_mode: opt.id as PosterFitMode })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      posterSettings.fit_mode === opt.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                    }`}
                  >
                    <div className="font-bold">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Projector Background */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Projector Background
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'black', label: 'Black (Default)' },
                  { id: 'dark', label: 'Dark Navy' },
                  { id: 'light', label: 'Light' },
                  { id: 'custom', label: 'Custom' }
                ].map(bg => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setPosterSettings({ ...posterSettings, background: bg.id as PosterBackground })}
                    className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                      posterSettings.background === bg.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
              {posterSettings.background === 'custom' && (
                <div className="pt-2 flex items-center space-x-2">
                  <input
                    type="color"
                    value={posterSettings.custom_bg_color || '#1e293b'}
                    onChange={(e) => setPosterSettings({ ...posterSettings, custom_bg_color: e.target.value })}
                    className="w-10 h-9 rounded border border-slate-300 dark:border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={posterSettings.custom_bg_color || '#1e293b'}
                    onChange={(e) => setPosterSettings({ ...posterSettings, custom_bg_color: e.target.value })}
                    className="w-36 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                    placeholder="#1e293b"
                  />
                </div>
              )}
            </div>

            {/* Default Zoom */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Default Zoom
              </label>
              <div className="flex flex-wrap gap-2">
                {['Fit Screen', '75%', '100%', '125%', '150%'].map(zoom => (
                  <button
                    key={zoom}
                    type="button"
                    onClick={() => setPosterSettings({ ...posterSettings, default_zoom: zoom })}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                      posterSettings.default_zoom === zoom
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {zoom}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-emerald-500 transition">
                <span className="font-bold text-slate-800 dark:text-slate-200">Show Poster Information</span>
                <input
                  type="checkbox"
                  checked={posterSettings.show_poster_info}
                  onChange={(e) => setPosterSettings({ ...posterSettings, show_poster_info: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-emerald-500 transition">
                <span className="font-bold text-slate-800 dark:text-slate-200">Show JBM Logo in Projector</span>
                <input
                  type="checkbox"
                  checked={posterSettings.show_jbm_logo}
                  onChange={(e) => setPosterSettings({ ...posterSettings, show_jbm_logo: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-emerald-500 transition">
                <span className="font-bold text-slate-800 dark:text-slate-200">Auto-Fullscreen on Projector Open</span>
                <input
                  type="checkbox"
                  checked={posterSettings.fullscreen_default}
                  onChange={(e) => setPosterSettings({ ...posterSettings, fullscreen_default: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-emerald-500 transition">
                <span className="font-bold text-slate-800 dark:text-slate-200">Remember Last Settings</span>
                <input
                  type="checkbox"
                  checked={posterSettings.remember_settings}
                  onChange={(e) => setPosterSettings({ ...posterSettings, remember_settings: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>
            </div>

          </div>
        </div>

        {/* Section 3: Domain & Hosting URL Settings */}
        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Globe className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-cinzel text-lg font-bold text-slate-900 dark:text-slate-100">
                Custom Domain & Hosting Architecture
              </h2>
              <p className="text-xs text-slate-500">
                Public internet address configuration and DNS guidance.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Sanctuary Custom Domain Name
              </label>
              <input
                type="text"
                value={settings.custom_domain}
                onChange={(e) => setSettings({ ...settings, custom_domain: e.target.value })}
                placeholder="jbmministries.org"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/40 text-slate-700 dark:text-slate-300 text-xs space-y-2">
              <div className="flex items-center space-x-2 font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Important Domain Registrar & DNS Guidance</span>
              </div>
              <p className="leading-relaxed">
                Entering a custom domain above sets the application's canonical URL and link generators. However, <strong>actual internet domain routing must be connected through your Domain Registrar</strong> (e.g. Cloudflare, Namecheap, GoDaddy):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>CNAME Record:</strong> Set <code>www</code> pointing to your deployment alias or tunnel.
                </li>
                <li>
                  <strong>A Record:</strong> Set root domain (<code>@</code>) to the host IP address.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Change Master Passkey */}
        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <KeyRound className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-cinzel text-lg font-bold text-slate-900 dark:text-slate-100">
                Owner Passkey Protection
              </h2>
              <p className="text-xs text-slate-500">
                Update the server-side passkey used to unlock this owner control panel.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              New Master Passkey (Leave blank to keep current)
            </label>
            <input
              type="password"
              value={newPasskey}
              onChange={(e) => setNewPasskey(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full sm:w-1/2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/"
            className="px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-amber-500 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white font-black text-sm rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Owner Settings</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Confirmation Modal: Reset Branding */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <RotateCcw className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-cinzel text-xl font-black text-slate-900 dark:text-slate-100">
                Reset Branding to JBM Defaults?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will reset the website name, tagline, description, and logo settings back to clean default JBM values.
              </p>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-400 font-semibold">
                ✓ Your Bible data, songs, posters, and user preferences will NOT be deleted or affected.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetBranding}
                disabled={resetting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                {resetting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4" />
                )}
                <span>Yes, Reset Branding</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
