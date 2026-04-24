import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShareButton from '@/components/ShareButton';
import PrintButton from '@/components/PrintButton';
import RelatedGuides from '@/components/RelatedGuides';
import CardImage from '@/components/CardImage';
import { connectToDatabase } from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';
import { 
  MapPin, GraduationCap, Globe, Clock, Award, 
  FileText, CheckCircle, ExternalLink, ArrowLeft,
  ChevronRight
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await connectToDatabase();
  const scholarship = await Scholarship.findOne({ slug }).lean();
  if (!scholarship) return { title: 'Scholarship Not Found' };

  const title = `${scholarship.title} | The Open Scholarships`;
  const description = scholarship.description?.substring(0, 160) || '';
  
  // Prepare OG parameters (no image URL – pure text card)
  const funding = Array.isArray(scholarship.fundingType)
    ? scholarship.fundingType[0]
    : scholarship.fundingType || 'Fully Funded';
  const host = scholarship.hostCountries?.[0] || 'Various';
  const deadline = new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const level = Array.isArray(scholarship.degreeLevel)
    ? scholarship.degreeLevel[0]
    : scholarship.degreeLevel || 'All Levels';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theopenscholarships.vercel.app';
  const ogUrl = new URL(`${baseUrl}/api/og`);
  ogUrl.searchParams.set('type', 'scholarship');
  ogUrl.searchParams.set('title', scholarship.title);
  ogUrl.searchParams.set('description', description);
  ogUrl.searchParams.set('funding', funding);
  ogUrl.searchParams.set('host', host);
  ogUrl.searchParams.set('deadline', deadline);
  ogUrl.searchParams.set('level', level);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/scholarships/${scholarship.slug}`,
      siteName: 'The Open Scholarships',
      images: [{ url: ogUrl.toString(), width: 1200, height: 630, alt: scholarship.title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
}

// Convert a deadline date to a friendly hint
function getDeadlineHint(deadline: Date): string {
  const month = deadline.getMonth();
  const day = deadline.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (day <= 10) return `Early ${monthNames[month]}`;
  if (day <= 20) return `Mid ${monthNames[month]}`;
  return `Late ${monthNames[month]}`;
}

export default async function ScholarshipDetailPage({ params }: PageProps) {
  const { slug } = await params;
  await connectToDatabase();
  const scholarship = await Scholarship.findOne({ slug }).lean();
  
  if (!scholarship) notFound();
  
  await Scholarship.updateOne({ slug }, { $inc: { views: 1 } });
  
  const deadlineHint = getDeadlineHint(new Date(scholarship.deadline));
  
  // Similar scholarships
  const relatedScholarships = await Scholarship.find({
    _id: { $ne: scholarship._id },
    hostCountries: { $in: scholarship.hostCountries },
    status: 'open'
  }).limit(3).lean();

  // Hero background with high‑quality image
  const heroImageSrc = scholarship.image 
    ? `${scholarship.image}?q=80&w=1920&auto=format`
    : '';

  const fundingString = Array.isArray(scholarship.fundingType) 
    ? scholarship.fundingType.join(', ') 
    : scholarship.fundingType || 'Fully Funded';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section with Gradient Overlay */}
        <div className="relative text-white overflow-hidden bg-gradient-to-br from-[#0B3B2F] to-[#1A5D4A]">
          {heroImageSrc && (
            <div className="absolute inset-0">
              <CardImage 
                src={heroImageSrc} 
                alt={scholarship.title} 
                fallbackText={scholarship.provider}
                height="h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B3B2F]/80 to-[#1A5D4A]/80" />
            </div>
          )}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Link href="/scholarships" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm md:text-base">
              <ArrowLeft className="w-4 h-4" /> Back to Scholarships
            </Link>
            
            {/* Region badge only */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {scholarship.region && !scholarship.region.includes('Global') && (
                <span className="bg-amber-500/90 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> {Array.isArray(scholarship.region) ? scholarship.region[0] : scholarship.region}
                </span>
              )}
            </div>
            
            <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-bold mb-3">{scholarship.title}</h1>
            <p className="text-white/80 text-sm md:text-base mb-4">Offered by <span className="font-semibold">{scholarship.provider}</span></p>
            
            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> Deadline: <strong className="text-white">{deadlineHint}</strong></div>
              <div className="flex items-center gap-1"><Award className="w-4 h-4" /> Funding: <strong className="text-white">{fundingString}</strong></div>
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Host: <strong className="text-white">{scholarship.hostCountries?.join(', ') || 'Various'}</strong></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Action buttons */}
              <div className="flex items-center justify-between print-hide">
                <div className="flex gap-2">
                  <ShareButton title={scholarship.title} description={scholarship.description?.substring(0, 160)} url={`/scholarships/${scholarship.slug}`} />
                  <PrintButton />
                </div>
              </div>

              {/* Description */}
              <section className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
                <h2 className="text-xl font-serif font-semibold mb-4 pb-2 border-b">About the Scholarship</h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{scholarship.description}</p>
              </section>

              {/* Benefits */}
              {scholarship.benefits?.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
                  <h2 className="text-xl font-serif font-semibold mb-4 pb-2 border-b">Scholarship Benefits</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {scholarship.benefits.map((benefit: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm md:text-base">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Eligibility */}
              {scholarship.eligibility?.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
                  <h2 className="text-xl font-serif font-semibold mb-4 pb-2 border-b">Eligibility Criteria</h2>
                  <div className="space-y-3">
                    {scholarship.eligibility.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="flex-shrink-0 w-6 h-6 bg-[#0B3B2F] text-white rounded-full flex items-center justify-center text-sm font-medium">{i+1}</span>
                        <span className="text-gray-700 text-sm md:text-base">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* How to Apply */}
              {scholarship.howToApply?.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
                  <h2 className="text-xl font-serif font-semibold mb-4 pb-2 border-b">Application Process</h2>
                  <div className="space-y-4">
                    {scholarship.howToApply.map((step: string, i: number) => (
                      <div key={i} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                        <span className="flex-shrink-0 w-7 h-7 bg-[#0B3B2F] text-white rounded-full flex items-center justify-center text-sm font-semibold">{i+1}</span>
                        <span className="text-gray-700 text-sm md:text-base pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Required Documents */}
              {scholarship.requiredDocuments?.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
                  <h2 className="text-xl font-serif font-semibold mb-4 pb-2 border-b">Required Documents</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {scholarship.requiredDocuments.map((doc: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Important Dates */}
              {(scholarship.importantDates?.resultsAnnouncement || scholarship.importantDates?.programmeStart) && (
                <section className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
                  <h2 className="text-xl font-serif font-semibold mb-4 pb-2 border-b">Important Dates</h2>
                  <div className="space-y-3">
                    {scholarship.importantDates.resultsAnnouncement && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Results Announcement</span>
                        <span className="font-medium">{scholarship.importantDates.resultsAnnouncement}</span>
                      </div>
                    )}
                    {scholarship.importantDates.programmeStart && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Programme Start</span>
                        <span className="font-medium">{scholarship.importantDates.programmeStart}</span>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Application Tips */}
              {scholarship.applicationTips && (
                <section className="bg-amber-50 rounded-xl border border-amber-200 p-5 md:p-6">
                  <h2 className="text-xl font-serif font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" /> Application Tips
                  </h2>
                  <p className="text-gray-700 text-sm md:text-base whitespace-pre-wrap">{scholarship.applicationTips}</p>
                </section>
              )}

              {/* FAQs */}
              {scholarship.faqs?.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
                  <h2 className="text-xl font-serif font-semibold mb-4 pb-2 border-b">Frequently Asked Questions</h2>
                  <div className="space-y-3">
                    {scholarship.faqs.map((faq: any, i: number) => (
                      <details key={i} className="group border border-gray-200 rounded-lg overflow-hidden">
                        <summary className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer list-none">
                          <span className="font-medium text-sm md:text-base pr-4">{faq.question}</span>
                          <ChevronRight className="w-4 h-4 text-gray-500 group-open:rotate-90 transition-transform flex-shrink-0" />
                        </summary>
                        <div className="p-4 bg-white border-t">
                          <p className="text-gray-700 text-sm md:text-base">{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Key Information */}
              <section className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
                <h2 className="text-xl font-serif font-semibold mb-4 pb-2 border-b">Key Information</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <span className="text-xs text-gray-500 block mb-1">Degree Level</span>
                    <span className="font-medium text-sm">{Array.isArray(scholarship.degreeLevel) ? scholarship.degreeLevel.join(', ') : scholarship.degreeLevel}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <span className="text-xs text-gray-500 block mb-1">Host Country</span>
                    <span className="font-medium text-sm">{scholarship.hostCountries?.join(', ') || 'Various'}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <span className="text-xs text-gray-500 block mb-1">Study Fields</span>
                    <span className="font-medium text-sm">{scholarship.fields?.slice(0,3).join(', ')}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <span className="text-xs text-gray-500 block mb-1">Funding Type</span>
                    <span className="font-medium text-green-600 text-sm">{fundingString}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <span className="text-xs text-gray-500 block mb-1">Deadline</span>
                    <span className="font-medium text-red-600 text-sm">{deadlineHint}</span>
                  </div>
                </div>
              </section>

              {/* Sticky Apply Button (mobile) - Always visible */}
              {scholarship.officialLink && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 print-hide">
                  <a
                    href={scholarship.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#0B3B2F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1A5D4A] transition-colors w-full"
                  >
                    <ExternalLink className="w-5 h-5" /> Apply Now
                  </a>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Desktop Apply Button - Always visible */}
              {scholarship.officialLink && (
                <div className="hidden lg:block bg-white rounded-xl border border-gray-200 p-5">
                  <a
                    href={scholarship.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#0B3B2F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1A5D4A] transition-colors w-full"
                  >
                    <ExternalLink className="w-5 h-5" /> Apply Now
                  </a>
                  <p className="text-gray-400 text-xs text-center mt-3">You will be redirected to the official website</p>
                </div>
              )}

              {/* Similar Scholarships */}
              {relatedScholarships.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-serif text-lg font-semibold mb-4">Similar Scholarships</h3>
                  <div className="space-y-4">
                    {relatedScholarships.map((related: any) => {
                      const relatedDeadlineHint = getDeadlineHint(new Date(related.deadline));
                      return (
                        <Link key={related._id} href={`/scholarships/${related.slug}`} className="block group">
                          <div className="border-b border-gray-100 pb-4 last:border-0">
                            <h4 className="font-medium group-hover:text-[#0B3B2F] transition-colors line-clamp-2 text-sm">{related.title}</h4>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{related.hostCountries?.[0]}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{relatedDeadlineHint}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <Link href="/scholarships" className="mt-4 inline-flex items-center gap-1 text-sm text-[#0B3B2F] font-medium hover:text-[#D4A373]">
                    View all scholarships <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Related Guides */}
              <RelatedGuides 
                country={scholarship.hostCountries?.[0]} 
                degreeLevel={scholarship.degreeLevel} 
                fundingType={scholarship.fundingType} 
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
