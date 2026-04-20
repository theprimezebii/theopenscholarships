import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { withRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limit: 5 requests per hour per IP
  const rateLimitResponse = await withRateLimit(request, {
    interval: 3600,
    maxRequests: 5,
    message: 'Too many subscription attempts. Please try again later.',
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    await connectToDatabase();
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }
    await Subscriber.findOneAndUpdate({ email }, { email }, { upsert: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();
  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ subscribers });
}
