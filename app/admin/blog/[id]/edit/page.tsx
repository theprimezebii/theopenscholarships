'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogPostForm from '@/components/admin/BlogPostForm';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/admin/check');
      if (!res.ok) router.push('/admin/login');
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/posts/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        // Clean faqs: remove _id to avoid serialization issues
        const cleanedFaqs = (data.faqs || []).map((f: any) => ({
          question: f.question,
          answer: f.answer
        }));
        setInitialData({
          ...data,
          faqs: cleanedFaqs,
        });
      } catch (error) {
        alert('Failed to load post');
        router.push('/admin/blog');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (formData: any) => {
    const res = await fetch(`/api/blog/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      router.push('/admin/blog');
    } else {
      const error = await res.json();
      alert('Error: ' + error.error);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Post">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Blog Post">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/blog" className="text-[#0B3B2F] text-sm">← Back to Blog</Link>
        </div>
        {initialData && (
          <BlogPostForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Update Post" />
        )}
      </div>
    </AdminLayout>
  );
}
