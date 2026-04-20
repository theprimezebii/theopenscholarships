'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SuccessStoryForm from '@/components/admin/SuccessStoryForm';

export default function EditSuccessStoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/success-stories/${id}`).then(res => res.json()).then(data => { setInitialData(data); setLoading(false); });
  }, [id]);

  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/success-stories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) router.push('/admin/success-stories');
    else alert('Failed to update');
  };

  if (loading) return <AdminLayout title="Edit Story"><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div></div></AdminLayout>;

  return (
    <AdminLayout title="Edit Success Story">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6"><Link href="/admin/success-stories" className="text-[#0B3B2F] text-sm">← Back to stories</Link></div>
        {initialData && <SuccessStoryForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Update Story" />}
      </div>
    </AdminLayout>
  );
}
