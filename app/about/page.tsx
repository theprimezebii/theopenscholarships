import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building2, GraduationCap, MapPin, Users } from 'lucide-react';
import StatCard from '@/components/StatCard';

export const metadata = {
  title: 'About TheOpenScholarships | Scholarship Platform for Developing Countries',
  description: 'TheOpenScholarships helps students from developing countries discover fully funded scholarships. Learn about our mission, story, and impact.',
  keywords: 'about fundedworld, scholarship platform, study abroad help, education funding',
};

export default async function About() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div
          className="relative bg-gradient-to-br from-[#0B3B2F] to-[#1A5D4A] text-white overflow-hidden py-20 md:py-24"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(11, 59, 47, 0.85), rgba(26, 93, 74, 0.85)), url(https://plus.unsplash.com/premium_photo-1677529498680-fdb9d5ee762a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                About TheOpenScholarships
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Talent is equally distributed across the world. Opportunity is not.
                TheOpenScholarships exists to change that.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        {/* Impact Stats */}
        <div className="bg-white py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              < StatCard icon={GraduationCap} value="2.5K+" label="Scholarships Listed" color="blue" />
              <StatCard icon={MapPin} value="85+" label="Countries" color="green" />
              <StatCard icon={Building2} value="1.2K+" label="Open Opportunities" color="amber" />
              <StatCard icon={Users} value="1.8M+" label="Students Helped" color="purple" />
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-4">Our Mission</h2>
              <div className="w-20 h-1 bg-[#D4A373] mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To bridge the information gap between talented students in developing countries
                and fully funded educational opportunities worldwide. We find scholarships,
                verify them, and present every detail clearly — so students can spend their
                time applying, not searching.
              </p>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-4">Our Story</h2>
                <div className="w-20 h-1 bg-[#D4A373] mb-6"></div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    TheOpenScholarships was born from frustration. Our founders were students from
                    developing countries who spent hundreds of hours searching for scholarships
                    — only to find outdated information, broken links, and websites built for
                    Western audiences.
                  </p>
                  <p>
                    After winning scholarships themselves — Chevening, DAAD, and Türkiye Burslari
                    — they decided to build the resource they wished had existed: a clean, accurate,
                    and regularly updated database specifically for students from developing countries.
                  </p>
                  <p>
                    Since launch, TheOpenScholarships has helped over 1.8 million students discover and apply
                    for scholarships. Many of them are now studying at top universities worldwide
                    — fully funded.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#0B3B2F] to-[#1A5D4A] rounded-2xl p-8 text-white">
                <div className="text-center">
                  <div className="text-5xl font-serif mb-4">"</div>
                  <p className="text-lg italic leading-relaxed">
                    TheOpenScholarships helped me find scholarships I never knew existed.
                    Today, I am studying at Oxford University, fully funded.
                  </p>
                  <div className="mt-6">
                    <p className="font-semibold">— Aisha Khan</p>
                    <p className="text-white/60 text-sm">Chevening Scholar, Oxford University</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-4">What We Stand For</h2>
              <div className="w-20 h-1 bg-[#D4A373] mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our core values guide everything we do at TheOpenScholarships.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#0B3B2F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0B3B2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Student-First</h3>
                <p className="text-gray-500 text-sm">
                  Every decision is centred on helping students from developing countries access quality education.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#0B3B2F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0B3B2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Verified Information</h3>
                <p className="text-gray-500 text-sm">
                  We research every scholarship manually from official sources before publishing.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#0B3B2F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0B3B2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Truly Global Coverage</h3>
                <p className="text-gray-500 text-sm">
                  Scholarships from 85+ host countries for students from 150+ developing nations.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#0B3B2F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0B3B2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">100% Free Forever</h3>
                <p className="text-gray-500 text-sm">
                  No paywalls, no premium tiers, no hidden fees. Ever. Scholarships should be accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-4">Our Team</h2>
              <div className="w-20 h-1 bg-[#D4A373] mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                A diverse team of scholarship recipients and education enthusiasts dedicated to helping students worldwide.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-[#0B3B2F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-serif text-[#0B3B2F]">Z</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1A1A1A]">Zohaib</h3>
                <p className="text-[#D4A373] text-sm mb-2">Founder & Lead Developer</p>
                <p className="text-gray-500 text-sm">Chevening Scholar, building platforms to democratize education access.</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-[#0B3B2F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-serif text-[#0B3B2F]">S</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1A1A1A]">Sarah</h3>
                <p className="text-[#D4A373] text-sm mb-2">Head of Research</p>
                <p className="text-gray-500 text-sm">DAAD alumna, passionate about connecting students with opportunities.</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-[#0B3B2F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-serif text-[#0B3B2F]">M</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1A1A1A]">Michael</h3>
                <p className="text-[#D4A373] text-sm mb-2">Community Manager</p>
                <p className="text-gray-500 text-sm">Fulbright scholar, helping students navigate application processes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-[#0B3B2F] to-[#1A5D4A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Ready to Find Your Scholarship?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students who have found their path to a fully funded education.
            </p>
            <Link
              href="/scholarships"
              className="inline-block bg-[#D4A373] text-[#0B3B2F] px-8 py-3 rounded-lg font-semibold hover:bg-[#C67B5E] transition-colors"
            >
              Browse Scholarships
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
