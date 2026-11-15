'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { SearchBar } from '../components/SearchBar';
import { BrowseByPlatform } from '../components/BrowseByPlatform';
import { FeaturedPosts } from '../components/FeaturedPosts';
import { LatestPosts } from '../components/LatestPosts';
import { CtaBanner } from '../components/CtaBanner';
import { Footer } from '../components/Footer';
import { PostModal } from '../components/PostModal';
import { FEATURED_POSTS, LATEST_POSTS } from '../data/mockPosts';
import { Post } from '../types/post';

export default function HomePage() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [postedFilter, setPostedFilter] = useState('any');
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Load saved posts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('abrospot_saved_posts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedPostIds(new Set(parsed));
        }
      }
    } catch (e) {
      // storage unavailable
    }
  }, []);

  // Save to localStorage when savedPostIds changes
  const toggleSavePost = (postId: string) => {
    setSavedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      try {
        localStorage.setItem('abrospot_saved_posts', JSON.stringify(Array.from(next)));
      } catch (e) {}
      return next;
    });
  };

  // Nav click handler
  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
    if (navId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setPlatformFilter('all');
      setSearchQuery('');
    } else if (navId === 'feed') {
      document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
    } else if (navId === 'platforms') {
      document.getElementById('platforms')?.scrollIntoView({ behavior: 'smooth' });
    } else if (navId === 'trending') {
      document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
    } else if (navId === 'saved') {
      document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter latest posts based on search query, platform filter, posted filter, and activeNav
  const filteredLatestPosts = useMemo(() => {
    return LATEST_POSTS.filter((post) => {
      // If "saved" tab is active, only show saved posts
      if (activeNav === 'saved' && !savedPostIds.has(post.id)) {
        return false;
      }

      // Platform filter
      if (platformFilter !== 'all' && platformFilter !== 'topics') {
        if (post.platform !== platformFilter) {
          return false;
        }
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesExcerpt = post.excerpt?.toLowerCase().includes(query) ?? false;
        const matchesHandle = post.source_handle.toLowerCase().includes(query);
        const matchesCategory = post.category?.toLowerCase().includes(query) ?? false;
        if (!matchesTitle && !matchesExcerpt && !matchesHandle && !matchesCategory) {
          return false;
        }
      }

      // Posted time filter demo
      if (postedFilter === 'hour') {
        // e.g. only posts with minutes or 1h
        return post.posted_at.includes('m') || post.posted_at.includes('1h');
      }
      if (postedFilter === 'today') {
        return post.posted_at.includes('h') || post.posted_at.includes('m');
      }

      return true;
    });
  }, [activeNav, savedPostIds, platformFilter, searchQuery, postedFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setPlatformFilter('all');
    setPostedFilter('any');
    setActiveNav('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      {/* 4.1 Header */}
      <Header
        activeNav={activeNav}
        onNavClick={handleNavClick}
        savedCount={savedPostIds.size}
      />

      <main className="flex-1">
        {/* 4.2 Hero */}
        <Hero
          onExploreClick={() => {
            setActiveNav('feed');
            document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onBrowseClick={() => {
            setActiveNav('platforms');
            document.getElementById('platforms')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onCardClick={(title, sourceUrl) => {
            setSelectedPost({
              id: 'preview-hero',
              platform: 'telegram',
              title,
              source_handle: '@channel_name',
              source_url: sourceUrl,
              posted_at: 'Just now',
              saved: false,
              excerpt: 'Curated social digest preview directly linked to origin post.',
            });
          }}
        />

        {/* 4.3 Search Bar */}
        <div className="py-4">
          <SearchBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            platformFilter={platformFilter}
            onPlatformFilterChange={(platform) => {
              setPlatformFilter(platform);
              document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
            }}
            postedFilter={postedFilter}
            onPostedFilterChange={setPostedFilter}
            onSearchSubmit={handleSearchSubmit}
          />
        </div>

        {/* 4.4 Browse By Platform */}
        <BrowseByPlatform
          selectedPlatform={platformFilter}
          onSelectPlatform={(platform) => {
            setPlatformFilter(platform);
            setActiveNav('feed');
            document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 4.5 Featured Posts (full-width --surface band) */}
        <FeaturedPosts
          posts={FEATURED_POSTS}
          savedPostIds={savedPostIds}
          onToggleSave={toggleSavePost}
          onViewPost={(post) => setSelectedPost(post)}
        />

        {/* 4.6 Latest Posts (list rows) */}
        <LatestPosts
          posts={filteredLatestPosts}
          savedPostIds={savedPostIds}
          onToggleSave={toggleSavePost}
          onOpenPost={(post) => setSelectedPost(post)}
          activeFilter={platformFilter}
          searchQuery={searchQuery}
          onResetFilters={resetAllFilters}
        />

        {/* 4.7 Call to action (inside --surface band) */}
        <CtaBanner
          onCreateFeedClick={() => {
            alert('Custom Feed Builder: Select your favorite Telegram, TikTok, X and Instagram handles!');
          }}
        />
      </main>

      {/* 4.8 Footer */}
      <Footer />

      {/* Post Preview Modal */}
      <PostModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        isSaved={selectedPost ? savedPostIds.has(selectedPost.id) : false}
        onToggleSave={toggleSavePost}
      />
    </div>
  );
}
