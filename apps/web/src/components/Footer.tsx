'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-[clamp(16px,3vw,32px)] py-14 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-12">
          
          {/* Wordmark + Blurb */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center text-[22px] font-bold tracking-tight text-[var(--text)] select-none"
            >
              <span>Abrospot</span>
              <span className="text-[var(--accent)] font-extrabold text-[24px]">.</span>
            </Link>
            <p className="text-sm text-[var(--muted)] leading-relaxed max-w-sm">
              One place to follow Telegram, TikTok, X and Instagram. Every post links back to its original source.
            </p>
          </div>

          {/* Three Link Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Column 1: Platform */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[var(--text)] tracking-wider">
                Platform
              </h4>
              <ul className="space-y-2 text-sm text-[var(--muted)]">
                <li>
                  <a href="#feed" className="hover:text-[var(--accent)] transition-colors py-1 inline-block">
                    Browse Feed
                  </a>
                </li>
                <li>
                  <a href="#platforms" className="hover:text-[var(--accent)] transition-colors py-1 inline-block">
                    Platforms
                  </a>
                </li>
                <li>
                  <a href="#featured" className="hover:text-[var(--accent)] transition-colors py-1 inline-block">
                    Trending
                  </a>
                </li>
                <li>
                  <a href="#saved" className="hover:text-[var(--accent)] transition-colors py-1 inline-block">
                    Saved Posts
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Support */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[var(--text)] tracking-wider">
                Support
              </h4>
              <ul className="space-y-2 text-sm text-[var(--muted)]">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Help Center'); }} className="hover:text-[var(--accent)] transition-colors py-1 inline-block">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Terms & Conditions'); }} className="hover:text-[var(--accent)] transition-colors py-1 inline-block">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy Policy'); }} className="hover:text-[var(--accent)] transition-colors py-1 inline-block">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Contact Us'); }} className="hover:text-[var(--accent)] transition-colors py-1 inline-block">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[var(--text)] tracking-wider">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-[var(--muted)]">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('About Us'); }} className="hover:text-[var(--accent)] transition-colors py-1 inline-block">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Blog'); }} className="hover:text-[var(--accent)] transition-colors py-1 inline-block">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Report A Post'); }} className="hover:text-[var(--accent)] transition-colors py-1 inline-block">
                    Report A Post
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Partners'); }} className="hover:text-[var(--accent)] transition-colors py-1 inline-block">
                    Partners
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Centred Copyright Line */}
        <div className="pt-8 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
          <p>© 2026 Abrospot. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};
