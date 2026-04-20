import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ForumClient from './ForumClient';

export const metadata = {
  title: 'Student Forum | The Open Scholarships',
  description: 'Join the student community. Ask questions, share experiences, and get advice on scholarship applications.',
  keywords: 'scholarship forum, student discussion, study abroad community, application help',
};

export default function ForumPage() {
  const heroImageUrl = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1920&auto=format';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div
          className="relative text-white py-12 md:py-16"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(11, 59, 47, 0.85), rgba(26, 93, 74, 0.85)), url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0B3B2F'
          }}
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Student Forum</h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
              Connect with fellow scholarship seekers, ask questions, and share your experiences.
            </p>
          </div>
        </div>
        <ForumClient />
      </main>
      <Footer />
    </>
  );
}
