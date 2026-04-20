'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

export default function ScholarshipError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Scholarship page error:', error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Scholarship
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            We encountered an issue while loading this scholarship. It may have been removed or the link is incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="bg-[#0B3B2F] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1A5D4A] transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/scholarships"
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Scholarships
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
