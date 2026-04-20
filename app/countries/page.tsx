'use client';
import StatCard from '@/components/StatCard';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import CardImage from '@/components/CardImage';
import CountryCardSkeleton from '@/components/CountryCardSkeleton';
import { ArrowRight, Globe, GraduationCap, Building2, Search } from 'lucide-react';

const STATS = {
  countries: '85+',
  scholarships: '2.5K+',
  withFivePlus: '45+'
};

const heroImageUrl = 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1920&auto=format';

const countryImages: Record<string, string> = {
  'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=400&auto=format',
  'Saudi Arabia': 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F1ZGklMjBhcmFiaWF8ZW58MHx8MHx8fDA%3D',
  'United States': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=400&auto=format',
  'Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=400&auto=format',
  'Canada': 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=400&auto=format',
  'Australia': 'https://images.unsplash.com/photo-1604136514790-b27086f6c36e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Japan': 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=400&auto=format',
  'France': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format',
  'Netherlands': 'https://images.unsplash.com/photo-1616321741705-e9a4073af35c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmV0aGVybGFuZHxlbnwwfHwwfHx8MA%3D%3D',
  'Italy': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=400&auto=format',
  'Spain': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=400&auto=format',
  'Switzerland': 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=400&auto=format',
  'Sweden': 'https://images.unsplash.com/photo-1579359565489-8e65439e6d1c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3dlZGVuJTIwdW5pdmVyc2l0aWVzfGVufDB8fDB8fHww',
  'Norway': 'https://images.unsplash.com/photo-1475066392170-59d55d96fe51?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bm9yd2F5fGVufDB8fDB8fHww',
  'Denmark': 'https://images.unsplash.com/photo-1659786928490-27d1d416e4d6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGVubWFyayUyMHVuaXZlcnNpdGllc3xlbnwwfHwwfHx8MA%3D%3D',
  'Finland': 'https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?q=80&w=400&auto=format',
  'Belgium': 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=80&w=400&auto=format',
  'Austria': 'https://images.unsplash.com/photo-1526581671404-349f224db79b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGF1c3RyaWF8ZW58MHx8MHx8fDA%3D',
  'Portugal': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=400&auto=format',
  'Ireland': 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXJlbGFuZCUyMGNpdHl8ZW58MHx8MHx8fDA%3D',
  'New Zealand': 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=400&auto=format',
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=400&auto=format',
  'India': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=400&auto=format',
  'China': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=400&auto=format',
  'South Korea': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=400&auto=format',
  'Turkey': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=400&auto=format',
  'Brazil': 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QnJhemlsJTIwZmFtb3VzJTIwcGxhY2V8ZW58MHx8MHx8fDA%3D',
  'Mexico': 'https://images.unsplash.com/photo-1645921441624-3d8f9098a2a5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fE1leGljbyUyMGZhbW91cyUyMHBsYWNlfGVufDB8fDB8fHww',
  'South Africa': 'https://images.unsplash.com/photo-1552937075-967cf58b74a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNvdXRoJTIwYWZyaWNhfGVufDB8fDB8fHww',
  'Egypt': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8RWd5cHR8ZW58MHx8MHx8fDA%3D',
  'Chile': 'https://images.unsplash.com/photo-1535479672101-8486af672be0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fENoaWxlfGVufDB8fDB8fHww',
  'UAE': 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dW5pdGVkJTIwYXJhYiUyMGVtaXJhdGVzfGVufDB8fDB8fHww',
  'Hong Kong': 'https://images.unsplash.com/photo-1562157996-463d2c820464?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGhvbmclMjBrb25nfGVufDB8fDB8fHww',
  'Taiwan': 'https://images.unsplash.com/photo-1571555788467-71d9e3add426?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHRhaXdhbnxlbnwwfHwwfHx8MA%3D%3D',
  'Poland': 'https://images.unsplash.com/photo-1576926545793-c6c17a013b79?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBvbGFuZHxlbnwwfHwwfHx8MA%3D%3D',
  'Qatar': 'https://images.unsplash.com/photo-1700901742651-6b353164caf3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UWF0YXJ8ZW58MHx8MHx8fDA%3D',
  'Argentina': 'https://images.unsplash.com/photo-1600627094717-809e6a3f29f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fEFyZ2VudGluYXxlbnwwfHwwfHx8MA%3D%3D',
  'Lebanon': 'https://images.unsplash.com/photo-1584830633909-d562e80692bb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bGViYW5vbiUyMGZhbW91cyUyMHBsYWNlfGVufDB8fDB8fHww',
  'Czech Republic': 'https://images.unsplash.com/photo-1596811311317-c948dd4382dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEN6ZWNoJTIwUmVwdWJsaWN8ZW58MHx8MHx8fDA%3D',
  'Hungary': 'https://images.unsplash.com/photo-1565426873118-a17ed65d74b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGh1bmdhcnl8ZW58MHx8MHx8fDA%3D',
  'Philippines': 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhpbGlwcGluZXN8ZW58MHx8MHx8fDA%3D',
  'Kenya': 'https://images.unsplash.com/photo-1533645782036-997947a9d529?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGtlbnlhfGVufDB8fDB8fHww',
  'Ghana': 'https://images.unsplash.com/photo-1741973769994-9d744531dde4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8R2hhbmElMjBmYW1vdXMlMjBwbGFjZXxlbnwwfHwwfHx8MA%3D%3D',
  'Uganda': 'https://images.unsplash.com/photo-1521493959102-bdd6677fdd81?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8VWdhbmRhfGVufDB8fDB8fHww',
  'Colombia': 'https://images.unsplash.com/photo-1633627402383-41cc837033ab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvbG9tYmlhJTIwZmFtb3VzJTIwcGxhY2V8ZW58MHx8MHx8fDA%3D',
  'Luxembourg': 'https://images.unsplash.com/photo-1592571169485-cda6ca8a05ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGx1eGVtYm91cmd8ZW58MHx8MHx8fDA%3D',
  'Croatia': 'https://images.unsplash.com/photo-1414862625453-d87604a607e4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNyb2F0aWF8ZW58MHx8MHx8fDA%3D',
  'Slovenia': 'https://images.unsplash.com/photo-1725203498888-8eda33f3ab98?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNsb3ZlbmlhJTIwZmFtb3VzJTIwcGxhY2V8ZW58MHx8MHx8fDA%3D',
  'Costa Rica': 'https://images.unsplash.com/photo-1719719595774-67f961da5d82?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvc3RhJTIwcmljYSUyMGZhbW91cyUyMHBsYWNlfGVufDB8fDB8fHww',
  'Nigeria': 'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmlnZXJpYSUyMGZhbW91cyUyMHBsYWNlfGVufDB8fDB8fHww',
  'Pakistan': 'https://images.unsplash.com/photo-1684439061252-cb6632acb8ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fHBha2lzdGFuJTIwZmFtb3VzJTIwcGxhY2V8ZW58MHx8MHx8fDA%3D',
  'Indonesia': 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5kb25lc2lhJTIwZmFtb3VzJTIwcGxhY2V8ZW58MHx8MHx8fDA%3D',
  'Thailand': 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGhhaWxhbmQlMjBmYW1vdXMlMjBwbGFjZXxlbnwwfHwwfHx8MA%3D%3D',
  'Malaysia': 'https://images.unsplash.com/photo-1593789135964-b3ddb924dcc7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fG1hbGF5c2lhJTIwZmFtb3VzJTIwcGxhY2V8ZW58MHx8MHx8fDA%3D',
  'Multiple Countries': 'https://images.unsplash.com/photo-1668734657528-2141ac621974?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'default': 'https://images.unsplash.com/photo-1662702933459-eeb71db82f85?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

interface CountryData {
  name: string;
  count: number;
}

export default function CountriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('/api/countries');
        const data = await res.json();
        setCountries(data.countries || []);
      } catch (error) {
        console.error('Failed to fetch countries', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    const queryWords = searchQuery.toLowerCase().trim().split(/\s+/);
    return countries.filter(c =>
      queryWords.every(word => c.name.toLowerCase().includes(word))
    );
  }, [countries, searchQuery]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div
          className="relative text-white py-16 md:py-20"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(11, 59, 47, 0.85), rgba(26, 93, 74, 0.85)), url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0B3B2F'
          }}
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">Study Destinations</h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
              Explore scholarships by country. We have opportunities in {countries.length} countries worldwide.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A373] bg-gray-50 text-sm"
                />
              </div>
              <button className="bg-[#0B3B2F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1A5D4A] transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-3">
                Found {filteredCountries.length} countr{filteredCountries.length !== 1 ? 'ies' : 'y'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <StatCard icon={Globe} value={STATS.countries} label="Countries" color="blue" />
            <StatCard icon={GraduationCap} value={STATS.scholarships} label="Total Scholarships" color="green" />
            <StatCard icon={Building2} value={STATS.withFivePlus} label="Countries with 5+ Scholarships" color="amber" />
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {Array.from({ length: 10 }).map((_, i) => <CountryCardSkeleton key={i} />)}
            </div>
          ) : filteredCountries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No countries found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {filteredCountries.map((country) => {
                const imageUrl = countryImages[country.name] || countryImages.default;
                return (
                  <Link
                    key={country.name}
                    href={`/countries/${encodeURIComponent(country.name)}`}
                    className="group"
                  >
                    <div className="relative h-28 md:h-32 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                      <CardImage
                        src={imageUrl}
                        alt={country.name}
                        fallbackText={country.name}
                        height="h-28 md:h-32"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="text-white font-medium text-sm truncate block">{country.name}</span>
                        <p className="text-white/80 text-xs mt-0.5">{country.count} scholarship{country.count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/scholarships"
              className="inline-flex items-center gap-2 text-[#0B3B2F] font-medium hover:text-[#D4A373] transition-colors"
            >
              Browse All Scholarships <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
