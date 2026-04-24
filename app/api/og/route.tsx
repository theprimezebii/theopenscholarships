import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'The Open Scholarships';
    const description = searchParams.get('description') || '';
    const type = searchParams.get('type') || 'default'; // 'course', 'scholarship', 'guide', 'blog', 'university'
    const host = searchParams.get('host') || '';
    const funding = searchParams.get('funding') || '';
    const deadline = searchParams.get('deadline') || '';
    const level = searchParams.get('level') || '';
    const duration = searchParams.get('duration') || '';

    // Colour schemes based on type
    const gradientMap: Record<string, [string, string]> = {
      scholarship: ['#0B3B2F', '#1A5D4A'],
      course: ['#1A5D4A', '#D4A373'],
      guide: ['#0B3B2F', '#D4A373'],
      blog: ['#0B3B2F', '#1A5D4A'],
      university: ['#0B3B2F', '#2C7A5E'],
        country: ['#0B3B2F', '#D4A373'],
      default: ['#0B3B2F', '#1A5D4A'],
    };
    const [fromColor, toColor] = gradientMap[type] || gradientMap.default;

    // Limit description length
    const shortDesc = description.length > 150 ? description.slice(0, 150) + '…' : description;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
            fontFamily: 'Inter, sans-serif',
            padding: '50px',
            position: 'relative',
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: 'rgba(212,163,115,0.15)', borderRadius: '50%' }} />

          {/* Logo area */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
            <div style={{ width: 50, height: 50, background: '#D4A373', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: '#0B3B2F' }}>O</span>
            </div>
            <span style={{ fontSize: 28, fontWeight: 600, color: 'white', letterSpacing: -0.3 }}>
              The Open Scholarships
            </span>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Type badge */}
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(212,163,115,0.2)',
                color: '#D4A373',
                fontSize: 18,
                fontWeight: 500,
                padding: '6px 16px',
                borderRadius: 30,
                marginBottom: 20,
                alignSelf: 'flex-start',
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </div>

            {/* Title */}
            <div style={{ fontSize: 52, fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 24 }}>
              {title}
            </div>

            {/* Description */}
            {shortDesc && (
              <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4, marginBottom: 32, maxWidth: '80%' }}>
                {shortDesc}
              </div>
            )}

            {/* Key details row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              {host && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, background: '#D4A373', borderRadius: '50%' }} />
                  <span style={{ fontSize: 20, color: '#D4A373', fontWeight: 500 }}>{host}</span>
                </div>
              )}
              {funding && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, background: '#D4A373', borderRadius: '50%' }} />
                  <span style={{ fontSize: 20, color: '#D4A373', fontWeight: 500 }}>{funding}</span>
                </div>
              )}
              {deadline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, background: '#D4A373', borderRadius: '50%' }} />
                  <span style={{ fontSize: 20, color: '#D4A373', fontWeight: 500 }}>Deadline: {deadline}</span>
                </div>
              )}
              {level && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, background: '#D4A373', borderRadius: '50%' }} />
                  <span style={{ fontSize: 20, color: '#D4A373', fontWeight: 500 }}>{level}</span>
                </div>
              )}
              {duration && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, background: '#D4A373', borderRadius: '50%' }} />
                  <span style={{ fontSize: 20, color: '#D4A373', fontWeight: 500 }}>{duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ position: 'absolute', bottom: 30, left: 50, right: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>
            <span>theopenscholarships.com</span>
            <span>🌟 Free Online Courses & Scholarships</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: any) {
    console.error('OG generation error:', error);
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0B3B2F',
            color: 'white',
            fontSize: 48,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          The Open Scholarships
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}