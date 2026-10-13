'use client';

import { BookOpen, Sparkles, Users, Flame } from 'lucide-react';
import { useBranding } from '@/context/BrandingContext';
import JbmBrandLogo from '@/components/JbmBrandLogo';

export default function AboutPage() {
  const { branding } = useBranding();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>About JBM</span>
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-slate-900 dark:text-amber-100">
          Our Vision, Faith & Mission
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
          "Declaring the unsearchable riches of Christ through bilingual scripture preaching, passionate worship, and faithful disciple-making."
        </p>
      </div>

      {/* Visual Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-xl bg-slate-950 p-8 sm:p-12 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-300">
              Welcome to JBM
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              JBM is founded on the biblical call to spiritual awakening, prayer, and deep reverence for the Word of God. Our congregation welcomes families, youth, and seekers from every walk of life to grow in grace and truth.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-telugu leading-relaxed">
              దేవుని వాక్యమునకు కట్టుబడి, పరిశుద్ధాత్మ శక్తితో నింపబడి, ప్రభువైన యేసుక్రీస్తు సువార్తను ప్రకటించుటకు మేము సమర్పించుకున్నాము.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl shadow-2xl border border-amber-500/30 bg-slate-900/90">
              <JbmBrandLogo variant="hero" showSubtitle={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="font-cinzel font-bold text-base text-slate-900 dark:text-slate-100">
            Biblical Infallibility
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We treasure the Holy Scriptures as the inspired, infallible, and sufficient revelation of God for faith and holy living.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-rose-500" />
          </div>
          <h3 className="font-cinzel font-bold text-base text-slate-900 dark:text-slate-100">
            Spirit-Filled Worship
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Worshipping the Father in spirit and truth, lifting our hearts in harmonious Telugu and English hymns that honor God.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-sky-500" />
          </div>
          <h3 className="font-cinzel font-bold text-base text-slate-900 dark:text-slate-100">
            Loving Fellowship
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Caring for one another through prayer, fellowship, fasting, and reaching out into our communities with the love of Christ.
          </p>
        </div>
      </div>

    </div>
  );
}
