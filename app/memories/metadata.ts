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
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  openGraph: {
    title: 'Unsent Messages Archive – Browse Anonymous Letters',
    description: 'Browse thousands of anonymous unsent letters, love confessions, and heartfelt messages. Search by name to find words someone never sent.',
    url: 'https://www.ifonlyisentthis.com/memories',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unsent Messages Archive – Browse Anonymous Letters',
    description: 'Browse thousands of anonymous unsent letters, love confessions, and heartfelt messages. Search by name to find words someone never sent.',
    images: ['/opengraph-image.png'],
  },
};
