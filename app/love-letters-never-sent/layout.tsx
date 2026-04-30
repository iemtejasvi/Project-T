export default function LoveLettersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Love Letters Never Sent",
            "description": "From Neruda's unnamed beloved to the words you never said, love letters never sent are the most honest kind.",
            "url": "https://www.ifonlyisentthis.com/love-letters-never-sent",
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
