import { NextResponse } from 'next/server';

const CRON_SECRET = process.env.CRON_SECRET || 'your-secret-token-change-me';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    await Promise.all([
      fetch(`${baseUrl}/api/countries`),
      fetch(`${baseUrl}/api/universities`),
      fetch(`${baseUrl}/api/filters`),
    ]);
    return NextResponse.json({ success: true, message: 'Caches refreshed' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to refresh caches' }, { status: 500 });
  }
}
