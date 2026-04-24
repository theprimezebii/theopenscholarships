'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ScholarshipForm from '@/components/admin/ScholarshipForm';

export default function NewScholarshipForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) {
    router.push('/admin/login');
    return null;
  }

  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/scholarships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) router.push('/admin/scholarships');
    else alert('Error: ' + (await res.json()).error);
  };

  return (
    <AdminLayout title="New Scholarship">
      <div className="max-w-5xl mx-auto">
        <ScholarshipForm onSubmit={handleSubmit} submitLabel="Save Scholarship" />
      </div>
    </AdminLayout>
  );
}
