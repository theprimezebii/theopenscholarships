import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { connectToDatabase } from '@/lib/mongodb';
import ForumTopic from '@/models/ForumTopic';
import DiscussionDetail from './DiscussionDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return {
    title: `Forum Discussion | The Open Scholarships`,
    description: 'Join the discussion and share your thoughts on scholarship applications.',
  };
}

export default async function DiscussionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  await connectToDatabase();
  
  let topic = await ForumTopic.findOne({ slug: slug }).lean();
  
  if (!topic && slug.match(/^[0-9a-fA-F]{24}$/)) {
    topic = await ForumTopic.findById(slug).lean();
  }
  
  if (!topic) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-serif text-[#1A1A1A] mb-4">Discussion Not Found</h1>
            <p className="text-gray-500 mb-6">The discussion you're looking for doesn't exist.</p>
            <a href="/forum" className="bg-[#0B3B2F] text-white px-6 py-2 rounded-lg">Back to Forum</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <DiscussionDetail initialTopic={JSON.parse(JSON.stringify(topic))} slug={slug} />
      </main>
      <Footer />
    </>
  );
}
