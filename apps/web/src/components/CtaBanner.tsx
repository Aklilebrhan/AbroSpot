'use client';

import React from 'react';
import { PlatformIcon } from './PlatformIcon';
import { Sparkles } from 'lucide-react';

interface CtaBannerProps {
  onCreateFeedClick?: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onCreateFeedClick }) => {
  return (
    <section className="w-full bg-[var(--surface)] py-14 lg:py-20 transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-[clamp(16px,3vw,32px)]">
        
        {/* Rounded 28px --cta card */}
        <div
          className="rounded-[28px] p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-xl relative overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: 'var(--cta)',
            color: 'var(--cta-text)',
          }}
        >
          {/* Subtle background ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[var(--accent)]/15 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            
            {/* Row of four platform icons in translucent circles */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {(['telegram', 'tiktok', 'x', 'instagram'] as const).map((platform) => (
                <div
                  key={platform}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white shadow-sm hover:scale-110 hover:bg-white/20 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <PlatformIcon platform={platform} size={22} strokeWidth={1.6} />
                </div>
              ))}
            </div>

            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--cta-text)]">
              Build Your Own Feed
            </h2>

            {/* Paragraph */}
            <p
              className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto"
              style={{ color: 'var(--cta-muted)' }}
            >
              Pick the channels, creators and topics you care about and Abrospot keeps them in one stream,
              so you never miss a post.
            </p>

            {/* Accent Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onCreateFeedClick || (() => alert('Custom feed creation wizard demo'))}
                className="min-h-[48px] px-8 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Create Your Feed</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
