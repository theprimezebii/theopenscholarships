import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';
import PlausibleAnalytics from './plausible';
import { connectToDatabase } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { HeaderSettingsProvider } from '@/context/HeaderSettingsContext';

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
  const favicon = settings?.favicon || 'https://res.cloudinary.com/dzua18qj3/image/upload/v1776687002/theopenscholarships/fkr3nmyvldmx8xanru0z.png';

  return {
    title: {
      default: `${siteName} | Fully Funded Scholarships for International Students`,
      template: `%s | ${siteName}`,
    },
    description: 'Discover verified fully funded scholarships from top universities worldwide.',
    keywords: ['fully funded scholarships', 'study abroad', 'international students', 'scholarships 2026', 'masters scholarships', 'PhD funding'],
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connectToDatabase();
  const settings = await SiteSettings.findOne().lean();

  const headerSettings = {
    headerLogo: settings?.headerLogo || settings?.logo || null,
    headerBgColor: settings?.headerBgColor || '#FFFFFF',
    headerTextColor: settings?.headerTextColor || '#1A1A1A',
    headerNameColor1: settings?.headerNameColor1 || settings?.siteNameColor1 || '#0B3B2F',
    headerNameColor2: settings?.headerNameColor2 || settings?.siteNameColor2 || '#D4A373',
    siteName: settings?.siteName || 'TheOpenScholarships',
    displayNameWithLogo: settings?.displayNameWithLogo ?? false,
  };

  const logoUrl = headerSettings.headerLogo;

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        {logoUrl && <link rel="preload" href={logoUrl} as="image" />}
      </head>
      <body className="font-sans bg-[#FAF9F7] text-[#1A1A1A] antialiased" suppressHydrationWarning>
        <PlausibleAnalytics />
        <HeaderSettingsProvider value={headerSettings}>
          <SessionProviderWrapper>{children}</SessionProviderWrapper>
        </HeaderSettingsProvider>
      </body>
    </html>
  );
}