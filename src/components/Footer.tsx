'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Tv, Music, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-amber-500/20 pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Church Info & Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-1 rounded-lg border border-amber-500/30">
                <img
                  src="/images/revival-chapel-logo.jpg"
                  alt="Revival Chapel Official Logo"
                  className="h-12 w-auto object-contain rounded"
                />
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-lg text-amber-200 tracking-wider">
                  REVIVAL CHAPEL
                </h3>
                <p className="text-xs text-amber-400 font-medium">Public Bible & Hymn Library</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "For where two or three are gathered together in my name, there am I in the midst of them." — Matthew 18:20
            </p>
            <p className="text-xs text-slate-400 font-telugu leading-relaxed">
              "నా నామమున ఇద్దరు ముగ్గురు ఎక్కడ కూడియుందురో అక్కడ నేను వారి మధ్యన ఉందును." — మత్తయి 18:20
            </p>
          </div>

          {/* Column 2: Service Timings */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-amber-300 tracking-wider uppercase flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Sanctuary Timings</span>
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="font-semibold text-slate-200">Sunday Morning:</span>
                <span className="text-amber-300">9:30 AM (Bilingual)</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="font-semibold text-slate-200">Sunday Evening:</span>
                <span className="text-amber-300">6:00 PM (Worship)</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="font-semibold text-slate-200">Wednesday Study:</span>
                <span className="text-amber-300">7:00 PM (Bible)</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="font-semibold text-slate-200">Friday Prayer:</span>
                <span className="text-amber-300">6:30 PM (Fasting)</span>
              </li>
              <li className="flex justify-between pb-1">
                <span className="font-semibold text-slate-200">Sunday School:</span>
                <span className="text-amber-300">8:30 AM (Children)</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-amber-300 tracking-wider uppercase">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link href="/" className="text-slate-400 hover:text-amber-300 transition-colors">
                Home
              </Link>
              <Link href="/bible" className="text-slate-400 hover:text-amber-300 transition-colors">
                Bilingual Bible
              </Link>
              <Link href="/songs" className="text-slate-400 hover:text-amber-300 transition-colors">
                Church Songs
              </Link>
              <Link href="/bible/projector" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors flex items-center space-x-1">
                <Tv className="w-3 h-3" />
                <span>Bible Projector</span>
              </Link>
              <Link href="/songs/projector" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors flex items-center space-x-1">
                <Tv className="w-3 h-3" />
                <span>Song Projector</span>
              </Link>
              <Link href="/bible/search" className="text-slate-400 hover:text-amber-300 transition-colors">
                Search Bible
              </Link>
              <Link href="/categories" className="text-slate-400 hover:text-amber-300 transition-colors">
                Song Categories
              </Link>
              <Link href="/about" className="text-slate-400 hover:text-amber-300 transition-colors">
                About Sanctuary
              </Link>
            </div>
          </div>

          {/* Column 4: Church Location & Contact */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-amber-300 tracking-wider uppercase">
              Church Information
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Revival Chapel Sanctuary, Church Street, Fellowship Hall</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 98765 43210 / 080-1234567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@revivalchapel.org</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Open to all believers, visitors, and families without registration.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Revival Chapel. Dedicated to the glory of God and the uplifting of His church.</p>
          <div className="flex items-center space-x-4">
            <span>Telugu & English Scripture Study</span>
            <span>•</span>
            <span>Sacred Praise & Worship</span>
            <span>•</span>
            <span>Projector Mode</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
