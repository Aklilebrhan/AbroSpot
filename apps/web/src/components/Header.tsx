'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeNav?: string;
  onNavClick?: (nav: string) => void;
  savedCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav = 'home',
  onNavClick,
  savedCount = 0,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'feed', label: 'Feed', href: '#feed' },
    { id: 'platforms', label: 'Platforms', href: '#platforms' },
    { id: 'trending', label: 'Trending', href: '#featured' },
    { id: 'saved', label: `Saved${savedCount > 0 ? ` (${savedCount})` : ''}`, href: '#saved' },
  ];

  const handleItemClick = (id: string, e: React.MouseEvent) => {
    if (onNavClick) {
      e.preventDefault();
      onNavClick(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-[clamp(16px,3vw,32px)] h-18 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Wordmark Abrospot. */}
        <Link
          href="/"
          className="flex items-center text-[22px] font-bold tracking-tight text-[var(--text)] transition-transform active:scale-98 select-none"
        >
          <span>Abrospot</span>
          <span className="text-[var(--accent)] font-extrabold text-[24px]">.</span>
        </Link>

        {/* Centre Nav (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-7 text-[15px] font-medium"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleItemClick(item.id, e)}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? 'text-[var(--text)] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--accent)] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text)] flex items-center justify-center hover:border-[var(--accent)] transition-all active:scale-95 shadow-sm"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-[var(--text)]" aria-hidden="true" />
            ) : (
              <Sun className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
            )}
          </button>

          {/* Login text link */}
          <button
            type="button"
            onClick={() => alert('Login authentication demo')}
            className="min-h-[44px] px-3.5 flex items-center justify-center text-[15px] font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            Login
          </button>

          {/* Sign Up pill button */}
          <button
            type="button"
            onClick={() => alert('Sign Up modal demo')}
            className="min-h-[44px] px-5 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-semibold text-[14px] hover:opacity-95 active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile controls & hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text)] flex items-center justify-center active:scale-95"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-[var(--text)]" aria-hidden="true" />
            ) : (
              <Sun className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text)] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[var(--border)] bg-[var(--card)] px-6 py-4 space-y-4 shadow-lg animate-fadeIn">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleItemClick(item.id, e)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeNav === item.id
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                    : 'text-[var(--text)] hover:bg-[var(--surface)]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                alert('Login demo');
                setMobileMenuOpen(false);
              }}
              className="w-full min-h-[44px] rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm font-medium flex items-center justify-center"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                alert('Sign Up demo');
                setMobileMenuOpen(false);
              }}
              className="w-full min-h-[44px] rounded-full bg-[var(--accent)] text-[var(--on-accent)] text-sm font-semibold flex items-center justify-center"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
