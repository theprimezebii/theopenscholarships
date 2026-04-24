// app/admin/courses/new/page.tsx
'use client';
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import CourseForm from '@/components/admin/CourseForm';

export default function NewCoursePage() {
  const router = useRouter();
  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) router.push('/admin/courses');
    else alert('Failed to create');
  };
  return (
    <AdminLayout title="New Course">
      <CourseForm onSubmit={handleSubmit} submitLabel="Create Course" />
    </AdminLayout>
  );
}