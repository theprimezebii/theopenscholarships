import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CoursesContent from './CoursesContent';

export default function CoursesPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <CoursesContent />
      </Suspense>
      <Footer />
    </>
  );
}
