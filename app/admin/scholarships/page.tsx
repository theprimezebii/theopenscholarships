'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Plus, Edit, Trash2, Search, ChevronUp, ChevronDown,
  Filter, CheckSquare, Square
} from 'lucide-react';

interface Scholarship {
  _id: string;
  title: string;
  hostCountries: string[];
  degreeLevel: string | string[];
  deadline: string;
  status: string;
  provider?: string;
}

type SortField = 'title' | 'country' | 'degree' | 'deadline' | 'status';
type SortOrder = 'asc' | 'desc';

const PAGE_SIZE_OPTIONS = [25, 50, 75, 100];

function ScholarshipsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('limit') || '25');
  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const countryFilter = searchParams.get('country') || '';   // ← moved up here
  const sortField = (searchParams.get('sortField') as SortField) || 'deadline';
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'asc';

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const isUpdatingFromUrl = useRef(false);
  const [countries, setCountries] = useState<string[]>([]);   // ← countries state

  const totalPages = Math.ceil(total / pageSize);

  // Fetch country list once
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('/api/filters');
        const data = await res.json();
        setCountries(data.countries || []);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // Now countryFilter is defined before fetchScholarships
  const fetchScholarships = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', pageSize.toString());
      if (searchQuery) params.set('search', searchQuery);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (countryFilter) params.set('country', countryFilter);    // ← now works
      params.set('sortField', sortField);
      params.set('sortOrder', sortOrder);

      const res = await fetch(`/api/scholarships?${params.toString()}`);
      const data = await res.json();
      setScholarships(data.scholarships || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch scholarships:', error);
    } finally {
      setLoading(false);
      setSelectedIds(new Set());
    }
  }, [currentPage, pageSize, searchQuery, statusFilter, countryFilter, sortField, sortOrder]);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.replace(`/admin/scholarships?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Sync URL on filter/page changes
  useEffect(() => {
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }
    const updates: Record<string, string | null> = {};
    if (currentPage > 1) updates.page = currentPage.toString();
    if (pageSize !== 25) updates.limit = pageSize.toString();
    if (searchQuery) updates.search = searchQuery;
    if (statusFilter !== 'all') updates.status = statusFilter;
    if (countryFilter) updates.country = countryFilter;      // ← sync country
    if (sortField !== 'deadline') updates.sortField = sortField;
    if (sortOrder !== 'asc') updates.sortOrder = sortOrder;
    updateUrl(updates);
  }, [currentPage, pageSize, searchQuery, statusFilter, countryFilter, sortField, sortOrder, updateUrl]);

  useEffect(() => {
    isUpdatingFromUrl.current = true;
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search: searchInput || null, page: '1' });
  };

  const handleStatusFilter = (status: string) => {
    updateUrl({ status: status === 'all' ? null : status, page: '1' });
  };

  const handleCountryFilter = (value: string) => {
    updateUrl({ country: value || null, page: '1' });
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
    if (!confirm('Delete this scholarship permanently?')) return;
    await fetch(`/api/scholarships/${id}`, { method: 'DELETE' });
    fetchScholarships();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected scholarship(s)?`)) return;
    setBulkDeleting(true);
    try {
      await fetch('/api/admin/scholarships/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      });
      fetchScholarships();
    } catch (error) {
      alert('Bulk delete failed');
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === scholarships.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(scholarships.map(s => s._id)));
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-green-100 text-green-700',
      'closing-soon': 'bg-orange-100 text-orange-700',
      closed: 'bg-gray-100 text-gray-600',
      'coming-soon': 'bg-blue-100 text-blue-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
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
    <AdminLayout title="Scholarships" subtitle="Manage all scholarship listings">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search scholarships..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] w-full sm:w-64"
            />
          </form>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] text-sm"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closing-soon">Closing Soon</option>
              <option value="closed">Closed</option>
              <option value="coming-soon">Coming Soon</option>
            </select>
            {/* Country filter */}
            <select
              value={countryFilter}
              onChange={(e) => handleCountryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] text-sm"
            >
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {bulkDeleting ? 'Deleting...' : `Delete (${selectedIds.size})`}
            </button>
          )}
          <Link
            href="/admin/scholarships/new"
            className="bg-[#0B3B2F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A5D4A] transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add New
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Showing {scholarships.length} of {total} scholarships
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 w-10">
                  <button onClick={toggleSelectAll} className="text-gray-500 hover:text-[#0B3B2F]">
                    {selectedIds.size === scholarships.length && scholarships.length > 0 ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <SortHeader field="title">Title</SortHeader>
                <SortHeader field="country">Country</SortHeader>
                <SortHeader field="degree">Degree</SortHeader>
                <SortHeader field="deadline">Deadline</SortHeader>
                <SortHeader field="status">Status</SortHeader>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center">Loading...</td></tr>
              ) : scholarships.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No scholarships found.</td></tr>
              ) : (
                scholarships.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <button onClick={() => toggleSelect(s._id)} className="text-gray-500 hover:text-[#0B3B2F]">
                        {selectedIds.has(s._id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-medium text-sm line-clamp-1">{s.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.hostCountries?.[0] || 'Various'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{Array.isArray(s.degreeLevel) ? s.degreeLevel.join(', ') : s.degreeLevel}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(s.deadline).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(s.status)}`}>{s.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/scholarships/${s._id}/edit`} className="p-1.5 text-gray-500 hover:text-[#0B3B2F]">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(s._id)} className="p-1.5 text-gray-500 hover:text-red-600">
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

export default function AdminScholarshipsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div></div>}>
      <ScholarshipsPageContent />
    </Suspense>
  );
}