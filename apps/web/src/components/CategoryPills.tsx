'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { EventCategory } from '../lib/types';

interface CategoryPillsProps {
  categories: EventCategory[];
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({ categories }) => {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
      <Link
        href="/events"
        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
          !currentCategory
            ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
            : 'bg-darkSurface-100 text-slate-300 hover:bg-darkSurface-50 border border-white/5'
        }`}
      >
        All Events (ሁሉም)
      </Link>
      {categories.map((cat) => {
        const isActive = currentCategory === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`/events?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'bg-darkSurface-100 text-slate-300 hover:bg-darkSurface-50 border border-white/5'
            }`}
          >
            {cat.name} {cat.nameAmharic ? `(${cat.nameAmharic})` : ''}
          </Link>
        );
      })}
    </div>
  );
};
