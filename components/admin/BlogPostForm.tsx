'use client';

import { useState } from 'react';
import { Eye, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

const CATEGORY_OPTIONS = [
  { value: 'Writing Tips', label: 'Writing Tips' },
  { value: 'Recommendations', label: 'Recommendations' },
  { value: 'Language Tests', label: 'Language Tests' },
  { value: 'Scholarship Lists', label: 'Scholarship Lists' },
  { value: 'Interview Guide', label: 'Interview Guide' },
  { value: 'Finance Guide', label: 'Finance Guide' },
  { value: 'Country Guide', label: 'Country Guide' },
  { value: 'Application Tips', label: 'Application Tips' },
  { value: 'Success Stories', label: 'Success Stories' },
];

interface FaqItem {
  question: string;
  answer: string;
}

interface BlogPostFormProps {
  initialData?: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    readTime: string;
    author: string;
    authorRole: string;
    image: string;
    tags: string[];
    published: boolean;
    faqs?: FaqItem[];
  };
  onSubmit: (data: any) => Promise<void>;
  submitLabel: string;
  isEditing?: boolean;
}

export default function BlogPostForm({ initialData, onSubmit, submitLabel }: BlogPostFormProps) {
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || 'Writing Tips',
    readTime: initialData?.readTime || '5 min read',
    author: initialData?.author || 'TheOpenScholarships Team',
    authorRole: initialData?.authorRole || '',
    image: initialData?.image || '',
    tags: initialData?.tags || [],
    published: initialData?.published ?? true,
    faqs: initialData?.faqs || [],
  });
  const [tagInput, setTagInput] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    setPreviewLoading(true);
    try {
      const res = await fetch('/api/blog/posts/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        window.open(`/blog/${data.slug}`, '_blank');
      } else {
        alert('Preview failed: ' + data.error);
      }
    } catch (error) {
      alert('Preview failed. Please try again.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addFaq = () => {
    const newFaqs = [...formData.faqs, { question: '', answer: '' }];
    setFormData({ ...formData, faqs: newFaqs });
    setExpandedFaq(newFaqs.length - 1);
  };

  const removeFaq = (index: number) => {
    const newFaqs = formData.faqs.filter((_, i) => i !== index);
    setFormData({ ...formData, faqs: newFaqs });
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else if (expandedFaq !== null && expandedFaq > index) {
      setExpandedFaq(expandedFaq - 1);
    }
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData({ ...formData, faqs: newFaqs });
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
            <textarea rows={2} required value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2">
                {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
              <input type="text" value={formData.readTime} onChange={(e) => setFormData({...formData, readTime: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Content</h2>
        <RichTextEditor
          content={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
          placeholder="Write your blog post content here..."
        />
      </div>

      {/* FAQs Section - Fixed */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Frequently Asked Questions</h2>
          <button
            type="button"
            onClick={addFaq}
            className="flex items-center gap-2 text-sm text-[#0B3B2F] hover:text-[#D4A373] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>
        
        {formData.faqs.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No FAQs added yet. Click "Add FAQ" to create one.</p>
        ) : (
          <div className="space-y-3">
            {formData.faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header with expand/collapse and delete - no nested buttons */}
                <div className="flex items-stretch bg-gray-50">
                  {/* Expand/Collapse area */}
                  <div
                    onClick={() => toggleFaq(index)}
                    className="flex-1 flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleFaq(index); }}
                  >
                    <span className="font-medium text-[#1A1A1A] truncate pr-4">
                      {faq.question || `Question ${index + 1}`}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                  {/* Delete button - separate from expand area */}
                  <div
                    onClick={(e) => { e.stopPropagation(); removeFaq(index); }}
                    className="flex items-center px-4 text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors cursor-pointer border-l border-gray-200"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); removeFaq(index); } }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </div>
                </div>
                {/* Expanded content */}
                {expandedFaq === index && (
                  <div className="p-4 bg-white space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        placeholder="e.g., How many recommendation letters do I need?"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        placeholder="Provide a clear and helpful answer..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Author & Media */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Author & Media</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
            <input type="text" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Role</label>
            <input type="text" value={formData.authorRole} onChange={(e) => setFormData({...formData, authorRole: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="e.g., Scholarship Expert" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
          <input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="https://..." />
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">Tags</h2>
        <div className="flex gap-2 mb-3">
          <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 border border-gray-300 rounded-lg px-4 py-2" placeholder="Enter a tag" />
          <button type="button" onClick={addTag} className="bg-gray-200 px-4 py-2 rounded-lg text-sm">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-2">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Published */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({...formData, published: e.target.checked})} className="w-5 h-5 text-[#0B3B2F] rounded" />
          <span className="text-gray-700">Publish immediately</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="bg-[#0B3B2F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1A5D4A] disabled:opacity-50">
          {loading ? 'Saving...' : submitLabel}
        </button>
        <button type="button" onClick={handlePreview} disabled={previewLoading} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          {previewLoading ? 'Loading...' : 'Preview'}
        </button>
        <button type="button" onClick={() => window.history.back()} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200">
          Cancel
        </button>
      </div>
    </form>
  );
}
