'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import SuccessStoryForm from '@/components/admin/SuccessStoryForm';

export default function NewSuccessStoryForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) {
    router.push('/admin/login');
    return null;
  }

  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/success-stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) router.push('/admin/success-stories');
    else alert('Error: ' + (await res.json()).error);
  };

  return (
    <AdminLayout title="New Success Story">
      <div className="max-w-3xl mx-auto">
        <SuccessStoryForm onSubmit={handleSubmit} submitLabel="Save Story" />
      </div>
    </AdminLayout>
  );
}
