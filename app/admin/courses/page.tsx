import { Suspense } from 'react';
import CoursesAdminContent from './CoursesAdminContent';

export default function AdminCoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CoursesAdminContent />
    </Suspense>
  );
}
