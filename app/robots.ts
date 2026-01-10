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
    sitemap: 'https://www.ifonlyisentthis.com/sitemap.xml',
    host: 'https://www.ifonlyisentthis.com',
  }
}