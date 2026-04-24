import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CardImage from '@/components/CardImage';
import { connectToDatabase } from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';
import { MapPin, GraduationCap, ArrowLeft, Award, Users, Globe, Clock } from 'lucide-react';

interface PageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { country } = await params;
  const decodedCountry = decodeURIComponent(country);
  
  await connectToDatabase();
  const totalCount = await Scholarship.countDocuments({ hostCountries: decodedCountry });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theopenscholarships.vercel.app';
  const title = `Scholarships in ${decodedCountry} | The Open Scholarships`;
  const description = `Discover ${totalCount}+ fully funded scholarships and study opportunities in ${decodedCountry}. Apply now for Bachelor, Master, and PhD programs.`;

  const ogUrl = new URL(`${baseUrl}/api/og`);
  ogUrl.searchParams.set('type', 'country');
  ogUrl.searchParams.set('title', `Scholarships in ${decodedCountry}`);
  ogUrl.searchParams.set('description', description.substring(0, 150));
  ogUrl.searchParams.set('host', decodedCountry);
  ogUrl.searchParams.set('funding', `${totalCount} opportunities`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/countries/${encodeURIComponent(decodedCountry)}`,
      siteName: 'The Open Scholarships',
      images: [{ url: ogUrl.toString(), width: 1200, height: 630, alt: decodedCountry }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
}


function getDeadlineHint(deadline: Date): string {
  const month = deadline.getMonth();
  const day = deadline.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (day <= 10) return `Early ${monthNames[month]}`;
  if (day <= 20) return `Mid ${monthNames[month]}`;
  return `Late ${monthNames[month]}`;
}

// 高质量国家英雄图片
const countryHeroImages: Record<string, string> = {
  'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920&auto=format',
  'United States': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=1920&auto=format',
  'Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1920&auto=format',
  'Canada': 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1920&auto=format',
  'Australia': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9ca?q=80&w=1920&auto=format',
  'Japan': 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=1920&auto=format',
  'France': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1920&auto=format',
  'Netherlands': 'https://images.unsplash.com/photo-1512470876302-972faa0a4ddd?q=80&w=1920&auto=format',
  'Italy': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1920&auto=format',
  'Spain': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1920&auto=format',
  'Switzerland': 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=1920&auto=format',
  'Sweden': 'https://images.unsplash.com/photo-1506973035872-a6ecb43a8c3f?q=80&w=1920&auto=format',
  'Norway': 'https://images.unsplash.com/photo-1520769669658-f076b4e3c4b3?q=80&w=1920&auto=format',
  'Denmark': 'https://images.unsplash.com/photo-1513622470522-26c3c5a854bc?q=80&w=1920&auto=format',
  'Finland': 'https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?q=80&w=1920&auto=format',
  'Belgium': 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=80&w=1920&auto=format',
  'Austria': 'https://images.unsplash.com/photo-1516550893926-d5e5c2eb47e4?q=80&w=1920&auto=format',
  'Portugal': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=1920&auto=format',
  'Ireland': 'https://images.unsplash.com/photo-1582034358936-9b6ac7c1559d?q=80&w=1920&auto=format',
  'New Zealand': 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=1920&auto=format',
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1920&auto=format',
  'India': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1920&auto=format',
  'China': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1920&auto=format',
  'South Korea': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1920&auto=format',
  'Turkey': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1920&auto=format',
  'Brazil': 'https://images.unsplash.com/photo-1516306580123-e6e52b9b7b5c?q=80&w=1920&auto=format',
  'Mexico': 'https://images.unsplash.com/photo-1518655048521-f130df041f66?q=80&w=1920&auto=format',
  'South Africa': 'https://images.unsplash.com/photo-1576485375217-d7c3e2a2d2e1?q=80&w=1920&auto=format',
  'Egypt': 'https://images.unsplash.com/photo-1502252430442-aac78f397426?q=80&w=1920&auto=format',
  'default': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1920&auto=format'
};

export default async function CountryScholarshipsPage({ params }: PageProps) {
  const { country } = await params;
  const decodedCountry = decodeURIComponent(country);
  
  await connectToDatabase();
  
  // 获取该国家的所有奖学金（不按状态过滤）
  const scholarships = await Scholarship.find({ hostCountries: decodedCountry })
    .sort({ deadline: 1 })
    .lean();
  
  if (!scholarships) {
    notFound();
  }
  
  const totalCount = scholarships.length;
  
  // 学位分布
  const degreeStats = await Scholarship.aggregate([
    { $match: { hostCountries: decodedCountry } },
    { $unwind: '$degreeLevel' },
    { $group: { _id: '$degreeLevel', count: { $sum: 1 } } },
  ]);
  
  // 资助类型分布
  const fundingStats = await Scholarship.aggregate([
    { $match: { hostCountries: decodedCountry } },
    { $unwind: '$fundingType' },
    { $group: { _id: '$fundingType', count: { $sum: 1 } } },
  ]);

  const heroImageUrl = countryHeroImages[decodedCountry] || countryHeroImages.default;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div
          className="relative text-white py-20 md:py-24"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(11, 59, 47, 0.8), rgba(26, 93, 74, 0.8)), url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0B3B2F'
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/countries" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors text-sm md:text-base">
              <ArrowLeft className="w-4 h-4" />
              Back to All Countries
            </Link>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold mb-3">
                  {decodedCountry}
                </h1>
                <p className="text-white/80 text-base md:text-lg max-w-2xl">
                  Discover fully funded scholarships and study opportunities in {decodedCountry}.
                </p>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold">{totalCount}</div>
                  <div className="text-white/70 text-sm">Total Scholarships</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {scholarships.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-[#0B3B2F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-[#0B3B2F]" />
                  </div>
                  <h2 className="text-xl font-serif text-[#1A1A1A] mb-2">No scholarships found</h2>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    We couldn't find any scholarships for {decodedCountry}. Check back later or browse other countries.
                  </p>
                  <Link href="/scholarships" className="inline-flex items-center gap-2 bg-[#0B3B2F] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#1A5D4A] transition-colors">
                    Browse All Scholarships
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl text-[#1A1A1A]">
                      Available Scholarships ({scholarships.length})
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {scholarships.map((scholarship: any) => {
                      const deadlineHint = getDeadlineHint(new Date(scholarship.deadline));
                      const fundingString = Array.isArray(scholarship.fundingType) 
                        ? scholarship.fundingType[0] 
                        : scholarship.fundingType || 'Fully Funded';
                      
                      return (
                        <Link key={scholarship._id} href={`/scholarships/${scholarship.slug}`} className="block">
                          <div className="group bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all hover:border-[#D4A373]">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                                <CardImage 
                                  src={scholarship.image || ''} 
                                  alt={scholarship.title} 
                                  fallbackText={scholarship.provider}
                                  height="h-16"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm text-[#1A1A1A] group-hover:text-[#0B3B2F] transition-colors line-clamp-2 mb-1">
                                  {scholarship.title}
                                </h3>
                                <p className="text-gray-500 text-xs mb-2">{scholarship.provider}</p>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <GraduationCap className="w-3 h-3" />
                                    {Array.isArray(scholarship.degreeLevel) ? scholarship.degreeLevel[0] : scholarship.degreeLevel}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    {fundingString}
                                  </span>
                                  <span className="flex items-center gap-1 text-[#0B3B2F] font-medium">
                                    <Clock className="w-3 h-3" />
                                    {deadlineHint}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#0B3B2F]" />
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <GraduationCap className="w-5 h-5 text-[#0B3B2F] mx-auto mb-1" />
                    <div className="text-xl font-bold text-[#1A1A1A]">{degreeStats.length}</div>
                    <div className="text-xs text-gray-500">Degree Types</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <Award className="w-5 h-5 text-[#0B3B2F] mx-auto mb-1" />
                    <div className="text-xl font-bold text-[#1A1A1A]">{fundingStats.length}</div>
                    <div className="text-xs text-gray-500">Funding Types</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center col-span-2">
                    <Users className="w-5 h-5 text-[#0B3B2F] mx-auto mb-1" />
                    <div className="text-xl font-bold text-[#1A1A1A]">{totalCount}</div>
                    <div className="text-xs text-gray-500">Total Opportunities</div>
                  </div>
                </div>
              </div>

              {degreeStats.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-serif text-lg font-semibold mb-4">Degree Levels</h3>
                  <div className="space-y-3">
                    {degreeStats.map((stat: any) => (
                      <div key={stat._id} className="flex items-center justify-between">
                        <span className="text-gray-600">{stat._id}</span>
                        <span className="font-medium bg-gray-100 px-2 py-1 rounded-full text-sm">{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {fundingStats.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-serif text-lg font-semibold mb-4">Funding Types</h3>
                  <div className="space-y-3">
                    {fundingStats.map((stat: any) => (
                      <div key={stat._id} className="flex items-center justify-between">
                        <span className="text-gray-600">{stat._id}</span>
                        <span className="font-medium bg-gray-100 px-2 py-1 rounded-full text-sm">{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-[#0B3B2F] to-[#1A5D4A] rounded-xl p-6 text-white">
                <h3 className="font-serif text-lg font-semibold mb-2">Ready to apply?</h3>
                <p className="text-white/80 text-sm mb-4">
                  Browse all scholarships and find your perfect opportunity.
                </p>
                <Link href="/scholarships" className="inline-block w-full text-center bg-[#D4A373] text-[#0B3B2F] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#C67B5E] transition-colors">
                  Browse All Scholarships
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}