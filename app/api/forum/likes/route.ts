import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ForumTopic from '@/models/ForumTopic';
import ForumReply from '@/models/ForumReply';

// Simple in-memory store for user likes (replace with DB in production)
const userLikes = new Map<string, Set<string>>(); // sessionId -> Set of liked item IDs

function getSessionId(request: NextRequest): string {
  let sessionId = request.cookies.get('user_session')?.value;
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }
  return sessionId;
}

// GET: check which items the user has liked
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const topicId = searchParams.get('topicId');
  
  if (!topicId) {
    return NextResponse.json({ error: 'Topic ID required' }, { status: 400 });
  }
  
  const sessionId = getSessionId(request);
  const likedItems = userLikes.get(sessionId) || new Set();
  
  const topicLiked = likedItems.has(`topic:${topicId}`);
  
  const response = NextResponse.json({ topicLiked, likedReplies: [] });
  if (!request.cookies.get('user_session')) {
    response.cookies.set('user_session', sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }
  return response;
}

// POST: toggle like on topic or reply
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { topicId, replyId } = body;
    
    if (!topicId && !replyId) {
      return NextResponse.json({ error: 'topicId or replyId required' }, { status: 400 });
    }
    
    const sessionId = getSessionId(request);
    const itemKey = topicId ? `topic:${topicId}` : `reply:${replyId}`;
    
    if (!userLikes.has(sessionId)) {
      userLikes.set(sessionId, new Set());
    }
    const likedItems = userLikes.get(sessionId)!;
    
    let action: 'liked' | 'unliked';
    if (likedItems.has(itemKey)) {
      // Unlike
      likedItems.delete(itemKey);
      if (topicId) {
        await ForumTopic.findByIdAndUpdate(topicId, { $inc: { likes: -1 } });
      } else if (replyId) {
        await ForumReply.findByIdAndUpdate(replyId, { $inc: { likes: -1 } });
      }
      action = 'unliked';
    } else {
      // Like
      likedItems.add(itemKey);
      if (topicId) {
        await ForumTopic.findByIdAndUpdate(topicId, { $inc: { likes: 1 } });
      } else if (replyId) {
        await ForumReply.findByIdAndUpdate(replyId, { $inc: { likes: 1 } });
      }
      action = 'liked';
    }
    
    const response = NextResponse.json({ success: true, action });
    if (!request.cookies.get('user_session')) {
      response.cookies.set('user_session', sessionId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }
    return response;
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
