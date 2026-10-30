import React from 'react';
import Link from 'next/link';
import { Send, Instagram, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-darkSurface-300 border-t border-white/10 mt-20 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
                አ
              </div>
              <span className="font-bold text-lg text-white">AbroSpot</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous Ethiopian Social Event Intelligence Platform. Continuous multimodal ingestion from Telegram, Instagram, and X across Addis Ababa.
            </p>
          </div>

          {/* Sub-Cities */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Popular Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/events?subCity=Bole" className="hover:text-brand-400">Bole (ቦሌ)</Link></li>
              <li><Link href="/events?subCity=Kirkos" className="hover:text-brand-400">Kazanchis & Kirkos (ቂርቆስ)</Link></li>
              <li><Link href="/events?subCity=Arada" className="hover:text-brand-400">Piassa & Arada (አራዳ)</Link></li>
              <li><Link href="/events?subCity=Yeka" className="hover:text-brand-400">4 Kilo & Yeka (የካ)</Link></li>
            </ul>
          </div>

          {/* Platforms Monitored */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Ingestion Sources</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1.5"><Send className="w-3.5 h-3.5 text-blue-400" /><span>Telegram Channels (@linkupaddis, @eventsethiopia)</span></li>
              <li className="flex items-center space-x-1.5"><Instagram className="w-3.5 h-3.5 text-pink-400" /><span>Instagram Creator Guides</span></li>
              <li className="flex items-center space-x-1.5"><Twitter className="w-3.5 h-3.5 text-sky-400" /><span>X (Twitter) Developer Streams</span></li>
              <li className="flex items-center space-x-1.5"><Linkedin className="w-3.5 h-3.5 text-blue-500" /><span>Tech & Startup Hubs</span></li>
            </ul>
          </div>

          {/* System Status */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">System Intelligence</h4>
            <div className="p-3 rounded-xl bg-darkSurface-100 subtle-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>OCR Pipeline</span>
                <span className="text-emerald-400 font-medium">Bilingual Ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Calendar Normalizer</span>
                <span className="text-brand-400 font-medium">Ge&apos;ez / Gregorian</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Time Offset</span>
                <span className="text-slate-300">Africa/Addis_Ababa</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 AbroSpot Ethiopia. Dedicated to Addis Ababa&apos;s cultural and tech scene.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Engineered with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Addis Ababa</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
