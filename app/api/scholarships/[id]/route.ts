import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';
import { slugify } from '@/lib/slugify';

function getSyntheticDeadline(month: number, period: string): Date {
  let day = 15;
  if (period === 'early') day = 5;
  if (period === 'late') day = 25;
  const year = new Date().getFullYear();
  return new Date(year, month, day);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const scholarship = await Scholarship.findById(id).lean();
    if (!scholarship) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(scholarship);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
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
    const existing = await Scholarship.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const syntheticDeadline = getSyntheticDeadline(body.deadlineMonth, body.deadlinePeriod);

    const updateData = {
      ...body,
      slug,
      deadline: syntheticDeadline,
    };

    const scholarship = await Scholarship.findByIdAndUpdate(id, updateData, { new: true }).lean();
    return NextResponse.json(scholarship);
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
    await Scholarship.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
