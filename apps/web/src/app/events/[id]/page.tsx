import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Send,
  Instagram,
  Tag,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { fetchEventBySlug } from '../../../lib/api';

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const event = await fetchEventBySlug(params.id);

  if (!event) {
    notFound();
  }

  const primaryFlyer = event.media.find((m) => m.isPrimaryFlyer) || event.media[0];
  const primaryOccurrence = event.occurrences[0];
  const source = event.sourcePosts?.[0];

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Date TBA';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Button */}
      <Link
        href="/events"
        className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-brand-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all events</span>
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Flyer Image & Source Attribution */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative w-full aspect-[4/5] rounded-3xl bg-darkSurface-100 overflow-hidden subtle-border shadow-2xl">
            {primaryFlyer ? (
              <Image
                src={primaryFlyer.url}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                Flyer Image Unavailable
              </div>
            )}
          </div>

          {/* Source Attribution Box */}
          {source && (
            <div className="p-5 rounded-2xl bg-darkSurface-100 subtle-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Ingestion Source Attribution
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {source.platform === 'TELEGRAM' ? (
                    <Send className="w-3 h-3 mr-1" />
                  ) : (
                    <Instagram className="w-3 h-3 mr-1" />
                  )}
                  {source.platform}
                </span>
              </div>

              <div className="text-xs space-y-1.5 text-slate-300">
                <p>
                  Channel/Account:{' '}
                  <span className="text-white font-medium">@{source.authorUsername || 'channel'}</span>
                </p>
                <p>
                  Published:{' '}
                  <span className="text-slate-400">
                    {new Date(source.publishedAt).toLocaleString()}
                  </span>
                </p>
              </div>

              {source.postUrl && (
                <a
                  href={source.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 w-full py-2 rounded-xl bg-darkSurface-50 hover:bg-darkSurface-200 text-xs font-semibold text-brand-400 transition-colors border border-white/5"
                >
                  <span>View Original Post on {source.platform}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Event Information */}
        <div className="lg:col-span-7 space-y-8">
          {/* Header Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-amber-300 border border-brand-500/20">
                {event.category.name}
              </span>
              {event.isVerified && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Canonical Event</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              {event.title}
            </h1>
            {event.titleAmharic && (
              <h2 className="text-base sm:text-lg text-amber-200/80 font-normal">
                {event.titleAmharic}
              </h2>
            )}
          </div>

          {/* Key Schedule & Venue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dual Calendar Card */}
            <div className="p-4 rounded-2xl bg-darkSurface-100 subtle-border space-y-2">
              <div className="flex items-center space-x-2 text-brand-400">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Date & Calendar</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  {formatDate(primaryOccurrence?.startDate)}
                </p>
                {primaryOccurrence?.originalDateExpression && (
                  <p className="text-xs text-amber-300 font-medium">
                    {primaryOccurrence.originalDateExpression} (ኢትዮጵያ ዘመን አቆጣጠር)
                  </p>
                )}
              </div>
            </div>

            {/* Time Card */}
            <div className="p-4 rounded-2xl bg-darkSurface-100 subtle-border space-y-2">
              <div className="flex items-center space-x-2 text-brand-400">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Starting Time</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  {primaryOccurrence?.startTime?.substring(0, 5) || 'Time TBA'} EAT
                </p>
                <p className="text-xs text-slate-400">
                  Timezone: {primaryOccurrence?.timezone || 'Africa/Addis_Ababa'}
                </p>
              </div>
            </div>

            {/* Venue & Location Card */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-darkSurface-100 subtle-border space-y-2">
              <div className="flex items-center space-x-2 text-brand-400">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Location & Landmark</span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-white">
                    {event.location?.venueName || 'Venue in Addis Ababa'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {event.location?.subCity ? `Sub-City: ${event.location.subCity} · ` : ''}
                    {event.location?.landmark ? `Landmark: ${event.location.landmark}` : 'Addis Ababa, Ethiopia'}
                  </p>
                </div>
                {event.location?.googleMapsUrl && (
                  <a
                    href={event.location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-darkSurface-50 hover:bg-darkSurface-200 text-xs font-semibold text-brand-400 subtle-border shrink-0"
                  >
                    Google Maps
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-950/40 via-darkSurface-100 to-darkSurface-100 subtle-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400">Admission Price</span>
              <p className="text-2xl font-black text-amber-400">
                {event.isFree ? 'FREE ADMISSION (ነፃ)' : `${event.priceAmount} ${event.priceCurrency}`}
              </p>
            </div>

            {event.ticketUrl ? (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs tracking-wide transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2"
              >
                <span>Get Tickets / Register</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <span className="text-xs text-slate-400 italic">No pre-registration required</span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-base font-bold text-white">About this Event</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description || event.summary || 'No further description provided.'}
            </p>
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 pt-2">
              <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
              {event.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-md bg-darkSurface-50 text-[11px] text-slate-400 subtle-border"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
