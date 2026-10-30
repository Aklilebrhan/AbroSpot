export interface EventCategory {
  id: string;
  slug: string;
  name: string;
  nameAmharic?: string;
  iconName?: string;
}

export interface EventLocation {
  id: string;
  venueName: string;
  city: string;
  subCity?: string;
  landmark?: string;
  streetAddress?: string;
  googleMapsUrl?: string;
  isVirtual: boolean;
}

export interface EventOccurrence {
  id: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  originalDateExpression?: string;
  calendarSystem: 'GREGORIAN' | 'ETHIOPIAN' | 'MIXED';
}

export interface EventMedia {
  id: string;
  url: string;
  thumbnailUrl?: string;
  isPrimaryFlyer: boolean;
  mediaType: string;
}

export interface SourcePostAttribution {
  id: string;
  platform: 'TELEGRAM' | 'INSTAGRAM' | 'X_TWITTER' | 'TIKTOK' | 'LINKEDIN' | 'MANUAL';
  authorUsername?: string;
  postUrl?: string;
  publishedAt: string;
  rawText?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  titleAmharic?: string;
  summary?: string;
  description?: string;
  status: string;
  isFree: boolean;
  priceAmount?: number;
  priceCurrency: string;
  ticketUrl?: string;
  organizerName?: string;
  confidenceScore: number;
  isFeatured: boolean;
  isVerified: boolean;
  tags: string[];
  createdAt: string;
  category: EventCategory;
  location?: EventLocation;
  occurrences: EventOccurrence[];
  media: EventMedia[];
  sourcePosts?: SourcePostAttribution[];
}

export interface MonitoredSource {
  id: string;
  platform: string;
  identifier: string;
  displayName: string;
  description?: string;
  sourceUrl?: string;
  status: string;
  fetchFrequencyMinutes: number;
  lastFetchedAt?: string;
  errorCount: number;
  _count?: {
    posts: number;
  };
}

export interface ReviewQueueItem {
  id: string;
  status: string;
  reason: string;
  notes?: string;
  createdAt: string;
  sourcePost: {
    platform: string;
    authorUsername?: string;
    postUrl?: string;
    rawText?: string;
    extractionResult?: {
      confidenceScore: number;
      ocrAmharicText?: string;
      ocrEnglishText?: string;
      detectedLanguage: string;
      extractedJson: any;
      requiresReview: boolean;
    };
  };
  event?: EventItem;
}
