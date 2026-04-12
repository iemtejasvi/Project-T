/** @type {import('next').NextConfig} */
const nextConfig = {
  generateEtags: true,
  async headers() {
    return [
      // Security headers on all routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },

      // Immutable static assets (_next/static) — cache everywhere forever
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Vercel-CDN-Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },

      // Mutation API routes — no caching anywhere
      {
        source: '/api/submit-memory',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
          { key: 'Vercel-CDN-Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/api/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
          { key: 'Vercel-CDN-Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/api/check-user-status',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/api/announcements/track',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/api/cron/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/api/unpin-expired',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
        ],
      },

      // Read-only API routes — Vercel CDN caches (ISR), Cloudflare bypasses
      {
        source: '/api/memories/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
          { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=10, stale-while-revalidate=30' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      {
        source: '/api/announcements',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
          { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=30, stale-while-revalidate=60' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      {
        source: '/api/names',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
          { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=120' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      {
        source: '/api/popular-names',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
          { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=7200' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },

      // Static images/icons — browser 1 day, CDN 7 days
      {
        source: '/favicon.ico',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=604800' },
        ],
      },
      {
        source: '/favicon-:size.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=604800' },
        ],
      },
      {
        source: '/apple-touch-icon.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=604800' },
        ],
      },
      {
        source: '/android-chrome-:size.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=604800' },
        ],
      },
      {
        source: '/mstile-:size.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=604800' },
        ],
      },
      {
        source: '/:all*(svg|jpg|png|ico|webp)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=604800' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/&',
        destination: '/',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.ifonlyisentthis.com',
      },
    ],
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

module.exports = nextConfig;
