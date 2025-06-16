import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Memories - If Only I Sent This',
  description: 'Browse through heartfelt unsent messages and memories shared by people around the world.',
  alternates: {
    canonical: '/memories',
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
    },
  },
}; 