'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">Something went wrong!</h2>
        <p className="text-gray-500 mb-6">We couldn't load the scholarships. Please try again.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="bg-[#0B3B2F] text-white px-6 py-2 rounded-lg">Try again</button>
          <Link href="/" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
