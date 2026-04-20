'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Edit, Trash2, Search, ChevronUp, ChevronDown } from 'lucide-react';

interface SuccessStory {
  _id: string;
  name: string;
  country: string;
  scholarship: string;
  university: string;
  year: number;
  published: boolean;
  order: number;
}

type SortField = 'name' | 'country' | 'scholarship' | 'university' | 'year' | 'order';
type SortOrder = 'asc' | 'desc';

export default function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('order');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [stories, searchQuery, sortField, sortOrder]);

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/success-stories?published=false');
      const data = await res.json();
      setStories(data.stories || []);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...stories];
    
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.scholarship.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.university.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (sortField) {
        case 'name': aVal = a.name; bVal = b.name; break;
        case 'country': aVal = a.country; bVal = b.country; break;
        case 'scholarship': aVal = a.scholarship; bVal = b.scholarship; break;
        case 'year': aVal = a.year; bVal = b.year; break;
        case 'order': aVal = a.order; bVal = b.order; break;
        default: return 0;
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredStories(filtered);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this success story?')) return;
    await fetch(`/api/success-stories/${id}`, { method: 'DELETE' });
    fetchStories();
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-2">
        {children}
        {sortField === field && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
      </div>
    </th>
  );

  if (loading) {
    return <AdminLayout title="Success Stories"><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Success Stories" subtitle="Manage student success stories">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search stories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] w-full" />
        </div>
        <Link href="/admin/success-stories/new" className="bg-[#0B3B2F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A5D4A] flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Story
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortHeader field="name">Name</SortHeader>
              <SortHeader field="country">Country</SortHeader>
              <SortHeader field="scholarship">Scholarship</SortHeader>
              <SortHeader field="university">University</SortHeader>
              <SortHeader field="year">Year</SortHeader>
              <SortHeader field="order">Order</SortHeader>
              <th className="px-6 py-3 text-xs font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStories.length === 0 ? (
              <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">No stories found.</td></tr>
            ) : (
              filteredStories.map((story) => (
                <tr key={story._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{story.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{story.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{story.scholarship}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{story.university}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{story.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{story.order}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${story.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {story.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/success-stories/${story._id}/edit`} className="p-1.5 text-gray-500 hover:text-[#0B3B2F]"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(story._id)} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
