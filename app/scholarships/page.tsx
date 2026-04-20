'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScholarshipCard from '@/components/ScholarshipCard';
import Pagination from '@/components/Pagination';
import ScholarshipCardSkeleton from '@/components/ScholarshipCardSkeleton';
import {
  Search, Filter, X, ChevronDown, MapPin, GraduationCap,
  Globe, BookOpen, DollarSign, Clock, Briefcase,
  Microscope
} from 'lucide-react';
import { useMemo } from 'react';

interface Scholarship {
  _id: string;
  title: string;
  slug: string;
  provider: string;
  hostCountries: string[];
  degreeLevel: string | string[];
  deadline: string;
  status: string;
  fundingType?: string | string[];
  region?: string | string[];
  programMode?: string | string[];
  programDuration?: string | string[];
  programLevel?: string | string[];
  image?: string;
  featured?: boolean;
  views?: number;
}

const ITEMS_PER_PAGE = 9;

export default function ScholarshipsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Derive state from URL (stable within a render)
  const selectedCountries = searchParams.get('countries')?.split(',').filter(Boolean) || [];
  const selectedDisciplines = searchParams.get('disciplines')?.split(',').filter(Boolean) || [];
  const selectedDegree = searchParams.get('degree') || '';
  const selectedFunding = searchParams.get('funding') || '';
  const selectedRegion = searchParams.get('region') || '';
  const selectedProgramMode = searchParams.get('programMode') || '';
  const selectedProgramDuration = searchParams.get('programDuration') || '';
  const selectedProgramLevel = searchParams.get('programLevel') || '';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [countries, setCountries] = useState<string[]>([]);
  const [disciplines, setDisciplines] = useState<string[]>([]);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const fundingTypes = ['Fully Funded', 'Partial Funding', 'Tuition Waiver', 'Living Stipend', 'Travel Grant'];
  const degreeOptions = ['Bachelor', 'Masters', 'PhD'];
  const regionOptions = ['Europe', 'North America', 'Asia Pacific', 'Middle East', 'Africa', 'Latin America'];
  const programModeOptions = [
    { value: 'online', label: 'Online' },
    { value: 'on-campus', label: 'On Campus' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'full-time', label: 'Full Time' },
  ];
  const programDurationOptions = [
    { value: '1-year', label: '1 Year' },
    { value: '2-years', label: '2 Years' },
    { value: '3-years', label: '3 Years' },
    { value: '4-years', label: '4 Years' },
  ];
  const programLevelOptions = [
    { value: 'regular', label: 'Regular' },
    { value: 'executive', label: 'Executive' },
    { value: 'research', label: 'Research' },
  ];

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const hasActiveFilters = useCallback(() => {
    return selectedCountries.length > 0 ||
           selectedDisciplines.length > 0 ||
           selectedDegree !== '' ||
           selectedFunding !== '' ||
           selectedRegion !== '' ||
           searchQuery !== '' ||
           selectedProgramMode !== '' ||
           selectedProgramDuration !== '' ||
           selectedProgramLevel !== '';
  }, [selectedCountries, selectedDisciplines, selectedDegree, selectedFunding, selectedRegion, searchQuery, selectedProgramMode, selectedProgramDuration, selectedProgramLevel]);

  // Set mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch filter options once
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await fetch('/api/filters');
        const data = await res.json();
        setCountries(data.countries || []);
        setDisciplines(data.disciplines || []);
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      }
    };
    fetchFilterOptions();
  }, []);

  // Build query string and store in ref to prevent dependency churn
 const queryString = useMemo(() => {
  const params = new URLSearchParams();
  if (selectedCountries.length) params.set('countries', selectedCountries.join(','));
  if (selectedDisciplines.length) params.set('disciplines', selectedDisciplines.join(','));
  if (selectedDegree) params.set('degree', selectedDegree);
  if (selectedFunding) params.set('funding', selectedFunding);
  if (selectedRegion) params.set('region', selectedRegion);
  if (searchQuery) params.set('search', searchQuery);
  if (selectedProgramMode) params.set('programMode', selectedProgramMode);
  if (selectedProgramDuration) params.set('programDuration', selectedProgramDuration);
  if (selectedProgramLevel) params.set('programLevel', selectedProgramLevel);
  params.set('page', currentPage.toString());
  params.set('limit', ITEMS_PER_PAGE.toString());
  return params.toString();
}, [selectedCountries, selectedDisciplines, selectedDegree, selectedFunding, selectedRegion, searchQuery, selectedProgramMode, selectedProgramDuration, selectedProgramLevel, currentPage]);

  const fetchScholarships = useCallback(async () => {
  if (!mounted || fetchingRef.current) return;
  fetchingRef.current = true;
  setLoading(true);
  try {
    const res = await fetch(`/api/scholarships/filter?${queryString}`);
    const data = await res.json();
    setScholarships(data.scholarships || []);
    setTotal(data.total || 0);
  } catch (error) {
    console.error('Failed to fetch scholarships:', error);
  } finally {
    setLoading(false);
    fetchingRef.current = false;
  }
}, [mounted, queryString]);

  // Fetch when the query string ref changes (i.e., filters or page change)
 useEffect(() => {
  if (!mounted) return;
  fetchScholarships();
}, [fetchScholarships, mounted]);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (!updates.hasOwnProperty('page') && Object.keys(updates).some(k => k !== 'page')) {
      params.set('page', '1');
    }
    router.push(`/scholarships?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search: searchInput || null, page: '1' });
  };

  const clearAllFilters = () => {
    router.push('/scholarships', { scroll: false });
  };

  const toggleCountry = (country: string) => {
    const newCountries = selectedCountries.includes(country)
      ? selectedCountries.filter(c => c !== country)
      : [...selectedCountries, country];
    updateUrl({ countries: newCountries.join(',') || null });
  };

  const toggleDiscipline = (discipline: string) => {
    const newDisciplines = selectedDisciplines.includes(discipline)
      ? selectedDisciplines.filter(d => d !== discipline)
      : [...selectedDisciplines, discipline];
    updateUrl({ disciplines: newDisciplines.join(',') || null });
  };

  const setFilter = (key: string, value: string) => {
    updateUrl({ [key]: value || null });
  };

  const removeFilter = (type: string, value: string) => {
    if (type === 'country') {
      const newVal = selectedCountries.filter(c => c !== value);
      updateUrl({ countries: newVal.join(',') || null });
    } else if (type === 'discipline') {
      const newVal = selectedDisciplines.filter(d => d !== value);
      updateUrl({ disciplines: newVal.join(',') || null });
    } else if (type === 'search') {
      updateUrl({ search: null });
    } else {
      updateUrl({ [type]: null });
    }
  };

  const totalFiltersApplied =
    selectedCountries.length +
    selectedDisciplines.length +
    (selectedDegree ? 1 : 0) +
    (selectedFunding ? 1 : 0) +
    (selectedRegion ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (selectedProgramMode ? 1 : 0) +
    (selectedProgramDuration ? 1 : 0) +
    (selectedProgramLevel ? 1 : 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const heroImageUrl = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format';

  const normalizeScholarship = (s: Scholarship) => ({
    ...s,
    degreeLevel: Array.isArray(s.degreeLevel) ? s.degreeLevel : [s.degreeLevel],
    fundingType: Array.isArray(s.fundingType) ? s.fundingType : s.fundingType ? [s.fundingType] : [],
    region: Array.isArray(s.region) ? s.region : s.region ? [s.region] : [],
    programMode: Array.isArray(s.programMode) ? s.programMode : s.programMode ? [s.programMode] : [],
    programDuration: Array.isArray(s.programDuration) ? s.programDuration : s.programDuration ? [s.programDuration] : [],
    programLevel: Array.isArray(s.programLevel) ? s.programLevel : s.programLevel ? [s.programLevel] : [],
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div
          className="relative text-white py-12 md:py-16"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(11, 59, 47, 0.85), rgba(26, 93, 74, 0.85)), url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0B3B2F'
          }}
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3">All Scholarships</h1>
            <p className="text-white/80 text-sm md:text-lg">Discover fully funded opportunities from top universities worldwide</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by scholarship, provider, or keyword..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] bg-gray-50 text-sm md:text-base"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-[#0B3B2F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1A5D4A] transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:block mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h3>
                {totalFiltersApplied > 0 && (
                  <button onClick={clearAllFilters} className="text-sm text-red-500 hover:text-red-700">
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4" ref={dropdownRef}>
                {/* Country */}
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'country' ? null : 'country')}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-[#D4A373] transition-colors bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="truncate">Country {selectedCountries.length > 0 && `(${selectedCountries.length})`}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'country' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'country' && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
                      {countries.map(country => (
                        <label key={country} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" checked={selectedCountries.includes(country)} onChange={() => toggleCountry(country)} className="w-4 h-4 text-[#0B3B2F] rounded" />
                          <span className="text-sm">{country}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Discipline */}
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'discipline' ? null : 'discipline')}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-[#D4A373] transition-colors bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span className="truncate">Discipline {selectedDisciplines.length > 0 && `(${selectedDisciplines.length})`}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'discipline' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'discipline' && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
                      {disciplines.map(discipline => (
                        <label key={discipline} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" checked={selectedDisciplines.includes(discipline)} onChange={() => toggleDiscipline(discipline)} className="w-4 h-4 text-[#0B3B2F] rounded" />
                          <span className="text-sm">{discipline}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Degree */}
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'degree' ? null : 'degree')}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-[#D4A373] transition-colors bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <span className="truncate">{selectedDegree || 'Degree'}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'degree' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'degree' && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name="degree" checked={selectedDegree === ''} onChange={() => setFilter('degree', '')} className="w-4 h-4 text-[#0B3B2F]" />
                        <span className="text-sm">All Degrees</span>
                      </label>
                      {degreeOptions.map(degree => (
                        <label key={degree} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="degree" checked={selectedDegree === degree} onChange={() => setFilter('degree', degree)} className="w-4 h-4 text-[#0B3B2F]" />
                          <span className="text-sm">{degree}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Funding */}
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'funding' ? null : 'funding')}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-[#D4A373] transition-colors bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="truncate">{selectedFunding || 'Funding'}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'funding' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'funding' && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
                      <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name="funding" checked={selectedFunding === ''} onChange={() => setFilter('funding', '')} className="w-4 h-4 text-[#0B3B2F]" />
                        <span className="text-sm">All Funding</span>
                      </label>
                      {fundingTypes.map(funding => (
                        <label key={funding} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="funding" checked={selectedFunding === funding} onChange={() => setFilter('funding', funding)} className="w-4 h-4 text-[#0B3B2F]" />
                          <span className="text-sm">{funding}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Region */}
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'region' ? null : 'region')}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-[#D4A373] transition-colors bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="truncate">{selectedRegion || 'Region'}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'region' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'region' && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name="region" checked={selectedRegion === ''} onChange={() => setFilter('region', '')} className="w-4 h-4 text-[#0B3B2F]" />
                        <span className="text-sm">All Regions</span>
                      </label>
                      {regionOptions.map(region => (
                        <label key={region} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="region" checked={selectedRegion === region} onChange={() => setFilter('region', region)} className="w-4 h-4 text-[#0B3B2F]" />
                          <span className="text-sm">{region}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Program Mode */}
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'programMode' ? null : 'programMode')}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-[#D4A373] transition-colors bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span className="truncate">{selectedProgramMode ? programModeOptions.find(o => o.value === selectedProgramMode)?.label : 'Mode'}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'programMode' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'programMode' && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name="programMode" checked={selectedProgramMode === ''} onChange={() => setFilter('programMode', '')} className="w-4 h-4 text-[#0B3B2F]" />
                        <span className="text-sm">All Modes</span>
                      </label>
                      {programModeOptions.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="programMode" checked={selectedProgramMode === opt.value} onChange={() => setFilter('programMode', opt.value)} className="w-4 h-4 text-[#0B3B2F]" />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Program Duration */}
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'programDuration' ? null : 'programDuration')}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-[#D4A373] transition-colors bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="truncate">{selectedProgramDuration ? programDurationOptions.find(o => o.value === selectedProgramDuration)?.label : 'Duration'}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'programDuration' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'programDuration' && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name="programDuration" checked={selectedProgramDuration === ''} onChange={() => setFilter('programDuration', '')} className="w-4 h-4 text-[#0B3B2F]" />
                        <span className="text-sm">All Durations</span>
                      </label>
                      {programDurationOptions.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="programDuration" checked={selectedProgramDuration === opt.value} onChange={() => setFilter('programDuration', opt.value)} className="w-4 h-4 text-[#0B3B2F]" />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Program Level */}
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'programLevel' ? null : 'programLevel')}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-[#D4A373] transition-colors bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <Microscope className="w-4 h-4 text-gray-500" />
                      <span className="truncate">{selectedProgramLevel ? programLevelOptions.find(o => o.value === selectedProgramLevel)?.label : 'Level'}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'programLevel' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'programLevel' && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name="programLevel" checked={selectedProgramLevel === ''} onChange={() => setFilter('programLevel', '')} className="w-4 h-4 text-[#0B3B2F]" />
                        <span className="text-sm">All Levels</span>
                      </label>
                      {programLevelOptions.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="programLevel" checked={selectedProgramLevel === opt.value} onChange={() => setFilter('programLevel', opt.value)} className="w-4 h-4 text-[#0B3B2F]" />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Active Filter Tags */}
              {totalFiltersApplied > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {selectedCountries.map(country => (
                    <span key={country} className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                      {country} <button onClick={() => removeFilter('country', country)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                  {selectedDisciplines.map(discipline => (
                    <span key={discipline} className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                      {discipline} <button onClick={() => removeFilter('discipline', discipline)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                  {selectedDegree && (
                    <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                      {selectedDegree} <button onClick={() => removeFilter('degree', '')} className="hover:text-red-500">×</button>
                    </span>
                  )}
                  {selectedFunding && (
                    <span className="bg-teal-50 text-teal-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                      {selectedFunding} <button onClick={() => removeFilter('funding', '')} className="hover:text-red-500">×</button>
                    </span>
                  )}
                  {selectedRegion && (
                    <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                      {selectedRegion} <button onClick={() => removeFilter('region', '')} className="hover:text-red-500">×</button>
                    </span>
                  )}
                  {selectedProgramMode && (
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                      {programModeOptions.find(o => o.value === selectedProgramMode)?.label} <button onClick={() => removeFilter('programMode', '')} className="hover:text-red-500">×</button>
                    </span>
                  )}
                  {selectedProgramDuration && (
                    <span className="bg-cyan-50 text-cyan-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                      {programDurationOptions.find(o => o.value === selectedProgramDuration)?.label} <button onClick={() => removeFilter('programDuration', '')} className="hover:text-red-500">×</button>
                    </span>
                  )}
                  {selectedProgramLevel && (
                    <span className="bg-pink-50 text-pink-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                      {programLevelOptions.find(o => o.value === selectedProgramLevel)?.label} <button onClick={() => removeFilter('programLevel', '')} className="hover:text-red-500">×</button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                      "{searchQuery}" <button onClick={() => removeFilter('search', '')} className="hover:text-red-500">×</button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-gray-700 font-medium"
            >
              <Filter className="w-5 h-5" />
              Filters {totalFiltersApplied > 0 && `(${totalFiltersApplied})`}
            </button>
          </div>

          {/* Result Count */}
          {hasActiveFilters() && (
            <div className="mb-4">
              <p className="text-gray-600 text-sm">{total} scholarship{total !== 1 ? 's' : ''} found</p>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => <ScholarshipCardSkeleton key={i} />)}
            </div>
          ) : (
            <div>
              {scholarships.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#1A1A1A] mb-2">No scholarships found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search query.</p>
                  <button onClick={clearAllFilters} className="text-[#0B3B2F] font-medium hover:underline">Clear all filters</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {scholarships.map((scholarship) => {
                      const normalized = normalizeScholarship(scholarship);
                      return (
                        <ScholarshipCard 
                          key={scholarship._id} 
                          scholarship={normalized as any} 
                        />
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => updateUrl({ page: String(page) })}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-1"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-5">
                {totalFiltersApplied > 0 && (
                  <button onClick={clearAllFilters} className="text-sm text-red-500">Clear all filters</button>
                )}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Country</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {countries.map(c => (
                      <label key={c} className="flex items-center gap-2">
                        <input type="checkbox" checked={selectedCountries.includes(c)} onChange={() => toggleCountry(c)} /> {c}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Discipline</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {disciplines.map(d => (
                      <label key={d} className="flex items-center gap-2">
                        <input type="checkbox" checked={selectedDisciplines.includes(d)} onChange={() => toggleDiscipline(d)} /> {d}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Degree</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2"><input type="radio" name="mobile-degree" checked={selectedDegree === ''} onChange={() => setFilter('degree', '')} /> All Degrees</label>
                    {degreeOptions.map(d => <label key={d} className="flex items-center gap-2"><input type="radio" name="mobile-degree" checked={selectedDegree === d} onChange={() => setFilter('degree', d)} /> {d}</label>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Funding</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <label className="flex items-center gap-2"><input type="radio" name="mobile-funding" checked={selectedFunding === ''} onChange={() => setFilter('funding', '')} /> All Funding</label>
                    {fundingTypes.map(f => <label key={f} className="flex items-center gap-2"><input type="radio" name="mobile-funding" checked={selectedFunding === f} onChange={() => setFilter('funding', f)} /> {f}</label>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2"><Globe className="w-4 h-4" /> Region</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2"><input type="radio" name="mobile-region" checked={selectedRegion === ''} onChange={() => setFilter('region', '')} /> All Regions</label>
                    {regionOptions.map(r => <label key={r} className="flex items-center gap-2"><input type="radio" name="mobile-region" checked={selectedRegion === r} onChange={() => setFilter('region', r)} /> {r}</label>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Program Mode</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2"><input type="radio" name="mobile-programMode" checked={selectedProgramMode === ''} onChange={() => setFilter('programMode', '')} /> All Modes</label>
                    {programModeOptions.map(o => <label key={o.value} className="flex items-center gap-2"><input type="radio" name="mobile-programMode" checked={selectedProgramMode === o.value} onChange={() => setFilter('programMode', o.value)} /> {o.label}</label>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Duration</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2"><input type="radio" name="mobile-programDuration" checked={selectedProgramDuration === ''} onChange={() => setFilter('programDuration', '')} /> All Durations</label>
                    {programDurationOptions.map(o => <label key={o.value} className="flex items-center gap-2"><input type="radio" name="mobile-programDuration" checked={selectedProgramDuration === o.value} onChange={() => setFilter('programDuration', o.value)} /> {o.label}</label>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2"><Microscope className="w-4 h-4" /> Level</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2"><input type="radio" name="mobile-programLevel" checked={selectedProgramLevel === ''} onChange={() => setFilter('programLevel', '')} /> All Levels</label>
                    {programLevelOptions.map(o => <label key={o.value} className="flex items-center gap-2"><input type="radio" name="mobile-programLevel" checked={selectedProgramLevel === o.value} onChange={() => setFilter('programLevel', o.value)} /> {o.label}</label>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
