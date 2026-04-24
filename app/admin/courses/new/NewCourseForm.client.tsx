'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import CourseForm from '@/components/admin/CourseForm';

export default function NewCourseForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) {
    router.push('/admin/login');
    return null;
  }

  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) router.push('/admin/courses');
    else alert('Error: ' + (await res.json()).error);
  };

  return (
    <AdminLayout title="New Course">
      <div className="max-w-3xl mx-auto">
        <CourseForm onSubmit={handleSubmit} submitLabel="Save Course" />
      </div>
    </AdminLayout>
  );
}
