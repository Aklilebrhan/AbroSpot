export type PlatformType = 'telegram' | 'tiktok' | 'x' | 'instagram' | 'topics';

export interface Post {
  id: string;
  platform: 'telegram' | 'tiktok' | 'x' | 'instagram';
  title: string;
  excerpt?: string;
  source_handle: string;
  source_url: string;
  thumbnail_url?: string;
  posted_at: string;
  saved: boolean;
  isFeatured?: boolean;
  category?: string;
  timestamp?: string;
  relativeTime?: string;
  stats?: {
    views?: string;
    likes?: string;
    shares?: string;
  };
}

export interface PlatformConfig {
  id: PlatformType;
  name: string;
  subLabel: string;
  color: string;
  iconName: 'telegram' | 'tiktok' | 'x' | 'instagram' | 'topics';
}
