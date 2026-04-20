import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { connectToDatabase } from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';
import CalendarClient from './CalendarClient';

export const metadata = {
  title: 'Scholarship Deadline Calendar | TheOpenScholarships',
  description: 'Track upcoming scholarship deadlines by month. Never miss a scholarship deadline again.',
};

export default async function CalendarPage() {
  await connectToDatabase();
  const allScholarships = await Scholarship.find({ deadline: { $exists: true } }, { title: 1, slug: 1, deadline: 1, degreeLevel: 1, hostCountries: 1 }).sort({ deadline: 1 });
  const scholarshipsData = allScholarships.map((s: any) => ({ _id: s._id.toString(), title: s.title, slug: s.slug, deadline: s.deadline, degreeLevel: s.degreeLevel, hostCountry: s.hostCountries?.[0] || 'Various' }));

  const heroStyle = {
    backgroundImage: `linear-gradient(135deg, rgba(11, 59, 47, 0.85), rgba(26, 93, 74, 0.85)), url(https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1920&h=600&fit=crop)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <>
      <Header />
      <main className="bg-[#FAF9F7] min-h-screen">
        <div className="relative text-white py-16 md:py-20" style={heroStyle}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Scholarship Deadline Calendar</h1>
            <p className="text-white/70 text-lg max-w-2xl">Track upcoming scholarship deadlines by month. Never miss an opportunity.</p>
          </div>
        </div>
        <CalendarClient initialScholarships={scholarshipsData} />
      </main>
      <Footer />
    </>
  );
}
