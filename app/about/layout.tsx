export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About If Only I Sent This",
            "description": "A free, anonymous archive for unsent letters, love letters never sent, and words you never said.",
            "url": "https://www.ifonlyisentthis.com/about",
            "isPartOf": {
              "@type": "WebSite",
              "name": "If Only I Sent This",
              "url": "https://www.ifonlyisentthis.com"
            }
          }).replace(/</g, '\\u003c')
        }}
      />
      {children}
    </>
  );
}
