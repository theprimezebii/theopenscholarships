import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

export async function GET() {
  try {
    await connectToDatabase();
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ subscribers: [] }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('admin_auth');
    if (authCookie?.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID required' }, { status: 400 });
    }
    
    await Subscriber.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
