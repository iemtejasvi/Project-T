import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/memories',
          '/submit',
          '/how-it-works',
          '/donate',
          '/contact',
          '/privacy-policy'
        ],
        disallow: [
          '/admin',
          '/api',
          '/_next',
          '/static',
          '/*.json$',
          '/*.xml$',
          '/*.txt$'
        ],
      },
    ],
    sitemap: 'https://ifonlyisentthis.com/sitemap.xml',
    host: 'https://ifonlyisentthis.com',
  }
} 