import React from 'react';
import "./globals.css";
import './bleeding-text.css';
import ThemeSwitcher from "@/components/ThemeSwitcher";
import UuidInitializer from "@/components/UuidInitializer";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: "If Only I Sent This",
  description: "A modern archive for unsent memories and heartfelt messages.",
  keywords: [
    "unsent messages",
    "unsent letters",
    "unsent project",
    "unsent love letters",
    "unsent text messages",
    "unsent emails",
    "unsent confessions",
    "unsent feelings",
    "unsent thoughts",
    "unsent memories",
    "unsent words",
    "unsent love",
    "unsent apologies",
    "unsent goodbyes",
    "unsent thank you",
    "unsent i love you",
    "unsent break up",
    "unsent heartbreak",
    "unsent first love",
    "unsent friendship",
    "unsent family",
    "unsent parents",
    "unsent ex",
    "unsent crush",
    "unsent soulmate",
    "unsent closure",
    "unsent forgiveness",
    "unsent regret",
    "unsent hope",
    "unsent dreams",
    "unsent promises",
    "unsent secrets",
    "unsent truth",
    "unsent feelings",
    "unsent emotions",
    "unsent heart",
    "unsent soul",
    "unsent mind",
    "unsent voice",
    "unsent story",
    "anonymous messages",
    "anonymous confessions",
    "anonymous letters",
    "anonymous love",
    "anonymous feelings",
    "anonymous thoughts",
    "anonymous memories",
    "anonymous heart",
    "anonymous soul",
    "anonymous voice",
    "unsent text to ex",
    "unsent message to ex",
    "unsent text to crush",
    "unsent message to crush",
    "unsent text to first love",
    "unsent message to first love",
    "unsent text to parents",
    "unsent message to parents",
    "unsent text to friend",
    "unsent message to friend",
    "unsent text to family",
    "unsent message to family",
    "unsent text to someone",
    "unsent message to someone",
    "unsent text to you",
    "unsent message to you",
    "unsent text to them",
    "unsent message to them",
    "unsent text to her",
    "unsent message to her",
    "unsent text to him",
    "unsent message to him",
    "unsent text to mom",
    "unsent message to mom",
    "unsent text to dad",
    "unsent message to dad",
    "unsent text to brother",
    "unsent message to brother",
    "unsent text to sister",
    "unsent message to sister",
    "unsent text to best friend",
    "unsent message to best friend",
    "unsent text to lover",
    "unsent message to lover",
    "unsent text to partner",
    "unsent message to partner",
    "unsent text to spouse",
    "unsent message to spouse",
    "unsent text to wife",
    "unsent message to wife",
    "unsent text to husband",
    "unsent message to husband",
    "unsent text to boyfriend",
    "unsent message to boyfriend",
    "unsent text to girlfriend",
    "unsent message to girlfriend",
    "unsent text to soulmate",
    "unsent message to soulmate",
    "unsent text to the one",
    "unsent message to the one",
    "unsent text to my love",
    "unsent message to my love",
    "unsent text to my heart",
    "unsent message to my heart",
    "unsent text to my soul",
    "unsent message to my soul",
    "unsent text to my mind",
    "unsent message to my mind",
    "unsent text to my life",
    "unsent message to my life",
    "unsent text to my world",
    "unsent message to my world",
    "unsent text to my everything",
    "unsent message to my everything",
    "unsent text to my future",
    "unsent message to my future",
    "unsent text to my past",
    "unsent message to my past",
    "unsent text to my present",
    "unsent message to my present",
    "unsent text to my dreams",
    "unsent message to my dreams",
    "unsent text to my hopes",
    "unsent message to my hopes",
    "unsent text to my fears",
    "unsent message to my fears",
    "unsent text to my regrets",
    "unsent message to my regrets",
    "unsent text to my mistakes",
    "unsent message to my mistakes",
    "unsent text to my apologies",
    "unsent message to my apologies",
    "unsent text to my forgiveness",
    "unsent message to my forgiveness",
    "unsent text to my closure",
    "unsent message to my closure",
    "unsent text to my goodbye",
    "unsent message to my goodbye",
    "unsent text to my hello",
    "unsent message to my hello",
    "unsent text to my future self",
    "unsent message to my future self",
    "unsent text to my past self",
    "unsent message to my past self",
    "unsent text to my present self",
    "unsent text to first love",
    "unsent message to first love",
    "unsent text to first crush",
    "unsent message to first crush",
    "unsent text to first kiss",
    "unsent message to first kiss",
    "unsent text to first date",
    "unsent message to first date",
    "unsent text to first relationship",
    "unsent message to first relationship",
    "unsent text to first heartbreak",
    "unsent message to first heartbreak",
    "unsent text to first breakup",
    "unsent message to first breakup",
    "unsent text to first love letter",
    "unsent message to first love letter",
    "unsent text to first love story",
    "unsent message to first love story",
    "unsent text to first love memory",
    "unsent message to first love memory",
    "unsent text to first love moment",
    "unsent message to first love moment",
    "unsent text to first love experience",
    "unsent message to first love experience",
    "unsent text to first love feelings",
    "unsent message to first love feelings",
    "unsent text to first love emotions",
    "unsent message to first love emotions",
    "unsent text to first love thoughts",
    "unsent message to first love thoughts",
    "unsent text to first love dreams",
    "unsent message to first love dreams",
    "unsent text to first love hopes",
    "unsent message to first love hopes",
    "unsent text to first love fears",
    "unsent message to first love fears",
    "unsent text to first love regrets",
    "unsent message to first love regrets",
    "unsent text to first love mistakes",
    "unsent message to first love mistakes",
    "unsent text to first love apologies",
    "unsent message to first love apologies",
    "unsent text to first love forgiveness",
    "unsent message to first love forgiveness",
    "unsent text to first love closure",
    "unsent message to first love closure",
    "unsent text to first love goodbye",
    "unsent message to first love goodbye",
    "unsent text to first love hello",
    "unsent message to first love hello",
    "unsent text to first love future",
    "unsent message to first love future",
    "unsent text to first love past",
    "unsent message to first love past",
    "unsent text to first love present",
    "unsent message to first love present",
    "breakup messages",
    "breakup texts",
    "breakup letters",
    "breakup confessions",
    "breakup feelings",
    "breakup thoughts",
    "breakup memories",
    "breakup words",
    "breakup love",
    "breakup apologies",
    "breakup goodbyes",
    "breakup thank you",
    "breakup i love you",
    "breakup heartbreak",
    "breakup first love",
    "breakup friendship",
    "breakup family",
    "breakup parents",
    "breakup ex",
    "breakup crush",
    "breakup soulmate",
    "breakup closure",
    "breakup forgiveness",
    "breakup regret",
    "breakup hope",
    "breakup dreams",
    "breakup promises",
    "breakup secrets",
    "breakup truth",
    "breakup feelings",
    "breakup emotions",
    "breakup heart",
    "breakup soul",
    "breakup mind",
    "breakup voice",
    "breakup story",
    "ex messages",
    "ex texts",
    "ex letters",
    "ex confessions",
    "ex feelings",
    "ex thoughts",
    "ex memories",
    "ex words",
    "ex love",
    "ex apologies",
    "ex goodbyes",
    "ex thank you",
    "ex i love you",
    "ex heartbreak",
    "ex first love",
    "ex friendship",
    "ex family",
    "ex parents",
    "ex crush",
    "ex soulmate",
    "ex closure",
    "ex forgiveness",
    "ex regret",
    "ex hope",
    "ex dreams",
    "ex promises",
    "ex secrets",
    "ex truth",
    "ex feelings",
    "ex emotions",
    "ex heart",
    "ex soul",
    "ex mind",
    "ex voice",
    "ex story",
    "first love messages",
    "first love texts",
    "first love letters",
    "first love confessions",
    "first love feelings",
    "first love thoughts",
    "first love memories",
    "first love words",
    "first love apologies",
    "first love goodbyes",
    "first love thank you",
    "first love i love you",
    "first love heartbreak",
    "first love friendship",
    "first love family",
    "first love parents",
    "first love ex",
    "first love crush",
    "first love soulmate",
    "first love closure",
    "first love forgiveness",
    "first love regret",
    "first love hope",
    "first love dreams",
    "first love promises",
    "first love secrets",
    "first love truth",
    "first love feelings",
    "first love emotions",
    "first love heart",
    "first love soul",
    "first love mind",
    "first love voice",
    "first love story",
    "first love memory",
    "first love moment",
    "first love experience",
    "first love journey",
    "first love beginning",
    "first love end",
    "first love start",
    "first love finish",
    "first love chapter",
    "first love page",
    "first love book",
    "first love story",
    "first love tale",
    "first love narrative",
    "first love chronicle",
    "first love history",
    "first love past",
    "first love present",
    "first love future",
    "first love yesterday",
    "first love today",
    "first love tomorrow",
    "first love forever",
    "first love always",
    "first love never",
    "first love once",
    "first love again",
    "first love more",
    "first love less",
    "first love better",
    "first love worse",
    "first love best",
    "first love worst",
    "first love perfect",
    "first love imperfect",
    "first love real",
    "first love unreal",
    "first love true",
    "first love false",
    "first love right",
    "first love wrong",
    "first love good",
    "first love bad",
    "first love happy",
    "first love sad",
    "first love joy",
    "first love pain",
    "first love smile",
    "first love tears",
    "first love laugh",
    "first love cry",
    "first love sing",
    "first love dance",
    "first love play",
    "first love work",
    "first love live",
    "first love die",
    "first love breathe",
    "first love sleep",
    "first love wake",
    "first love dream",
    "first love hope",
    "first love fear",
    "first love trust",
    "first love doubt",
    "first love believe",
    "first love know",
    "first love think",
    "first love feel",
    "first love see",
    "first love hear",
    "first love touch",
    "first love taste",
    "first love smell",
    "first love sense",
    "first love understand",
    "first love learn",
    "first love grow",
    "first love change",
    "first love become",
    "first love be",
    "never sent messages",
    "never sent texts",
    "never sent letters",
    "never sent confessions",
    "never sent feelings",
    "never sent thoughts",
    "never sent memories",
    "never sent words",
    "never sent love",
    "never sent apologies",
    "never sent goodbyes",
    "never sent thank you",
    "never sent i love you",
    "never sent heartbreak",
    "never sent first love",
    "never sent friendship",
    "never sent family",
    "never sent parents",
    "never sent ex",
    "never sent crush",
    "never sent soulmate",
    "never sent closure",
    "never sent forgiveness",
    "never sent regret",
    "never sent hope",
    "never sent dreams",
    "never sent promises",
    "never sent secrets",
    "never sent truth",
    "never sent feelings",
    "never sent emotions",
    "never sent heart",
    "never sent soul",
    "never sent mind",
    "never sent voice",
    "never sent story",
    "could not send messages",
    "could not send texts",
    "could not send letters",
    "could not send confessions",
    "could not send feelings",
    "could not send thoughts",
    "could not send memories",
    "could not send words",
    "could not send love",
    "could not send apologies",
    "could not send goodbyes",
    "could not send thank you",
    "could not send i love you",
    "could not send heartbreak",
    "could not send first love",
    "could not send friendship",
    "could not send family",
    "could not send parents",
    "could not send ex",
    "could not send crush",
    "could not send soulmate",
    "could not send closure",
    "could not send forgiveness",
    "could not send regret",
    "could not send hope",
    "could not send dreams",
    "could not send promises",
    "could not send secrets",
    "could not send truth",
    "could not send feelings",
    "could not send emotions",
    "could not send heart",
    "could not send soul",
    "could not send mind",
    "could not send voice",
    "could not send story",
    "wish i sent messages",
    "wish i sent texts",
    "wish i sent letters",
    "wish i sent confessions",
    "wish i sent feelings",
    "wish i sent thoughts",
    "wish i sent memories",
    "wish i sent words",
    "wish i sent love",
    "wish i sent apologies",
    "wish i sent goodbyes",
    "wish i sent thank you",
    "wish i sent i love you",
    "wish i sent heartbreak",
    "wish i sent first love",
    "wish i sent friendship",
    "wish i sent family",
    "wish i sent parents",
    "wish i sent ex",
    "wish i sent crush",
    "wish i sent soulmate",
    "wish i sent closure",
    "wish i sent forgiveness",
    "wish i sent regret",
    "wish i sent hope",
    "wish i sent dreams",
    "wish i sent promises",
    "wish i sent secrets",
    "wish i sent truth",
    "wish i sent feelings",
    "wish i sent emotions",
    "wish i sent heart",
    "wish i sent soul",
    "wish i sent mind",
    "wish i sent voice",
    "wish i sent story",
    "should have sent messages",
    "should have sent texts",
    "should have sent letters",
    "should have sent confessions",
    "should have sent feelings",
    "should have sent thoughts",
    "should have sent memories",
    "should have sent words",
    "should have sent love",
    "should have sent apologies",
    "should have sent goodbyes",
    "should have sent thank you",
    "should have sent i love you",
    "should have sent heartbreak",
    "should have sent first love",
    "should have sent friendship",
    "should have sent family",
    "should have sent parents",
    "should have sent ex",
    "should have sent crush",
    "should have sent soulmate",
    "should have sent closure",
    "should have sent forgiveness",
    "should have sent regret",
    "should have sent hope",
    "should have sent dreams",
    "should have sent promises",
    "should have sent secrets",
    "should have sent truth",
    "should have sent feelings",
    "should have sent emotions",
    "should have sent heart",
    "should have sent soul",
    "should have sent mind",
    "should have sent voice",
    "should have sent story",
    "if only i sent messages",
    "if only i sent texts",
    "if only i sent letters",
    "if only i sent confessions",
    "if only i sent feelings",
    "if only i sent thoughts",
    "if only i sent memories",
    "if only i sent words",
    "if only i sent love",
    "if only i sent apologies",
    "if only i sent goodbyes",
    "if only i sent thank you",
    "if only i sent i love you",
    "if only i sent heartbreak",
    "if only i sent first love",
    "if only i sent friendship",
    "if only i sent family",
    "if only i sent parents",
    "if only i sent ex",
    "if only i sent crush",
    "if only i sent soulmate",
    "if only i sent closure",
    "if only i sent forgiveness",
    "if only i sent regret",
    "if only i sent hope",
    "if only i sent dreams",
    "if only i sent promises",
    "if only i sent secrets",
    "if only i sent truth",
    "if only i sent feelings",
    "if only i sent emotions",
    "if only i sent heart",
    "if only i sent soul",
    "if only i sent mind",
    "if only i sent voice",
    "if only i sent story"
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
    title: "If Only I Sent This",
    description: "A modern archive for unsent memories and heartfelt messages.",
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
    title: "If Only I Sent This",
    description: "A modern archive for unsent memories and heartfelt messages.",
    images: ['/opengraph-image.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  let canonicalUrl = 'https://www.ifonlyisentthis.com/';
  // Use usePathname only in client components
  try {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
    canonicalUrl = 'https://www.ifonlyisentthis.com' + pathname;
  } catch {
    // fallback to root
  }
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
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en" href="https://www.ifonlyisentthis.com/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <meta name="description" content="A modern archive for unsent memories and heartfelt messages. Share your unspoken thoughts and feelings in a safe, anonymous space." />
        <meta property="og:title" content="If Only I Sent This" />
        <meta property="og:description" content="A modern archive for unsent memories and heartfelt messages. Share your unspoken thoughts and feelings in a safe, anonymous space." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.ifonlyisentthis.com/" />
        <meta property="og:image" content="https://www.ifonlyisentthis.com/opengraph-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="If Only I Sent This" />
        <meta name="twitter:description" content="A modern archive for unsent memories and heartfelt messages. Share your unspoken thoughts and feelings in a safe, anonymous space." />
        <meta name="twitter:image" content="https://www.ifonlyisentthis.com/opengraph-image.png" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LLWRNWWS0H"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LLWRNWWS0H');
            `
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const hour = new Date().getHours();
                let theme = "morning";
                if (hour >= 12 && hour < 18) {
                  theme = "evening";
                } else if (hour >= 18 || hour < 6) {
                  theme = "night";
                }
                const root = document.documentElement;
                if (theme === "morning") {
                  root.style.setProperty("--background", "#F5F5F5");
                  root.style.setProperty("--text", "#4A4A4A");
                  root.style.setProperty("--accent", "#AEDFF7");
                  root.style.setProperty("--secondary", "#E8D8D8");
                  root.style.setProperty("--card-bg", "#FDFDFD");
                  root.style.setProperty("--border", "#D9D9D9");
                } else if (theme === "evening") {
                  root.style.setProperty("--background", "#F0ECE3");
                  root.style.setProperty("--text", "#4A4A4A");
                  root.style.setProperty("--accent", "#B0C4DE");
                  root.style.setProperty("--secondary", "#D3C0B4");
                  root.style.setProperty("--card-bg", "#FFF8F0");
                  root.style.setProperty("--border", "#D9D9D9");
                } else if (theme === "night") {
                  root.style.setProperty("--background", "#E8E8E8");
                  root.style.setProperty("--text", "#4A4A4A");
                  root.style.setProperty("--accent", "#C0D6E4");
                  root.style.setProperty("--secondary", "#DADADA");
                  root.style.setProperty("--card-bg", "#F8F8F8");
                  root.style.setProperty("--border", "#CCCCCC");
                }
              })();
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "url": "https://www.ifonlyisentthis.com",
              "logo": "https://www.ifonlyisentthis.com/favicon.ico",
              "name": "If Only I Sent This",
              "description": "A modern archive for unsent memories and heartfelt messages."
            })
          }}
        />
        <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=La+Belle+Aurore&display=swap" rel="stylesheet" />
        <style>
          {`
            .la-belle-aurore-regular {
              font-family: "La Belle Aurore", cursive;
              font-weight: 400;
              font-style: normal;
            }
          `}
        </style>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--text)]">
        <ThemeSwitcher />
        <UuidInitializer />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js?v=' + Date.now()).then(function(registration) {
                    console.log('ServiceWorker registration successful');
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
                
                // Add cache clearing on page load for development
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                  if ('caches' in window) {
                    caches.keys().then(names => {
                      names.forEach(name => {
                        caches.delete(name);
                      });
                    });
                  }
                }
              }
            `
          }}
        />
      </body>
    </html>
  );
}
