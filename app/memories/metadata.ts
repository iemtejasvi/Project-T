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
};
