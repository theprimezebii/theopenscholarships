/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'media.istockphoto.com' },
      { protocol: 'https', hostname: 'media.gettyimages.com' },
      { protocol: 'https', hostname: 'images.trvl-media.com' },
      { protocol: 'https', hostname: 'mastersplus.innoenergy.com' },
      { protocol: 'https', hostname: 'universitycity.gov.ae' },
      { protocol: 'https', hostname: 'www.sharjahupdate.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
    ],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  async redirects() {
    return [
      { source: '/blog/financial-guide', destination: '/blog/complete-financial-guide-study-abroad', permanent: true },
      { source: '/blog/country-comparison', destination: '/blog/country-comparison-study-abroad', permanent: true },
      { source: '/blog/scholarship-interview-guide', destination: '/guides/scholarship-interview-guide', permanent: true },
      { source: '/blog/ultimate-scholarship-guide', destination: '/guides/ultimate-scholarship-guide-2026', permanent: true },
    ];
  },
  typescript: {
    // !! TEMPORARY: ignore build errors to allow deployment
  },
};

module.exports = nextConfig;
