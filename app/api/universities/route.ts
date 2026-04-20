import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';
import { cacheGet, cacheSet } from '@/lib/redis';

const CACHE_KEY = 'universities-data';
const CACHE_TTL = 3600;

export async function GET() {
  try {
    const cached = await cacheGet(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached);
    }
    
    await connectToDatabase();
    const scholarships = await Scholarship.find({}).lean();
    
    const universityMap = new Map();
    scholarships.forEach((s: any) => {
      const provider = s.provider;
      if (provider && provider.length > 2) {
        if (!universityMap.has(provider)) {
          universityMap.set(provider, {
            count: 0,
            countries: new Set(),
            image: s.image || null
          });
        }
        const entry = universityMap.get(provider);
        entry.count++;
        s.hostCountries?.forEach((c: string) => entry.countries.add(c));
        if (!entry.image && s.image) entry.image = s.image;
      }
    });
    
    const universities = Array.from(universityMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        countries: Array.from(data.countries),
        image: data.image,
      }))
      .sort((a, b) => b.count - a.count);
    
    const data = { universities };
    
    await cacheSet(CACHE_KEY, data, CACHE_TTL);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Universities API error:', error);
    return NextResponse.json({ universities: [] }, { status: 500 });
  }
}
