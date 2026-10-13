import type { Metadata } from 'next';
import { Inter, Cinzel, Noto_Sans_Telugu } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PlayerProvider } from '@/components/MusicPlayer';
import { SettingsProvider } from '@/context/SettingsContext';
import SettingsModal from '@/components/SettingsModal';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import { BrandingProvider } from '@/context/BrandingContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ['telugu'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-telugu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'JBM',
    template: '%s | JBM'
  },
  applicationName: 'JBM',
  appleWebApp: {
    title: 'JBM',
    capable: true,
    statusBarStyle: 'black-translucent'
  },
  description: 'JBM - Holy Bible in Telugu and English, sacred worship hymns, church posters, and live sanctuary presentation projector mode.',
  openGraph: {
    title: 'JBM',
    siteName: 'JBM',
    description: 'JBM - Holy Bible in Telugu and English, sacred worship hymns, church posters, and live sanctuary presentation projector mode.',
    type: 'website'
  },
  twitter: {
    title: 'JBM',
    description: 'JBM - Holy Bible in Telugu and English, sacred worship hymns, church posters, and live sanctuary presentation projector mode.'
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico'
  },
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${notoSansTelugu.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#FCFBF7] dark:bg-[#060B13] text-slate-900 dark:text-slate-100 antialiased selection:bg-amber-500/20 selection:text-amber-800 dark:selection:text-amber-200">
        <BrandingProvider>
          <SettingsProvider>
            <PlayerProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <SettingsModal />
              <ServiceWorkerRegister />
            </PlayerProvider>
          </SettingsProvider>
        </BrandingProvider>
      </body>
    </html>
  );
}
