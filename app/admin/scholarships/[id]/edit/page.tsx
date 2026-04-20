'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ScholarshipForm from '@/components/admin/ScholarshipForm';

const toArray = (val: any): any[] => {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
};

// Helper to convert old deadline to month + period
function deadlineToMonthPeriod(dateStr: string): { month: number; period: string } {
  const date = new Date(dateStr);
  const month = date.getMonth();
  const day = date.getDate();
  let period = 'early';
  if (day > 20) period = 'late';
  else if (day > 10) period = 'mid';
  return { month, period };
}

export default function EditScholarshipPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/admin/check');
      if (!res.ok) router.push('/admin/login');
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchScholarship = async () => {
      const res = await fetch(`/api/scholarships/${id}`);
      const data = await res.json();
      if (!res.ok) { alert('Failed to load'); return; }
      
      // If old deadline exists, convert to month/period
      let deadlineMonth = data.deadlineMonth;
      let deadlinePeriod = data.deadlinePeriod;
      if (data.deadline && (deadlineMonth === undefined || deadlinePeriod === undefined)) {
        const converted = deadlineToMonthPeriod(data.deadline);
        deadlineMonth = converted.month;
        deadlinePeriod = converted.period;
      }
      
      setInitialData({
        title: data.title || '',
        provider: data.provider || '',
        description: data.description || '',
        benefits: Array.isArray(data.benefits) ? data.benefits.join('\n') : (data.benefits || ''),
        eligibility: Array.isArray(data.eligibility) ? data.eligibility.join('\n') : (data.eligibility || ''),
        howToApply: Array.isArray(data.howToApply) ? data.howToApply.join('\n') : (data.howToApply || ''),
        requiredDocuments: Array.isArray(data.requiredDocuments) ? data.requiredDocuments.join('\n') : (data.requiredDocuments || ''),
        applicationTips: data.applicationTips || '',
        officialLink: data.officialLink || '',
        image: data.image || '',
        featured: data.featured || false,
        importantDates: data.importantDates || { resultsAnnouncement: '', programmeStart: '' },
        faqs: data.faqs?.length ? data.faqs : [{ question: '', answer: '' }],
        useDefaultFaqs: data.faqs?.length ? false : true,
        degreeLevel: toArray(data.degreeLevel),
        fundingType: toArray(data.fundingType),
        programMode: toArray(data.programMode),
        programDuration: toArray(data.programDuration),
        programLevel: toArray(data.programLevel),
        region: toArray(data.region),
        hostCountries: toArray(data.hostCountries),
        fields: toArray(data.fields),
        deadlineMonth: deadlineMonth ?? 0,
        deadlinePeriod: deadlinePeriod || 'early',
      });
      
      setInitialLoading(false);
    };
    fetchScholarship();
  }, [id]);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    const res = await fetch(`/api/scholarships/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      router.push('/admin/scholarships');
    } else {
      const error = await res.json();
      alert('Error: ' + error.error);
    }
    setLoading(false);
  };

  if (initialLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0B3B2F] text-white py-4">
        <div className="max-w-5xl mx-auto px-4">
          <Link href="/admin/scholarships" className="text-white/80 hover:text-white">← Back to Scholarships</Link>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-serif text-2xl mb-6">Edit Scholarship</h1>
        {initialData && (
          <ScholarshipForm initialData={initialData} onSubmit={handleSubmit} submitLabel={loading ? 'Saving...' : 'Update Scholarship'} />
        )}
      </div>
    </div>
  );
}
