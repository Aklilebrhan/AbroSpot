import React, { Suspense } from 'react';
import Link from 'next/link';
import { Search, MapPin, Sparkles, Flame, Calendar, ArrowRight, ShieldCheck, Send } from 'lucide-react';
import { fetchEvents, fetchCategories } from '../lib/api';
import { EventCard } from '../components/EventCard';
import { CategoryPills } from '../components/CategoryPills';

export default async function HomePage() {
  const [{ events }, categories] = await Promise.all([
    fetchEvents({ limit: '8' }),
    fetchCategories(),
  ]);

  const featuredEvents = events.filter((e) => e.isFeatured);
  const regularEvents = events.filter((e) => !e.isFeatured);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-darkSurface-300 via-darkSurface-200 to-transparent">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multimodal Ingestion · Telegram · Instagram · X</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover Every Event in <br />
            <span className="bg-gradient-to-r from-amber-400 via-brand-500 to-amber-200 bg-clip-text text-transparent">
              Addis Ababa (አዲስ አበባ)
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            No more missing events scattered across Telegram channels and flyer images. AbroSpot automatically extracts, normalizes calendars, and centralizes Ethiopian social announcements.
          </p>

          {/* Quick Search Bar */}
          <form action="/events" method="GET" className="max-w-2xl mx-auto pt-4">
            <div className="p-2 rounded-2xl bg-darkSurface-100/90 subtle-border shadow-2xl flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center flex-1 w-full px-3 py-2 text-slate-300">
                <Search className="w-5 h-5 text-brand-500 mr-2 shrink-0" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search concert, tech meetup, bazaar, or venue..."
                  className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-slate-500"
                />
              </div>

              <div className="h-6 w-px bg-white/10 hidden sm:block" />

              <div className="flex items-center w-full sm:w-auto px-3 py-2 text-slate-400">
                <MapPin className="w-4 h-4 text-brand-500 mr-2 shrink-0" />
                <select
                  name="subCity"
                  className="bg-transparent border-none outline-none text-xs text-slate-300 cursor-pointer"
                  defaultValue=""
                >
                  <option value="" className="bg-darkSurface-100 text-white">All Sub-Cities</option>
                  <option value="Bole" className="bg-darkSurface-100 text-white">Bole (ቦሌ)</option>
                  <option value="Kirkos" className="bg-darkSurface-100 text-white">Kirkos / Kazanchis (ቂርቆስ)</option>
                  <option value="Arada" className="bg-darkSurface-100 text-white">Arada / Piassa (አራዳ)</option>
                  <option value="Yeka" className="bg-darkSurface-100 text-white">Yeka / 4 Kilo (የካ)</option>
                  <option value="Lideta" className="bg-darkSurface-100 text-white">Lideta (ልደታ)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-brand-600/30 shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Sub-City Badges */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2 text-xs text-slate-400">
            <span>Popular:</span>
            <Link href="/events?subCity=Bole" className="px-2.5 py-1 rounded-lg bg-darkSurface-100 hover:text-brand-400 subtle-border">
              Bole (ቦሌ)
            </Link>
            <Link href="/events?subCity=Kirkos" className="px-2.5 py-1 rounded-lg bg-darkSurface-100 hover:text-brand-400 subtle-border">
              Kazanchis (ካዛንቺስ)
            </Link>
            <Link href="/events?subCity=Arada" className="px-2.5 py-1 rounded-lg bg-darkSurface-100 hover:text-brand-400 subtle-border">
              Piassa (ፒያሳ)
            </Link>
            <Link href="/events?category=technology" className="px-2.5 py-1 rounded-lg bg-darkSurface-100 hover:text-brand-400 subtle-border">
              DevFests & Tech
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="h-10 w-full animate-pulse bg-darkSurface-100 rounded-full" />}>
          <CategoryPills categories={categories} />
        </Suspense>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">Featured in Addis Ababa</h2>
            </div>
            <Link href="/events" className="text-xs font-semibold text-brand-400 hover:underline flex items-center space-x-1">
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming & Ingested Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Upcoming & Ingested Announcements</h2>
          </div>
          <Link href="/events" className="text-xs font-semibold text-brand-400 hover:underline flex items-center space-x-1">
            <span>Explore all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* Trust & Intelligence Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-darkSurface-100 via-darkSurface-50 to-darkSurface-100 subtle-border p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Direct Social Ingestion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We monitor Addis Ababa event channels including @linkupaddis, @eventsethiopia, @gdgaddis, and cultural centers.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Bilingual OCR & Vision</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ethiopian event posters with mixed English and Amharic typography are accurately extracted, with dual calendar conversion.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Curated & Traceable</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every event links back to its verified original announcement on Telegram or Instagram so you always have direct source proof.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
