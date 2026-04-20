'use client';
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Trash2, ChevronUp, ChevronDown, CheckSquare, Square } from 'lucide-react';

interface Topic {
  _id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  replies: number;
  views: number;
  createdAt: string;
}

type SortField = 'title' | 'category' | 'author' | 'replies' | 'views' | 'date';
type SortOrder = 'asc' | 'desc';

export default function AdminForumPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => { fetchTopics(); }, []);
  useEffect(() => { applyFiltersAndSort(); }, [topics, searchQuery, sortField, sortOrder]);

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/forum/topics');
      const data = await res.json();
      setTopics(data.topics || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...topics];
    if (searchQuery) {
      filtered = filtered.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()) || t.author.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (sortField) {
        case 'title': aVal = a.title; bVal = b.title; break;
        case 'category': aVal = a.category; bVal = b.category; break;
        case 'author': aVal = a.author; bVal = b.author; break;
        case 'replies': aVal = a.replies; bVal = b.replies; break;
        case 'views': aVal = a.views; bVal = b.views; break;
        case 'date': aVal = new Date(a.createdAt).getTime(); bVal = new Date(b.createdAt).getTime(); break;
      }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredTopics(filtered);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this discussion?')) return;
    await fetch(`/api/admin/forum/topics/${id}`, { method: 'DELETE' });
    fetchTopics();
    setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} discussion(s)?`)) return;
    setBulkDeleting(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => fetch(`/api/admin/forum/topics/${id}`, { method: 'DELETE' })));
      fetchTopics();
      setSelectedIds(new Set());
    } catch { alert('Bulk delete failed'); } finally { setBulkDeleting(false); }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTopics.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredTopics.map(t => t._id)));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-2">{children}{sortField === field && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}</div>
    </th>
  );

  if (loading) return <AdminLayout title="Forum"><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div></div></AdminLayout>;

  return (
    <AdminLayout title="Forum" subtitle="Manage discussions">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#D4A373] w-full" />
        </div>
        {selectedIds.size > 0 && (
          <button onClick={handleBulkDelete} disabled={bulkDeleting} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete Selected ({selectedIds.size})
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-4">Showing {filteredTopics.length} of {topics.length} discussions</p>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 w-10"><button onClick={toggleSelectAll} className="text-gray-500 hover:text-[#0B3B2F]">{selectedIds.size === filteredTopics.length && filteredTopics.length > 0 ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}</button></th>
              <SortHeader field="title">Topic</SortHeader>
              <SortHeader field="category">Category</SortHeader>
              <SortHeader field="author">Author</SortHeader>
              <SortHeader field="replies">Replies</SortHeader>
              <SortHeader field="views">Views</SortHeader>
              <SortHeader field="date">Date</SortHeader>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTopics.length === 0 ? (
              <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">No discussions found.</td></tr>
            ) : (
              filteredTopics.map(topic => (
                <tr key={topic._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><button onClick={() => toggleSelect(topic._id)} className="text-gray-500 hover:text-[#0B3B2F]">{selectedIds.has(topic._id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}</button></td>
                  <td className="px-6 py-4"><Link href={`/forum/discussions/${topic.slug || topic._id}`} target="_blank" className="font-medium text-[#1A1A1A] text-sm hover:text-[#0B3B2F] line-clamp-1">{topic.title}</Link></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{topic.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{topic.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{topic.replies}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{topic.views}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(topic.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right"><button onClick={() => handleDelete(topic._id)} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
