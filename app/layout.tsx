import React from 'react';
import "./globals.css";
// Removed bleeding effect stylesheet
import ThemeSwitcher from "@/components/ThemeSwitcher";
import UuidInitializer from "@/components/UuidInitializer";
import Script from "next/script";
import RoutePrefetcher from "@/components/RoutePrefetcher";

const GA_MEASUREMENT_ID = 'G-LLWRNWWS0H';
const ADSENSE_CLIENT_ID = 'ca-pub-8850424858354795';
const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
const ENABLE_ADS = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
};

export const metadata = {
  metadataBase: new URL('https://www.ifonlyisentthis.com'),
  title: "If Only I Sent This – Unsent Letters & Anonymous Confessions",
  description:
    "Write and share unsent letters, anonymous confessions, and heartfelt messages you never had the courage to send. Free, no account needed.",
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'mobile-web-app-capable': 'yes',
    'format-detection': 'telephone=no',
  },
  keywords: [
    // Core brand
    "unsent messages",
    "unsent letters",
    "if only i sent this",
    "ifonlyisentthis",
    "unsent message archive",
    "anonymous confession site",
    "anonymous letter platform",
    // Anonymous letters & confessions
    "anonymous confession website",
    "anonymous love letter online",
    "write anonymous letter",
    "confession platform",
    "unsent letter archive",
    // Unsent texts & messaging
    "unsent text messages",
    "love texts never sent",
    "unsent message project",
    "unsent apology note",
    "message i wish i had sent",
    "unsent confession to ex",
    "unsent crush message",
    // Love & heartbreak
    "unsent love letter",
    "unrequited love message",
    "breakup letter unsent",
    "first love confession",
    "goodbye letter to love",
    "love regret message",
    // Mental health & therapeutic writing
    "journaling for mental health",
    "writing therapy benefits",
    "cathartic writing ideas",
    "healing through letters",
    "therapeutic letter writing",
    // Competitor alternatives
    "sites like the unsent project",
    "the unsent project alternative",
    "unsent project alternative",
    "unsent message project alternative",
    "unsent project not working",
    "write unsent letter online free",
    "anonymous love letter website",
    "sites like postsecret",
    "postsecret alternative",
    "anonymous venting website",
    // High-intent curiosity searches
    "find anonymous messages about me",
    "search unsent messages by name",
    "did someone write about me",
    "has anyone written about me",
    "search my name unsent messages",
    // Emotional outlet & cathartic writing
    "where to write unsent letters online",
    "free anonymous confession platform",
    "write letter you'll never send",
    "anonymous emotional outlet",
    "safe space to confess online",
    "write feelings anonymously",
    "release emotions through writing",
    // Core unsent message variations
    "unsent love letters",
    "unsent confessions",
    "unsent goodbyes",
    "unsent apologies",
    "unsent closure",
    "unsent forgiveness",
    // Unsent messages by relationship
    "unsent message to ex",
    "unsent message to crush",
    "unsent message to first love",
    "unsent message to parents",
    "unsent message to best friend",
    "unsent message to soulmate",
    "unsent letter to him",
    "unsent letter to her",
    "letter to my ex i'll never send",
    "things i wish i told you",
    // Breakup & grief
    "breakup messages",
    "breakup letters",
    "breakup closure",
    "goodbye letter to ex",
    "closure letter template",
    "grief support",
    "coping with grief",
    "loss of parent",
    "unsent goodbye letter",
    "goodbye letter to deceased",
    // Time capsule & self-destruct features
    "time capsule letter",
    "message to future self",
    "self destructing message",
    "digital time capsule",
    "disappearing message website",
    // Healing & moving on
    "healing after breakup",
    "writing for closure",
    "unsent therapy exercise",
    "writing letters never sent",
    // High-value trending keywords
    "unsent letters anonymous",
    "write anonymous unsent letter",
    "confession website free",
    "anonymous emotional writing",
    "unsent message to someone",
    "anonymous letters project",
    "unsent messages alternative",
    "online confession anonymous free"
  ].join(", "),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "If Only I Sent This – Unsent Letters & Anonymous Confessions",
    description:
      "Write and share unsent letters, anonymous confessions, and heartfelt messages you never had the courage to send. Free, no account needed.",
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'If Only I Sent This',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "If Only I Sent This – Unsent Letters & Anonymous Confessions",
    description:
      "Write and share unsent letters, anonymous confessions, and heartfelt messages you never had the courage to send. Free, no account needed.",
    images: ['/opengraph-image.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/mstile-150x150.png" />
        <meta name="google-site-verification" content="-3cysNzrb6ZgU44DFdsfeiwU61zydgZWRMyXebgmsUM" />
        <meta name="color-scheme" content="light dark" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL || ''} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        {ENABLE_ANALYTICS && <link rel="dns-prefetch" href="https://www.googletagmanager.com" />}
        {ENABLE_ADS && <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />}
        <link rel="prefetch" href="/memories" />
        <link rel="prefetch" href="/submit" />
        <link rel="prefetch" href="/how-it-works" />
        {ENABLE_ANALYTICS && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "url": "https://www.ifonlyisentthis.com",
                "logo": "https://www.ifonlyisentthis.com/android-chrome-512x512.png",
                "name": "If Only I Sent This",
                "description": "A modern archive for unsent memories, anonymous confessions, and heartfelt messages you were never ready to send. The instant, glitch-free alternative to unsent message projects.",
                "sameAs": ["https://buymeacoffee.com/ifonlyisentthis"]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://www.ifonlyisentthis.com",
                "name": "If Only I Sent This",
                "description": "Share unsent memories, anonymous confessions, and heartfelt messages you were never ready to send.",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://www.ifonlyisentthis.com/name/{search_term_string}"
                  },
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "If Only I Sent This",
                "url": "https://www.ifonlyisentthis.com",
                "applicationCategory": "LifestyleApplication",
                "operatingSystem": "All",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "description": "Write and share unsent messages anonymously. No account needed. Submissions go live instantly after moderation."
              }
            ]).replace(/</g, '\\u003c')
          }}
        />
        
        <link rel="manifest" href="/site.webmanifest" />
        {ENABLE_ADS && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--text)]">
        <ThemeSwitcher />
        <UuidInitializer />
        <RoutePrefetcher />
        {children}
        <Script id="ioist-startup-cleanup" strategy="afterInteractive">
          {`
            (function() {
              // Run only in production on this domain (covers subdomains)
              var host = window.location.hostname || '';
              var isProd = host === 'ifonlyisentthis.com' || host.endsWith('.ifonlyisentthis.com');
              if (!isProd) { return; }

              // Ensure we don't loop reloads: mark one-time cleanup per session
              if (sessionStorage.getItem('ioist_cleanup_done') === '1') { return; }
              sessionStorage.setItem('ioist_cleanup_done', '1');

              var cleanup = async function() {
                try {
                  // 1) Clear CacheStorage
                  if (window.caches && caches.keys) {
                    var keys = await caches.keys();
                    await Promise.all(keys.map(function(k){ return caches.delete(k); }));
                  }
                } catch(e) {}

                try {
                  // 2) Unregister any service workers for this origin
                  if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
                    var regs = await navigator.serviceWorker.getRegistrations();
                    await Promise.all(regs.map(function(r){ return r.unregister(); }));
                  }
                } catch(e) {}

                try {
                  // 3) Selective localStorage clear — preserve identity and cache
                  var keysToKeep = ['user_uuid', 'app_version', 'ultraMemoryCache'];
                  var preserved = {};
                  keysToKeep.forEach(function(k) {
                    var v = localStorage.getItem(k);
                    if (v !== null) preserved[k] = v;
                  });
                  localStorage.clear();
                  Object.keys(preserved).forEach(function(k) {
                    localStorage.setItem(k, preserved[k]);
                  });
                } catch(e) {}

                try {
                  // Preserve the marker while clearing sessionStorage
                  var marker = sessionStorage.getItem('ioist_cleanup_done');
                  sessionStorage.clear();
                  sessionStorage.setItem('ioist_cleanup_done', marker || '1');
                } catch(e) {}

                try {
                  if (window.indexedDB && indexedDB.databases) {
                    var dbs = await indexedDB.databases();
                    await Promise.all((dbs || []).map(function(db){
                      if (db && db.name) { return new Promise(function(res){ var del = indexedDB.deleteDatabase(db.name); del.onsuccess = del.onerror = del.onblocked = function(){ res(); }; }); }
                      return Promise.resolve();
                    }));
                  }
                } catch(e) {}

                // Removed reload to prevent double-loads; cleanup only
              };

              // Delay until load to avoid blocking rendering
              if (document.readyState === 'complete') { cleanup(); }
              else { window.addEventListener('load', function(){ cleanup(); }); }

              // Intentionally no bfcache reload: keep current session smooth.
            })();
          `}
        </Script>
      </body>
    </html>
  );
}

