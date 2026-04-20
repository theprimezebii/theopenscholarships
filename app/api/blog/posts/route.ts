import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { slugify } from '@/lib/slugify';

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '25');
  const search = searchParams.get('search') || '';
  const sortField = searchParams.get('sortField') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
  const skip = (page - 1) * limit;

  let query: any = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } }
    ];
  }

  let sort: any = {};
  if (sortField === 'date') sort['createdAt'] = sortOrder;
  else if (sortField === 'type') sort['type'] = sortOrder;
  else sort[sortField] = sortOrder;

  const [posts, total] = await Promise.all([
    BlogPost.find(query).sort(sort).skip(skip).limit(limit).lean(),
    BlogPost.countDocuments(query)
  ]);

  return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('admin_auth');
    if (authCookie?.value !== 'true') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const body = await request.json();
    let slug = slugify(body.title);
    if (await BlogPost.findOne({ slug })) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const post = await BlogPost.create({ ...body, slug, faqs: body.faqs || [] });
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
