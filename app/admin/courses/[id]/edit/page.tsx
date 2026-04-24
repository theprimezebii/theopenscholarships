// app/admin/courses/[id]/edit/page.tsx (you need to create the directory)
'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import CourseForm from '@/components/admin/CourseForm';

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState(null);
  useEffect(() => {
    fetch(`/api/courses/${id}`).then(res => res.json()).then(data => setInitialData(data));
  }, [id]);

  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) router.push('/admin/courses');
  };

  if (!initialData) return <AdminLayout title="Edit Course"><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div></div></AdminLayout>;

  return (
    <AdminLayout title="Edit Course">
      <CourseForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Update Course" />
    </AdminLayout>
  );
}