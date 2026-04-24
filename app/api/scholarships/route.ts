import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';
import { slugify } from '@/lib/slugify';

function getSyntheticDeadline(month: number, period: string): Date {
  let day = 15;
  if (period === 'early') day = 5;
  if (period === 'late') day = 25;
  return new Date(new Date().getFullYear(), month, day);
}

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '25');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status');
  const country = searchParams.get('country') || '';          // ✅ read country
  const sortField = searchParams.get('sortField') || 'deadline';
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;
  const skip = (page - 1) * limit;

  let query: any = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { provider: { $regex: search, $options: 'i' } },
      { hostCountries: { $regex: search, $options: 'i' } }
    ];
  }
  if (status) query.status = status;
  if (country) query.hostCountries = { $in: [country] };                // ✅ filter by country

  let sort: any = {};
  if (sortField === 'country') sort['hostCountries.0'] = sortOrder;
  else if (sortField === 'degree') sort['degreeLevel'] = sortOrder;
  else sort[sortField] = sortOrder;

  const [scholarships, total] = await Promise.all([
    Scholarship.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Scholarship.countDocuments(query)
  ]);

  return NextResponse.json({ scholarships, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('admin_auth');
    if (authCookie?.value !== 'true') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const body = await request.json();
    let slug = slugify(body.title);
    if (await Scholarship.findOne({ slug })) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const syntheticDeadline = getSyntheticDeadline(body.deadlineMonth, body.deadlinePeriod);
    const scholarship = await Scholarship.create({ ...body, slug, deadline: syntheticDeadline });
    return NextResponse.json(scholarship, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}