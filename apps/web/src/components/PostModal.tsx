'use client';

import React from 'react';
import { Post } from '../types/post';
import { PlatformIcon } from './PlatformIcon';
import { X, ExternalLink, Heart, Bookmark, Share2 } from 'lucide-react';

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (postId: string) => void;
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

export const PostModal: React.FC<PostModalProps> = ({
  post,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  if (!post) return null;

  const bgColor = PLATFORM_COLORS[post.platform] || '#1E3A5F';
  const platformName = PLATFORM_LABELS[post.platform] || post.platform;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-post-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-[24px] bg-[var(--card)] border border-[var(--border)] shadow-2xl overflow-hidden text-[var(--text)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Media Banner */}
        <div
          className="relative h-48 w-full flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          <div className="opacity-25 text-white">
            <PlatformIcon platform={post.platform} size={110} strokeWidth={1.2} />
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close post preview modal"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Platform Chip */}
          <div className="absolute top-4 left-4 z-10">
            <span className="rounded-full bg-white text-slate-900 font-semibold text-xs px-3 py-1 flex items-center gap-1.5 shadow-sm">
              <PlatformIcon platform={post.platform} size={14} className="text-slate-900" />
              <span>{platformName}</span>
            </span>
          </div>

          {/* Dark bottom scrim */}
          <div className="absolute inset-x-0 bottom-0 h-16 dark-scrim pointer-events-none" />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold">
                Posted {post.posted_at}
              </span>
              <span className="text-xs text-[var(--muted)]">
                Author: <strong className="text-[var(--text)]">{post.source_handle}</strong>
              </span>
            </div>

            <h3 id="modal-post-title" className="text-xl sm:text-2xl font-bold leading-snug">
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Source Attribution Notice */}
          <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--muted)] flex items-center justify-between">
            <div>
              <p className="font-semibold text-[var(--text)]">Original Attribution Guaranteed</p>
              <p>Every post links back directly to the creator on {platformName}.</p>
            </div>
            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-semibold shrink-0"
            >
              <span>Verify</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Actions Footer */}
          <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleSave(post.id)}
                className={`min-h-[44px] px-4 rounded-full border border-[var(--border)] text-xs font-semibold flex items-center gap-2 transition-colors ${
                  isSaved
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]'
                    : 'bg-[var(--card)] text-[var(--text)] hover:border-[var(--accent)]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[var(--accent)]' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save Post'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(post.source_url);
                  alert('Post source URL copied to clipboard!');
                }}
                className="min-h-[44px] w-11 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text)] flex items-center justify-center hover:border-[var(--accent)] transition-colors"
                aria-label="Share post link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-6 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-semibold text-xs inline-flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-sm"
            >
              <span>Open Original Post</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
