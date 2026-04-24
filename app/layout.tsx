import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { HeaderSettingsProvider } from '@/context/HeaderSettingsContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    default: 'The Open Scholarships – Fully Funded Opportunities Worldwide',
    template: '%s | The Open Scholarships',
  },
  description: 'Find your perfect fully funded scholarship abroad. Discover verified opportunities from top universities – free, no ads, completely accessible.',
  openGraph: {
    title: 'The Open Scholarships – Fully Funded Opportunities',
    description: 'Search by country, field of study, or degree level. Thousands of verified scholarships for Bachelor, Master, and PhD programs.',
    url: baseUrl,
    siteName: 'The Open Scholarships',
    images: [
      {
        url: `${baseUrl}/api/og?type=home&title=The+Open+Scholarships&description=Find+your+perfect+fully+funded+scholarship+abroad.`,
        width: 1200,
        height: 630,
        alt: 'The Open Scholarships',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Open Scholarships – Fully Funded Opportunities',
    description: 'Discover verified scholarships from top universities worldwide. Absolutely free.',
    images: [`${baseUrl}/api/og?type=home&title=The+Open+Scholarships&description=Find+your+perfect+fully+funded+scholarship+abroad.`],
  },
  robots: 'index, follow',
  keywords: 'scholarships, fully funded, study abroad, free education, international students',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <HeaderSettingsProvider>
          {children}
        </HeaderSettingsProvider>
      </body>
    </html>
  );
}
