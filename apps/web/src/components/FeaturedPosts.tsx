'use client';

import React, { useRef } from 'react';
import { Post } from '../types/post';
import { PlatformIcon } from './PlatformIcon';
import { ChevronLeft, ChevronRight, Heart, ExternalLink } from 'lucide-react';

interface FeaturedPostsProps {
  posts: Post[];
  savedPostIds: Set<string>;
  onToggleSave: (postId: string) => void;
  onViewPost: (post: Post) => void;
}

const PLATFORM_COLORS: Record<string, string> = {
  telegram: '#1E3A5F',
  tiktok: '#3B1F4A',
  x: '#1F2937',
  instagram: '#5A2A3A',
  topics: '#14463C',
};

const PLATFORM_LABELS: Record<string, string> = {
  telegram: 'Telegram',
  tiktok: 'TikTok',
  x: 'X',
  instagram: 'Instagram',
};

export const FeaturedPosts: React.FC<FeaturedPostsProps> = ({
  posts,
  savedPostIds,
  onToggleSave,
  onViewPost,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section id="featured" className="w-full bg-[var(--surface)] py-14 lg:py-20 transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-[clamp(16px,3vw,32px)] space-y-7">
        
        {/* Section Header with Previous/Next Circular Buttons */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="h2-section text-[var(--text)]">
              Featured Posts
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
              Top curated discussions and visual stories trending across platforms
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Previous: filled accent */}
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous featured posts"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[var(--accent)] text-[var(--on-accent)] flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Next: outlined */}
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next featured posts"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text)] flex items-center justify-center hover:border-[var(--accent)] active:scale-95 transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Carousel / Auto-fit Grid */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mx-[clamp(16px,3vw,32px)] px-[clamp(16px,3vw,32px)]"
          tabIndex={0}
          aria-label="Featured posts carousel"
        >
          {posts.map((post) => {
            const isSaved = savedPostIds.has(post.id);
            const bgColor = PLATFORM_COLORS[post.platform] || '#1E3A5F';
            const platformName = PLATFORM_LABELS[post.platform] || post.platform;

            return (
              <div
                key={post.id}
                className="w-[300px] sm:w-[350px] shrink-0 rounded-[24px] bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                {/* Tile (210px): platform chip top-left, save-heart top-right, faint platform icon centered */}
                <div
                  className="relative h-[210px] w-full flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: bgColor }}
                >
                  {/* Centred faint platform icon */}
                  <div className="opacity-20 text-white pointer-events-none transition-transform duration-500 hover:scale-110">
                    <PlatformIcon platform={post.platform} size={90} strokeWidth={1.2} />
                  </div>

                  {/* Top-left: platform chip (white pill, dark text) */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="rounded-full bg-white text-slate-900 font-semibold text-xs px-3 py-1 flex items-center gap-1.5 shadow-sm">
                      <PlatformIcon platform={post.platform} size={14} className="text-slate-900" />
                      <span>{platformName}</span>
                    </span>
                  </div>

                  {/* Top-right: save-heart button (44px white circle) */}
                  <button
                    type="button"
                    onClick={() => onToggleSave(post.id)}
                    aria-label={isSaved ? `Remove ${post.title} from saved` : `Save ${post.title}`}
                    className="absolute top-3.5 right-4 z-10 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isSaved ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-slate-700'
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Subtle dark bottom gradient on media tile */}
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Time chip (accent-soft) */}
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-[12px] font-semibold tracking-wide">
                        {post.posted_at}
                      </span>
                      {post.category && (
                        <span className="text-[12px] text-[var(--muted)] font-medium">
                          • {post.category}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="card-title text-[var(--text)] line-clamp-2 hover:text-[var(--accent)] transition-colors">
                      {post.title}
                    </h3>

                    {/* Source row with handle & platform */}
                    <div className="flex items-center justify-between text-xs text-[var(--muted)] pt-1">
                      <span className="font-medium text-[var(--text)]">
                        {post.source_handle} · {platformName}
                      </span>
                      <a
                        href={post.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        <span>Original source</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  {/* Footer with "Posted 2h ago" and View Post button */}
                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-xs text-[var(--muted)]">
                      Posted {post.posted_at}
                    </span>

                    <button
                      type="button"
                      onClick={() => onViewPost(post)}
                      className="min-h-[44px] px-4 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)] hover:border-[var(--accent)] transition-all font-semibold text-xs flex items-center gap-1.5"
                    >
                      <span>View Post</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
