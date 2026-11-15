'use client';

import React from 'react';
import { PlatformIcon } from './PlatformIcon';
import { PLATFORMS_CONFIG } from '../data/mockPosts';
import { PlatformType } from '../types/post';
import { ArrowRight, Check } from 'lucide-react';

interface BrowseByPlatformProps {
  selectedPlatform: string;
  onSelectPlatform: (platform: string) => void;
}

export const BrowseByPlatform: React.FC<BrowseByPlatformProps> = ({
  selectedPlatform,
  onSelectPlatform,
}) => {
  return (
    <section id="platforms" className="w-full py-10 lg:py-14">
      <div className="max-w-[1200px] mx-auto px-[clamp(16px,3vw,32px)] space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="h2-section text-[var(--text)]">
            Browse By Platform
          </h2>
          <button
            type="button"
            onClick={() => onSelectPlatform('all')}
            className="group text-sm font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1.5 min-h-[44px]"
          >
            <span>{selectedPlatform === 'all' ? 'View All' : 'Show All Platforms'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Auto-fit grid: minmax(170px, 1fr) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {PLATFORMS_CONFIG.map((platform) => {
            const isSelected = selectedPlatform === platform.id;
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => onSelectPlatform(isSelected ? 'all' : platform.id)}
                className={`group relative h-[170px] rounded-[20px] overflow-hidden p-5 flex flex-col justify-between text-left transition-all duration-300 active:scale-98 shadow-sm hover:shadow-md hover:-translate-y-1 ${
                  isSelected ? 'ring-3 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)]' : ''
                }`}
                style={{ backgroundColor: platform.color }}
              >
                {/* Background faint giant icon */}
                <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-white pointer-events-none transition-transform group-hover:scale-125 duration-500">
                  <PlatformIcon platform={platform.iconName} size={90} strokeWidth={1.2} />
                </div>

                {/* Top: White platform icon in circular badge & checkmark if selected */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:scale-105 transition-transform">
                    <PlatformIcon platform={platform.iconName} size={20} strokeWidth={1.8} />
                  </div>
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-white text-[var(--text)] flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Bottom: Text on dark scrim */}
                <div className="relative z-10 -mx-5 -mb-5 p-4 dark-scrim text-white">
                  <h3 className="font-semibold text-[17px] text-white leading-snug group-hover:text-blue-100 transition-colors">
                    {platform.name}
                  </h3>
                  <p className="text-[12px] text-white/80 font-medium truncate mt-0.5">
                    {platform.subLabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
