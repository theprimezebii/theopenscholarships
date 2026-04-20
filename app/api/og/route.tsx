import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'The Open Scholarships';
    const description = searchParams.get('description') || 'Discover fully funded scholarships worldwide';
    const type = searchParams.get('type') || 'default';

    // Simplified gradient colors
    const gradientColors: Record<string, [string, string]> = {
      scholarship: ['#0B3B2F', '#1A5D4A'],
      blog: ['#1A5D4A', '#D4A373'],
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
            padding: '60px',
            position: 'relative',
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: 'rgba(212,163,115,0.15)', borderRadius: '50%' }} />

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 50 }}>
            <div style={{ width: 56, height: 56, background: '#D4A373', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: '#0B3B2F' }}>O</span>
            </div>
            <span style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: -0.3 }}>
              The Open Scholarships
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: 900,
              marginBottom: 24,
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              maxWidth: 700,
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>

          {/* Footer */}
          <div style={{ position: 'absolute', bottom: 35, left: 60, display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>theopenscholarships.com</span>
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
    return new Response(`Failed to generate image: ${error.message}`, {
      status: 500,
    });
  }
}
