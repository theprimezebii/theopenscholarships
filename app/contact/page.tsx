import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact Us | The Open Scholarships',
  description: 'Have questions about scholarships? Contact us. We reply within 24 hours to help you with scholarship queries.',
  keywords: 'contact scholarships, scholarship help, study abroad support',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div
          className="relative text-white py-16 md:py-20"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(11, 59, 47, 0.85), rgba(26, 93, 74, 0.85)), url(https://plus.unsplash.com/premium_photo-1661542867896-54694497f5cd?q=80&w=1954&auto=format&fit=crop)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0B3B2F'
          }}
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Have questions about scholarships? Need help finding opportunities? 
              We're here to help. We reply within 24 hours.
            </p>
          </div>
        </div>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
