'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BlogPostForm from '@/components/admin/BlogPostForm';

export default function NewBlogPostPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/admin/check');
      if (!res.ok) router.push('/admin/login');
    };
    checkAuth();
  }, []);

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0B3B2F] text-white py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-white/80 hover:text-white text-sm">← Dashboard</Link>
            <span className="text-white/30">|</span>
            <Link href="/admin/blog" className="text-white/80 hover:text-white text-sm">Blog</Link>
            <span className="text-white/30">|</span>
            <span className="text-white font-medium">New Post</span>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-2xl text-[#1A1A1A] mb-6">Create New Blog Post</h1>
        <BlogPostForm onSubmit={handleSubmit} submitLabel="Publish Post" />
      </div>
    </div>
  );
}
