import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { slugify } from '@/lib/slugify';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const post = await BlogPost.findById(id).lean();
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCookie = request.cookies.get('admin_auth');
    if (authCookie?.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    
    let slug = slugify(body.title);
    const existing = await BlogPost.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    
    // Include faqs in update data
    const updateData = {
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      readTime: body.readTime,
      author: body.author,
      authorRole: body.authorRole,
      image: body.image,
      tags: body.tags,
      published: body.published,
      faqs: body.faqs || [], // NEW
    };
    
    const post = await BlogPost.findByIdAndUpdate(id, updateData, { new: true }).lean();
    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCookie = request.cookies.get('admin_auth');
    if (authCookie?.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();
    const { id } = await params;
    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
