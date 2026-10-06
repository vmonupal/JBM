import type { Metadata } from 'next';
import { Inter, Cinzel, Noto_Sans_Telugu } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PlayerProvider } from '@/components/MusicPlayer';

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
  title: 'Revival Chapel | Bilingual Bible (Telugu & English) & Church Worship',
  description: 'Revival Chapel - Read God\'s Word in Telugu and English side-by-side, worship through Telugu and English Christian songs, and experience live sanctuary presentation projector mode.',
  icons: {
    icon: '/images/revival-chapel-logo.jpg',
    apple: '/images/revival-chapel-logo.jpg'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${notoSansTelugu.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#FCFBF7] dark:bg-[#060B13] text-slate-900 dark:text-slate-100 antialiased selection:bg-amber-500/20 selection:text-amber-800 dark:selection:text-amber-200">
        <PlayerProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </PlayerProvider>
      </body>
    </html>
  );
}
