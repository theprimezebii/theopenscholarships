import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET() {
  await connectToDatabase();
  const categories = await Course.distinct('category');
  const platforms = await Course.distinct('platform');
  return NextResponse.json({
    categories: categories.sort(),
    platforms: platforms.sort()
  });
}
