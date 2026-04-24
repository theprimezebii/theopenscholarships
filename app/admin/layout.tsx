import { Suspense } from 'react';
import AdminProvider from './AdminProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div></div>}>
        {children}
      </Suspense>
    </AdminProvider>
  );
}
