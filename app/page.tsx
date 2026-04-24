import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import ScholarshipCard from '@/components/ScholarshipCard';
import CardImage from '@/components/CardImage';
import StatCard from '@/components/StatCard';
import { connectToDatabase } from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';
import BlogPost from '@/models/BlogPost';
import Course from '@/models/Course';
import CourseCard from '@/components/CourseCard';
// import type { Metadata } from 'next';
import {
  Search, GraduationCap, MapPin, Building2, Users, BookOpen,
  ArrowRight, TrendingUp, Calendar, FileText, ChevronRight, Clock,
  Microscope, Palette, Scale, Briefcase, Cpu, HeartPulse, Leaf
} from 'lucide-react';
import { Metadata } from 'next';

const STATS = {
  scholarships: '2.5K+',
  countries: '85+',
  universities: '1.2K+',
  views: '1.8M+'
};

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M+';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K+';
  return num.toString() + '+';
}

async function getHomePageData() {
  await connectToDatabase();
  // Fetch featured courses (or latest if none featured)
  const featuredCourses = await Course.find({ featured: true }).limit(4).lean();
  const featuredScholarships = await Scholarship.find({ featured: true, status: 'open' })
    .limit(8)
    .lean();

  const blogPosts = await BlogPost.find({ published: true, type: { $ne: 'guide' } })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  const topFields = await Scholarship.aggregate([
    { $unwind: '$fields' },
    { $group: { _id: '$fields', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 }
  ]);

  const popularCountries = await Scholarship.aggregate([
    { $unwind: '$hostCountries' },
    { $group: { _id: '$hostCountries', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 }
  ]);

  return {
    featuredScholarships,
    blogPosts,
    topFields: topFields.map(f => ({ name: f._id, count: f.count })),
    popularCountries: popularCountries.map(c => ({ name: c._id, count: c.count })),
    featuredCourses
  };
}

const fieldIcons: Record<string, any> = {
  'Business & Management': Briefcase,
  'Computer Science & IT': Cpu,
  'Engineering & Technology': Microscope,
  'Medicine & Health': HeartPulse,
  'Social Sciences': Users,
  'Arts & Design': Palette,
  'Education & Training': BookOpen,
  'Law': Scale,
  'Environmental Sciences': Leaf,
  'default': GraduationCap
};

const countryImages: Record<string, string> = {
  'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=400&auto=format',
  'United States': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=400&auto=format',
  'Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=400&auto=format',
  'Canada': 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=400&auto=format',
  'Australia': 'https://images.unsplash.com/photo-1528073636650-5c5f9c8b3e0d?q=80&w=400&auto=format',
  'Japan': 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=400&auto=format',
  'France': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format',
  'Netherlands': 'https://images.unsplash.com/photo-1512470876302-972faa0a4ddd?q=80&w=400&auto=format',
  'default': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=400&auto=format'
};

const heroImageUrl = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format';
export const metadata: Metadata = {
  title: {
    default: 'The Open Scholarships | Free Fully Funded Opportunities',
    template: '%s | The Open Scholarships',
  },
  description: 'Find your perfect fully funded scholarship abroad. Discover verified opportunities from top universities worldwide – free, no ads, completely accessible.',
  openGraph: {
    title: 'The Open Scholarships – Fully Funded Opportunities Worldwide',
    description: 'Search by country, field of study, or degree level. Thousands of verified scholarships for Bachelor, Master, and PhD programs.',
    url: 'https://theopenscholarships.com',
    siteName: 'The Open Scholarships',
    images: [
      {
        url: 'https://theopenscholarships.com/api/og?type=home',
        width: 1200,
        height: 630,
        alt: 'The Open Scholarships - Find Your Perfect Fully Funded Scholarship',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Open Scholarships – Fully Funded Opportunities',
    description: 'Discover verified scholarships from top universities worldwide. Search by country, field, or degree level – absolutely free.',
    images: ['https://theopenscholarships.com/api/og?type=home'],
  },
  robots: 'index, follow',
  keywords: 'scholarships, fully funded, study abroad, free education, international students',
};
export default async function Home() {
  const { featuredScholarships, blogPosts, topFields, popularCountries, featuredCourses } = await getHomePageData();

  return (
    <>
      <Header />
      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <div
          className="relative text-white py-16 md:py-24"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(11, 59, 47, 0.85), rgba(26, 93, 74, 0.85)), url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0B3B2F'
          }}
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                Find Your Perfect{' '}
                <span className="text-[#D4A373]">Fully Funded</span>
                <br />
                Scholarship Abroad
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-6 md:mb-8 max-w-2xl">
                Discover verified scholarships from top universities worldwide.
                Search by country, field of study, or degree level—all completely free.
              </p>
              <form action="/scholarships" method="GET" className="max-w-2xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text" name="search" placeholder="Search by scholarship, country, or field..."
                      className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A373] text-sm md:text-base"
                    />
                  </div>
                  <button type="submit" className="bg-[#D4A373] text-[#0B3B2F] px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:bg-[#C67B5E] transition-colors shadow-lg flex items-center justify-center gap-2">
                    <Search className="w-4 h-4" /> Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <section className="bg-white py-8 md:py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <StatCard icon={GraduationCap} value={STATS.scholarships} label="Scholarships" color="blue" />
              <StatCard icon={MapPin} value={STATS.countries} label="Countries" color="green" />
              <StatCard icon={Building2} value={STATS.universities} label="Universities" color="amber" />
              <StatCard icon={Users} value={STATS.views} label="Students Helped" color="purple" />
            </div>
          </div>
        </section>

        {/* Fields of Study */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-6 md:mb-8">
              <div>
                <h2 className="font-serif text-2xl md:text-4xl text-[#1A1A1A] mb-1">Popular Fields of Study</h2>
                <p className="text-sm md:text-base text-gray-500">Explore scholarships by discipline</p>
              </div>
              <Link href="/scholarships" className="text-[#0B3B2F] text-sm md:text-base font-medium hover:text-[#D4A373] flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden md:grid md:grid-cols-4 gap-4">
              {topFields.map((field) => {
                const IconComponent = fieldIcons[field.name] || fieldIcons.default;
                return (
                  <Link key={field.name} href={`/scholarships?disciplines=${encodeURIComponent(field.name)}`}>
                    <div className="group bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                      <div className="w-12 h-12 bg-[#0B3B2F]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0B3B2F]/20">
                        <IconComponent className="w-6 h-6 text-[#0B3B2F]" />
                      </div>
                      <h3 className="font-semibold text-base text-[#1A1A1A] group-hover:text-[#0B3B2F]">{field.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{formatNumber(field.count)} scholarships</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="md:hidden overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              <div className="flex gap-4 w-max">
                {topFields.map((field) => {
                  const IconComponent = fieldIcons[field.name] || fieldIcons.default;
                  return (
                    <Link key={field.name} href={`/scholarships?disciplines=${encodeURIComponent(field.name)}`} className="snap-start w-40">
                      <div className="group bg-white rounded-xl p-4 border border-gray-200 shadow-sm h-full">
                        <div className="w-10 h-10 bg-[#0B3B2F]/10 rounded-xl flex items-center justify-center mb-3">
                          <IconComponent className="w-5 h-5 text-[#0B3B2F]" />
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-1">{field.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{formatNumber(field.count)} scholarships</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="font-serif text-2xl md:text-4xl text-[#1A1A1A] mb-2">How It Works</h2>
              <p className="text-sm md:text-base text-gray-500">Four simple steps to your dream scholarship</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              {[
                { step: 1, title: 'Explore', desc: 'Browse programmes', icon: Search },
                { step: 2, title: 'Compare', desc: 'Make a wishlist', icon: TrendingUp },
                { step: 3, title: 'Decide', desc: 'Pick the best fit', icon: FileText },
                { step: 4, title: 'Apply', desc: 'Submit with confidence', icon: Calendar },
              ].map((item) => (
                <div key={item.step} className="group p-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-[#0B3B2F]/5 group-hover:bg-[#0B3B2F]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 md:w-7 md:h-7 text-[#0B3B2F]" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Scholarships */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-6 md:mb-8">
              <div>
                <h2 className="font-serif text-2xl md:text-4xl text-[#1A1A1A] mb-1">Featured Scholarships</h2>
                <p className="text-sm md:text-base text-gray-500">Top opportunities from around the world</p>
              </div>
              <Link href="/scholarships" className="text-[#0B3B2F] text-sm md:text-base font-medium hover:text-[#D4A373] flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {featuredScholarships.length === 0 ? (
              <div className="bg-white rounded-xl border p-8 text-center">No featured scholarships yet.</div>
            ) : (
              <>
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredScholarships.slice(0, 4).map((s: any) => <ScholarshipCard key={s._id} scholarship={s} featured />)}
                </div>
                <div className="md:hidden overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  <div className="flex gap-4 w-max">
                    {featuredScholarships.map((s: any) => <div key={s._id} className="snap-start w-80"><ScholarshipCard scholarship={s} featured /></div>)}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        {/* Featured Free Courses */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-6 md:mb-8">
              <div>
                <h2 className="font-serif text-2xl md:text-4xl text-[#1A1A1A] mb-1">Free Online Courses</h2>
                <p className="text-sm md:text-base text-gray-500">Learn from top platforms at no cost</p>
              </div>
              <Link href="/courses" className="text-[#0B3B2F] text-sm md:text-base font-medium hover:text-[#D4A373] flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {featuredCourses.length === 0 ? (
              <div className="bg-white rounded-xl border p-8 text-center">No featured courses yet. Add some in the admin panel!</div>
            ) : (
              <>
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredCourses.slice(0, 4).map((course: any) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>
                <div className="md:hidden overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  <div className="flex gap-4 w-max">
                    {featuredCourses.map((course: any) => (
                      <div key={course._id} className="snap-start w-80">
                        <CourseCard course={course} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        {/* Popular Destinations */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-6 md:mb-8">
              <div>
                <h2 className="font-serif text-2xl md:text-4xl text-[#1A1A1A] mb-1">Popular Destinations</h2>
                <p className="text-sm md:text-base text-gray-500">Explore scholarships in top study destinations</p>
              </div>
              <Link href="/countries" className="text-[#0B3B2F] text-sm md:text-base font-medium hover:text-[#D4A373] flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden md:grid md:grid-cols-4 gap-4">
              {popularCountries.slice(0, 4).map((country) => {
                const img = countryImages[country.name] || countryImages.default;
                return (
                  <Link key={country.name} href={`/countries/${encodeURIComponent(country.name)}`}>
                    <div className="group relative h-36 rounded-xl overflow-hidden shadow-sm hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                      <CardImage
                        src={img}
                        alt={country.name}
                        fallbackText={country.name}
                        height="h-36"
                      />
                      <div className="absolute bottom-3 left-3 right-3 z-20">
                        <h3 className="text-white font-semibold text-base">{country.name}</h3>
                        <p className="text-white/80 text-xs mt-0.5">{formatNumber(country.count)} scholarships</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="md:hidden overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              <div className="flex gap-4 w-max">
                {popularCountries.map((country) => {
                  const img = countryImages[country.name] || countryImages.default;
                  return (
                    <Link key={country.name} href={`/countries/${encodeURIComponent(country.name)}`} className="snap-start w-40">
                      <div className="group relative h-32 rounded-xl overflow-hidden shadow-sm">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                        <CardImage
                          src={img}
                          alt={country.name}
                          fallbackText={country.name}
                          height="h-32"
                        />
                        <div className="absolute bottom-2 left-2 right-2 z-20">
                          <h3 className="text-white font-semibold text-sm truncate">{country.name}</h3>
                          <p className="text-white/80 text-[10px] mt-0.5">{formatNumber(country.count)} scholarships</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-6 md:mb-8">
              <div>
                <h2 className="font-serif text-2xl md:text-4xl text-[#1A1A1A] mb-1">Latest Articles</h2>
                <p className="text-sm md:text-base text-gray-500">Expert advice and updates</p>
              </div>
              <Link href="/blog" className="text-[#0B3B2F] text-sm md:text-base font-medium hover:text-[#D4A373] flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {blogPosts.length === 0 ? (
              <div className="bg-white rounded-xl border p-8 text-center">No articles yet.</div>
            ) : (
              <>
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {blogPosts.slice(0, 4).map((post: any) => (
                    <Link key={post._id} href={`/blog/${post.slug}`}>
                      <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border h-full flex flex-col">
                        <CardImage
                          src={post.image || ''}
                          alt={post.title}
                          fallbackText={post.title}
                          height="h-40"
                        />
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{post.category}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                          </div>
                          <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-[#0B3B2F]">{post.title}</h3>
                          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{post.excerpt}</p>
                          <div className="mt-auto pt-3 border-t">
                            <span className="text-[#0B3B2F] text-xs font-medium group-hover:text-[#D4A373] inline-flex items-center gap-1">Read more <ChevronRight className="w-3 h-3" /></span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="md:hidden overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  <div className="flex gap-4 w-max">
                    {blogPosts.map((post: any) => (
                      <Link key={post._id} href={`/blog/${post.slug}`} className="snap-start w-72">
                        <div className="group bg-white rounded-xl overflow-hidden shadow-sm border h-full flex flex-col">
                          <CardImage
                            src={post.image || ''}
                            alt={post.title}
                            fallbackText={post.title}
                            height="h-36"
                          />
                          <div className="p-3 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">{post.category}</span>
                              <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                            </div>
                            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-[#0B3B2F]">{post.title}</h3>
                            <p className="text-gray-500 text-xs line-clamp-2 mb-3">{post.excerpt}</p>
                            <div className="mt-auto pt-2 border-t">
                              <span className="text-[#0B3B2F] text-xs font-medium group-hover:text-[#D4A373] inline-flex items-center gap-1">Read more <ChevronRight className="w-3 h-3" /></span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div className="text-center mt-6 md:mt-8">
              <Link href="/guides" className="inline-flex items-center gap-2 text-[#0B3B2F] text-sm md:text-base font-medium hover:text-[#D4A373]">
                Browse in‑depth guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}