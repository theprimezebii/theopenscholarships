import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Use | TheOpenScholarships',
  description: 'Read TheOpenScholarships\'s terms of use. Understand the rules and guidelines for using our scholarship platform.',
  keywords: 'terms of use, terms and conditions, user agreement, scholarship terms',
};

export default function TermsOfUse() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-[#0B3B2F] to-[#1A5D4A] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Terms of Use</h1>
            <p className="text-white/70 text-lg">Last updated: April 2026</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Acceptance of Terms</h2>
              <p className="text-gray-600">By accessing TheOpenScholarships, you agree to be bound by these Terms of Use. If you do not agree, please do not use our website.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Use of Information</h2>
              <p className="text-gray-600 mb-3">The scholarship information provided on TheOpenScholarships is for informational purposes only. We strive to keep information accurate and up-to-date, but we do not guarantee its completeness or accuracy.</p>
              <p className="text-gray-600">Always verify scholarship details on the official scholarship provider's website before applying.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">No Guarantee of Results</h2>
              <p className="text-gray-600">TheOpenScholarships provides scholarship listings and application guidance. We do not guarantee that you will receive any scholarship. Scholarship decisions are made solely by the scholarship providers.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">User Accounts</h2>
              <p className="text-gray-600">You are responsible for maintaining the confidentiality of your account information. You agree to accept responsibility for all activities that occur under your account.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">User Conduct</h2>
              <p className="text-gray-600 mb-3">You agree to use TheOpenScholarships for lawful purposes only. You may not:</p>
              <ul className="list-disc ml-6 text-gray-600 space-y-1">
                <li>Scrape or copy our scholarship data without permission</li>
                <li>Submit false information through our contact forms</li>
                <li>Attempt to hack or disrupt our website</li>
                <li>Post spam or malicious content in the forum</li>
                <li>Impersonate another person or entity</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Intellectual Property</h2>
              <p className="text-gray-600">All content on TheOpenScholarships, including text, graphics, logos, and software, is the property of TheOpenScholarships and is protected by copyright laws.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Third-Party Links</h2>
              <p className="text-gray-600">Our website contains links to external websites. We are not responsible for the content, accuracy, or practices of these third-party sites.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Limitation of Liability</h2>
              <p className="text-gray-600">TheOpenScholarships and its owners shall not be liable for any damages arising from the use or inability to use our website, including but not limited to missed scholarship deadlines or application errors.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Indemnification</h2>
              <p className="text-gray-600">You agree to indemnify and hold TheOpenScholarships harmless from any claims, damages, or expenses arising from your use of the website or violation of these terms.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Termination</h2>
              <p className="text-gray-600">We reserve the right to terminate or suspend your access to TheOpenScholarships at our sole discretion, without notice, for conduct that violates these terms.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Changes to Terms</h2>
              <p className="text-gray-600">We may update these Terms of Use at any time. Continued use of TheOpenScholarships constitutes acceptance of the updated terms.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Governing Law</h2>
              <p className="text-gray-600">These terms shall be governed by and construed in accordance with the laws of Pakistan.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Contact Us</h2>
              <p className="text-gray-600">For questions about these Terms, please contact us at theprimezebii@gmail.com</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
