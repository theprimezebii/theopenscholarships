import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'The Open Scholarships';
    const description = searchParams.get('description') || '';
    const type = searchParams.get('type') || 'scholarship';
    const funding = searchParams.get('funding') || '';
    const host = searchParams.get('host') || '';
    const deadline = searchParams.get('deadline') || '';
    const imageUrl = searchParams.get('image');

    const gradientColors: Record<string, [string, string]> = {
      scholarship: ['#0B3B2F', '#1A5D4A'],
      blog: ['#1A5D4A', '#D4A373'],
      guide: ['#0B3B2F', '#D4A373'],
      default: ['#0B3B2F', '#0B3B2F'],
    };

    const [fromColor, toColor] = gradientColors[type] || gradientColors.default;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
            fontFamily: 'Inter, sans-serif',
            padding: '50px',
            position: 'relative',
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: 'rgba(212,163,115,0.15)', borderRadius: '50%' }} />

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
            <div style={{ width: 50, height: 50, background: '#D4A373', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: '#0B3B2F' }}>O</span>
            </div>
            <span style={{ fontSize: 24, fontWeight: 600, color: 'white', letterSpacing: -0.3 }}>
              The Open Scholarships
            </span>
          </div>

          {/* Main Content Area with Image on Right */}
          <div style={{ display: 'flex', gap: 40, flex: 1 }}>
            {/* Text Content */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>
                {title}
              </div>
              {description && (
                <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4, marginBottom: 20 }}>
                  {description.length > 120 ? description.slice(0, 120) + '...' : description}
                </div>
              )}
              {(funding || host || deadline) && (
                <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
                  {funding && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, background: '#D4A373', borderRadius: '50%' }} />
                      <span style={{ fontSize: 18, color: '#D4A373', fontWeight: 500 }}>{funding}</span>
                    </div>
                  )}
                  {host && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, background: '#D4A373', borderRadius: '50%' }} />
                      <span style={{ fontSize: 18, color: '#D4A373', fontWeight: 500 }}>{host}</span>
                    </div>
                  )}
                  {deadline && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, background: '#D4A373', borderRadius: '50%' }} />
                      <span style={{ fontSize: 18, color: '#D4A373', fontWeight: 500 }}>Deadline: {deadline}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Image Section */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt=""
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 280,
                    objectFit: 'cover',
                    borderRadius: 16,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: 200,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed rgba(255,255,255,0.3)',
                  }}
                >
                  <span style={{ fontSize: 64, color: 'rgba(255,255,255,0.5)' }}>🎓</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ position: 'absolute', bottom: 30, left: 50, display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>theopenscholarships.com</span>
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
    return new Response(`Failed to generate image: ${error.message}`, { status: 500 });
  }
}