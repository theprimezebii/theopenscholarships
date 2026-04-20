import ReadingProgress from '@/components/ReadingProgress';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import BlogContent from '@/components/BlogContent';
import FaqAccordion from '@/components/FaqAccordion';
import ShareButton from '@/components/ShareButton';
import PrintButton from '@/components/PrintButton';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { Calendar, Clock, User, Tag, ArrowLeft, BookOpen } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await connectToDatabase();
  const post = await BlogPost.findOne({ slug, type: 'guide', published: true }).lean();
  if (!post) return { title: 'Guide Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags?.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  await connectToDatabase();
  
  const post = await BlogPost.findOne({ slug, type: 'guide', published: true }).lean();
  
  if (!post) {
    notFound();
  }
  
  await BlogPost.updateOne({ slug }, { $inc: { views: 1 } });
  
  const relatedGuides = await BlogPost.find({
    _id: { $ne: post._id },
    type: 'guide',
    published: true,
    $or: [
      { category: post.category },
      { tags: { $in: post.tags || [] } }
    ]
  }).limit(3).lean();

  // Hero background style
  const heroBackgroundStyle = post.image
    ? {
        backgroundImage: `linear-gradient(135deg, rgba(11, 59, 47, 0.85), rgba(26, 93, 74, 0.85)), url(${post.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: 'linear-gradient(135deg, #0B3B2F, #1A5D4A)',
      };

  return (
    <>
      <ReadingProgress /><Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section with Image Background */}
        <div className="relative text-white overflow-hidden" style={heroBackgroundStyle}>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <Link href="/guides" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Guides
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#D4A373] text-[#0B3B2F] text-xs px-3 py-1 rounded-full font-medium">
                {post.category}
              </span>
              <span className="text-white/80 text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime || '5 min read'}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>
            <p className="text-white/80 text-lg max-w-3xl">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
                {post.authorRole && <span className="text-white/50">· {post.authorRole}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-3">
              <ShareButton title={post.title} description={post.excerpt} url={`/guides/${post.slug}`} />
              <PrintButton />
            </div>
          </div>
          
          <article className="prose prose-lg max-w-none">
            <BlogContent content={post.content} />
          </article>
          
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Tag className="w-4 h-4" />
                <span>Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-8">
              <FaqAccordion items={post.faqs} />
            </div>
          )}
          
          {relatedGuides.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="font-serif text-2xl font-semibold mb-6">Related Guides</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedGuides.map((related: any) => (
                  <Link key={related._id} href={`/guides/${related.slug}`} className="group">
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      {related.image && (
                        <img src={related.image} alt={related.title} className="w-full h-40 object-cover" />
                      )}
                      <div className="p-4">
                        <span className="text-xs text-[#0B3B2F] font-medium">{related.category}</span>
                        <h3 className="font-semibold mt-1 group-hover:text-[#0B3B2F] transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
