export default function UnsentLettersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "The Art of Unsent Letters",
            "description": "From Kafka's letters to Felice to the text you deleted at 2am — unsent letters are humanity's most honest form of expression.",
            "url": "https://www.ifonlyisentthis.com/unsent-letters",
            "datePublished": "2026-04-14",
            "author": {
              "@type": "Organization",
              "name": "If Only I Sent This"
            },
            "publisher": {
              "@type": "Organization",
              "name": "If Only I Sent This",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.ifonlyisentthis.com/android-chrome-512x512.png"
              }
            },
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
