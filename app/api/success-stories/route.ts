import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SuccessStory from '@/models/SuccessStory';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const publishedOnly = searchParams.get('published') !== 'false';
    
    const query = publishedOnly ? { published: true } : {};
    const stories = await SuccessStory.find(query).sort({ order: 1, createdAt: -1 }).limit(limit);
    
    return NextResponse.json({ stories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('admin_auth');
    if (authCookie?.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectToDatabase();
    const body = await request.json();
    const story = await SuccessStory.create(body);
    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 });
  }
}
