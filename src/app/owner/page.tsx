'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Globe, Image as ImageIcon, Check, 
  AlertTriangle, ArrowLeft, RefreshCw, LogOut, KeyRound, Sparkles
} from 'lucide-react';
import { SiteSettings } from '@/lib/types';

export default function OwnerSettingsPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Settings form
  const [settings, setSettings] = useState<SiteSettings>({
    website_name: '',
    church_display_name: '',
    website_title: '',
    website_description: '',
    logo_url: '',
    custom_domain: ''
  });
  const [newPasskey, setNewPasskey] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        setSettings(data);
      }
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
        setSuccessMsg('Branding & Website Settings successfully updated!');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to update settings');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error saving settings');
    } finally {
      setSaving(false);
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
              Public visitors can freely browse Bible and worship songs. Website name, branding, and domain settings are restricted strictly to the sanctuary owner.
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
            Website Branding & Owner Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure church name, branding, logo, page titles, and domain settings.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-amber-500 transition-colors"
          >
            View Public Site
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
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2 animate-fade-in shadow-xs">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
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
                Website Name
              </label>
              <input
                type="text"
                value={settings.website_name}
                onChange={(e) => setSettings({ ...settings, website_name: e.target.value })}
                placeholder="Revival Chapel"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Displays on header brand & copyright notices.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Church Display Name
              </label>
              <input
                type="text"
                value={settings.church_display_name}
                onChange={(e) => setSettings({ ...settings, church_display_name: e.target.value })}
                placeholder="Revival Chapel Sanctuary"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Full ceremonial sanctuary fellowship name.</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Browser Page Title
              </label>
              <input
                type="text"
                value={settings.website_title}
                onChange={(e) => setSettings({ ...settings, website_title: e.target.value })}
                placeholder="Revival Chapel - Public Bible & Worship Song Library"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Appears in browser tabs and search engine bookmarks.</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Website Description
              </label>
              <textarea
                rows={2}
                value={settings.website_description}
                onChange={(e) => setSettings({ ...settings, website_description: e.target.value })}
                placeholder="Public Bilingual Scripture, Worship Hymns, and Projector Sanctuary"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Logo & Branding Assets */}
        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-cinzel text-lg font-bold text-slate-900 dark:text-slate-100">
                Official Logo & Visual Branding
              </h2>
              <p className="text-xs text-slate-500">
                Official Revival Chapel logo displayed in upper-right corner and projector headers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Logo Asset Path / URL
              </label>
              <input
                type="text"
                value={settings.logo_url}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                placeholder="/images/revival-chapel-logo.jpg"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-400">
                Original image file: <code>/images/revival-chapel-logo.jpg</code> (kept in original proportions without stretching or cropping).
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Live Logo Preview</p>
              <img
                src={settings.logo_url || '/images/revival-chapel-logo.jpg'}
                alt="Logo Preview"
                className="h-16 w-auto object-contain rounded-lg border border-amber-500/30 bg-white p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/revival-chapel-logo.jpg';
                }}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Domain & Hosting URL Settings (Requirement 15) */}
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
                placeholder="revivalchapel.org"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            {/* Crucial transparent notice mandated by Requirement 15:
                "If actual domain changes must be performed through the hosting provider/domain registrar, clearly show that requirement instead of pretending that changing a text field changes the real domain." */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/40 text-slate-700 dark:text-slate-300 text-xs space-y-2">
              <div className="flex items-center space-x-2 font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Important Domain Registrar & DNS Guidance</span>
              </div>
              <p className="leading-relaxed">
                Entering a custom domain above sets the application's canonical URL and link generators. However, <strong>actual internet domain ownership and routing must be connected through your Domain Registrar</strong> (e.g. Cloudflare, Namecheap, GoDaddy) and hosting provider (Vercel, Cloudflare Pages, or Server):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>CNAME Record:</strong> Set <code>www</code> pointing to your deployment alias or tunnel (e.g. <code>cname.vercel-dns.com</code>).
                </li>
                <li>
                  <strong>A Record:</strong> Set root domain (<code>@</code>) to the host IP address (e.g. <code>76.76.21.21</code> on Vercel).
                </li>
                <li>
                  <strong>Active Tunnel / LAN:</strong> Currently, local church devices can connect at <code>http://192.168.0.3:3000</code> or your public Cloudflare Tunnel URL.
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

    </div>
  );
}
