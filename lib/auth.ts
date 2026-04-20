import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function requireAdmin() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
