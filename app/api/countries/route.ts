import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';
import { cacheGet, cacheSet } from '@/lib/redis';

const CACHE_KEY = 'countries-data';
const CACHE_TTL = 3600;

export async function GET() {
  try {
    const cached = await cacheGet(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached);
    }
    
    await connectToDatabase();
    const scholarships = await Scholarship.find({}).lean();
    
    const countMap = new Map<string, number>();
    scholarships.forEach((s: any) => {
      s.hostCountries?.forEach((c: string) => {
        countMap.set(c, (countMap.get(c) || 0) + 1);
      });
    });
    
    const countries = Array.from(countMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    const data = { countries };
    
    await cacheSet(CACHE_KEY, data, CACHE_TTL);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Countries API error:', error);
    return NextResponse.json({ countries: [] }, { status: 500 });
  }
}
