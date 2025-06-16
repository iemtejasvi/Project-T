import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Memories - If Only I Sent This',
  description: 'Browse through heartfelt unsent messages and memories shared by people around the world.',
  alternates: {
    canonical: 'https://ifonlyisentthis.com/memories',
  },
  openGraph: {
    title: 'Memories - If Only I Sent This',
    description: 'Browse through heartfelt unsent messages and memories shared by people around the world.',
    url: 'https://ifonlyisentthis.com/memories',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memories - If Only I Sent This',
    description: 'Browse through heartfelt unsent messages and memories shared by people around the world.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function MemoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 