import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Scholarship Glossary | Key Terms Explained',
  description: 'Understand scholarship terminology: fully funded, stipend, tuition waiver, GRE, IELTS, and more. Clear definitions for international students.',
  keywords: 'scholarship glossary, fully funded meaning, stipend definition, tuition waiver explained, GRE, IELTS, TOEFL, scholarship terms',
};

const glossaryTerms = [
  {
    term: 'Fully Funded',
    definition: 'A scholarship that covers all major expenses including tuition, living costs, travel, and health insurance. The student pays nothing out of pocket.'
  },
  {
    term: 'Stipend',
    definition: 'A fixed regular payment given to scholarship recipients to cover living expenses such as accommodation, food, and transportation.'
  },
  {
    term: 'Tuition Waiver',
    definition: 'A scholarship component that exempts the student from paying university tuition fees, either partially or in full.'
  },
  {
    term: 'GRE',
    definition: 'Graduate Record Examination. A standardized test required for admission to many graduate programs, especially in the United States.'
  },
  {
    term: 'IELTS',
    definition: 'International English Language Testing System. A globally recognized English proficiency test required by universities in the UK, Australia, Canada, and Europe.'
  },
  {
    term: 'TOEFL',
    definition: 'Test of English as a Foreign Language. An English proficiency test primarily used by universities in the United States and Canada.'
  },
  {
    term: 'Personal Statement',
    definition: 'An essay written by the applicant explaining their motivations, achievements, and goals. A critical component of scholarship applications.'
  },
  {
    term: 'Letter of Recommendation',
    definition: 'A letter written by a professor, employer, or mentor endorsing the applicant\'s abilities, character, and potential.'
  },
  {
    term: 'Deadline',
    definition: 'The final date by which a scholarship application must be submitted. Applications received after this date are typically rejected.'
  },
  {
    term: 'Eligibility Criteria',
    definition: 'The set of requirements an applicant must meet to qualify for a scholarship, such as nationality, academic background, or work experience.'
  },
  {
    term: 'Merit‑Based Scholarship',
    definition: 'A scholarship awarded based on academic achievement, leadership, or talent, rather than financial need.'
  },
  {
    term: 'Need‑Based Scholarship',
    definition: 'A scholarship awarded to students who demonstrate financial hardship or come from low‑income backgrounds.'
  },
  {
    term: 'Rolling Admission',
    definition: 'A process where applications are reviewed as they arrive, and scholarships are awarded until all funds are exhausted. Early application is advantageous.'
  },
  {
    term: 'Conditional Offer',
    definition: 'An offer of admission or scholarship that depends on the applicant meeting specific requirements, such as achieving a certain test score.'
  },
  {
    term: 'Unconditional Offer',
    definition: 'A final offer of admission or scholarship with no further requirements to fulfill.'
  }
];

export default function GlossaryPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0B3B2F] to-[#1A5D4A] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Scholarship Glossary</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Clear definitions of common scholarship and study‑abroad terms.
            </p>
          </div>
        </div>

        {/* Glossary Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {glossaryTerms.map((item, index) => (
              <div key={index} id={item.term.toLowerCase().replace(/\s+/g, '-')} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h2 className="font-serif text-xl font-semibold text-[#0B3B2F] mb-2">{item.term}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
