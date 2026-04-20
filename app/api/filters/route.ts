import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';
import fs from 'fs/promises';
import path from 'path';

const CACHE_PATH = path.join(process.cwd(), 'public', 'filters-cache.json');

export async function GET() {
  try {
    // 1. Try to read static cache file
    try {
      const cacheContent = await fs.readFile(CACHE_PATH, 'utf-8');
      const data = JSON.parse(cacheContent);
      return NextResponse.json(data);
    } catch (err) {
      // Cache file doesn't exist or is invalid – fall back to database
      console.log('Filters cache not found, generating from database...');
    }
    
    // 2. Fallback: compute from database (same logic as before)
    await connectToDatabase();
    
    const allScholarships = await Scholarship.find({}).lean();
    
    const countriesSet = new Set<string>();
    allScholarships.forEach((s: any) => {
      if (s.hostCountries && Array.isArray(s.hostCountries)) {
        s.hostCountries.forEach((c: string) => countriesSet.add(c));
      }
    });
    const countries = Array.from(countriesSet).sort();
    
    const fieldsSet = new Set<string>();
    allScholarships.forEach((s: any) => {
      if (s.fields && Array.isArray(s.fields)) {
        s.fields.forEach((f: string) => fieldsSet.add(f));
      }
    });
    const disciplines = Array.from(fieldsSet).sort();
    
    const degreesSet = new Set<string>();
    allScholarships.forEach((s: any) => {
      if (s.degreeLevel) {
        if (Array.isArray(s.degreeLevel)) {
          s.degreeLevel.forEach((d: string) => degreesSet.add(d));
        } else {
          degreesSet.add(s.degreeLevel);
        }
      }
    });
    const degrees = Array.from(degreesSet).sort();
    
    const fundingSet = new Set<string>();
    allScholarships.forEach((s: any) => {
      if (s.fundingType) {
        if (Array.isArray(s.fundingType)) {
          s.fundingType.forEach((f: string) => fundingSet.add(f));
        } else {
          fundingSet.add(s.fundingType);
        }
      } else {
        fundingSet.add('Fully Funded');
      }
    });
    const fundingTypes = Array.from(fundingSet).sort();
    
    const countryCounts: Record<string, number> = {};
    countries.forEach(country => {
      countryCounts[country] = allScholarships.filter((s: any) => 
        s.hostCountries && s.hostCountries.includes(country)
      ).length;
    });
    
    const disciplineCounts: Record<string, number> = {};
    disciplines.forEach(discipline => {
      disciplineCounts[discipline] = allScholarships.filter((s: any) => 
        s.fields && s.fields.includes(discipline)
      ).length;
    });
    
    const onlineCount = await Scholarship.countDocuments({ programMode: 'online' });
    const partTimeCount = await Scholarship.countDocuments({ programMode: 'part-time' });
    const oneYearCount = await Scholarship.countDocuments({ programDuration: '1-year' });
    const twoYearCount = await Scholarship.countDocuments({ programDuration: '2-years' });
    const executiveCount = await Scholarship.countDocuments({ programLevel: 'executive' });
    const researchCount = await Scholarship.countDocuments({ programLevel: 'research' });
    
    const data = {
      countries,
      countryCounts,
      disciplines,
      disciplineCounts,
      degrees,
      fundingTypes,
      programmeStats: {
        online: onlineCount,
        partTime: partTimeCount,
        oneYear: oneYearCount,
        twoYear: twoYearCount,
        executive: executiveCount,
        research: researchCount
      }
    };
    
    // Try to write cache for next time (fire-and-forget)
    fs.writeFile(CACHE_PATH, JSON.stringify(data, null, 2)).catch(() => {});
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Filters API error:', error);
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
  }
}
