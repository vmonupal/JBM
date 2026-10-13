'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Church, BookOpen, Music, Tv } from 'lucide-react';
import JbmBrandLogo from '@/components/JbmBrandLogo';

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <Church className="w-3.5 h-3.5 text-amber-500" />
          <span>Sanctuary Location & Information</span>
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-slate-900 dark:text-amber-100">
          JBM
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          We warmly welcome everyone to join us for worship in Telugu and English. Open to all visitors without any registration or account requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Sanctuary Location & Contact Info */}
        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center space-x-3">
            <JbmBrandLogo variant="header" showSubtitle={true} />
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Sanctuary Address</p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">JBM Sanctuary, Church Street, Fellowship Hall</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">General Phone Enquiries</p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">+91 98765 43210 / 080-1234567</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">General Email</p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">info@revivalchapel.org</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
            <Link
              href="/bible"
              className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-semibold flex items-center space-x-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Bible</span>
            </Link>
            <Link
              href="/songs"
              className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-semibold flex items-center space-x-1"
            >
              <Music className="w-3.5 h-3.5" />
              <span>Church Songs</span>
            </Link>
            <Link
              href="/bible/projector"
              className="px-4 py-2 bg-slate-900 text-amber-300 rounded-xl text-xs font-semibold flex items-center space-x-1"
            >
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              <span>Projector</span>
            </Link>
          </div>
        </div>

        {/* Worship Service Timings */}
        <div className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-slate-100">
              Weekly Service Timings
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            All services are open to the general public.
          </p>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
            <div className="py-2.5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Sunday Morning Worship</p>
                <p className="text-xs text-slate-400">Bilingual Telugu & English Service</p>
              </div>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">9:30 AM</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Sunday Evening Worship</p>
                <p className="text-xs text-slate-400">Praise, Scripture & Testimonies</p>
              </div>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">6:00 PM</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Wednesday Midweek Bible Study</p>
                <p className="text-xs text-slate-400">Scriptural Exegesis & Discussion</p>
              </div>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">7:00 PM</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Friday Fasting & Prayer</p>
                <p className="text-xs text-slate-400">Intercession for Churches & Families</p>
              </div>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">6:30 PM</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Sunday School</p>
                <p className="text-xs text-slate-400">Children's Bible Lessons & Songs</p>
              </div>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">8:30 AM</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
