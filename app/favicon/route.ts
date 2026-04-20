import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
  await connectToDatabase();
  const settings = await SiteSettings.findOne().lean();
  const faviconUrl = settings?.favicon;
  
  if (!faviconUrl) {
    return new NextResponse(null, { status: 404 });
  }
  
  // Fetch the image from Cloudinary
  const imageResponse = await fetch(faviconUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  
  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': imageResponse.headers.get('content-type') || 'image/png',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
