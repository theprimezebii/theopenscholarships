'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ScholarshipForm from '@/components/admin/ScholarshipForm';

export default function EditScholarshipPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const res = await fetch(`/api/scholarships/${id}`);
        const data = await res.json();
        if (!res.ok) {
          alert('Failed to load scholarship');
          router.push('/admin/scholarships');
          return;
        }
        setInitialData(data);
      } catch (error) {
        alert('Failed to load');
        router.push('/admin/scholarships');
      } finally {
        setLoading(false);
      }
    };
    fetchScholarship();
  }, [id, router]);

  const handleSubmit = async (formData: any) => {
    const res = await fetch(`/api/scholarships/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      router.push('/admin/scholarships');
    } else {
      const error = await res.json();
      alert('Error: ' + error.error);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Scholarship">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Scholarship">
      <div className="max-w-5xl mx-auto">
        {initialData && (
          <ScholarshipForm
            initialData={initialData}
            onSubmit={handleSubmit}
            submitLabel="Update Scholarship"
          />
        )}
      </div>
    </AdminLayout>
  );
}