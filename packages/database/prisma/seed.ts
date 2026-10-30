import { PrismaClient, UserRole, SourcePlatform, EventStatus, CalendarSystem, MediaType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting AbroSpot Database Seeding...');

  // 1. Categories
  const categoriesData = [
    { slug: 'technology', name: 'Technology', nameAmharic: 'ቴክኖሎጂ', iconName: 'cpu', displayOrder: 1 },
    { slug: 'music', name: 'Music & Concerts', nameAmharic: 'ሙዚቃ እና ኮንሰርት', iconName: 'music', displayOrder: 2 },
    { slug: 'art-culture', name: 'Art & Culture', nameAmharic: 'ኪነ-ጥበብ እና ባህል', iconName: 'palette', displayOrder: 3 },
    { slug: 'business', name: 'Business & Networking', nameAmharic: 'ንግድ እና ትስስር', iconName: 'briefcase', displayOrder: 4 },
    { slug: 'education', name: 'Education & Workshops', nameAmharic: 'ትምህርት እና ስልጠና', iconName: 'graduation-cap', displayOrder: 5 },
    { slug: 'entertainment', name: 'Nightlife & Entertainment', nameAmharic: 'መዝናኛ', iconName: 'sparkles', displayOrder: 6 },
    { slug: 'sports', name: 'Sports & Fitness', nameAmharic: 'ስፖርት እና ጤና', iconName: 'activity', displayOrder: 7 },
    { slug: 'community', name: 'Community & Bazaars', nameAmharic: 'ማህበረሰብ እና ባዛር', iconName: 'users', displayOrder: 8 },
    { slug: 'conferences', name: 'Conferences & Summits', nameAmharic: 'ጉባኤዎች እና ሲምፖዚየሞች', iconName: 'presentation', displayOrder: 9 },
    { slug: 'exhibitions', name: 'Exhibitions & Expos', nameAmharic: 'ኤግዚቢሽን እና አውደ-ርዕይ', iconName: 'layout-grid', displayOrder: 10 },
    { slug: 'career', name: 'Career & Job Fairs', nameAmharic: 'የስራ ዕድል እና ቅጥር', iconName: 'user-check', displayOrder: 11 },
    { slug: 'other', name: 'Other Happenings', nameAmharic: 'ሌሎች ዝግጅቶች', iconName: 'calendar', displayOrder: 12 },
  ];

  console.log('Inserting event categories...');
  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.eventCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }

  // 2. Locations in Addis Ababa
  const locationsData = [
    {
      venueName: 'Addis Ababa Exhibition Center',
      city: 'Addis Ababa',
      subCity: 'Kirkos',
      landmark: 'Next to Meskel Square',
      streetAddress: 'Meskel Square',
      latitude: 9.0105,
      longitude: 38.7618,
    },
    {
      venueName: 'Millennium Hall',
      city: 'Addis Ababa',
      subCity: 'Bole',
      landmark: 'Near Bole International Airport',
      streetAddress: 'Bole Road',
      latitude: 8.9892,
      longitude: 38.7891,
    },
    {
      venueName: 'Atmosphere Addis',
      city: 'Addis Ababa',
      subCity: 'Bole',
      landmark: 'Behind Edna Mall',
      streetAddress: 'Bole Medhanialem area',
      latitude: 8.9984,
      longitude: 38.7852,
    },
    {
      venueName: 'Fendika Cultural Center',
      city: 'Addis Ababa',
      subCity: 'Kirkos',
      landmark: 'Kazanchis, behind Intercontinental Hotel',
      streetAddress: 'Kazanchis',
      latitude: 9.0175,
      longitude: 38.7712,
    },
    {
      venueName: 'Alliance Ethio-Française',
      city: 'Addis Ababa',
      subCity: 'Arada',
      landmark: 'Near Churchill Road / Piassa',
      streetAddress: 'P.O. Box 271, Addis Ababa',
      latitude: 9.0305,
      longitude: 38.7521,
    },
    {
      venueName: 'Goethe-Institut Addis Ababa',
      city: 'Addis Ababa',
      subCity: 'Yeka',
      landmark: 'Behind Holy Trinity Cathedral / 4 Kilo',
      streetAddress: '4 Kilo',
      latitude: 9.0332,
      longitude: 38.7634,
    },
    {
      venueName: 'ALX Capstone Hub (Lideta)',
      city: 'Addis Ababa',
      subCity: 'Lideta',
      landmark: 'Commerce Area, Lideta',
      streetAddress: 'Lideta',
      latitude: 9.0145,
      longitude: 38.7423,
    },
    {
      venueName: 'Ethiopian Skylight Hotel',
      city: 'Addis Ababa',
      subCity: 'Bole',
      landmark: '5 minutes from Bole International Airport',
      streetAddress: 'Airport Road',
      latitude: 8.9876,
      longitude: 38.7915,
    },
  ];

  console.log('Inserting Addis Ababa venues...');
  const locationMap = new Map<string, string>();
  for (const loc of locationsData) {
    const existing = await prisma.eventLocation.findFirst({
      where: { venueName: loc.venueName },
    });
    if (existing) {
      locationMap.set(loc.venueName, existing.id);
    } else {
      const created = await prisma.eventLocation.create({
        data: loc,
      });
      locationMap.set(loc.venueName, created.id);
    }
  }

  // 3. Monitored Sources
  const sourcesData = [
    {
      platform: SourcePlatform.TELEGRAM,
      identifier: '@linkupaddis',
      displayName: 'LinkUp Addis',
      description: 'Premier entertainment, lifestyle, culture and tech events guide in Addis Ababa.',
      sourceUrl: 'https://t.me/linkupaddis',
      fetchFrequencyMinutes: 15,
    },
    {
      platform: SourcePlatform.TELEGRAM,
      identifier: '@eventsethiopia',
      displayName: 'Events Ethiopia',
      description: 'Central channel for business, arts, exhibitions, and university events.',
      sourceUrl: 'https://t.me/eventsethiopia',
      fetchFrequencyMinutes: 30,
    },
    {
      platform: SourcePlatform.TELEGRAM,
      identifier: '@yegnahappenings',
      displayName: 'Yegna Happenings',
      description: 'Concerts, nightlife, markets, and social gatherings in Addis.',
      sourceUrl: 'https://t.me/yegnahappenings',
      fetchFrequencyMinutes: 30,
    },
    {
      platform: SourcePlatform.TELEGRAM,
      identifier: '@gdgaddis',
      displayName: 'GDG Addis',
      description: 'Google Developer Group Addis Ababa: DevFests, tech talks, workshops, hackathons.',
      sourceUrl: 'https://t.me/gdgaddis',
      fetchFrequencyMinutes: 60,
    },
    {
      platform: SourcePlatform.TELEGRAM,
      identifier: '@DSCAASTU',
      displayName: 'GDG on Campus AASTU',
      description: 'Addis Ababa Science & Technology University student developer club & tech fest announcements.',
      sourceUrl: 'https://t.me/DSCAASTU',
      fetchFrequencyMinutes: 120,
    },
    {
      platform: SourcePlatform.TELEGRAM,
      identifier: '@alxethiopiaofficial',
      displayName: 'ALX Ethiopia',
      description: 'Tech accelerators, career masterclasses, tech panels, founder meetups.',
      sourceUrl: 'https://t.me/alxethiopiaofficial',
      fetchFrequencyMinutes: 60,
    },
    {
      platform: SourcePlatform.INSTAGRAM,
      identifier: 'linkupaddis',
      displayName: 'LinkUp Addis Instagram',
      description: 'Official Instagram posts & event flyers.',
      sourceUrl: 'https://instagram.com/linkupaddis',
      fetchFrequencyMinutes: 60,
    },
    {
      platform: SourcePlatform.X_TWITTER,
      identifier: 'LinkupAddis',
      displayName: 'LinkUp Addis on X',
      description: 'X/Twitter updates on events and nightlife.',
      sourceUrl: 'https://x.com/LinkupAddis',
      fetchFrequencyMinutes: 60,
    },
  ];

  console.log('Inserting monitored sources...');
  const sourceMap = new Map<string, string>();
  for (const src of sourcesData) {
    const created = await prisma.monitoredSource.upsert({
      where: {
        platform_identifier: {
          platform: src.platform,
          identifier: src.identifier,
        },
      },
      update: src,
      create: src,
    });
    sourceMap.set(src.identifier, created.id);
  }

  // 4. Default Users
  console.log('Inserting default administrative users...');
  // Password hash for 'AbroSpotAdmin2026!'
  const adminPasswordHash = '$2a$10$wT8K5P9xYmK0cZg5tQx.weW.7e/F1Vf3F6bF0vI7Bq2n4t7H3v6aW'; 
  const admin = await prisma.user.upsert({
    where: { email: 'admin@abrospot.et' },
    update: {},
    create: {
      email: 'admin@abrospot.et',
      passwordHash: adminPasswordHash,
      name: 'AbroSpot Superadmin',
      role: UserRole.ADMIN,
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=abrospot-admin',
    },
  });

  const curator = await prisma.user.upsert({
    where: { email: 'curator@abrospot.et' },
    update: {},
    create: {
      email: 'curator@abrospot.et',
      passwordHash: adminPasswordHash,
      name: 'Addis Event Curator',
      role: UserRole.CURATOR,
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=addis-curator',
    },
  });

  // 5. Sample Canonical Events with Multi-Channel Source Attribution
  console.log('Creating initial canonical events with occurrences & flyer media...');
  
  // Event 1: Acoustic Night at Atmosphere
  const atmosphereEvent = await prisma.event.upsert({
    where: { slug: 'acoustic-night-betty-g-atmosphere' },
    update: {},
    create: {
      slug: 'acoustic-night-betty-g-atmosphere',
      title: 'Acoustic Night with Betty G & The Mehari Brothers',
      titleAmharic: 'አኮስቲክ ምሽት ከቤቲ ጂ እና መሀሪ ብራዘርስ ጋር',
      summary: 'An intimate live acoustic music experience featuring Betty G, backed by The Mehari Brothers at Atmosphere Addis.',
      description: 'Join us this Friday for an extraordinary night of soul, jazz, and Ethiopian pop vibes. Enjoy curated mocktails and food in the garden amphitheater.',
      status: EventStatus.PUBLISHED,
      categoryId: categoryMap.get('music')!,
      locationId: locationMap.get('Atmosphere Addis'),
      isFree: false,
      priceAmount: 300,
      priceCurrency: 'ETB',
      organizerName: 'Atmosphere Addis',
      confidenceScore: 0.96,
      isFeatured: true,
      isVerified: true,
      tags: ['live-music', 'acoustic', 'addis-nightlife', 'bole'],
      occurrences: {
        create: {
          startDate: new Date('2026-11-06'),
          startTime: '19:00:00',
          endTime: '23:30:00',
          timezone: 'Africa/Addis_Ababa',
          originalDateExpression: 'ዓርብ ጥቅምት 27, 2018 ዓ.ም ከምሽቱ 1:00 ጀምሮ',
          calendarSystem: CalendarSystem.ETHIOPIAN,
        },
      },
      media: {
        create: {
          mediaType: MediaType.IMAGE,
          url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
          isPrimaryFlyer: true,
          width: 1080,
          height: 1350,
          mimeType: 'image/jpeg',
        },
      },
    },
  });

  // Event 2: GDG DevFest Addis 2026
  const devfestEvent = await prisma.event.upsert({
    where: { slug: 'devfest-addis-2026' },
    update: {},
    create: {
      slug: 'devfest-addis-2026',
      title: 'DevFest Addis 2026: AI & Cloud Computing Summit',
      titleAmharic: 'ዴቭፌስት አዲስ 2026፡ አርቴፊሻል ኢንተለጀንስ እና ክላውድ ኮምፒውቲንግ',
      summary: 'The largest annual developer conference in Ethiopia bringing together 1,500+ engineers, students, and tech leaders.',
      description: 'Google Developer Group Addis Ababa invites you to DevFest 2026! Featuring hands-on workshops on LLMs, Flutter, Cloud Run, and panel discussions on Ethiopian tech ecosystem scale.',
      status: EventStatus.PUBLISHED,
      categoryId: categoryMap.get('technology')!,
      locationId: locationMap.get('Millennium Hall'),
      isFree: true,
      ticketUrl: 'https://gdg.community.dev/events/details/developer-group-addis-ababa-presents-devfest-2026/',
      organizerName: 'Google Developer Group (GDG) Addis Ababa',
      confidenceScore: 0.98,
      isFeatured: true,
      isVerified: true,
      tags: ['technology', 'google', 'devfest', 'ai', 'hackathon'],
      occurrences: {
        create: {
          startDate: new Date('2026-11-14'),
          endDate: new Date('2026-11-14'),
          startTime: '08:30:00',
          endTime: '17:30:00',
          timezone: 'Africa/Addis_Ababa',
          originalDateExpression: 'Saturday November 14, 2026 (ህዳር 5, 2018 ዓ.ም)',
          calendarSystem: CalendarSystem.MIXED,
        },
      },
      media: {
        create: {
          mediaType: MediaType.IMAGE,
          url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=80',
          isPrimaryFlyer: true,
          width: 1200,
          height: 630,
          mimeType: 'image/jpeg',
        },
      },
    },
  });

  // Event 3: Fendika Cultural Night
  const fendikaEvent = await prisma.event.upsert({
    where: { slug: 'fendika-ethio-jazz-tradition' },
    update: {},
    create: {
      slug: 'fendika-ethio-jazz-tradition',
      title: 'Fendika Azmari & Ethio-Jazz Extravaganza',
      titleAmharic: 'የፈንዲካ የአዝማሪ እና የኢትዮ ጃዝ ምሽት',
      summary: 'Authentic Azmari Bet poetry, Masenqo, Kirar, and modern Ethio-Jazz fusion led by Melaku Belay.',
      description: 'Every Wednesday and Friday, experience the timeless pulse of traditional Ethiopian sounds in the heart of Kazanchis.',
      status: EventStatus.PUBLISHED,
      categoryId: categoryMap.get('art-culture')!,
      locationId: locationMap.get('Fendika Cultural Center'),
      isFree: false,
      priceAmount: 200,
      priceCurrency: 'ETB',
      organizerName: 'Fendika Cultural Center',
      confidenceScore: 0.95,
      isFeatured: false,
      isVerified: true,
      tags: ['culture', 'ethio-jazz', 'azmari', 'kazanchis'],
      occurrences: {
        create: {
          startDate: new Date('2026-11-04'),
          startTime: '20:00:00',
          endTime: '01:00:00',
          timezone: 'Africa/Addis_Ababa',
          originalDateExpression: 'ሮብ ጥቅምት 25, 2018 ዓ.ም',
          calendarSystem: CalendarSystem.ETHIOPIAN,
          isRecurring: true,
          recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE,FR',
        },
      },
      media: {
        create: {
          mediaType: MediaType.IMAGE,
          url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
          isPrimaryFlyer: true,
          width: 1080,
          height: 1080,
          mimeType: 'image/jpeg',
        },
      },
    },
  });

  // Link sample raw SourcePost with ExtractionResult
  console.log('Creating sample raw SourcePost & ExtractionResult linkage...');
  const sampleTelegramPost = await prisma.sourcePost.upsert({
    where: {
      platform_externalPostId: {
        platform: SourcePlatform.TELEGRAM,
        externalPostId: 'linkupaddis_19840',
      },
    },
    update: {},
    create: {
      platform: SourcePlatform.TELEGRAM,
      externalPostId: 'linkupaddis_19840',
      postUrl: 'https://t.me/linkupaddis/19840',
      authorUsername: 'linkupaddis',
      publishedAt: new Date('2026-10-30T10:15:00Z'),
      rawText: 'Atmosphere Addis presents: Acoustic Night with Betty G! Friday Megabit 15 at Atmosphere, Bole behind Edna Mall. Doors open at 6:00 PM (ከሰዓት 12:00). Entry 300 ETB.',
      rawPayload: {
        message_id: 19840,
        views: 6420,
        forwards: 310,
        channel: 'linkupaddis',
      },
      mediaUrls: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'],
      processingStatus: 'EXTRACTED',
      canonicalEventId: atmosphereEvent.id,
      monitoredSourceId: sourceMap.get('@linkupaddis'),
      extractionResult: {
        create: {
          isEvent: true,
          confidenceScore: 0.96,
          ocrAmharicText: 'አኮስቲክ ምሽት ከቤቲ ጂ ጋር በአትሞስፊየር አዲስ',
          ocrEnglishText: 'Acoustic Night with Betty G & The Mehari Brothers at Atmosphere Addis',
          fullExtractedText: 'Atmosphere Addis presents: Acoustic Night with Betty G! Friday Megabit 15 at Atmosphere...',
          detectedLanguage: 'MIXED',
          extractedJson: {
            title: 'Acoustic Night with Betty G',
            venue: 'Atmosphere Addis',
            subCity: 'Bole',
            startDate: '2026-11-06',
            startTime: '19:00:00',
            price: 300,
          },
          requiresReview: false,
          modelEngine: 'telethon+ocr+multimodal-llm',
        },
      },
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
