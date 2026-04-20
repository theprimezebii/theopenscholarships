'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { Suspense } from 'react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import CardImage from '@/components/CardImage';
import UniversityCardSkeleton from '@/components/UniversityCardSkeleton';
import { Building2, MapPin, ExternalLink, GraduationCap, Globe, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const STATS = { universities: '1.2K+', scholarships: '2.5K+', countries: '85+' };
const ITEMS_PER_PAGE = 9;

interface University { name: string; count: number; countries: string[]; image: string | null; }

function UniversitiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/universities')
      .then(res => res.json())
      .then(data => { setAllUniversities(data.universities || []); setLoading(false); });
  }, []);

  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return allUniversities;
    const q = searchQuery.toLowerCase().trim().split(/\s+/);
    return allUniversities.filter(u => q.every(w => u.name.toLowerCase().includes(w)));
  }, [allUniversities, searchQuery]);

  const totalPages = Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUniversities = filteredUniversities.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const updateUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) params.set('page', page.toString()); else params.delete('page');
    router.push(`/universities?${params.toString()}`);
  };

  const getVisiblePages = (c: number, t: number) => {
    const d = 2; const r: number[] = []; const w: (number|string)[] = []; let l: number|undefined;
    for (let i=1; i<=t; i++) if(i===1||i===t||(i>=c-d&&i<=c+d)) r.push(i);
    r.forEach(i=>{ if(l!==undefined){ if(i-l===2) w.push(l+1); else if(i-l!==1) w.push('...'); } w.push(i); l=i; });
    return w;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="relative text-white py-16 md:py-20" style={{backgroundImage:'linear-gradient(135deg,rgba(11,59,47,0.85),rgba(26,93,74,0.85)),url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format)',backgroundSize:'cover',backgroundPosition:'center'}}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">Universities Worldwide</h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">Browse {STATS.universities} prestigious institutions offering fully funded scholarships.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search universities..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] bg-gray-50 text-sm" /></div>
              <button className="bg-[#0B3B2F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1A5D4A] transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap"><Search className="w-4 h-4"/>Search</button>
            </div>
            {searchQuery && <p className="text-sm text-gray-500 mt-3">Found {filteredUniversities.length} universit{filteredUniversities.length!==1?'ies':'y'}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center"><div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4"><Building2 className="w-6 h-6 text-blue-600"/></div><div className="text-3xl font-bold text-[#1A1A1A]">{STATS.universities}</div><p className="text-gray-500 text-sm mt-1">Institutions</p></div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center"><div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4"><GraduationCap className="w-6 h-6 text-green-600"/></div><div className="text-3xl font-bold text-[#1A1A1A]">{STATS.scholarships}</div><p className="text-gray-500 text-sm mt-1">Total Scholarships</p></div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center"><div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-4"><Globe className="w-6 h-6 text-amber-600"/></div><div className="text-3xl font-bold text-[#1A1A1A]">{STATS.countries}</div><p className="text-gray-500 text-sm mt-1">Host Countries</p></div>
          </div>
          {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({length:6}).map((_,i)=><UniversityCardSkeleton key={i}/>)}</div> :
           currentUniversities.length===0 ? <div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4"/><p className="text-gray-500">{searchQuery?'No matching universities found.':'No institutions found.'}</p></div> :
           <><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{currentUniversities.map(u=><div key={u.name} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"><CardImage src={u.image||''} alt={u.name} fallbackText={u.name} height="h-40"/><div className="p-5"><h3 className="font-serif text-lg font-semibold text-[#1A1A1A] group-hover:text-[#0B3B2F] transition-colors mb-2">{u.name}</h3><div className="flex items-center gap-2 text-sm text-gray-500 mb-3"><MapPin className="w-4 h-4 flex-shrink-0"/><span className="line-clamp-1">{u.countries.slice(0,3).join(', ')}{u.countries.length>3&&` +${u.countries.length-3} more`}</span></div><div className="flex items-center justify-between"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{u.count} scholarship{u.count!==1?'s':''}</span><Link href={`/scholarships?search=${encodeURIComponent(u.name)}`} className="inline-flex items-center gap-1 text-sm font-medium text-[#0B3B2F] hover:text-[#D4A373] transition-colors">View <ExternalLink className="w-3.5 h-3.5"/></Link></div></div></div>)}</div>
           {totalPages>1&&<div className="flex justify-center items-center gap-2 mt-10"><button onClick={()=>updateUrl(Math.max(1,currentPage-1))} disabled={currentPage===1} className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="w-5 h-5"/></button><div className="flex gap-1">{getVisiblePages(currentPage,totalPages).map((p,i)=>p==='...'?<span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>:<button key={p} onClick={()=>updateUrl(Number(p))} className={`w-10 h-10 rounded-lg border ${currentPage===p?'bg-[#0B3B2F] text-white border-[#0B3B2F]':'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>)}</div><button onClick={()=>updateUrl(Math.min(totalPages,currentPage+1))} disabled={currentPage===totalPages} className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="w-5 h-5"/></button></div>}</>
          }
          <div className="mt-12 text-center"><Link href="/scholarships" className="inline-flex items-center gap-2 bg-[#0B3B2F] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#1A5D4A] transition-colors">Browse All Scholarships<ExternalLink className="w-4 h-4"/></Link></div>
        </div>
        <Newsletter/>
      </main>
      <Footer/>
    </>
  );
}

export default function UniversitiesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#0B3B2F] border-t-transparent rounded-full animate-spin"></div></div>}>
      <UniversitiesContent />
    </Suspense>
  );
}
