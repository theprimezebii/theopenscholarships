import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Disclaimer | TheOpenScholarships',
  description: 'Read TheOpenScholarships\'s disclaimer. Understand our limitations of liability and information accuracy.',
  keywords: 'disclaimer, liability, information accuracy, scholarship disclaimer',
};

export default function Disclaimer() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-[#0B3B2F] to-[#1A5D4A] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Disclaimer</h1>
            <p className="text-white/70 text-lg">Last updated: April 2026</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Not Affiliated with Scholarship Providers</h2>
              <p className="text-gray-600">TheOpenScholarships is an independent platform and is not affiliated with, endorsed by, or connected to any scholarship provider, government agency, university, or organization mentioned on this website.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Information Accuracy</h2>
              <p className="text-gray-600 mb-3">We make every effort to ensure that scholarship information is accurate and up-to-date. However, scholarship details, deadlines, and requirements may change without notice.</p>
              <p className="text-gray-600 font-medium">You are strongly advised to verify all information on the official scholarship provider's website before applying.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">No Financial or Legal Advice</h2>
              <p className="text-gray-600">The information on TheOpenScholarships is for educational and informational purposes only. We do not provide financial, legal, or professional advice. Consult with qualified professionals for advice tailored to your situation.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">External Links</h2>
              <p className="text-gray-600">Our website contains links to external websites. We have no control over the content, privacy policies, or practices of these sites and assume no responsibility for them. The inclusion of any link does not imply endorsement.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">No Warranties</h2>
              <p className="text-gray-600">TheOpenScholarships is provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, regarding the operation or availability of our website.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Limitation of Liability</h2>
              <p className="text-gray-600">In no event shall TheOpenScholarships be liable for any loss or damage arising from the use of our website or reliance on any information provided herein. This includes, but is not limited to, missed application deadlines, incorrect information, or any financial losses.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Scholarship Application Outcomes</h2>
              <p className="text-gray-600">TheOpenScholarships does not guarantee scholarship success. Scholarship awards are competitive and depend on many factors beyond our control. We provide tools and information to help you, but final outcomes are determined by scholarship providers.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">User Responsibility</h2>
              <p className="text-gray-600">You are solely responsible for your scholarship applications. You should read and understand all requirements, meet deadlines, and submit accurate information. TheOpenScholarships is not responsible for application errors or missed opportunities.</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-amber-800 text-sm font-medium">Important Reminder</p>
              <p className="text-amber-700 text-sm mt-1">Always visit the official scholarship website to verify deadlines, eligibility, and application requirements before submitting any application. TheOpenScholarships is a free resource, but the final responsibility for application accuracy rests with you.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
