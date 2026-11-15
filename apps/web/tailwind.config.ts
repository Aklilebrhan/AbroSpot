import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        border: 'var(--border)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
        'on-accent': 'var(--on-accent)',
        field: 'var(--field)',
        cta: {
          DEFAULT: 'var(--cta)',
          text: 'var(--cta-text)',
          muted: 'var(--cta-muted)',
        },
        platform: {
          telegram: '#1E3A5F',
          tiktok: '#3B1F4A',
          x: '#1F2937',
          instagram: '#5A2A3A',
          topics: '#14463C',
        },
      },
      borderRadius: {
        card: '24px',
        tile: '20px',
        search: '28px',
        field: '18px',
      },
      boxShadow: {
        theme: 'var(--shadow)',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
