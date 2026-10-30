import { EventItem, EventCategory, MonitoredSource, ReviewQueueItem } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Fallback initial data for Addis Ababa
export const FALLBACK_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    slug: 'acoustic-night-betty-g-atmosphere',
    title: 'Acoustic Night with Betty G & The Mehari Brothers',
    titleAmharic: 'አኮስቲክ ምሽት ከቤቲ ጂ እና መሀሪ ብራዘርስ ጋር',
    summary: 'An intimate live acoustic music experience featuring Betty G, backed by The Mehari Brothers at Atmosphere Addis.',
    description: 'Join us this Friday for an extraordinary night of soul, jazz, and Ethiopian pop vibes. Enjoy curated mocktails and food in the garden amphitheater.',
    status: 'PUBLISHED',
    isFree: false,
    priceAmount: 300,
    priceCurrency: 'ETB',
    organizerName: 'Atmosphere Addis',
    confidenceScore: 0.96,
    isFeatured: true,
    isVerified: true,
    tags: ['live-music', 'acoustic', 'addis-nightlife', 'bole'],
    createdAt: new Date().toISOString(),
    category: {
      id: 'cat-2',
      slug: 'music',
      name: 'Music & Concerts',
      nameAmharic: 'ሙዚቃ እና ኮንሰርት',
      iconName: 'music',
    },
    location: {
      id: 'loc-1',
      venueName: 'Atmosphere Addis',
      city: 'Addis Ababa',
      subCity: 'Bole',
      landmark: 'Behind Edna Mall',
      isVirtual: false,
    },
    occurrences: [
      {
        id: 'occ-1',
        startDate: '2026-11-06',
        startTime: '19:00:00',
        endTime: '23:30:00',
        originalDateExpression: 'ዓርብ ጥቅምት 27, 2018 ዓ.ም ከምሽቱ 1:00 ጀምሮ',
        calendarSystem: 'ETHIOPIAN',
      },
    ],
    media: [
      {
        id: 'med-1',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        isPrimaryFlyer: true,
        mediaType: 'IMAGE',
      },
    ],
    sourcePosts: [
      {
        id: 'sp-1',
        platform: 'TELEGRAM',
        authorUsername: 'linkupaddis',
        postUrl: 'https://t.me/linkupaddis/19840',
        publishedAt: '2026-10-30T10:15:00Z',
        rawText: 'Atmosphere Addis presents: Acoustic Night with Betty G! Friday at Atmosphere, Bole behind Edna Mall. Doors open 6:00 PM.',
      },
    ],
  },
  {
    id: 'evt-2',
    slug: 'devfest-addis-2026',
    title: 'DevFest Addis 2026: AI & Cloud Computing Summit',
    titleAmharic: 'ዴቭፌስት አዲስ 2026፡ አርቴፊሻል ኢንተለጀንስ እና ክላውድ ኮምፒውቲንግ',
    summary: 'The largest annual developer conference in Ethiopia bringing together 1,500+ engineers, students, and tech leaders.',
    description: 'Google Developer Group Addis Ababa invites you to DevFest 2026! Featuring hands-on workshops on LLMs, Flutter, Cloud Run, and panel discussions.',
    status: 'PUBLISHED',
    isFree: true,
    priceCurrency: 'ETB',
    ticketUrl: 'https://gdg.community.dev/events/details/developer-group-addis-ababa-presents-devfest-2026/',
    organizerName: 'GDG Addis Ababa',
    confidenceScore: 0.98,
    isFeatured: true,
    isVerified: true,
    tags: ['technology', 'google', 'devfest', 'ai', 'hackathon'],
    createdAt: new Date().toISOString(),
    category: {
      id: 'cat-1',
      slug: 'technology',
      name: 'Technology',
      nameAmharic: 'ቴክኖሎጂ',
      iconName: 'cpu',
    },
    location: {
      id: 'loc-2',
      venueName: 'Millennium Hall',
      city: 'Addis Ababa',
      subCity: 'Bole',
      landmark: 'Bole Airport Road',
      isVirtual: false,
    },
    occurrences: [
      {
        id: 'occ-2',
        startDate: '2026-11-14',
        startTime: '08:30:00',
        endTime: '17:30:00',
        originalDateExpression: 'Saturday November 14, 2026 (ህዳር 5, 2018 ዓ.ም)',
        calendarSystem: 'MIXED',
      },
    ],
    media: [
      {
        id: 'med-2',
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        isPrimaryFlyer: true,
        mediaType: 'IMAGE',
      },
    ],
    sourcePosts: [
      {
        id: 'sp-2',
        platform: 'TELEGRAM',
        authorUsername: 'gdgaddis',
        postUrl: 'https://t.me/gdgaddis/1420',
        publishedAt: '2026-10-29T14:00:00Z',
        rawText: 'DevFest 2026 Registration is now LIVE! Join 1500+ developers at Millennium Hall.',
      },
    ],
  },
  {
    id: 'evt-3',
    slug: 'addis-art-walk-makers-market',
    title: "Addis Art Walk & Makers' Market 2026",
    titleAmharic: 'የአዲስ አርት ዎክ እና የፈጣሪዎች ባዛር',
    summary: 'Over 40 local artisans, live acoustic performances, specialty Ethiopian coffee tasting, and contemporary fine art exhibits.',
    description: 'Celebrate local creativity, handcrafted textiles, pottery, jewelry, and paintings in the historical garden of Alliance Ethio-Française.',
    status: 'PUBLISHED',
    isFree: true,
    priceCurrency: 'ETB',
    organizerName: "The Maker's Market Addis",
    confidenceScore: 0.94,
    isFeatured: false,
    isVerified: true,
    tags: ['art', 'market', 'bazaar', 'culture', 'piassa'],
    createdAt: new Date().toISOString(),
    category: {
      id: 'cat-3',
      slug: 'art-culture',
      name: 'Art & Culture',
      nameAmharic: 'ኪነ-ጥበብ እና ባህል',
      iconName: 'palette',
    },
    location: {
      id: 'loc-3',
      venueName: 'Alliance Ethio-Française',
      city: 'Addis Ababa',
      subCity: 'Arada',
      landmark: 'Near Churchill Road / Piassa',
      isVirtual: false,
    },
    occurrences: [
      {
        id: 'occ-3',
        startDate: '2026-11-07',
        startTime: '10:00:00',
        endTime: '19:00:00',
        originalDateExpression: 'ቅዳሜ ጥቅምት 28, 2018 ዓ.ም',
        calendarSystem: 'ETHIOPIAN',
      },
    ],
    media: [
      {
        id: 'med-3',
        url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
        isPrimaryFlyer: true,
        mediaType: 'IMAGE',
      },
    ],
    sourcePosts: [
      {
        id: 'sp-3',
        platform: 'TELEGRAM',
        authorUsername: 'yegnahappenings',
        postUrl: 'https://t.me/yegnahappenings/892',
        publishedAt: '2026-10-30T09:30:00Z',
        rawText: "Makers Market Addis is back at Alliance Ethio-Française this Saturday! Free entrance.",
      },
    ],
  },
];

