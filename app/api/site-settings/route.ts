import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectToDatabase();
    const body = await request.json();
    
    const allowedFields = [
      'favicon',
      'siteName',
      'siteDescription',
      'contactEmail',
      'headerBgColor',
      'headerTextColor',
      'headerLogo',
      'headerNameColor1',
      'headerNameColor2',
      'footerBgColor',
      'footerTextColor',
      'footerLogo',
      'footerNameColor1',
      'footerNameColor2',
      'siteNameColor1',
      'siteNameColor2',
      'logo',
      'displayNameWithLogo',
      'favicon', 'whatsappChannelUrl',
      'facebookPageUrl',
      'twitterUrl',
      'linkedinUrl',
      'instagramUrl',
      'showWhatsapp',
      'showFacebook',
      'showTwitter',
      'showLinkedin',
      'showInstagram',
    ];
    
    const updateData: Record<string, any> = {};
    allowedFields.forEach(field => {
      if (body[field] !== undefined) updateData[field] = body[field];
    });
    
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(updateData);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, updateData, { new: true, runValidators: true });
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
