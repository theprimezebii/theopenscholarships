import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShareButton from '@/components/ShareButton';
import PrintButton from '@/components/PrintButton';
import FaqAccordion from '@/components/FaqAccordion';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';
import { ArrowLeft, BookOpen, Clock, Award, Globe, ExternalLink, Star, Users, ListChecks, CheckCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Helper: Convert Mongoose docs to plain objects (removes ObjectId, etc.)
function toPlainObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await connectToDatabase();
  const courseRaw = await Course.findOne({ slug }).lean();
  if (!courseRaw) return { title: 'Course Not Found' };
  const course = toPlainObject(courseRaw);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const ogUrl = new URL(`${baseUrl}/api/og`);
  ogUrl.searchParams.set('title', course.title);
  ogUrl.searchParams.set('description', course.description?.substring(0, 150) || `Enroll for free in ${course.title}`);
  ogUrl.searchParams.set('type', 'course');
  ogUrl.searchParams.set('host', course.provider);
  ogUrl.searchParams.set('funding', course.duration);
  ogUrl.searchParams.set('level', course.level);
  if (course.platform) ogUrl.searchParams.set('duration', course.platform);

  return {
    title: `${course.title} | Free Online Course | The Open Scholarships`,
    description: course.description?.substring(0, 160) || '',
    openGraph: {
      title: course.title,
      description: course.description?.substring(0, 160),
      url: `${baseUrl}/courses/${course.slug}`,
      siteName: 'The Open Scholarships',
      images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description?.substring(0, 160),
      images: [ogUrl.toString()],
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  await connectToDatabase();
  const courseRaw = await Course.findOne({ slug }).lean();
  if (!courseRaw) notFound();

  const course = toPlainObject(courseRaw);

  // Fetch related courses: same category OR same provider, excluding current course
  const relatedCoursesRaw = await Course.find({
    _id: { $ne: course._id },
    $or: [
      { category: course.category },
      { provider: course.provider }
    ]
  })
  .limit(3)
  .lean();
  const relatedCourses = relatedCoursesRaw.map(c => toPlainObject(c));

  // Sanitize faqs for client component (remove _id)
  const plainFaqs = course.faqs?.map((faq: any) => ({
    question: faq.question,
    answer: faq.answer,
  })) || [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div
          className="relative text-white py-16 md:py-20 bg-gradient-to-r from-[#0B3B2F] to-[#1A5D4A]"
          style={course.image ? {
            backgroundImage: `linear-gradient(135deg, rgba(11, 59, 47, 0.85), rgba(26, 93, 74, 0.85)), url(${course.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/courses" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Courses
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="bg-[#D4A373] text-[#0B3B2F] text-xs px-3 py-1 rounded-full font-medium">{course.category}</span>
              <span className="text-white/80 text-sm flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.level}</span>
              {course.rating && (
                <span className="text-white/80 text-sm flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {course.rating}</span>
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{course.title}</h1>
            <p className="text-white/80 text-lg mb-4">Offered by {course.provider} on {course.platform}</p>
            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
              <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {course.language}</span>
              <span className="flex items-center gap-1"><Award className="w-4 h-4" /> {course.certificateOffered ? 'Certificate available' : 'No certificate'}</span>
              {course.enrolledCount && <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.enrolledCount}</span>}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b print-hide">
                <ShareButton title={course.title} description={course.description?.substring(0, 160)} url={`/courses/${course.slug}`} />
                <PrintButton />
              </div>

              {/* About This Course */}
              <section>
                <h2 className="text-xl font-serif font-semibold mb-3 pb-2 border-b">About This Course</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{course.description}</p>
              </section>

              {/* What You'll Learn (Syllabus) */}
              {course.syllabus?.length > 0 && (
                <section>
                  <h2 className="text-xl font-serif font-semibold mb-3 pb-2 border-b flex items-center gap-2"><ListChecks className="w-5 h-5" /> What You'll Learn</h2>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {course.syllabus.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Requirements */}
              {course.requirements?.length > 0 && (
                <section>
                  <h2 className="text-xl font-serif font-semibold mb-3 pb-2 border-b">Requirements</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {course.requirements.map((req: string, i: number) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Instructor */}
              {course.instructor && (
                <section>
                  <h2 className="text-xl font-serif font-semibold mb-3 pb-2 border-b">Instructor</h2>
                  <p className="text-gray-700">{course.instructor}</p>
                </section>
              )}

              {/* FAQs */}
              {plainFaqs.length > 0 && (
                <section>
                  <FaqAccordion items={plainFaqs} />
                </section>
              )}

              {/* Related Courses */}
              {relatedCourses.length > 0 && (
                <section>
                  <h2 className="text-xl font-serif font-semibold mb-4 pb-2 border-b">Related Courses</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedCourses.map((related: any) => (
                      <Link key={related._id} href={`/courses/${related.slug}`} className="group">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1">
                          <div className="aspect-video bg-gray-100 relative overflow-hidden">
                            {related.image && (
                              <img
                                src={related.image}
                                alt={related.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 group-hover:text-[#0B3B2F] transition-colors line-clamp-2 text-sm">
                              {related.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">{related.provider}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span>{related.duration}</span>
                              <span>{related.level}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl border p-6 space-y-4 sticky top-24">
                <h3 className="font-semibold text-lg">Course Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Platform</span><span className="font-medium">{course.platform}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{course.duration}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Language</span><span className="font-medium">{course.language}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Level</span><span className="font-medium">{course.level}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Certificate</span><span className="font-medium">{course.certificateOffered ? 'Yes' : 'No'}</span></div>
                  {course.rating && <div className="flex justify-between"><span className="text-gray-500">Rating</span><span className="font-medium flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{course.rating}</span></div>}
                  {course.enrolledCount && <div className="flex justify-between"><span className="text-gray-500">Enrolled</span><span className="font-medium">{course.enrolledCount}</span></div>}
                </div>
                <a
                  href={course.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center bg-[#0B3B2F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1A5D4A] transition-colors"
                >
                  <ExternalLink className="w-4 h-4 inline mr-2" />Enroll Now (Free)
                </a>
                {course.platformDetails && (
                  <p className="text-xs text-gray-400 mt-3">{course.platformDetails}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}