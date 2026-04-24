// app/universities/page.tsx
import { Suspense } from 'react';
import UniversitiesContent from './UniversitiesContent';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';

export const metadata = {
  title: 'Universities Worldwide | The Open Scholarships',
  description: 'Discover top universities offering fully funded scholarships for international students. Browse 1,200+ institutions.',
  openGraph: {
    title: 'Universities Worldwide | The Open Scholarships',
    description: 'Discover top universities offering fully funded scholarships for international students.',
    url: 'https://theopenscholarships.com/universities',
    siteName: 'The Open Scholarships',
    images: [{
      url: 'https://theopenscholarships.com/api/og?type=university&title=Universities+Worldwide&description=Discover+1,200%2B+institutions+offering+fully+funded+scholarships&host=Global',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universities Worldwide | The Open Scholarships',
    description: 'Discover top universities offering fully funded scholarships.',
    images: ['https://theopenscholarships.com/api/og?type=university&title=Universities+Worldwide&description=Discover+1,200%2B+institutions+offering+fully+funded+scholarships&host=Global'],
  },
};

export default function UniversitiesPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div></div>}>
        <UniversitiesContent />
      </Suspense>
      <Footer />
    </>
  );
}