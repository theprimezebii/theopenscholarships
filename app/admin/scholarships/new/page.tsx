'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScholarshipForm from '@/components/admin/ScholarshipForm';

export default function NewScholarshipPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/admin/check');
      if (!res.ok) router.push('/admin/login');
    };
    checkAuth();
  }, []);

  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/scholarships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      router.push('/admin/scholarships');
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
            <Link href="/admin/scholarships" className="text-white/80 hover:text-white text-sm">Scholarships</Link>
            <span className="text-white/30">|</span>
            <span className="text-white font-medium">Add New Scholarship</span>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-2xl text-[#1A1A1A] mb-6">Add New Scholarship</h1>
        <ScholarshipForm onSubmit={handleSubmit} submitLabel="Save Scholarship" />
      </div>
    </div>
  );
}
