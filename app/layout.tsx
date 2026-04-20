import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';
import PlausibleAnalytics from './plausible';
import { Analytics } from '@vercel/analytics/next';
import { connectToDatabase } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0B3B2F',
};

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const settings = await SiteSettings.findOne().lean();
  const siteName = settings?.siteName?.replace(/\s+/g, '') || 'TheOpenScholarships';
  
  // 🔥 HARDCODED FAVICON – Replace this URL if you upload a new one
  const favicon = 'https://res.cloudinary.com/dzua18qj3/image/upload/v1776646973/theopenscholarships/hdsh2sdktp61qeaeirby.png';
  
  return {
    title: {
      default: `${siteName} | Fully Funded Scholarships for International Students`,
      template: `%s | ${siteName}`,
    },
    description:
      'Discover verified fully funded scholarships from top universities worldwide. Free access for students from developing countries.',
    keywords: [
      'fully funded scholarships',
      'study abroad',
      'international students',
      'scholarships 2026',
      'masters scholarships',
      'PhD funding',
      'DAAD scholarship',
      'Chevening',
      'Fulbright',
      'Erasmus Mundus',
    ],
    authors: [{ name: siteName, url: 'https://theopenscholarships.com' }],
    robots: 'index, follow',
    openGraph: {
      title: `${siteName} | Fully Funded Scholarships`,
      description: 'Find and apply to fully funded scholarships worldwide. Free forever.',
      type: 'website',
      locale: 'en_US',
      siteName: siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteName} | Fully Funded Scholarships`,
      description: 'Find and apply to fully funded scholarships worldwide. Free forever.',
    },
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-[#FAF9F7] text-[#1A1A1A] antialiased" suppressHydrationWarning>
        <PlausibleAnalytics />
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
        <Analytics />
      </body>
    </html>
  );
}
