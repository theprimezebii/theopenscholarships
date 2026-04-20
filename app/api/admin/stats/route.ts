import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';
import BlogPost from '@/models/BlogPost';
import ForumTopic from '@/models/ForumTopic';
import ForumReply from '@/models/ForumReply';
import ContactMessage from '@/models/ContactMessage';
import Subscriber from '@/models/Subscriber';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  
  await connectToDatabase();
  
  const [
    totalScholarships,
    openScholarships,
    closingSoonScholarships,
    totalBlogPosts,
    totalTopics,
    totalReplies,
    totalMessages,
    totalSubscribers
  ] = await Promise.all([
    Scholarship.countDocuments(),
    Scholarship.countDocuments({ status: 'open' }),
    Scholarship.countDocuments({ status: 'closing-soon' }),
    BlogPost.countDocuments({ published: true }),
    ForumTopic.countDocuments(),
    ForumReply.countDocuments(),
    ContactMessage.countDocuments(),
    Subscriber.countDocuments()
  ]);
  
  const viewsResult = await Scholarship.aggregate([
    { $group: { _id: null, total: { $sum: '$views' } } }
  ]);
  const totalViews = viewsResult[0]?.total || 0;
  
  return NextResponse.json({
    scholarships: totalScholarships,
    open: openScholarships,
    closingSoon: closingSoonScholarships,
    totalViews,
    blogPosts: totalBlogPosts,
    forumTopics: totalTopics,
    forumReplies: totalReplies,
    messages: totalMessages,
    subscribers: totalSubscribers
  });
}
