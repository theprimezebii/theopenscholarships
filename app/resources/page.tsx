import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import CardImage from '@/components/CardImage';
import { 
  FileText, Calendar, Users, Award, BookOpen, GraduationCap, Globe, PenTool,
  ArrowRight, Sparkles, Compass, MessageCircle, Mail, Clock, Target
} from 'lucide-react';

export const metadata = {
  title: 'Scholarship Resources & Guides | TheOpenScholarships',
  description: 'Free resources to help you win scholarships: application guides, deadline calendar, blog, forum, and success stories.',
};

const resourceCategories = [
  {
    title: 'Application Guides',
    description: 'Step-by-step guides to craft winning applications.',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    links: [
      { name: 'How to Apply for Scholarships', href: '/how-to-apply', icon: Compass },
      { name: 'Write a Personal Statement', href: '/guides/how-to-write-winning-personal-statement', icon: PenTool },
      { name: 'Get Strong Recommendation Letters', href: '/guides/how-to-get-strong-recommendation-letters', icon: Users },
      { name: 'IELTS Guide', href: '/guides/ielts-scholarship-guide', icon: Globe },
    ]
  },
  {
    title: 'Tools & Planning',
    description: 'Stay organized and never miss a deadline.',
    icon: Calendar,
    color: 'from-green-500 to-green-600',
    links: [
      { name: 'Deadline Calendar', href: '/calendar', icon: Clock },
      { name: 'Scholarship Search', href: '/scholarships', icon: Target },
      { name: 'Financial Planning Guide', href: '/guides/complete-financial-guide-study-abroad', icon: GraduationCap },
    ]
  },
  {
    title: 'Community & Support',
    description: 'Connect with other students and get help.',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    links: [
      { name: 'Student Forum', href: '/forum', icon: MessageCircle },
      { name: 'Success Stories', href: '/stories', icon: Award },
      { name: 'Contact Us', href: '/contact', icon: Mail },
    ]
  },
  {
    title: 'Scholarship Lists',
    description: 'Curated lists of top opportunities.',
    icon: Award,
    color: 'from-amber-500 to-amber-600',
    links: [
      { name: 'Top 10 Fully Funded Scholarships 2026', href: '/blog/top-10-scholarships', icon: Sparkles },
      { name: 'Country Comparison', href: '/guides/country-comparison-best-places-to-study-abroad-in', icon: Globe },
      { name: 'All Scholarships', href: '/scholarships', icon: BookOpen },
    ]
  },
];

const popularGuides = [
  { 
    title: 'Scholarship Interview Guide', 
    desc: '50+ questions and sample answers', 
    href: '/guides/scholarship-interview-guide', 
    icon: MessageCircle,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format'
  },
  { 
    title: 'Complete Financial Guide', 
    desc: 'Budgeting, loans, and funding', 
    href: '/guides/complete-financial-guide-study-abroad', 
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format'
  },
  { 
    title: 'Country Comparison', 
    desc: 'UK, USA, Germany, Canada compared', 
    href: '/guides/country-comparison-study-abroad', 
    icon: Globe,
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600&auto=format'
  },
];

export default function ResourcesPage() {
  const heroImageUrl = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1920&auto=format';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div
          className="relative text-white py-20 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(11, 59, 47, 0.85), rgba(26, 93, 74, 0.85)), url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0B3B2F'
          }}
        >
          <div className="absolute top-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#D4A373]/10 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Free Resources</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Scholarship Resources
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
              Everything you need to find and win scholarships—all in one place.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Resource Categories Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {resourceCategories.map((category, index) => (
              <div key={index} className="group bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-[#1A1A1A]">{category.title}</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{category.description}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {category.links.map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      className="flex items-center gap-3 p-3 -mx-3 rounded-lg text-gray-600 hover:text-[#0B3B2F] hover:bg-gray-50 transition-all group/link"
                    >
                      <link.icon className="w-5 h-5 text-gray-400 group-hover/link:text-[#0B3B2F] transition-colors" />
                      <span className="flex-1">{link.name}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Popular Guides Section */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-3">Popular Guides</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Handpicked resources to accelerate your scholarship journey</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {popularGuides.map((guide, i) => (
                <Link key={i} href={guide.href} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="h-40 relative">
                    <CardImage 
                      src={guide.image} 
                      alt={guide.title} 
                      fallbackText={guide.title}
                      height="h-40"
                    />
                  </div>
                  <div className="p-6">
                    <div className="w-12 h-12 bg-[#0B3B2F]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0B3B2F]/20 transition-colors">
                      <guide.icon className="w-6 h-6 text-[#0B3B2F]" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-[#0B3B2F] transition-colors">{guide.title}</h3>
                    <p className="text-gray-500 text-sm">{guide.desc}</p>
                    <div className="mt-4 flex items-center gap-1 text-[#0B3B2F] font-medium text-sm group-hover:gap-2 transition-all">
                      Read Guide <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="relative bg-gradient-to-r from-[#0B3B2F] to-[#1A5D4A] rounded-3xl p-10 md:p-12 text-center text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4A373]/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <h2 className="font-serif text-2xl md:text-4xl mb-4">Can't find what you need?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Our team is here to help you navigate your scholarship journey.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-[#D4A373] text-[#0B3B2F] px-8 py-3 rounded-xl font-semibold hover:bg-[#C67B5E] transition-colors shadow-lg">
                <Mail className="w-5 h-5" />
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
