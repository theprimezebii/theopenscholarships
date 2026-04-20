import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ForumTopic from '@/models/ForumTopic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    
    const { slug } = await params;
    const topic = await ForumTopic.findOne({ slug: slug });
    
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }
    
    // Increment view count
    await ForumTopic.updateOne({ slug: slug }, { $inc: { views: 1 } });
    
    return NextResponse.json(topic);
  } catch (error) {
    console.error('Failed to fetch topic:', error);
    return NextResponse.json({ error: 'Failed to fetch topic' }, { status: 500 });
  }
}
