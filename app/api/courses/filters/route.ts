import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET() {
  try {
    await connectToDatabase();

    // Use MongoDB's distinct() – much faster and lighter
    const [categories, platforms, languages] = await Promise.all([
      Course.distinct('category'),
      Course.distinct('platform'),
      Course.distinct('language'),
    ]);

    return NextResponse.json({
      categories: categories.sort(),
      platforms: platforms.sort(),
      languages: languages.sort(),
    });
  } catch (error) {
    console.error('Course filters API error:', error);
    return NextResponse.json(
      { categories: [], platforms: [], languages: [] },
      { status: 500 }
    );
  }
}