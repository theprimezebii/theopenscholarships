import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ForumReply from '@/models/ForumReply';
import ForumTopic from '@/models/ForumTopic';
import { withRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const topicId = request.nextUrl.searchParams.get('topicId');
    
    if (!topicId) {
      return NextResponse.json({ error: 'Topic ID required' }, { status: 400 });
    }
    
    const replies = await ForumReply.find({ topicId }).sort({ createdAt: 1 });
    return NextResponse.json(replies);
  } catch (error) {
    console.error('Failed to fetch replies:', error);
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Rate limit: 30 replies per hour per IP
  const rateLimitResponse = await withRateLimit(request, {
    interval: 3600,
    maxRequests: 30,
    message: 'You are posting too frequently. Please wait a moment.',
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    await connectToDatabase();
    const body = await request.json();
    
    const reply = await ForumReply.create({
      topicId: body.topicId,
      content: body.content,
      author: body.author || 'Anonymous',
    });
    
    await ForumTopic.findByIdAndUpdate(body.topicId, {
      $inc: { replies: 1 },
      $set: { lastActivity: new Date() }
    });
    
    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error('Failed to create reply:', error);
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 });
  }
}
