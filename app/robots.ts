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
      // Block AI training crawlers .  they burn invocations and provide no SEO value
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'ClaudeBot', 'Bytespider', 'cohere-ai'],
        disallow: ['/'],
      },
    ],
    sitemap: 'https://www.ifonlyisentthis.com/sitemap.xml',
    host: 'https://www.ifonlyisentthis.com',
  }
}