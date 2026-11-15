'use client';

import React from 'react';
import { Post } from '../types/post';
import { PlatformIcon } from './PlatformIcon';
import { Bookmark, ExternalLink, ArrowRight, RotateCcw } from 'lucide-react';

interface LatestPostsProps {
  posts: Post[];
  savedPostIds: Set<string>;
  onToggleSave: (postId: string) => void;
  onOpenPost: (post: Post) => void;
  activeFilter?: string;
  searchQuery?: string;
  onResetFilters?: () => void;
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
  topics: 'Topics',
};

export const LatestPosts: React.FC<LatestPostsProps> = ({
  posts,
  savedPostIds,
  onToggleSave,
  onOpenPost,
  activeFilter,
  searchQuery,
  onResetFilters,
}) => {
  const hasActiveFilters = (activeFilter && activeFilter !== 'all') || Boolean(searchQuery);

  return (
    <section id="feed" className="w-full py-12 lg:py-16">
      <div className="max-w-[1200px] mx-auto px-[clamp(16px,3vw,32px)] space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="h2-section text-[var(--text)]">
                Latest Posts
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
              Synchronized feeds from verified public accounts and channels
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1.5 min-h-[44px] px-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset filters</span>
              </button>
            )}

            <button
              type="button"
              onClick={onResetFilters}
              className="group text-sm font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1.5 min-h-[44px]"
            >
              <span>View All Posts</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Filter Indicator Pill if filter is active */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--muted)]">
            <span className="font-semibold text-[var(--text)]">Active filters:</span>
            {activeFilter && activeFilter !== 'all' && (
              <span className="px-3 py-1 rounded-full bg-[var(--card)] border border-[var(--border)] font-medium text-[var(--text)]">
                Platform: <strong className="capitalize">{activeFilter}</strong>
              </span>
            )}
            {searchQuery && (
              <span className="px-3 py-1 rounded-full bg-[var(--card)] border border-[var(--border)] font-medium text-[var(--text)]">
                Query: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>
        )}

        {/* List Rows */}
        {posts.length === 0 ? (
          <div className="rounded-[24px] bg-[var(--card)] border border-[var(--border)] p-12 text-center space-y-4 shadow-sm">
            <p className="text-base text-[var(--muted)]">
              No posts matched your search or platform filter.
            </p>
            {onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="min-h-[44px] px-6 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-semibold text-xs inline-flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Show All Posts</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const isSaved = savedPostIds.has(post.id);
              const bgColor = PLATFORM_COLORS[post.platform] || '#1E3A5F';
              const platformName = PLATFORM_LABELS[post.platform] || post.platform;

              return (
                <article
                  key={post.id}
                  className="rounded-[24px] bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] overflow-hidden flex flex-col md:flex-row items-stretch transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-lg"
                >
                  {/* Left Media Tile: min 240px wide, stacks on phones */}
                  <div
                    className="relative w-full md:w-[260px] lg:w-[280px] shrink-0 min-h-[170px] md:min-h-[190px] flex items-center justify-center overflow-hidden cursor-pointer"
                    style={{ backgroundColor: bgColor }}
                    onClick={() => onOpenPost(post)}
                  >
                    {/* Centred faint platform icon */}
                    <div className="opacity-20 text-white pointer-events-none transition-transform duration-500 hover:scale-110">
                      <PlatformIcon platform={post.platform} size={84} strokeWidth={1.2} />
                    </div>

                    {/* Top-left chip overlay on tile */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="rounded-full bg-white text-slate-900 font-semibold text-xs px-3 py-1 flex items-center gap-1.5 shadow-sm">
                        <PlatformIcon platform={post.platform} size={13} className="text-slate-900" />
                        <span>{platformName}</span>
                      </span>
                    </div>

                    {/* Dark bottom scrim */}
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />
                  </div>

                  {/* Right Content Area */}
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-4">
                    <div className="space-y-2.5">
                      {/* Top row: platform chip + time & Bookmark button */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold">
                            {post.posted_at}
                          </span>
                          {post.category && (
                            <span className="text-xs text-[var(--muted)] hidden sm:inline">
                              • {post.category}
                            </span>
                          )}
                        </div>

                        {/* Bookmark button (44px target, toggles saved state) */}
                        <button
                          type="button"
                          onClick={() => onToggleSave(post.id)}
                          aria-label={isSaved ? `Remove ${post.title} from bookmarks` : `Bookmark ${post.title}`}
                          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] flex items-center justify-center hover:border-[var(--accent)] active:scale-95 transition-all shadow-sm"
                        >
                          <Bookmark
                            className={`w-5 h-5 transition-colors ${
                              isSaved ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-[var(--muted)]'
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      </div>

                      {/* Title: 21px / 600 */}
                      <h3
                        onClick={() => onOpenPost(post)}
                        className="text-[20px] sm:text-[21px] font-semibold text-[var(--text)] leading-snug cursor-pointer hover:text-[var(--accent)] transition-colors"
                      >
                        {post.title}
                      </h3>

                      {/* Excerpt if present */}
                      {post.excerpt && (
                        <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Source row */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)] pt-1">
                        <span className="font-medium text-[var(--text)]">
                          {post.source_handle} · {platformName}
                        </span>
                        <span>•</span>
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

                    {/* Bottom Row: "Posted 4h ago" and Open Post button */}
                    <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                      <span className="text-xs text-[var(--muted)]">
                        Posted {post.posted_at}
                      </span>

                      <button
                        type="button"
                        onClick={() => onOpenPost(post)}
                        className="min-h-[44px] px-5 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-semibold text-xs inline-flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm"
                      >
                        <span>Open Post</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
