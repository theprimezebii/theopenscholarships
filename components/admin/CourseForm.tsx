'use client';

import { useState } from 'react';

const categoryOptions = [
  'Computer Science', 'Business', 'Data Science', 'Humanities', 'Engineering',
  'Health & Medicine', 'Arts & Design', 'Social Sciences', 'Mathematics', 'Others'
];

const levelOptions = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

export default function CourseForm({ initialData, onSubmit, submitLabel }: any) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    provider: initialData?.provider || '',
    platform: initialData?.platform || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Computer Science',
    level: initialData?.level || 'All Levels',
    duration: initialData?.duration || '',
    language: initialData?.language || 'English',
    certificateOffered: initialData?.certificateOffered || false,
    officialLink: initialData?.officialLink || '',
    image: initialData?.image || '',
    featured: initialData?.featured || false,
    tags: initialData?.tags || [],
    instructor: initialData?.instructor || '',
    requirements: initialData?.requirements || [],
    syllabus: initialData?.syllabus || [],
    platformDetails: initialData?.platformDetails || '',
    enrolledCount: initialData?.enrolledCount || '',
    rating: initialData?.rating || null,
    faqs: initialData?.faqs || [{ question: '', answer: '' }],
  });
  const [tagInput, setTagInput] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [syllabusInput, setSyllabusInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t: string) => t !== tag) });
  };

  const addRequirement = () => {
    if (reqInput.trim() && !formData.requirements.includes(reqInput.trim())) {
      setFormData({ ...formData, requirements: [...formData.requirements, reqInput.trim()] });
      setReqInput('');
    }
  };

  const removeRequirement = (index: number) => {
    const newReqs = formData.requirements.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, requirements: newReqs });
  };

  const addSyllabus = () => {
    if (syllabusInput.trim() && !formData.syllabus.includes(syllabusInput.trim())) {
      setFormData({ ...formData, syllabus: [...formData.syllabus, syllabusInput.trim()] });
      setSyllabusInput('');
    }
  };

  const removeSyllabus = (index: number) => {
    const newSyl = formData.syllabus.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, syllabus: newSyl });
  };

  const addFaq = () => {
    setFormData({ ...formData, faqs: [...formData.faqs, { question: '', answer: '' }] });
  };

  const removeFaq = (index: number) => {
    const newFaqs = formData.faqs.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, faqs: newFaqs });
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData({ ...formData, faqs: newFaqs });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Basic Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Provider *</label>
            <input type="text" required value={formData.provider} onChange={(e) => setFormData({...formData, provider: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Platform *</label>
            <input type="text" required value={formData.platform} onChange={(e) => setFormData({...formData, platform: e.target.value})} className="w-full border rounded-lg px-4 py-2" placeholder="e.g., Coursera, edX" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border rounded-lg px-4 py-2">
              {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full border rounded-lg px-4 py-2">
              {levelOptions.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input type="text" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full border rounded-lg px-4 py-2" placeholder="e.g., 4 weeks" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <input type="text" value={formData.language} onChange={(e) => setFormData({...formData, language: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={formData.certificateOffered} onChange={(e) => setFormData({...formData, certificateOffered: e.target.checked})} className="w-4 h-4" />
            <label className="text-sm">Certificate Offered</label>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea rows={4} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
        </div>
      </div>

      {/* Media & Links */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Media & Links</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Official Link *</label>
            <input type="url" required value={formData.officialLink} onChange={(e) => setFormData({...formData, officialLink: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4" />
          <label className="text-sm font-medium">Featured on homepage</label>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Tags</h2>
        <div className="flex gap-2 mb-2">
          <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 border rounded-lg px-4 py-2" placeholder="Add a tag" />
          <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag: string) => (
            <span key={tag} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-2">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Rich Content */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Rich Content</h2>
        {/* Requirements */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Requirements</label>
          <div className="flex gap-2 mb-2">
            <input type="text" value={reqInput} onChange={(e) => setReqInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())} className="flex-1 border rounded-lg px-4 py-2" placeholder="Add a requirement" />
            <button type="button" onClick={addRequirement} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Add</button>
          </div>
          <ul className="space-y-1">
            {formData.requirements.map((req: string, i: number) => (
              <li key={i} className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded">
                <span className="text-sm">{req}</span>
                <button type="button" onClick={() => removeRequirement(i)} className="text-red-500 hover:text-red-700">×</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Syllabus */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Syllabus</label>
          <div className="flex gap-2 mb-2">
            <input type="text" value={syllabusInput} onChange={(e) => setSyllabusInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSyllabus())} className="flex-1 border rounded-lg px-4 py-2" placeholder="Add a topic" />
            <button type="button" onClick={addSyllabus} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Add</button>
          </div>
          <ul className="space-y-1">
            {formData.syllabus.map((item: string, i: number) => (
              <li key={i} className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded">
                <span className="text-sm">{item}</span>
                <button type="button" onClick={() => removeSyllabus(i)} className="text-red-500 hover:text-red-700">×</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructor */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Instructor</label>
          <input type="text" value={formData.instructor} onChange={(e) => setFormData({...formData, instructor: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
        </div>

        {/* Platform Details */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Platform Details</label>
          <textarea rows={2} value={formData.platformDetails} onChange={(e) => setFormData({...formData, platformDetails: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
        </div>

        {/* Enrolled Count */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Enrolled Count</label>
          <input type="text" value={formData.enrolledCount} onChange={(e) => setFormData({...formData, enrolledCount: e.target.value})} className="w-full border rounded-lg px-4 py-2" placeholder="e.g., 4.8M+ students" />
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Rating (0‑5)</label>
          <input type="number" step="0.1" min="0" max="5" value={formData.rating || ''} onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value) || null})} className="w-full border rounded-lg px-4 py-2" />
        </div>

        {/* FAQs */}
        <div>
          <label className="block text-sm font-medium mb-1">FAQs</label>
          {formData.faqs.map((faq: any, i: number) => (
            <div key={i} className="mb-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">FAQ #{i+1}</span>
                <button type="button" onClick={() => removeFaq(i)} className="text-red-500 text-sm">Remove</button>
              </div>
              <input type="text" value={faq.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} className="w-full border rounded-lg px-3 py-1 mb-2" placeholder="Question" />
              <textarea rows={2} value={faq.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} className="w-full border rounded-lg px-3 py-1" placeholder="Answer" />
            </div>
          ))}
          <button type="button" onClick={addFaq} className="text-sm text-[#0B3B2F] hover:underline">+ Add FAQ</button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="bg-[#0B3B2F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1A5D4A] disabled:opacity-50">
          {loading ? 'Saving...' : submitLabel}
        </button>
        <button type="button" onClick={() => window.history.back()} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </form>
  );
}