export const FALLBACK_CATEGORIES: EventCategory[] = [
  { id: 'cat-1', slug: 'technology', name: 'Technology', nameAmharic: 'ቴክኖሎጂ', iconName: 'cpu' },
  { id: 'cat-2', slug: 'music', name: 'Music & Concerts', nameAmharic: 'ሙዚቃ እና ኮንሰርት', iconName: 'music' },
  { id: 'cat-3', slug: 'art-culture', name: 'Art & Culture', nameAmharic: 'ኪነ-ጥበብ እና ባህል', iconName: 'palette' },
  { id: 'cat-4', slug: 'business', name: 'Business & Networking', nameAmharic: 'ንግድ እና ትስስር', iconName: 'briefcase' },
  { id: 'cat-5', slug: 'education', name: 'Education & Workshops', nameAmharic: 'ትምህርት እና ስልጠና', iconName: 'graduation-cap' },
  { id: 'cat-6', slug: 'community', name: 'Community & Bazaars', nameAmharic: 'ማህበረሰብ እና ባዛር', iconName: 'users' },
  { id: 'cat-7', slug: 'entertainment', name: 'Nightlife & Parties', nameAmharic: 'መዝናኛ', iconName: 'sparkles' },
];

export async function fetchEvents(params?: Record<string, string>): Promise<{ events: EventItem[]; total: number }> {
  try {
    const query = new URLSearchParams(params || {}).toString();
    const res = await fetch(`${API_BASE_URL}/events?${query}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch events');
    const data = await res.json();
    return { events: data.events, total: data.pagination.total };
  } catch {
    let filtered = [...FALLBACK_EVENTS];
    if (params?.category) {
      filtered = filtered.filter((e) => e.category.slug === params.category);
    }
    if (params?.subCity) {
      filtered = filtered.filter((e) => e.location?.subCity?.toLowerCase() === params.subCity?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.summary?.toLowerCase().includes(q) ||
          e.location?.venueName.toLowerCase().includes(q)
      );
    }
    return { events: filtered, total: filtered.length };
  }
}

export async function fetchEventBySlug(slug: string): Promise<EventItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/events/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Not found');
    return await res.json();
  } catch {
    return FALLBACK_EVENTS.find((e) => e.slug === slug || e.id === slug) || null;
  }
}

export async function fetchCategories(): Promise<EventCategory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch {
    return FALLBACK_CATEGORIES;
  }
}
