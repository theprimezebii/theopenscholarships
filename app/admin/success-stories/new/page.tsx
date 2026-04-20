'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SuccessStoryForm from '@/components/admin/SuccessStoryForm';

export default function NewSuccessStoryPage() {
  const router = useRouter();
  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/success-stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) router.push('/admin/success-stories');
    else alert('Failed to create');
  };

  return (
    <AdminLayout title="New Success Story">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6"><Link href="/admin/success-stories" className="text-[#0B3B2F] text-sm">← Back to stories</Link></div>
        <SuccessStoryForm onSubmit={handleSubmit} submitLabel="Create Story" />
      </div>
    </AdminLayout>
  );
}
