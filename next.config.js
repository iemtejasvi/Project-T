/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';

// Canonical Content Security Policy — applied to ALL responses (pages + API)
// Also duplicated in lib/securityHeaders.ts for API route programmatic responses
const CSP_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://*.adtrafficquality.google https://challenges.cloudflare.com https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://challenges.cloudflare.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://*.supabase.co https://api.ipify.org https://ipapi.co https://ip-api.com https://httpbin.org https://ipinfo.io https://icanhazip.com https://api.ip2location.io https://ipwhois.app https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google https://static.cloudflareinsights.com",
  "frame-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://challenges.cloudflare.com https://*.adtrafficquality.google https://www.google.com",
  "frame-ancestors 'self' https://admin.google.com https://ogs.google.com https://*.google.com",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ');

const nextConfig = {
  generateEtags: true,
  async headers() {
    return [
      // Security headers on all routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Content-Security-Policy', value: CSP_POLICY },
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

      // Read-only API routes — cached at both Vercel + Cloudflare for 5hr
      // New approved memories may take up to 5hr to appear (user-accepted trade-off)
      {
        source: '/api/memories/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=18000, stale-while-revalidate=36000' },
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=18000, stale-while-revalidate=36000' },
          { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=18000, stale-while-revalidate=36000' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      {
        source: '/api/announcements',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=18000, stale-while-revalidate=36000' },
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=18000, stale-while-revalidate=36000' },
          { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=18000, stale-while-revalidate=36000' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      {
        source: '/api/names',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=18000, stale-while-revalidate=36000' },
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=18000, stale-while-revalidate=36000' },
          { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=18000, stale-while-revalidate=36000' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      {
        source: '/api/popular-names',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=18000, stale-while-revalidate=36000' },
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=18000, stale-while-revalidate=36000' },
          { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=18000, stale-while-revalidate=36000' },
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
      {
        source: '/articles',
        destination: '/journal',
        permanent: true,
      },
      {
        source: '/articles/:slug*',
        destination: '/journal/:slug*',
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
