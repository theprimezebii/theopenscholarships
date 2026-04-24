'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Plus, Edit, Trash2, Search, ChevronUp, ChevronDown, Filter, CheckSquare, Square
} from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  provider: string;
  platform: string;
  category: string;
  level: string;
  featured: boolean;
  createdAt: string;
}

type SortField = 'title' | 'provider' | 'platform' | 'category' | 'date';
type SortOrder = 'asc' | 'desc';

const PAGE_SIZE_OPTIONS = [25, 50, 75, 100];

export default function AdminCoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Read from URL
  const currentPage = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('limit') || '25');
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  const platformFilter = searchParams.get('platform') || '';
  const sortField = (searchParams.get('sortField') as SortField) || 'date';
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc';

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Filter options
  const [categories, setCategories] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);

  const totalPages = Math.ceil(total / pageSize);

  // Fetch filter options
  useEffect(() => {
    fetch('/api/admin/courses/filters')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
        setPlatforms(data.platforms || []);
      })
      .catch(console.error);
  }, []);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', pageSize.toString());
      if (searchQuery) params.set('search', searchQuery);
      if (categoryFilter) params.set('category', categoryFilter);
      if (platformFilter) params.set('platform', platformFilter);
      params.set('sortField', sortField);
      params.set('sortOrder', sortOrder);

      const res = await fetch(`/api/courses?${params.toString()}`);
      const data = await res.json();
      setCourses(data.courses || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
      setSelectedIds(new Set());
    }
  }, [currentPage, pageSize, searchQuery, categoryFilter, platformFilter, sortField, sortOrder]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/admin/courses?${params.toString()}`);
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
    if (!confirm('Delete this course?')) return;
    await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    fetchCourses();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected course(s)?`)) return;
    setBulkDeleting(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => fetch(`/api/courses/${id}`, { method: 'DELETE' })));
      fetchCourses();
    } catch (error) {
      alert('Bulk delete failed');
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === courses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(courses.map(c => c._id)));
    }
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
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortField === field ? (
          sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        ) : (
          <div className="w-4 h-4 opacity-0" />
        )}
      </div>
    </th>
  );

  return (
    <AdminLayout title="Online Courses" subtitle="Manage free online courses">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#D4A373] w-full sm:w-64"
            />
          </form>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => updateUrl({ category: e.target.value || null, page: '1' })}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={platformFilter}
              onChange={(e) => updateUrl({ platform: e.target.value || null, page: '1' })}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">All Platforms</option>
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {bulkDeleting ? 'Deleting...' : `Delete (${selectedIds.size})`}
            </button>
          )}
          <Link
            href="/admin/courses/new"
            className="bg-[#0B3B2F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A5D4A] flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Course
          </Link>
        </div>
      </div>

      {/* Results & Page Size */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Showing {courses.length} of {total} courses
          {selectedIds.size > 0 && ` · ${selectedIds.size} selected`}
        </p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Show:</label>
          <select
            value={pageSize}
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 w-10">
                  <button onClick={toggleSelectAll} className="text-gray-500 hover:text-[#0B3B2F]">
                    {selectedIds.size === courses.length && courses.length > 0 ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <SortHeader field="title">Title</SortHeader>
                <SortHeader field="provider">Provider</SortHeader>
                <SortHeader field="platform">Platform</SortHeader>
                <SortHeader field="category">Category</SortHeader>
                <SortHeader field="date">Date</SortHeader>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center">Loading...</td></tr>
              ) : courses.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No courses found.</td></tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <button onClick={() => toggleSelect(course._id)} className="text-gray-500 hover:text-[#0B3B2F]">
                        {selectedIds.has(course._id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-medium text-sm line-clamp-1">{course.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.provider}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.platform}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(course.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/courses/${course._id}/edit`} className="p-1.5 text-gray-500 hover:text-[#0B3B2F]">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(course._id)} className="p-1.5 text-gray-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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
              return (
                <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`w-10 h-10 rounded-lg border ${currentPage === pageNum ? 'bg-[#0B3B2F] text-white' : ''}`}>{pageNum}</button>
              );
            })}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-lg disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}