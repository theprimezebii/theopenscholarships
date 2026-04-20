import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const countries = searchParams.get('countries')?.split(',').filter(Boolean) || [];
    const disciplines = searchParams.get('disciplines')?.split(',').filter(Boolean) || [];
    const degree = searchParams.get('degree') || '';
    const funding = searchParams.get('funding') || '';
    const status = searchParams.get('status') || '';
    const region = searchParams.get('region') || '';
    const programMode = searchParams.get('programMode') || '';
    const programDuration = searchParams.get('programDuration') || '';
    const programLevel = searchParams.get('programLevel') || '';
    
    const limit = parseInt(searchParams.get('limit') || '9');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build query using $and to combine conditions properly
    const conditions: any[] = [];
    
    // Search condition
    if (search) {
      conditions.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { provider: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }
    
    // Countries filter
    if (countries.length > 0) {
      conditions.push({ hostCountries: { $in: countries } });
    }
    
    // Disciplines filter
    if (disciplines.length > 0) {
      conditions.push({
        $or: [
          { fields: { $in: disciplines } },
          { fields: 'All Fields' }
        ]
      });
    }
    
    // Degree filter
    if (degree) {
      const degrees = degree.split(',').filter(Boolean);
      if (degrees.length > 0) {
        conditions.push({
          $or: [
            { degreeLevel: { $in: degrees } },
            { degreeLevel: 'All Levels' }
          ]
        });
      }
    }
    
    // Funding filter
    if (funding) {
      const fundingTypes = funding.split(',').filter(Boolean);
      if (fundingTypes.length > 0) {
        conditions.push({ fundingType: { $in: fundingTypes } });
      }
    }
    
    // Status filter
    if (status) {
      const statuses = status.split(',').filter(Boolean);
      if (statuses.length > 0) {
        conditions.push({ status: { $in: statuses } });
      }
    }
    
    // Region filter
    if (region) {
      conditions.push({ region: region });
    }
    
    // Program mode filter
    if (programMode) {
      conditions.push({ programMode: programMode });
    }
    
    // Program duration filter
    if (programDuration) {
      conditions.push({ programDuration: programDuration });
    }
    
    // Program level filter
    if (programLevel) {
      conditions.push({ programLevel: programLevel });
    }
    
    const query = conditions.length > 0 ? { $and: conditions } : {};
    
    const [scholarships, total] = await Promise.all([
      Scholarship.find(query)
        .sort({ deadline: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Scholarship.countDocuments(query)
    ]);
    
    return NextResponse.json({
      scholarships,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      success: true
    });
  } catch (error) {
    console.error('Filter API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scholarships', scholarships: [], total: 0 },
      { status: 500 }
    );
  }
}