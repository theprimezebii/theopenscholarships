'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Plus, Edit, Trash2, Search, ChevronUp, ChevronDown, 
  CheckSquare, Square 
} from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  category: string;
  author: string;
  published: boolean;
  views: number;
  createdAt: string;
  type?: string;
}

type SortField = 'title' | 'category' | 'author' | 'date' | 'type';
type SortOrder = 'asc' | 'desc';

const PAGE_SIZE_OPTIONS = [25, 50, 75, 100];

function BlogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('limit') || '25');
  const searchQuery = searchParams.get('search') || '';
  const sortField = (searchParams.get('sortField') as SortField) || 'date';
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc';
  
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', pageSize.toString());
      if (searchQuery) params.set('search', searchQuery);
      params.set('sortField', sortField);
      params.set('sortOrder', sortOrder);
      
      const res = await fetch(`/api/blog/posts?${params.toString()}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
      setSelectedIds(new Set());
    }
  }, [currentPage, pageSize, searchQuery, sortField, sortOrder]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/admin/blog?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search: searchInput || null, page: '1' });
  };

  const handleSort = (field: SortField) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    updateUrl({ sortField: field, sortOrder: newOrder, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage.toString() });
  };

  const handleLimitChange = (newLimit: number) => {
    updateUrl({ limit: newLimit.toString(), page: '1' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return;
    await fetch(`/api/blog/posts/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected post(s)?`)) return;
    setBulkDeleting(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => fetch(`/api/blog/posts/${id}`, { method: 'DELETE' })));
      fetchPosts();
      setSelectedIds(new Set());
    } catch (error) {
      alert('Bulk delete failed');
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === posts.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(posts.map(p => p._id)));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-2">
        {children}
        {sortField === field ? (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : <div className="w-4 h-4 opacity-0" />}
      </div>
    </th>
  );

  return (
    <AdminLayout title="Blog Posts" subtitle="Manage your blog content">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search posts..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#D4A373]" />
        </form>
        <div className="flex gap-3">
          {selectedIds.size > 0 && (
            <button onClick={handleBulkDelete} disabled={bulkDeleting} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete ({selectedIds.size})
            </button>
          )}
          <Link href="/admin/blog/new" className="bg-[#0B3B2F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A5D4A] flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">Showing {posts.length} of {total} posts {selectedIds.size > 0 && `· ${selectedIds.size} selected`}</p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Show:</label>
          <select value={pageSize} onChange={(e) => handleLimitChange(parseInt(e.target.value))} className="border border-gray-200 rounded-lg px-2 py-1 text-sm">
            {PAGE_SIZE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 w-10"><button onClick={toggleSelectAll} className="text-gray-500 hover:text-[#0B3B2F]">{selectedIds.size === posts.length && posts.length > 0 ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}</button></th>
              <SortHeader field="title">Title</SortHeader>
              <SortHeader field="category">Category</SortHeader>
              <SortHeader field="type">Type</SortHeader>
              <SortHeader field="author">Author</SortHeader>
              <SortHeader field="date">Date</SortHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={8} className="px-6 py-12 text-center">Loading...</td></tr> : posts.length === 0 ? <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">No posts found.</td></tr> : posts.map(post => (
              <tr key={post._id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><button onClick={() => toggleSelect(post._id)} className="text-gray-500 hover:text-[#0B3B2F]">{selectedIds.has(post._id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}</button></td>
                <td className="px-6 py-4 font-medium text-sm line-clamp-1">{post.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{post.category}</td>
                <td className="px-6 py-4 text-sm"><span className={`text-xs px-2 py-1 rounded-full ${post.type === 'guide' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{post.type === 'guide' ? 'Guide' : 'Article'}</span></td>
                <td className="px-6 py-4 text-sm text-gray-600">{post.author}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{post.published ? 'Published' : 'Draft'}</span></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/blog/${post._id}/edit`} className="p-1.5 text-gray-500 hover:text-[#0B3B2F]"><Edit className="w-4 h-4" /></Link>
                    <button onClick={() => handleDelete(post._id)} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border rounded-lg disabled:opacity-50">Previous</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`w-10 h-10 rounded-lg border ${currentPage === pageNum ? 'bg-[#0B3B2F] text-white' : ''}`}>{pageNum}</button>;
            })}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-lg disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default function AdminBlogPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div></div>}>
      <BlogPageContent />
    </Suspense>
  );
}
