import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Write an Unsent Letter — Free & Anonymous',
  description: 'Write your unsent message anonymously. Choose colors, set a time capsule, or let it self-destruct. No sign-up required.',
  alternates: {
    canonical: '/submit',
  },
  openGraph: {
    title: 'Write an Unsent Letter — Free & Anonymous',
    description: 'Write your unsent message anonymously. Choose colors, set a time capsule, or let it self-destruct. No sign-up required.',
    url: 'https://www.ifonlyisentthis.com/submit',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Write an Unsent Letter — Free & Anonymous',
    description: 'Write your unsent message anonymously. Choose colors, set a time capsule, or let it self-destruct. No sign-up required.',
    images: ['/opengraph-image.png'],
  },
};
