// app/how-to-apply/page.tsx
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, TrendingUp, FileText, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'How to Apply for Scholarships | TheOpenScholarships',
  description: 'A comprehensive step-by-step guide to successfully applying for fully funded international scholarships.',
};

export default function HowToApply() {
  const heroImageUrl = 'https://images.unsplash.com/photo-1587116987778-063b06240f22?q=80&w=1920&auto=format&fit=crop';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div
          className="relative text-white py-20 md:py-24"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(11, 59, 47, 0.85), rgba(26, 93, 74, 0.85)), url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0B3B2F'
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                How to Apply for Scholarships
              </h1>
              <p className="text-white/80 text-lg">
                A comprehensive step-by-step guide to successfully applying for fully funded international scholarships.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Application Timeline */}
          <div className="mb-16">
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-8 text-center">Application Timeline</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {[
                { months: 12, label: 'Research Phase' },
                { months: 6, label: 'Document Phase' },
                { months: 3, label: 'Writing Phase' },
                { months: 1, label: 'Final Review' },
                { months: 0, label: 'Submission' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-[#0B3B2F] text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-sm">
                    {item.months}
                  </div>
                  <p className="font-medium text-sm">Months Before</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1 */}
          <Step number={1} title="Research Thoroughly">
            <p className="text-gray-600 mb-4 leading-relaxed">
              Start your research at least 12 months before your intended start date. Many students miss opportunities because they begin too late.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-[#0B3B2F] mb-2">What to Research</h3>
                <CheckList items={[
                  'Scholarship deadlines and application timeline',
                  'Eligibility requirements by country and degree level',
                  'Required documents and language tests',
                  'University programmes and admission criteria'
                ]} />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-[#0B3B2F] mb-2">Recommended Resources</h3>
                <CheckList items={[
                  'TheOpenScholarships scholarship database',
                  'Official scholarship websites',
                  'University admission portals',
                  'Professional alumni networks'
                ]} />
              </div>
            </div>
          </Step>

          {/* Step 2 */}
          <Step number={2} title="Prepare Required Documents">
            <p className="text-gray-600 mb-4 leading-relaxed">
              Most scholarships require similar documents. Begin gathering them 4-6 months before the deadline to avoid last-minute complications.
            </p>
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="font-medium text-[#0B3B2F] mb-3">Document Checklist</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Academic transcripts (certified and translated)',
                  'Valid passport (minimum 6 months validity)',
                  'English proficiency certificate (IELTS or TOEFL)',
                  'Letters of recommendation (2 to 3)',
                  'Statement of purpose or motivation letter',
                  'Academic CV or resume',
                  'Research proposal (for PhD applicants)',
                  'Medical examination certificate (if required)'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 border-b border-gray-200">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Step>

          {/* Step 3 */}
          <Step number={3} title="Write a Compelling Statement of Purpose">
            <p className="text-gray-600 mb-4 leading-relaxed">
              The statement of purpose is the most critical component of your application. It provides an opportunity to present your unique story and demonstrate why you deserve the scholarship.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-[#0B3B2F] mb-2">Essential Elements</h3>
                <CheckList items={[
                  'Academic background and key achievements',
                  'Rationale for chosen programme and university',
                  'Career objectives and scholarship alignment',
                  'Plans for contributing to home country'
                ]} />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-[#0B3B2F] mb-2">Common Mistakes to Avoid</h3>
                <CheckList items={[
                  'Generic content applicable to any scholarship',
                  'Exceeding specified word limits',
                  'Grammatical errors and typos',
                  'Failing to address the specific prompt'
                ]} type="error" />
              </div>
            </div>
            <div className="mt-4 bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-sm text-amber-800 font-medium">
                Professional Tip: Write multiple drafts. Seek feedback from professors, mentors, or scholarship alumni. Read your statement aloud to identify awkward phrasing.
              </p>
            </div>
          </Step>

          {/* Step 4 */}
          <Step number={4} title="Secure Strong Recommendation Letters">
            <p className="text-gray-600 mb-4 leading-relaxed">
              Effective recommendation letters come from individuals who know your work well and can articulate your specific strengths and qualifications.
            </p>
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="font-medium text-[#0B3B2F] mb-3">Best Practices for Recommendations</h3>
              <CheckList items={[
                'Request letters 2 to 3 months before the deadline',
                'Select recommenders who know you personally and professionally',
                'Provide your CV, draft SOP, and scholarship details',
                'Send a polite reminder two weeks before the deadline',
                'Express gratitude after submission'
              ]} />
            </div>
          </Step>

          {/* Step 5 */}
          <Step number={5} title="Submit Before the Deadline">
            <p className="text-gray-600 mb-4 leading-relaxed">
              Avoid waiting until the final day. Technical difficulties, server congestion, and unexpected issues frequently arise at deadlines.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-[#0B3B2F] mb-2">Final Verification Checklist</h3>
                <CheckList items={[
                  'All documents uploaded correctly',
                  'Contact information is accurate',
                  'Confirmation email received',
                  'Screenshot of submission saved'
                ]} />
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-medium text-red-700 mb-2">Critical Warning</h3>
                <p className="text-sm text-red-600">
                  Set your personal deadline at least 7 days before the official deadline. This buffer allows time to resolve any technical issues.
                </p>
              </div>
            </div>
          </Step>

          {/* Step 6 */}
          <Step number={6} title="Prepare for the Interview">
            <p className="text-gray-600 mb-4 leading-relaxed">
              Many prestigious scholarships include an interview stage. Thorough preparation significantly increases your chances of success.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { phase: 'Research Phase', description: 'Study the scholarship\'s values and review past interview questions' },
                { phase: 'Practice Phase', description: 'Conduct mock interviews with colleagues or mentors' },
                { phase: 'Professional Presentation', description: 'Dress professionally, test equipment, arrive early' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 text-center">
                  <h3 className="font-medium text-[#0B3B2F] mb-1">{item.phase}</h3>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </Step>

          {/* Common Mistakes Section */}
          <div className="mb-12">
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-5 text-center">Common Reasons for Application Rejection</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Missing the deadline by even one minute',
                  'Submitting incomplete documentation',
                  'Generic, non-specific personal statements',
                  'Ignoring formatting or word limit guidelines',
                  'Weak or generic recommendation letters',
                  'Applying without verifying eligibility',
                  'Spelling and grammatical errors',
                  'Failing to tailor application to the scholarship',
                  'Submitting unreadable scanned documents',
                  'Not saving submission confirmation'
                ].map((reason, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center py-8">
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">Ready to Begin Your Application?</h2>
            <p className="text-gray-500 mb-6">Explore our database of verified scholarships and take the first step toward your global education.</p>
            <Link
              href="/scholarships"
              className="inline-block bg-[#0B3B2F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1A5D4A] transition-colors"
            >
              Browse Available Scholarships
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Reusable Step Component
function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-[#0B3B2F] text-white rounded-xl flex items-center justify-center text-lg font-bold">
            {number.toString().padStart(2, '0')}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}

// Reusable CheckList Component
function CheckList({ items, type = 'success' }: { items: string[]; type?: 'success' | 'error' }) {
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const iconColor = type === 'success' ? 'text-green-600' : 'text-red-500';
  return (
    <ul className="space-y-2 text-sm text-gray-600">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <Icon className={`w-4 h-4 ${iconColor} mt-0.5 flex-shrink-0`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}