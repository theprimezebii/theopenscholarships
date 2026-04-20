import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import { withRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limit: 3 requests per hour per IP
  const rateLimitResponse = await withRateLimit(request, {
    interval: 3600,
    maxRequests: 3,
    message: 'You have reached the message limit. Please try again later.',
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    await ContactMessage.create({ name, email, subject, message });
    return NextResponse.json({ success: true, message: 'Message sent' }, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ messages: [] }, { status: 500 });
  }
}
