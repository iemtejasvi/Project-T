import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works | Write & Share Unsent Letters',
  description: 'Write an anonymous unsent letter in under a minute. No account, no fees. Learn how your words find a home after compassionate review.',
  alternates: {
    canonical: '/how-it-works',
  },
  openGraph: {
    title: 'How It Works | Write & Share Unsent Letters',
    description: 'Write an anonymous unsent letter in under a minute. No account, no fees. Learn how your words find a home after compassionate review.',
    url: 'https://www.ifonlyisentthis.com/how-it-works',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works | Write & Share Unsent Letters',
    description: 'Write an anonymous unsent letter in under a minute. No account, no fees. Learn how your words find a home after compassionate review.',
    images: ['/opengraph-image.png'],
  },
};
