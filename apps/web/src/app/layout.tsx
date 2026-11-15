import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';

export const metadata: Metadata = {
  title: 'Abrospot — All Your Socials, One Feed',
  description:
    'Abrospot gathers public posts from Telegram, TikTok, X and Instagram into one clean feed, so you can catch up on everything without switching apps. Every post links back to its original source.',
  keywords: [
    'Abrospot',
    'social media feed',
    'unified feed',
    'Telegram feed',
    'TikTok feed',
    'X posts',
    'Instagram reels',
  ],
};

const themeScript = `
(function() {
  try {
    var saved = localStorage.getItem('abrospot_theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col font-poppins selection:bg-[var(--accent)] selection:text-[var(--on-accent)]">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
