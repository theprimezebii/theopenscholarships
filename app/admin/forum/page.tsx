// app/admin/forum/page.tsx
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ForumContent from './ForumContent';

export default function AdminForumPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading forum...</div>}>
      <AdminLayout title="Forum" subtitle="Manage discussions">
        <ForumContent />
      </AdminLayout>
    </Suspense>
  );
}