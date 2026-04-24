'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogPostForm from '@/components/admin/BlogPostForm';

export default function NewBlogPostForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) {
    router.push('/admin/login');
    return null;
  }

  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) router.push('/admin/blog');
    else alert('Error: ' + (await res.json()).error);
  };

  return (
    <AdminLayout title="New Blog Post">
      <div className="max-w-3xl mx-auto">
        <BlogPostForm onSubmit={handleSubmit} submitLabel="Publish Post" />
      </div>
    </AdminLayout>
  );
}
