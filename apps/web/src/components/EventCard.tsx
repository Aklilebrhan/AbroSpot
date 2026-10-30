import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Clock, Tag, CheckCircle2, Send, Instagram } from 'lucide-react';
import { EventItem } from '../lib/types';

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const primaryFlyer = event.media.find((m) => m.isPrimaryFlyer) || event.media[0];
  const primaryOccurrence = event.occurrences[0];
  const source = event.sourcePosts?.[0];

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Date TBA';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  };

  return (
    <div className="group rounded-2xl bg-darkSurface-100/90 subtle-border hover:border-brand-500/40 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-brand-950/30">
      {/* Flyer Image Container */}
      <Link href={`/events/${event.slug}`} className="relative w-full aspect-[4/3] bg-darkSurface-50 overflow-hidden">
        {primaryFlyer ? (
          <Image
            src={primaryFlyer.url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-darkSurface-50 text-slate-500">
            <span>Flyer Preview</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-darkSurface-100 via-transparent to-black/30" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-darkSurface-200/90 backdrop-blur-md text-amber-300 border border-amber-500/30">
            {event.category.name}
          </span>
          {event.isVerified && (
            <span className="p-1 rounded-full bg-emerald-500/90 text-white" title="Verified by AbroSpot">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Price & Platform */}
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          {source && (
            <span className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10" title={`Ingested from ${source.platform}`}>
              {source.platform === 'TELEGRAM' ? (
                <Send className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
              )}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide bg-brand-600/90 backdrop-blur-md text-white">
            {event.isFree ? 'FREE' : `${event.priceAmount || ''} ${event.priceCurrency}`}
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Dual Date & Time Info */}
          <div className="flex items-center flex-wrap gap-2 text-xs text-brand-400 font-medium">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(primaryOccurrence?.startDate)}</span>
            </div>
            {primaryOccurrence?.originalDateExpression && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-normal">
                {primaryOccurrence.originalDateExpression.split(' ')[0]} {primaryOccurrence.originalDateExpression.split(' ')[1]}
              </span>
            )}
            {primaryOccurrence?.startTime && (
              <div className="flex items-center space-x-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{primaryOccurrence.startTime.substring(0, 5)}</span>
              </div>
            )}
          </div>

          {/* Title in English and Amharic */}
          <Link href={`/events/${event.slug}`} className="block">
            <h3 className="font-bold text-base text-white group-hover:text-brand-400 transition-colors line-clamp-1">
              {event.title}
            </h3>
            {event.titleAmharic && (
              <p className="text-xs text-slate-400 font-normal mt-0.5 line-clamp-1">
                {event.titleAmharic}
              </p>
            )}
          </Link>

          {/* Venue & Sub-City */}
          <div className="flex items-start space-x-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              {event.location?.venueName || 'Addis Ababa'}
              {event.location?.subCity ? ` (${event.location.subCity})` : ''}
              {event.location?.landmark ? ` · ${event.location.landmark}` : ''}
            </span>
          </div>
        </div>

        {/* Footer info: Organizer */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span>By {event.organizerName || 'Addis Organizer'}</span>
          <Link
            href={`/events/${event.slug}`}
            className="text-brand-400 font-semibold hover:underline"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};
