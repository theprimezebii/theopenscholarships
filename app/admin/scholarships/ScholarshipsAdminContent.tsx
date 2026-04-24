'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, X, Plus, Edit, Trash2, Eye, Calendar, Award } from 'lucide-react';

interface Scholarship {
  _id: string;
  title: string;
  slug: string;
  provider: string;
  hostCountries: string[];
  degreeLevel: string[];
  deadline: string;
  status: string;
  fundingType: string[];
  views: number;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function ScholarshipsAdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fetchingRef = useRef(false);

  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [selectedStatus, setSelectedStatus] = useState(statusFilter);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (statusFilter) params.set('status', statusFilter);
    params.set('page', currentPage.toString());
    params.set('limit', ITEMS_PER_PAGE.toString());
    params.set('admin', 'true');
    return params.toString();
  }, [searchQuery, statusFilter, currentPage]);

  const fetchScholarships = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(`/api/scholarships?${queryString}`);
      const data = await res.json();
      setScholarships(data.scholarships || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch scholarships', error);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [queryString]);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val) params.set(key, val);
      else params.delete(key);
    });
    router.push(`/admin/scholarships?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => {
    updateUrl({ search: searchInput || null, page: '1' });
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    updateUrl({ status: value || null, page: '1' });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSelectedStatus('');
    router.push('/admin/scholarships', { scroll: false });
  };

  const hasFilters = !!(searchQuery || statusFilter);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete scholarship "${title}"?`)) return;
    try {
      const res = await fetch(`/api/scholarships/${id}`, { method: 'DELETE' });
      if (res.ok) fetchScholarships();
      else alert('Delete failed');
    } catch (error) {
      alert('Error deleting');
    }
  };

  const statusOptions = ['open', 'closing-soon', 'coming-soon', 'closed'];

  return (
    <AdminLayout title="Scholarships">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Manage Scholarships</h2>
          <Link href="/admin/scholarships/new" className="bg-[#0B3B2F] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Scholarship
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search scholarships..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
            >
              <option value="">All Status</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={handleSearch} className="bg-[#0B3B2F] text-white px-6 py-2 rounded-lg">Search</button>
            {hasFilters && (
              <button onClick={clearFilters} className="text-red-500 flex items-center gap-1">
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div></div>
        ) : scholarships.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No scholarships found.</div>
        ) : (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Provider</th>
                  <th className="px-4 py-3 text-left">Country</th>
                  <th className="px-4 py-3 text-left">Deadline</th>
                  <th className="px-4 py-3 text-left">Funding</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.map(s => (
                  <tr key={s._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/scholarships/${s.slug}`} target="_blank" className="text-[#0B3B2F] hover:underline">
                        {s.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{s.provider}</td>
                    <td className="px-4 py-3">{s.hostCountries?.slice(0,2).join(', ')}</td>
                    <td className="px-4 py-3">{new Date(s.deadline).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{s.fundingType?.join(', ')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        s.status === 'open' ? 'bg-green-100 text-green-800' :
                        s.status === 'closing-soon' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/scholarships/${s._id}/edit`} className="text-blue-600"><Edit className="w-4 h-4" /></Link>
                        <button onClick={() => handleDelete(s._id, s.title)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                        <Link href={`/scholarships/${s.slug}`} target="_blank" className="text-gray-600"><Eye className="w-4 h-4" /></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button disabled={currentPage === 1} onClick={() => updateUrl({ page: String(currentPage-1) })} className="px-3 py-1 border rounded">Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => updateUrl({ page: String(currentPage+1) })} className="px-3 py-1 border rounded">Next</button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
