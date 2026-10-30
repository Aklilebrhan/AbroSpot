import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'AbroSpot - Ethiopian Social Event Discovery Platform | አዲስ አበባ ዝግጅቶች',
  description:
    'AI-powered social event intelligence and discovery platform for Addis Ababa, Ethiopia. Ingesting, reading flyers, and normalizing events from Telegram, Instagram, and X.',
  keywords: ['Addis Ababa events', 'Ethiopia events', 'LinkUp Addis', 'Telegram events', 'Addis concerts', 'Ethio tech meetups'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-darkSurface-200 text-slate-100 flex flex-col min-h-screen antialiased selection:bg-brand-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
