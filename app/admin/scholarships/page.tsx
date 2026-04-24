import { Suspense } from 'react';
import ScholarshipsAdminContent from './ScholarshipsAdminContent';

export default function AdminScholarshipsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div></div>}>
      <ScholarshipsAdminContent />
    </Suspense>
  );
}
