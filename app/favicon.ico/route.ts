import { NextResponse } from 'next/server';

export function GET() {
  // Return 404 so browser falls back to <link> tags
  return new NextResponse(null, { status: 404 });
}
