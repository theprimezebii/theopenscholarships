import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  
  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }
  
  await connectToDatabase();
  
  const scholarships = await Scholarship.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { provider: { $regex: query, $options: 'i' } }
    ]
  }).limit(5).select('title provider').lean();
  
  const suggestions = scholarships.map((s: any) => ({
    title: s.title,
    provider: s.provider
  }));
  
  return NextResponse.json({ suggestions });
}
