import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import CardImage from '@/components/CardImage';
import StatCard from '@/components/StatCard';
import { connectToDatabase } from '@/lib/mongodb';
import SuccessStory from '@/models/SuccessStory';
import { Award, Users, Globe } from 'lucide-react';

export const metadata = {
  title: 'Success Stories | The Open Scholarships',
  description: 'Real stories from students who found their dream scholarships through The Open Scholarships.',
};

const STATS = {
  stories: '1.2K+',
  countries: '85+',
  scholarships: '2.5K+'
};

export default async function StoriesPage() {
  await connectToDatabase();
  const stories = await SuccessStory.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean();
  
  const heroImageUrl = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
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
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Success Stories</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Real students, real scholarships, real dreams come true.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Banner - Using StatCard for consistency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12">
            <StatCard icon={Award} value={STATS.stories} label="Success Stories" color="blue" />
            <StatCard icon={Globe} value={STATS.countries} label="Countries Represented" color="green" />
            <StatCard icon={Users} value={STATS.scholarships} label="Scholarships Awarded" color="amber" />
          </div>

          {/* Stories Grid */}
          {stories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>No stories yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {stories.map((story: any) => (
                <div key={story._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden">
                        <CardImage
                          src={story.image || ''}
                          alt={story.name}
                          fallbackText={story.name}
                          height="h-16"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl text-[#1A1A1A]">{story.name}</h3>
                        <p className="text-gray-500 text-sm">{story.country}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{story.scholarship}</span>
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{story.university}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic mb-4">"{story.quote}"</p>
                    <p className="text-gray-700 text-sm mb-4">{story.fullStory}</p>
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400">Class of {story.year} · {story.program}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Share Your Story CTA */}
          <div className="mt-16 bg-gradient-to-r from-[#0B3B2F] to-[#1A5D4A] rounded-2xl p-8 text-center text-white">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Share Your Success Story</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Inspire thousands of other students by sharing your journey.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#D4A373] text-[#0B3B2F] px-8 py-3 rounded-lg font-semibold hover:bg-[#C67B5E] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
