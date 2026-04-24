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
import { Calendar, Clock, User, Tag, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Helper to convert any Mongoose document to plain object
function toPlainObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await connectToDatabase();
  const postRaw = await BlogPost.findOne({ slug, published: true }).lean();
  if (!postRaw) return { title: 'Post Not Found' };
  const post = toPlainObject(postRaw);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const ogUrl = new URL(`${baseUrl}/api/og`);
  ogUrl.searchParams.set('title', post.title);
  ogUrl.searchParams.set('description', post.excerpt || post.content?.substring(0, 150) || '');
  ogUrl.searchParams.set('type', 'blog');
  ogUrl.searchParams.set('host', post.author);
  if (post.readTime) ogUrl.searchParams.set('duration', post.readTime);

  return {
    title: `${post.title} | The Open Scholarships Blog`,
    description: post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${post.slug}`,
      siteName: 'The Open Scholarships',
      images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogUrl.toString()],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  await connectToDatabase();

  const postRaw = await BlogPost.findOne({ slug }).lean();
  if (!postRaw) notFound();

  // Convert the entire post to plain object (removes all ObjectId instances)
  const post = toPlainObject(postRaw);

  await BlogPost.updateOne({ slug }, { $inc: { views: 1 } });

  const relatedPostsRaw = await BlogPost.find({
    _id: { $ne: post._id },
    published: true,
    type: { $ne: 'guide' },
    $or: [
      { category: post.category },
      { tags: { $in: post.tags || [] } }
    ]
  }).limit(3).lean();
  const relatedPosts = relatedPostsRaw.map(p => toPlainObject(p));

  // Sanitize faqs (though toPlainObject already did, we keep for clarity)
  const plainFaqs = post.faqs?.map((faq: any) => ({
    question: faq.question,
    answer: faq.answer,
  })) || [];

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
      <ReadingProgress />
      <Header />
      <main className="min-h-screen bg-white">
        <div className="relative text-white overflow-hidden" style={heroBackgroundStyle}>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-3">
              <ShareButton title={post.title} description={post.excerpt} url={`/blog/${post.slug}`} />
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

          {plainFaqs.length > 0 && (
            <div className="mt-8">
              <FaqAccordion items={plainFaqs} />
            </div>
          )}

          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="font-serif text-2xl font-semibold mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((related: any) => (
                  <Link key={related._id} href={`/blog/${related.slug}`} className="group">
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