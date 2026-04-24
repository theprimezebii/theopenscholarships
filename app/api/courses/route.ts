// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb'; // 👈 correct import name
import Course from '@/models/Course';
import { slugify } from '@/lib/slugify';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const searchParams = request.nextUrl.searchParams;

  // Pagination
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '9');
  const skip = (page - 1) * limit;

  // Multi‑select filters (sent as comma‑separated strings)
  const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
  const platforms  = searchParams.get('platforms')?.split(',').filter(Boolean) || [];
  const languages  = searchParams.get('languages')?.split(',').filter(Boolean) || [];

  // Single‑select filters
  const level       = searchParams.get('level') || '';
  const certificate = searchParams.get('certificate'); // 'true' or 'false'
  const rating      = searchParams.get('rating');      // e.g., '4'
  const search      = searchParams.get('search') || '';

  // Sorting
  const sortField = searchParams.get('sortField') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

  // Build MongoDB query
  const query: any = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { provider: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (categories.length) query.category = { $in: categories };
  if (platforms.length)  query.platform = { $in: platforms };
  if (languages.length)  query.language = { $in: languages };
  if (level)             query.level = level;
  if (certificate === 'true')  query.certificateOffered = true;
  if (certificate === 'false') query.certificateOffered = false;
  if (rating)            query.rating = { $gte: parseFloat(rating) };

  // Build sort object
  const sort: any = {};
  if (sortField === 'title') sort.title = sortOrder;
  else if (sortField === 'rating') sort.rating = sortOrder;
  else sort.createdAt = sortOrder;

  const [courses, total] = await Promise.all([
    Course.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Course.countDocuments(query)
  ]);

  return NextResponse.json({
    courses,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectToDatabase();
  const body = await request.json();
  let slug = slugify(body.title);
  if (await Course.findOne({ slug })) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const course = await Course.create({ ...body, slug });
  return NextResponse.json(course, { status: 201 });
}