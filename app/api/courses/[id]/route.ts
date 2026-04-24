import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';
import { slugify } from '@/lib/slugify';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const course = await Course.findById(id).lean();
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(course);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDatabase();
  const { id } = await params;
  const body = await request.json();
  let slug = slugify(body.title);
  const existing = await Course.findOne({ slug, _id: { $ne: id } });
  if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;
  const course = await Course.findByIdAndUpdate(id, { ...body, slug }, { new: true }).lean();
  return NextResponse.json(course);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDatabase();
  const { id } = await params;
  await Course.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}