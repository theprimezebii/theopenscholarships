// app/courses/CoursesContent.tsx
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CourseCard from '@/components/CourseCard';
import CourseCardSkeleton from '@/components/CourseCardSkeleton';
import Pagination from '@/components/Pagination';
import {
  Search, Filter, X, ChevronDown, BookOpen, Globe, Award, Star
} from 'lucide-react';

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
}

const ITEMS_PER_PAGE = 9;
const levelOptions = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const certificateOptions = [
  { value: '', label: 'Any' },
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];
const ratingOptions = ['1', '2', '3', '4'];

export default function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Filters from URL
  const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
  const selectedPlatforms = searchParams.get('platforms')?.split(',').filter(Boolean) || [];
  const selectedLanguages = searchParams.get('languages')?.split(',').filter(Boolean) || [];
  const selectedLevel = searchParams.get('level') || '';
  const certificateFilter = searchParams.get('certificate') || '';
  const ratingFilter = searchParams.get('rating') || '';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Fetch filter options
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch('/api/courses/filters');
        const data = await res.json();
        setCategories(data.categories || []);
        setPlatforms(data.platforms || []);
        setLanguages(data.languages || []);
      } catch (error) { console.error('Failed to fetch course filters', error); }
    };
    fetchFilters();
  }, []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length) params.set('categories', selectedCategories.join(','));
    if (selectedPlatforms.length) params.set('platforms', selectedPlatforms.join(','));
    if (selectedLanguages.length) params.set('languages', selectedLanguages.join(','));
    if (selectedLevel) params.set('level', selectedLevel);
    if (certificateFilter) params.set('certificate', certificateFilter);
    if (ratingFilter) params.set('rating', ratingFilter);
    if (searchQuery) params.set('search', searchQuery);
    params.set('page', currentPage.toString());
    params.set('limit', ITEMS_PER_PAGE.toString());
    return params.toString();
  }, [selectedCategories, selectedPlatforms, selectedLanguages, selectedLevel, certificateFilter, ratingFilter, searchQuery, currentPage]);

  const fetchCourses = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(`/api/courses?${queryString}`);
      const data = await res.json();
      setCourses(data.courses || []);
      setTotal(data.total || 0);
    } catch (error) { console.error(error); } finally {
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
    router.push(`/courses?${params.toString()}`, { scroll: false });
  };

  // Real‑time search with debounce (500ms)
  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateUrl({ search: value || null, page: '1' });
    }, 500);
  };

  const clearAllFilters = () => router.push('/courses');

  const toggleMultiSelect = (field: string, value: string, currentValues: string[]) => {
    const newVals = currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value];
    updateUrl({ [field]: newVals.length ? newVals.join(',') : null, page: '1' });
  };

  const totalFiltersApplied =
    selectedCategories.length + selectedPlatforms.length + selectedLanguages.length +
    (selectedLevel ? 1 : 0) + (certificateFilter ? 1 : 0) + (ratingFilter ? 1 : 0) + (searchQuery ? 1 : 0);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Hero */}
      <div className="relative text-white py-12 md:py-16 bg-gradient-to-r from-[#0B3B2F] to-[#1A5D4A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3">Free Online Courses</h1>
          <p className="text-white/80 text-lg">Learn from top institutions worldwide, completely free</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar – real‑time on input */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#D4A373] bg-gray-50 text-sm"
              />
            </div>
            {/* Optional: keep the button but it's no longer necessary – you can remove it if you want pure real‑time */}
            <button
              onClick={() => updateUrl({ search: searchInput || null, page: '1' })}
              className="bg-[#0B3B2F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1A5D4A] transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </div>

          {/* Desktop Filters (unchanged layout) */}
          <div className="hidden lg:block mt-4">
            <div ref={dropdownRef} className="flex flex-wrap gap-3">
              {/* Category */}
              <div className="relative">
                <button onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm whitespace-nowrap">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  Category {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                  <ChevronDown className={`w-4 h-4 transition ${openDropdown === 'category' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'category' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50 max-h-64 overflow-y-auto">
                    {categories.map(c => (
                      <label key={c} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                        <input type="checkbox" checked={selectedCategories.includes(c)} onChange={() => toggleMultiSelect('categories', c, selectedCategories)} className="w-4 h-4 text-[#0B3B2F] rounded" /> {c}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Platform */}
              <div className="relative">
                <button onClick={() => setOpenDropdown(openDropdown === 'platform' ? null : 'platform')}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm whitespace-nowrap">
                  <Globe className="w-4 h-4 text-gray-500" />
                  Platform {selectedPlatforms.length > 0 && `(${selectedPlatforms.length})`}
                  <ChevronDown className={`w-4 h-4 transition ${openDropdown === 'platform' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'platform' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50 max-h-64 overflow-y-auto">
                    {platforms.map(p => (
                      <label key={p} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                        <input type="checkbox" checked={selectedPlatforms.includes(p)} onChange={() => toggleMultiSelect('platforms', p, selectedPlatforms)} className="w-4 h-4 text-[#0B3B2F] rounded" /> {p}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Language */}
              <div className="relative">
                <button onClick={() => setOpenDropdown(openDropdown === 'language' ? null : 'language')}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm whitespace-nowrap">
                  <Globe className="w-4 h-4 text-gray-500" />
                  Language {selectedLanguages.length > 0 && `(${selectedLanguages.length})`}
                  <ChevronDown className={`w-4 h-4 transition ${openDropdown === 'language' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'language' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50 max-h-64 overflow-y-auto">
                    {languages.map(l => (
                      <label key={l} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                        <input type="checkbox" checked={selectedLanguages.includes(l)} onChange={() => toggleMultiSelect('languages', l, selectedLanguages)} className="w-4 h-4 text-[#0B3B2F] rounded" /> {l}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Level */}
              <div className="relative">
                <button onClick={() => setOpenDropdown(openDropdown === 'level' ? null : 'level')}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm whitespace-nowrap">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  {selectedLevel || 'All Levels'}
                  <ChevronDown className={`w-4 h-4 transition ${openDropdown === 'level' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'level' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                      <input type="radio" name="level" checked={selectedLevel === ''} onChange={() => updateUrl({ level: null })} className="w-4 h-4 text-[#0B3B2F]" />
                      <span className="text-sm">All Levels</span>
                    </label>
                    {levelOptions.map(l => (
                      <label key={l} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                        <input type="radio" name="level" checked={selectedLevel === l} onChange={() => updateUrl({ level: l, page: '1' })} className="w-4 h-4 text-[#0B3B2F]" />
                        <span className="text-sm">{l}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Certificate */}
              <div className="relative">
                <button onClick={() => setOpenDropdown(openDropdown === 'certificate' ? null : 'certificate')}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm whitespace-nowrap">
                  <Award className="w-4 h-4 text-gray-500" />
                  {certificateFilter === 'true' ? 'With Certificate' : certificateFilter === 'false' ? 'Without Certificate' : 'Certificate'}
                  <ChevronDown className={`w-4 h-4 transition ${openDropdown === 'certificate' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'certificate' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    {certificateOptions.map(o => (
                      <label key={o.value} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                        <input type="radio" name="certificate" checked={certificateFilter === o.value} onChange={() => updateUrl({ certificate: o.value || null })} className="w-4 h-4 text-[#0B3B2F]" />
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="relative">
                <button onClick={() => setOpenDropdown(openDropdown === 'rating' ? null : 'rating')}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm whitespace-nowrap">
                  <Star className="w-4 h-4 text-gray-500" />
                  {ratingFilter ? `≥ ${ratingFilter} stars` : 'Any Rating'}
                  <ChevronDown className={`w-4 h-4 transition ${openDropdown === 'rating' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'rating' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                      <input type="radio" name="rating" checked={!ratingFilter} onChange={() => updateUrl({ rating: null })} className="w-4 h-4 text-[#0B3B2F]" />
                      <span className="text-sm">Any</span>
                    </label>
                    {ratingOptions.map(r => (
                      <label key={r} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                        <input type="radio" name="rating" checked={ratingFilter === r} onChange={() => updateUrl({ rating: r, page: '1' })} className="w-4 h-4 text-[#0B3B2F]" />
                        <span className="text-sm">≥ {r} stars</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {totalFiltersApplied > 0 && (
                <button onClick={clearAllFilters} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 whitespace-nowrap">
                  <X className="w-4 h-4" /> Clear All
                </button>
              )}
            </div>

            {/* Active Tags */}
            {totalFiltersApplied > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                {selectedCategories.map(c => (
                  <span key={c} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">{c} <button onClick={() => toggleMultiSelect('categories', c, selectedCategories)} className="hover:text-red-500">×</button></span>
                ))}
                {selectedPlatforms.map(p => (
                  <span key={p} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">{p} <button onClick={() => toggleMultiSelect('platforms', p, selectedPlatforms)} className="hover:text-red-500">×</button></span>
                ))}
                {selectedLanguages.map(l => (
                  <span key={l} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">{l} <button onClick={() => toggleMultiSelect('languages', l, selectedLanguages)} className="hover:text-red-500">×</button></span>
                ))}
                {selectedLevel && <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">{selectedLevel} <button onClick={() => updateUrl({ level: null })} className="hover:text-red-500">×</button></span>}
                {certificateFilter && <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">{certificateFilter === 'true' ? 'With Certificate' : 'Without Certificate'} <button onClick={() => updateUrl({ certificate: null })} className="hover:text-red-500">×</button></span>}
                {ratingFilter && <span className="bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">≥ {ratingFilter} ☆ <button onClick={() => updateUrl({ rating: null })} className="hover:text-red-500">×</button></span>}
                {searchQuery && <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">"{searchQuery}" <button onClick={() => updateUrl({ search: null })} className="hover:text-red-500">×</button></span>}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Active Filters */}
        {totalFiltersApplied > 0 && (
          <div className="lg:hidden flex flex-wrap gap-2 mb-4">
            {selectedCategories.map(c => (
              <span key={c} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">{c} <button onClick={() => toggleMultiSelect('categories', c, selectedCategories)} className="hover:text-red-500">×</button></span>
            ))}
            {selectedPlatforms.map(p => (
              <span key={p} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">{p} <button onClick={() => toggleMultiSelect('platforms', p, selectedPlatforms)} className="hover:text-red-500">×</button></span>
            ))}
            {selectedLanguages.map(l => (
              <span key={l} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">{l} <button onClick={() => toggleMultiSelect('languages', l, selectedLanguages)} className="hover:text-red-500">×</button></span>
            ))}
            {selectedLevel && <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">{selectedLevel} <button onClick={() => updateUrl({ level: null })} className="hover:text-red-500">×</button></span>}
            {certificateFilter && <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">{certificateFilter === 'true' ? 'With Certificate' : 'Without Certificate'} <button onClick={() => updateUrl({ certificate: null })} className="hover:text-red-500">×</button></span>}
            {ratingFilter && <span className="bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">≥ {ratingFilter} ☆ <button onClick={() => updateUrl({ rating: null })} className="hover:text-red-500">×</button></span>}
            {searchQuery && <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">"{searchQuery}" <button onClick={() => updateUrl({ search: null })} className="hover:text-red-500">×</button></span>}
          </div>
        )}

        {/* Results – with skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No courses found.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => <CourseCard key={course._id} course={course} />)}
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => updateUrl({ page: String(page) })} />}
          </>
        )}
      </div>

      {/* Sticky Filter Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <button onClick={() => setShowMobileFilters(true)}
          className="bg-[#0B3B2F] text-white px-6 py-3 rounded-lg font-medium shadow-lg flex items-center gap-2">
          <Filter className="w-5 h-5" /> Filters {totalFiltersApplied > 0 && `(${totalFiltersApplied})`}
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto z-50">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-5">
              {totalFiltersApplied > 0 && <button onClick={clearAllFilters} className="text-sm text-red-500">Clear all filters</button>}
              <div>
                <h4 className="font-medium mb-2">Category</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.map(c => (
                    <label key={c} className="flex items-center gap-2">
                      <input type="checkbox" checked={selectedCategories.includes(c)} onChange={() => toggleMultiSelect('categories', c, selectedCategories)} className="w-4 h-4 text-[#0B3B2F] rounded" /> {c}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Platform</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {platforms.map(p => (
                    <label key={p} className="flex items-center gap-2">
                      <input type="checkbox" checked={selectedPlatforms.includes(p)} onChange={() => toggleMultiSelect('platforms', p, selectedPlatforms)} className="w-4 h-4 text-[#0B3B2F] rounded" /> {p}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Language</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {languages.map(l => (
                    <label key={l} className="flex items-center gap-2">
                      <input type="checkbox" checked={selectedLanguages.includes(l)} onChange={() => toggleMultiSelect('languages', l, selectedLanguages)} className="w-4 h-4 text-[#0B3B2F] rounded" /> {l}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Level</h4>
                <div className="space-y-2">
                  {levelOptions.map(l => (
                    <label key={l} className="flex items-center gap-2">
                      <input type="radio" name="mobile-level" checked={selectedLevel === l} onChange={() => updateUrl({ level: l, page: '1' })} className="w-4 h-4 text-[#0B3B2F]" /> {l}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Certificate</h4>
                <div className="space-y-2">
                  {certificateOptions.map(o => (
                    <label key={o.value} className="flex items-center gap-2">
                      <input type="radio" name="mobile-cert" checked={certificateFilter === o.value} onChange={() => updateUrl({ certificate: o.value || null, page: '1' })} className="w-4 h-4 text-[#0B3B2F]" /> {o.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Rating</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="mobile-rating" checked={!ratingFilter} onChange={() => updateUrl({ rating: null, page: '1' })} className="w-4 h-4 text-[#0B3B2F]" /> Any
                  </label>
                  {ratingOptions.map(r => (
                    <label key={r} className="flex items-center gap-2">
                      <input type="radio" name="mobile-rating" checked={ratingFilter === r} onChange={() => updateUrl({ rating: r, page: '1' })} className="w-4 h-4 text-[#0B3B2F]" /> ≥ {r} stars
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}