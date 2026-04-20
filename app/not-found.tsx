'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, ArrowLeft, Home, Search, GraduationCap } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B3B2F] via-[#1A5D4A] to-[#0B3B2F] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#D4A373]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#D4A373]/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#D4A373]/5 rounded-full blur-3xl"></div>

      {/* Floating icons */}
      <div className="absolute top-[15%] left-[10%] animate-float opacity-20">
        <GraduationCap className="w-16 h-16 text-white" />
      </div>
      <div className="absolute bottom-[20%] right-[15%] animate-float-delay opacity-20">
        <Compass className="w-12 h-12 text-white" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* 404 with Compass */}
        <div className="mb-8 relative">
          <div className="text-[120px] md:text-[160px] font-bold font-serif text-white/10 tracking-wider select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass className="w-20 h-20 md:w-28 md:h-28 text-[#D4A373] animate-spin-slow" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-serif text-white font-bold mb-3">
          Page Not Found
        </h1>
        <p className="text-white/60 text-base mb-8 max-w-md mx-auto">
          The scholarship page you're looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#D4A373] text-[#0B3B2F] rounded-lg font-medium hover:bg-[#C67B5E] transition-all"
          >
            <Home className="w-4 h-4" />
            Home Page
          </Link>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/scholarships" className="text-white/50 text-sm hover:text-[#D4A373] transition-colors">
            Browse Scholarships
          </Link>
          <span className="text-white/20">•</span>
          <Link href="/how-to-apply" className="text-white/50 text-sm hover:text-[#D4A373] transition-colors">
            How to Apply
          </Link>
          <span className="text-white/20">•</span>
          <Link href="/contact" className="text-white/50 text-sm hover:text-[#D4A373] transition-colors">
            Contact Us
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 4s ease-in-out infinite 1s; }
      `}</style>
    </div>
  );
}
