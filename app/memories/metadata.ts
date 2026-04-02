import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unsent Messages Archive – Browse Anonymous Letters',
  description: 'Browse thousands of anonymous unsent letters, love confessions, and heartfelt messages. Search by name to find words someone never sent.',
  alternates: {
    canonical: '/memories',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Unsent Messages Archive – Browse Anonymous Letters',
    description: 'Browse thousands of anonymous unsent letters, love confessions, and heartfelt messages. Search by name to find words someone never sent.',
    url: 'https://www.ifonlyisentthis.com/memories',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unsent Messages Archive – Browse Anonymous Letters',
    description: 'Browse thousands of anonymous unsent letters, love confessions, and heartfelt messages. Search by name to find words someone never sent.',
    images: ['/opengraph-image.png'],
  },
};
