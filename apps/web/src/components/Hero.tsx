'use client';

import React from 'react';
import { PlatformIcon } from './PlatformIcon';
import { HERO_POSTS } from '../data/mockPosts';
import { LayoutGrid, ArrowRight, Check } from 'lucide-react';

interface HeroProps {
  onExploreClick?: () => void;
  onBrowseClick?: () => void;
  onCardClick?: (title: string, sourceUrl: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onBrowseClick,
  onCardClick,
}) => {
  return (
    <section className="relative w-full pt-8 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-[clamp(16px,3vw,32px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span>All Your Socials, One Feed</span>
            </div>

            {/* H1 Headline */}
            <h1 className="h1-hero text-[var(--text)] tracking-tight">
              Every Post,
              <br />
              <span className="text-[var(--accent)]">One Place.</span>
            </h1>

            {/* Paragraph */}
            <p className="body-text text-[var(--muted)] max-w-xl leading-relaxed">
              Abrospot gathers posts from Telegram, TikTok, X and Instagram into one clean feed,
              so you can catch up on everything without switching apps.
            </p>

            {/* Hero Buttons (min 48px height) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onExploreClick || (() => {
                  document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
                })}
                className="min-h-[48px] px-7 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-semibold text-[15px] inline-flex items-center justify-center gap-2.5 hover:opacity-95 active:scale-95 transition-all shadow-md hover:shadow-lg"
              >
                <LayoutGrid className="w-4 h-4" aria-hidden="true" />
                <span>Explore Feed</span>
              </button>

              <button
                type="button"
                onClick={onBrowseClick || (() => {
                  document.getElementById('platforms')?.scrollIntoView({ behavior: 'smooth' });
                })}
                className="min-h-[48px] px-7 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--text)] font-semibold text-[15px] inline-flex items-center justify-center gap-2 hover:border-[var(--accent)] active:scale-95 transition-all"
              >
                <span>Browse Platforms</span>
              </button>
            </div>

            {/* Trust Row with Check icon */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs sm:text-[13px] font-medium text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span>Original source credited</span>
              </div>
              <span className="text-[var(--border)] hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span>Four platforms, one feed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Three Media Cards */}
          <div className="lg:col-span-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
              
              {/* Card 1: Tall Card (440px min height) */}
              <div
                onClick={() => onCardClick?.(HERO_POSTS.tallCard.title, HERO_POSTS.tallCard.source_url)}
                className="group relative rounded-[24px] overflow-hidden min-h-[440px] flex flex-col justify-between p-6 cursor-pointer border border-[var(--border)] shadow-[var(--shadow)] transition-transform hover:-translate-y-1 duration-300"
                style={{ backgroundColor: HERO_POSTS.tallCard.color }}
              >
                {/* Centred faint platform icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 transition-transform group-hover:scale-110 duration-500 text-white">
                  <PlatformIcon platform="telegram" size={140} strokeWidth={1.2} />
                </div>

                {/* Top-right "Trending" chip */}
                <div className="relative z-10 flex justify-end">
                  <span className="chip-label px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                    Trending
                  </span>
                </div>

                {/* Bottom dark scrim with info */}
                <div className="relative z-10 -mx-6 -mb-6 p-6 dark-scrim text-white space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
                    <PlatformIcon platform="telegram" size={15} />
                    <span>Telegram</span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight text-white group-hover:text-sky-200 transition-colors">
                    {HERO_POSTS.tallCard.title}
                  </h3>
                  <p className="text-xs text-white/70 font-medium">
                    {HERO_POSTS.tallCard.source_handle}
                  </p>
                </div>
              </div>

              {/* Right Stack: Card 2 & Card 3 */}
              <div className="flex flex-col gap-4 justify-between">
                
                {/* Card 2: Small Card (TikTok tone, scrim) */}
                <div
                  onClick={() => onCardClick?.(HERO_POSTS.tiktokCard.title, HERO_POSTS.tiktokCard.source_url)}
                  className="group relative rounded-[20px] overflow-hidden min-h-[210px] flex flex-col justify-end p-5 cursor-pointer border border-[var(--border)] shadow-[var(--shadow)] transition-transform hover:-translate-y-1 duration-300"
                  style={{ backgroundColor: HERO_POSTS.tiktokCard.color }}
                >
                  {/* Centred faint platform icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 transition-transform group-hover:scale-110 duration-500 text-white">
                    <PlatformIcon platform="tiktok" size={80} strokeWidth={1.2} />
                  </div>

                  {/* Top platform chip */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                      <PlatformIcon platform="tiktok" size={16} />
                    </span>
                  </div>

                  {/* Dark scrim with content */}
                  <div className="relative z-10 -mx-5 -mb-5 p-5 dark-scrim text-white">
                    <div className="text-xs font-semibold text-pink-200 mb-1">
                      TikTok / 30-Second Street Food Tour
                    </div>
                    <div className="text-[11px] text-white/70">
                      {HERO_POSTS.tiktokCard.source_handle} • {HERO_POSTS.tiktokCard.posted_at}
                    </div>
                  </div>
                </div>

                {/* Card 3: Small Card (Top is Instagram-tone tile, below is --card body with round arrow button) */}
                <div
                  onClick={() => onCardClick?.(HERO_POSTS.instagramCard.title, HERO_POSTS.instagramCard.source_url)}
                  className="group rounded-[20px] overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)] flex flex-col cursor-pointer transition-transform hover:-translate-y-1 duration-300"
                >
                  {/* Top Instagram-tone tile */}
                  <div
                    className="relative h-[110px] w-full flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: HERO_POSTS.instagramCard.color }}
                  >
                    <div className="opacity-25 text-white transition-transform group-hover:scale-110 duration-500">
                      <PlatformIcon platform="instagram" size={60} strokeWidth={1.2} />
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                        <PlatformIcon platform="instagram" size={14} />
                      </span>
                    </div>
                  </div>

                  {/* Below is --card body */}
                  <div className="p-4 flex items-center justify-between gap-3 bg-[var(--card)]">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[var(--accent)] mb-0.5">
                        Instagram
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--text)] truncate group-hover:text-[var(--accent)] transition-colors">
                        Golden Hour Over The City
                      </h4>
                      <p className="text-[11px] text-[var(--muted)]">
                        {HERO_POSTS.instagramCard.source_handle}
                      </p>
                    </div>

                    {/* Round arrow button */}
                    <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)] group-hover:border-[var(--accent)] transition-all shrink-0 shadow-sm">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
