'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Filter, X, ChevronDown, Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  slug: string;
  provider: string;
  platform: string;
  category: string;
  level: string;
  duration: string;
  language: string;
  certificateOffered: boolean;
  rating?: number;
  enrolledCount?: string;
  image?: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function CoursesAdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fetchingRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // URL params
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  const platformFilter = searchParams.get('platform') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [selectedPlatform, setSelectedPlatform] = useState(platformFilter);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Fetch filter options
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch('/api/courses/filters');
        const data = await res.json();
        setCategories(data.categories || []);
        setPlatforms(data.platforms || []);
      } catch (error) {
        console.error('Failed to fetch filters', error);
      }
    };
    fetchFilters();
  }, []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (categoryFilter) params.set('category', categoryFilter);
    if (platformFilter) params.set('platform', platformFilter);
    params.set('page', currentPage.toString());
    params.set('limit', ITEMS_PER_PAGE.toString());
    params.set('admin', 'true');
    return params.toString();
  }, [searchQuery, categoryFilter, platformFilter, currentPage]);

  const fetchCourses = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(`/api/courses?${queryString}`);
      const data = await res.json();
      setCourses(data.courses || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch courses', error);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [queryString]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val) params.set(key, val);
      else params.delete(key);
    });
    router.push(`/admin/courses?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => {
    updateUrl({ search: searchInput || null, page: '1' });
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateUrl({ category: value || null, page: '1' });
  };

  const handlePlatformChange = (value: string) => {
    setSelectedPlatform(value);
    updateUrl({ platform: value || null, page: '1' });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSelectedCategory('');
    setSelectedPlatform('');
    router.push('/admin/courses', { scroll: false });
  };

  const hasFilters = !!(searchQuery || categoryFilter || platformFilter);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCourses();
      } else {
        alert('Failed to delete course');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred');
    }
  };

  return (
    <AdminLayout title="Online Courses">
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Manage free online courses</h2>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 bg-[#0B3B2F] text-white px-4 py-2 rounded-lg hover:bg-[#1A5D4A] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Course
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={selectedPlatform}
              onChange={(e) => handlePlatformChange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
            >
              <option value="">All Platforms</option>
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button
              onClick={handleSearch}
              className="bg-[#0B3B2F] text-white px-6 py-2 rounded-lg hover:bg-[#1A5D4A] transition-colors"
            >
              Search
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing {courses.length} of {total} courses</p>
        </div>

        {/* Courses Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            No courses found. <Link href="/admin/courses/new" className="text-[#0B3B2F] underline">Add your first course</Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium">Provider</th>
                  <th className="text-left px-4 py-3 font-medium">Platform</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/courses/${course.slug}`} className="text-[#0B3B2F] hover:underline" target="_blank">
                        {course.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{course.provider}</td>
                    <td className="px-4 py-3">{course.platform}</td>
                    <td className="px-4 py-3">{course.category}</td>
                    <td className="px-4 py-3">{new Date(course.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/courses/${course._id}/edit`} className="text-blue-600 hover:text-blue-800">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(course._id, course.title)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Link href={`/courses/${course.slug}`} target="_blank" className="text-gray-600 hover:text-gray-800">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => updateUrl({ page: String(Math.max(1, currentPage - 1)) })}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => updateUrl({ page: String(Math.min(totalPages, currentPage + 1)) })}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
