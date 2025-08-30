import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/maintenance/',
        ],
      },
    ],
    sitemap: 'https://ifonlyisentthis.com/sitemap.xml',
    host: 'https://ifonlyisentthis.com',
  }
} 