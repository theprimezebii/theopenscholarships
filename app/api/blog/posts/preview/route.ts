import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { slugify } from '@/lib/slugify';

export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('admin_auth');
    if (authCookie?.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    // Generate a preview slug (won't conflict with published posts)
    let slug = slugify(body.title);
    const existing = await BlogPost.findOne({ slug });
    if (existing) {
      slug = `${slug}-preview-${Date.now().toString().slice(-4)}`;
    }

    // Create a preview post (not published, marked as preview)
    const previewPost = await BlogPost.create({
      ...body,
      slug,
      published: false,
      preview: true,
    });

    // Return the slug for preview URL
    return NextResponse.json({
      success: true,
      slug: previewPost.slug,
    });
  } catch (error: any) {
    console.error('Preview error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
