import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unsent Messages Archive | Anonymous Letters',
  description:
    'Browse thousands of anonymous unsent letters, love confessions, apologies never sent, and heartfelt messages people never had the courage to deliver. Read the words others held back.',
  alternates: {
    canonical: '/memories',
  },
  openGraph: {
    title: 'Unsent Messages Archive | If Only I Sent This',
    description:
      'Browse thousands of anonymous unsent letters, love confessions, and messages people never sent. Discover the words others held back.',
    url: 'https://www.ifonlyisentthis.com/memories',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'Unsent Messages Archive' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unsent Messages Archive | If Only I Sent This',
    description:
      'Browse thousands of anonymous unsent letters, love confessions, and messages people never sent.',
    images: ['/opengraph-image.png'],
  },
};

export default function MemoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
