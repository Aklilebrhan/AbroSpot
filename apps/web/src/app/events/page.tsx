import React from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, X } from 'lucide-react';
import { fetchEvents, fetchCategories } from '../../lib/api';
import { EventCard } from '../../components/EventCard';

interface EventsPageProps {
  searchParams: {
    search?: string;
    category?: string;
    subCity?: string;
    isFree?: string;
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const [{ events, total }, categories] = await Promise.all([
    fetchEvents(searchParams as Record<string, string>),
    fetchCategories(),
  ]);

  const subCities = ['Bole', 'Kirkos', 'Arada', 'Yeka', 'Lideta', 'Nifas Silk-Lafto', 'Gullele'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Explore Events in Addis Ababa</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Showing {events.length} of {total} structured events in Addis Ababa
        </p>
      </div>

      {/* Filter Toolbar */}
      <form method="GET" action="/events" className="p-4 rounded-2xl bg-darkSurface-100 subtle-border space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Keyword Search */}
          <div className="flex items-center px-3 py-2 rounded-xl bg-darkSurface-50 subtle-border text-slate-300">
            <Search className="w-4 h-4 text-brand-500 mr-2 shrink-0" />
            <input
              type="text"
              name="search"
              defaultValue={searchParams.search || ''}
              placeholder="Search by event name, venue..."
              className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-slate-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center px-3 py-2 rounded-xl bg-darkSurface-50 subtle-border text-slate-300">
            <Filter className="w-4 h-4 text-brand-500 mr-2 shrink-0" />
            <select
              name="category"
              defaultValue={searchParams.category || ''}
              className="w-full bg-transparent border-none outline-none text-xs text-slate-300 cursor-pointer"
            >
              <option value="" className="bg-darkSurface-100 text-white">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug} className="bg-darkSurface-100 text-white">
                  {c.name} {c.nameAmharic ? `(${c.nameAmharic})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-City Filter */}
          <div className="flex items-center px-3 py-2 rounded-xl bg-darkSurface-50 subtle-border text-slate-300">
            <MapPin className="w-4 h-4 text-brand-500 mr-2 shrink-0" />
            <select
              name="subCity"
              defaultValue={searchParams.subCity || ''}
              className="w-full bg-transparent border-none outline-none text-xs text-slate-300 cursor-pointer"
            >
              <option value="" className="bg-darkSurface-100 text-white">All Sub-Cities</option>
              {subCities.map((sc) => (
                <option key={sc} value={sc} className="bg-darkSurface-100 text-white">
                  {sc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons & Active Filters */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            {(searchParams.search || searchParams.category || searchParams.subCity) && (
              <Link
                href="/events"
                className="flex items-center space-x-1 text-xs text-rose-400 hover:underline"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear filters</span>
              </Link>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-600/30"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <p className="text-slate-400 text-sm">No events found matching your criteria.</p>
          <Link
            href="/events"
            className="inline-block px-4 py-2 rounded-xl bg-darkSurface-100 text-brand-400 hover:text-white text-xs subtle-border"
          >
            Reset Filters
          </Link>
        </div>
      )}
    </div>
  );
}
