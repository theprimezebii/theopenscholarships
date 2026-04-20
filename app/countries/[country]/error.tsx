'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, ArrowLeft, Home, Globe } from 'lucide-react';

export default function CountryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Country page error:', error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-gray-800 mb-2">
            Country Page Unavailable
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            We couldn't load scholarships for this country. Please try again or browse all destinations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="bg-[#0B3B2F] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1A5D4A] transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/countries"
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              All Countries
            </Link>
            <Link
              href="/"
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
