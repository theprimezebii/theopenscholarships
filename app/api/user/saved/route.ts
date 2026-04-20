import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SavedScholarship from '@/models/SavedScholarship';

function getSessionId(request: NextRequest): string {
  let sessionId = request.cookies.get('user_session')?.value;
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }
  return sessionId;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const sessionId = getSessionId(request);
    const saved = await SavedScholarship.find({ sessionId }).distinct('scholarshipId');
    
    const response = NextResponse.json({ success: true, saved });
    if (!request.cookies.get('user_session')) {
      response.cookies.set('user_session', sessionId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }
    return response;
  } catch (error) {
    console.error('Error fetching saved:', error);
    return NextResponse.json({ success: false, saved: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { scholarshipId, action } = body;
    
    if (!scholarshipId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const sessionId = getSessionId(request);
    
    if (action === 'save') {
      try {
        await SavedScholarship.create({ sessionId, scholarshipId });
      } catch (err: any) {
        // Ignore duplicate key errors
        if (err.code !== 11000) throw err;
      }
    } else if (action === 'unsave') {
      await SavedScholarship.deleteOne({ sessionId, scholarshipId });
    }
    
    const saved = await SavedScholarship.find({ sessionId }).distinct('scholarshipId');
    const response = NextResponse.json({ success: true, saved });
    if (!request.cookies.get('user_session')) {
      response.cookies.set('user_session', sessionId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }
    return response;
  } catch (error) {
    console.error('Error saving scholarship:', error);
    return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
  }
}