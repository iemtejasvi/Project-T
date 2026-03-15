import { Metadata } from 'next';

interface NameLayoutProps {
  children: React.ReactNode;
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: NameLayoutProps): Promise<Metadata> {
  const { name: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug).toLowerCase().trim();
  const displayName = slug
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const title = `Messages to ${displayName} - If Only I Sent This`;
  const description = `Read unsent messages, anonymous letters, and confessions written to ${displayName}. Discover the words people never had the courage to send.`;

  return {
    title,
    description,
    keywords: [
      `unsent messages to ${displayName}`,
      `unsent messages for ${displayName}`,
      `letters to ${displayName}`,
      `messages for ${displayName}`,
      `anonymous letters to ${displayName}`,
      `things I never told ${displayName}`,
      `confessions to ${displayName}`,
      `love letters to ${displayName}`,
      `last memories for ${displayName}`,
      `words I never said to ${displayName}`,
      `dear ${displayName}`,
      'unsent messages',
      'unsent messages to ex',
      'unsent love letters',
      'anonymous confessions',
      'if only i sent this',
      'unsent project',
      'things i never said',
      'letters never sent',
    ],
    openGraph: {
      title,
      description,
      url: `https://www.ifonlyisentthis.com/name/${encodeURIComponent(slug)}`,
      siteName: 'If Only I Sent This',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://www.ifonlyisentthis.com/name/${encodeURIComponent(slug)}`,
    },
  };
}

export default function NameLayout({ children }: NameLayoutProps) {
  return <>{children}</>;
}
