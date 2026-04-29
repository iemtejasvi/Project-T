import React from 'react';
import "./globals.css";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import UuidInitializer from "@/components/UuidInitializer";
import Script from "next/script";
import RoutePrefetcher from "@/components/RoutePrefetcher";

import { La_Belle_Aurore, Pacifico } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';

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
  title: {
    default: "If Only I Sent This – Unsent Letters, Anonymous Confessions & Messages Never Sent",
    template: "%s – If Only I Sent This",
  },
  description:
    "A sanctuary for unsent letters, love letters never sent, anonymous confessions, and the words you never said. Write what you held back — to a person, a pet, or a moment. Free, no account needed.",
  keywords: [
    'unsent letters', 'love letters never sent', 'anonymous confessions',
    'words I never said', 'things I never told you', 'unsent messages',
    'letters to my ex', 'write anonymous letter', 'anonymous letter to someone',
    'messages I never sent', 'if only I sent this', 'unsent project alternative',
    'confessions', 'heartfelt messages', 'emotional letters',
    'letters to the one that got away', 'write a letter you will never send',
    'unsent message to first love', 'anonymous message archive',
    'search unsent messages by name', 'letter I never sent',
    'unspoken words', 'things left unsaid', 'letter to someone who passed away',
    'goodbye letter never sent', 'apology letter never sent',
    'r/unsentletters', 'PostSecret alternative', 'anonymous love letter',
    'message to my ex I never sent', 'closure letter',
    'write a confession anonymously', 'regret letters',
  ],
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
        rel: 'icon',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
      },
      {
        rel: 'icon',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "If Only I Sent This – Unsent Letters & Anonymous Confessions",
    description:
      "A sanctuary for unsent letters, love letters never sent, and the words you never said. Write your anonymous confession — free, no account needed.",
    url: 'https://www.ifonlyisentthis.com',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 800,
        height: 533,
        alt: 'If Only I Sent This – Unsent Letters & Anonymous Confessions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "If Only I Sent This – Unsent Letters & Anonymous Confessions",
    description:
      "A sanctuary for unsent letters, love letters never sent, and the words you never said. Write your anonymous confession — free, no account needed.",
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
        <meta name="google-adsense-account" content="ca-pub-4151123662328725" />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL || ''} crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {ENABLE_ANALYTICS && <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />}
        {ENABLE_ADS && <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />}
        {/* Google Consent Mode v2 — must execute synchronously BEFORE any GA/AdSense scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                wait_for_update: 500
              });

            `.replace(/\s+/g, ' ')
          }}
        />
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
                "sameAs": ["https://buymeacoffee.com/ifonlyisentthis", "https://www.instagram.com/ifonlyisentthiss"]
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
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`min-h-screen bg-[var(--background)] text-[var(--text)] ${laBelleAurore.variable} ${pacifico.variable}`}>
        <ThemeSwitcher />
        <UuidInitializer />
        <RoutePrefetcher />
        {children}
        {ENABLE_ANALYTICS && GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
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

              try {
                // Selective localStorage clear FIRST (synchronous) — before any async work
                var keysToKeep = ['user_uuid', 'app_version', 'ultraCache', 'browser_session_heartbeat', 'cookie_consent', 'iois_welcome_closed'];
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

