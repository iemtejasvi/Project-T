import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Write an Unsent Letter — Anonymous, Free & Instant',
  description: 'Write an unsent letter anonymously. Say the things you wish you said — to an ex, a lost friend, someone who passed, or anyone you held words back from. Choose colors, add self-destruct timers, or set a time capsule. No sign-up required.',
  alternates: {
    canonical: '/submit',
  },
  openGraph: {
    title: 'Write an Unsent Letter — Free & Anonymous',
    description: 'Say the things you wish you said. Write your unsent letter anonymously — to an ex, a lost friend, or someone who will never read it. Free, no account needed.',
    url: 'https://www.ifonlyisentthis.com/submit',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'Write an Unsent Letter' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Write an Unsent Letter — Free & Anonymous',
    description: 'Say the things you wish you said. Write your unsent letter anonymously — free, no account needed.',
    images: ['/opengraph-image.png'],
  },
};
