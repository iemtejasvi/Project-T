import React from 'react';
import "./globals.css";
// Removed bleeding effect stylesheet
import ThemeSwitcher from "@/components/ThemeSwitcher";
import UuidInitializer from "@/components/UuidInitializer";
import Script from "next/script";
import RoutePrefetcher from "@/components/RoutePrefetcher";
import { La_Belle_Aurore, Pacifico } from 'next/font/google';

const laBelleAurore = La_Belle_Aurore({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-la-belle-aurore',
});

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
});

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || '';
const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
const ENABLE_ADS = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
};

export const metadata = {
  metadataBase: new URL('https://www.ifonlyisentthis.com'),
  title: "If Only I Sent This – Unsent Letters & Confessions",
  description:
    "Write and share unsent letters, anonymous confessions, and heartfelt messages you never had the courage to send. Free, no account needed.",
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'mobile-web-app-capable': 'yes',
    'format-detection': 'telephone=no',
  },
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
    title: "If Only I Sent This – Unsent Letters & Confessions",
    description:
      "Write and share unsent letters, anonymous confessions, and heartfelt messages you never had the courage to send. Free, no account needed.",
    url: 'https://www.ifonlyisentthis.com',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 800,
        height: 533,
        alt: 'If Only I Sent This',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "If Only I Sent This – Unsent Letters & Confessions",
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
        <meta name="google-site-verification" content="-3cysNzrb6ZgU44DFdsfeiwU61zydgZWRMyXebgmsUM" />
        <meta name="color-scheme" content="light dark" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL || ''} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        {ENABLE_ANALYTICS && <link rel="dns-prefetch" href="https://www.googletagmanager.com" />}
        {ENABLE_ADS && <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />}
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
                "sameAs": ["https://buymeacoffee.com/ifonlyisentthis", "https://www.instagram.com/ifonlyisentthis"]
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
        {ENABLE_ADS && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`min-h-screen bg-[var(--background)] text-[var(--text)] ${laBelleAurore.variable} ${pacifico.variable}`}>
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
                  var keysToKeep = ['user_uuid', 'app_version', 'ultraCache', 'browser_session_heartbeat'];
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

