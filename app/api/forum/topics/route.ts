import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ForumTopic from '@/models/ForumTopic';
import { withRateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    await connectToDatabase();
    const topics = await ForumTopic.find({}).sort({ pinned: -1, createdAt: -1 }).limit(50);
    const totalTopics = await ForumTopic.countDocuments();
    return NextResponse.json({
      topics,
      stats: {
        discussions: totalTopics,
        members: 0,
        likesGiven: 0,
        onlineNow: 0
      }
    });
  } catch (error) {
    return NextResponse.json({ topics: [], stats: { discussions: 0, members: 0, likesGiven: 0, onlineNow: 0 } });
  }
}

export async function POST(request: NextRequest) {
  // Rate limit: 10 topics per day per IP
  const rateLimitResponse = await withRateLimit(request, {
    interval: 86400,
    maxRequests: 10,
    message: 'You have reached the daily topic limit. Please try again tomorrow.',
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    await connectToDatabase();
    const body = await request.json();
    
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const topic = await ForumTopic.create({
      title: body.title,
      slug: slug,
      category: body.category,
      content: body.content,
      author: body.author || 'Anonymous',
      tags: body.tags || [],
      lastActivity: new Date()
    });
    
    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error('Failed to create forum topic:', error);
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 });
  }
}
