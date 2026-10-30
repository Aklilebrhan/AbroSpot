'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Compass, Shield, PlusCircle, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-darkSurface-200/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-600/30">
            አ
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-brand-400 transition-colors">
              Abro<span className="text-brand-500">Spot</span>
            </span>
            <span className="text-[10px] text-amber-200/60 uppercase tracking-widest font-medium">
              አዲስ አበባ ዝግጅቶች
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
          <Link href="/" className="flex items-center space-x-1.5 hover:text-brand-400 transition-colors">
            <Compass className="w-4 h-4" />
            <span>Discover</span>
          </Link>
          <Link href="/events" className="flex items-center space-x-1.5 hover:text-brand-400 transition-colors">
            <Search className="w-4 h-4" />
            <span>Search & Explore</span>
          </Link>
          <Link href="/events?date=this-weekend" className="flex items-center space-x-1.5 hover:text-brand-400 transition-colors">
            <Calendar className="w-4 h-4" />
            <span>This Weekend</span>
          </Link>
          <Link href="/admin" className="flex items-center space-x-1.5 text-slate-400 hover:text-white transition-colors">
            <Shield className="w-4 h-4" />
            <span>Curator Hub</span>
          </Link>
        </nav>

        {/* Right Action */}
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-full bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-md shadow-brand-600/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Drop Flyer</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
