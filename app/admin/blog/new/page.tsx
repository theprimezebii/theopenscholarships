'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogPostForm from '@/components/admin/BlogPostForm';

export default function NewBlogPostPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      router.push('/admin/blog');
    } else {
      const error = await res.json();
      alert('Error: ' + error.error);
    }
  };

  return (
    <AdminLayout title="New Blog Post">
      <div className="max-w-3xl mx-auto">
        <BlogPostForm onSubmit={handleSubmit} submitLabel="Publish Post" />
      </div>
    </AdminLayout>
  );
}