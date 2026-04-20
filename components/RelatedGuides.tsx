import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { BookOpen, ArrowRight } from 'lucide-react';

interface RelatedGuidesProps {
  country?: string;
  degreeLevel?: string[];
  fundingType?: string[];
}

async function getRelatedPosts(country?: string, degreeLevel?: string[], fundingType?: string[]) {
  await connectToDatabase();
  
  // Build query based on scholarship attributes
  const query: any = { published: true };
  const orConditions: any[] = [];
  
  if (country) {
    orConditions.push({ title: { $regex: country, $options: 'i' } });
    orConditions.push({ excerpt: { $regex: country, $options: 'i' } });
    orConditions.push({ tags: { $in: [country] } });
  }
  
  if (degreeLevel && degreeLevel.length > 0) {
    degreeLevel.forEach(level => {
      orConditions.push({ title: { $regex: level, $options: 'i' } });
      orConditions.push({ tags: { $in: [level] } });
    });
  }
  
  if (fundingType && fundingType.length > 0) {
    fundingType.forEach(type => {
      orConditions.push({ title: { $regex: type, $options: 'i' } });
      orConditions.push({ tags: { $in: [type] } });
    });
  }
  
  // Also match common scholarship-related categories
  orConditions.push({ category: { $in: ['Scholarship Lists', 'Application Tips', 'Writing Tips', 'Interview Guide'] } });
  
  if (orConditions.length > 0) {
    query.$or = orConditions;
  }
  
  const posts = await BlogPost.find(query)
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();
    
  return posts;
}

export default async function RelatedGuides({ country, degreeLevel, fundingType }: RelatedGuidesProps) {
  const posts = await getRelatedPosts(country, degreeLevel, fundingType);
  
  if (!posts || posts.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-[#0B3B2F]" />
        Related Guides & Tips
      </h3>
      <div className="space-y-4">
        {posts.map((post: any) => (
          <Link key={post._id} href={`/blog/${post.slug}`} className="block group">
            <div className="border-b border-gray-100 pb-4 last:border-0">
              <h4 className="font-medium text-sm text-[#1A1A1A] group-hover:text-[#0B3B2F] transition-colors line-clamp-2">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{post.category}</span>
                <span className="text-xs text-gray-400">{post.readTime || '5 min read'}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link href="/blog" className="mt-4 inline-flex items-center gap-1 text-sm text-[#0B3B2F] font-medium hover:text-[#D4A373] transition-colors">
        View all guides
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
