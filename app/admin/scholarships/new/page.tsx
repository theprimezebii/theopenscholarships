'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ScholarshipForm from '@/components/admin/ScholarshipForm';

export default function NewScholarshipPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/scholarships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      router.push('/admin/scholarships');
    } else {
      const error = await res.json();
      alert('Error: ' + error.error);
    }
  };

  return (
    <AdminLayout title="Add New Scholarship">
      <div className="max-w-5xl mx-auto">
        <ScholarshipForm onSubmit={handleSubmit} submitLabel="Save Scholarship" />
      </div>
    </AdminLayout>
  );
}