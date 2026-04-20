import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | TheOpenScholarships',
  description: 'Read TheOpenScholarships\'s privacy policy to understand how we collect, use, and protect your personal information.',
  keywords: 'privacy policy, data protection, user privacy, scholarship website privacy',
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-[#0B3B2F] to-[#1A5D4A] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Privacy Policy</h1>
            <p className="text-white/70 text-lg">Last updated: April 2026</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Information We Collect</h2>
              <p className="text-gray-600 mb-3">When you use TheOpenScholarships, we may collect the following information:</p>
              <ul className="list-disc ml-6 text-gray-600 space-y-1">
                <li>Email address (when you subscribe to our newsletter)</li>
                <li>Name and contact information (when you contact us)</li>
                <li>Usage data such as pages visited and scholarship searches</li>
                <li>Saved scholarships (stored to provide you with bookmarking functionality)</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">How We Use Your Information</h2>
              <p className="text-gray-600 mb-3">We use the information we collect to:</p>
              <ul className="list-disc ml-6 text-gray-600 space-y-1">
                <li>Send weekly scholarship alerts to subscribers</li>
                <li>Respond to your inquiries and messages</li>
                <li>Improve our website and scholarship listings</li>
                <li>Analyze which scholarships are most popular</li>
                <li>Remember your saved scholarships across sessions</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Information Sharing</h2>
              <p className="text-gray-600">We do not sell, trade, or rent your personal information to third parties. We only share information when required by law or to protect our rights.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Cookies</h2>
              <p className="text-gray-600">TheOpenScholarships uses cookies to improve user experience. Cookies are small files stored on your device that help us remember your preferences, save your scholarship bookmarks, and analyze site traffic.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Third-Party Links</h2>
              <p className="text-gray-600">Our scholarship listings contain links to external websites. We are not responsible for the privacy practices of those websites. Always review their privacy policies before providing personal information.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Data Security</h2>
              <p className="text-gray-600">We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Your Rights</h2>
              <p className="text-gray-600">You have the right to unsubscribe from our emails at any time. You may also request deletion of your personal data by contacting us.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Children's Privacy</h2>
              <p className="text-gray-600">TheOpenScholarships is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Changes to This Policy</h2>
              <p className="text-gray-600">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0B3B2F] mb-3">Contact Us</h2>
              <p className="text-gray-600">If you have questions about this Privacy Policy, please contact us at theprimezebii@gmail.com</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
