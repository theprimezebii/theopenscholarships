'use client';

import { useState } from 'react';

interface SuccessStoryFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  submitLabel: string;
}

export default function SuccessStoryForm({ initialData, onSubmit, submitLabel }: SuccessStoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    country: initialData?.country || '',
    scholarship: initialData?.scholarship || '',
    university: initialData?.university || '',
    year: initialData?.year || new Date().getFullYear(),
    image: initialData?.image || '',
    quote: initialData?.quote || '',
    fullStory: initialData?.fullStory || '',
    program: initialData?.program || '',
    published: initialData?.published ?? true,
    order: initialData?.order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-4 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Country *</label><input type="text" required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full border rounded-lg px-4 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Scholarship *</label><input type="text" required value={formData.scholarship} onChange={(e) => setFormData({...formData, scholarship: e.target.value})} className="w-full border rounded-lg px-4 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">University *</label><input type="text" required value={formData.university} onChange={(e) => setFormData({...formData, university: e.target.value})} className="w-full border rounded-lg px-4 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Year *</label><input type="number" required value={formData.year} onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})} className="w-full border rounded-lg px-4 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Program *</label><input type="text" required value={formData.program} onChange={(e) => setFormData({...formData, program: e.target.value})} className="w-full border rounded-lg px-4 py-2" /></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Story Content</h2>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Image URL</label><input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full border rounded-lg px-4 py-2" placeholder="https://..." /></div>
          <div><label className="block text-sm font-medium mb-1">Quote *</label><textarea rows={2} required value={formData.quote} onChange={(e) => setFormData({...formData, quote: e.target.value})} className="w-full border rounded-lg px-4 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Full Story *</label><textarea rows={6} required value={formData.fullStory} onChange={(e) => setFormData({...formData, fullStory: e.target.value})} className="w-full border rounded-lg px-4 py-2" /></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full border rounded-lg px-4 py-2" /></div>
          <div className="flex items-center"><label className="flex items-center gap-2"><input type="checkbox" checked={formData.published} onChange={(e) => setFormData({...formData, published: e.target.checked})} className="w-4 h-4 text-[#0B3B2F]" /><span>Published</span></label></div>
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="bg-[#0B3B2F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1A5D4A] disabled:opacity-50">{loading ? 'Saving...' : submitLabel}</button>
        <button type="button" onClick={() => window.history.back()} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
      </div>
    </form>
  );
}
