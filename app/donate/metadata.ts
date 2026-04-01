import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support Us – Donate to If Only I Sent This',
  description: 'Help keep If Only I Sent This free. Your donation supports hosting, moderation, and development of this anonymous unsent message platform.',
  alternates: {
    canonical: '/donate',
  },
  openGraph: {
    title: 'Support Us – Donate to If Only I Sent This',
    description: 'Help keep If Only I Sent This free. Your donation supports hosting, moderation, and development of this anonymous unsent message platform.',
    url: 'https://www.ifonlyisentthis.com/donate',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support Us – Donate to If Only I Sent This',
    description: 'Help keep If Only I Sent This free. Your donation supports hosting, moderation, and development.',
    images: ['/opengraph-image.png'],
  },
};
