'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  platformFilter: string;
  onPlatformFilterChange: (platform: string) => void;
  postedFilter: string;
  onPostedFilterChange: (posted: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  platformFilter,
  onPlatformFilterChange,
  postedFilter,
  onPostedFilterChange,
  onSearchSubmit,
}) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,3vw,32px)]">
      <form
        onSubmit={onSearchSubmit}
        className="rounded-[28px] bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] p-3 sm:p-4"
        role="search"
        aria-label="Filter and search social posts"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-end">
          
          {/* Field 1: Search Posts */}
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label
              htmlFor="search-posts-input"
              className="chip-label text-[var(--muted)] px-1 uppercase tracking-wider"
            >
              Search Posts
            </label>
            <div className="relative flex items-center">
              <input
                id="search-posts-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="Keywords, channels, creators"
                className="w-full min-h-[44px] rounded-[18px] bg-[var(--field)] text-[var(--text)] placeholder-[var(--muted)] px-4 py-2.5 text-sm border border-transparent focus:border-[var(--accent)] outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchQueryChange('')}
                  aria-label="Clear search query"
                  className="absolute right-3 text-xs text-[var(--muted)] hover:text-[var(--text)]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Field 2: Platform */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label
              htmlFor="search-platform-select"
              className="chip-label text-[var(--muted)] px-1 uppercase tracking-wider"
            >
              Platform
            </label>
            <select
              id="search-platform-select"
              value={platformFilter}
              onChange={(e) => onPlatformFilterChange(e.target.value)}
              className="w-full min-h-[44px] rounded-[18px] bg-[var(--field)] text-[var(--text)] px-4 py-2.5 text-sm border border-transparent focus:border-[var(--accent)] outline-none cursor-pointer transition-colors"
            >
              <option value="all">All platforms</option>
              <option value="telegram">Telegram</option>
              <option value="tiktok">TikTok</option>
              <option value="x">X</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>

          {/* Field 3: Posted */}
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label
              htmlFor="search-posted-select"
              className="chip-label text-[var(--muted)] px-1 uppercase tracking-wider"
            >
              Posted
            </label>
            <select
              id="search-posted-select"
              value={postedFilter}
              onChange={(e) => onPostedFilterChange(e.target.value)}
              className="w-full min-h-[44px] rounded-[18px] bg-[var(--field)] text-[var(--text)] px-4 py-2.5 text-sm border border-transparent focus:border-[var(--accent)] outline-none cursor-pointer transition-colors"
            >
              <option value="any">Any time</option>
              <option value="hour">Last hour</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
            </select>
          </div>

          {/* Action Button: Search */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full min-h-[44px] px-6 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-semibold text-sm inline-flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-sm"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>Search</span>
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};
