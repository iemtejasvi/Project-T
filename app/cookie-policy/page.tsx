import Link from "next/link";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Learn about the cookies used on If Only I Sent This, including essential, analytics, and advertising cookies, and how to manage them.",
  alternates: {
    canonical: '/cookie-policy',
  },
  openGraph: {
    title: "Cookie Policy – If Only I Sent This",
    description: "Learn about the cookies used on If Only I Sent This and how to manage them.",
    url: 'https://www.ifonlyisentthis.com/cookie-policy',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Cookie Policy – If Only I Sent This",
    description: "Learn about the cookies used on If Only I Sent This and how to manage them.",
    images: ['/opengraph-image.png'],
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Cookie Policy</h1>
          <p className="text-sm text-[var(--text)] opacity-50 mt-1">Last updated: April 14, 2026</p>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex justify-center gap-4 desktop-nav-list">
              <li>
                <Link href="/" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)]">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] mb-6 tracking-tight">How We Use Cookies</h2>
            <p className="text-[var(--text)] text-base sm:text-lg mb-8">
              Cookies are small text files stored on your device when you visit a website. We use cookies and similar technologies (such as local storage) to operate the site, analyze usage, and serve advertisements. This policy explains what cookies we use and how you can manage them.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Essential Cookies</h3>
                <p className="text-[var(--text)] text-base sm:text-lg mb-3">
                  These cookies are necessary for the site to function and cannot be switched off.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[var(--text)] text-sm sm:text-base border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="py-2 pr-4 font-semibold">Cookie</th>
                        <th className="py-2 pr-4 font-semibold">Purpose</th>
                        <th className="py-2 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--border)] opacity-80">
                        <td className="py-2 pr-4 font-mono text-sm">user_uuid</td>
                        <td className="py-2 pr-4">Anonymous identifier for spam prevention and rate limiting</td>
                        <td className="py-2">1 year</td>
                      </tr>
                      <tr className="border-b border-[var(--border)] opacity-80">
                        <td className="py-2 pr-4 font-mono text-sm">cookie_consent</td>
                        <td className="py-2 pr-4">Stores your cookie consent preference</td>
                        <td className="py-2">1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Analytics Cookies</h3>
                <p className="text-[var(--text)] text-base sm:text-lg mb-3">
                  We use Google Analytics to understand how visitors interact with the site. These cookies collect information anonymously.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[var(--text)] text-sm sm:text-base border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="py-2 pr-4 font-semibold">Cookie</th>
                        <th className="py-2 pr-4 font-semibold">Purpose</th>
                        <th className="py-2 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--border)] opacity-80">
                        <td className="py-2 pr-4 font-mono text-sm">_ga</td>
                        <td className="py-2 pr-4">Distinguishes unique users for Google Analytics</td>
                        <td className="py-2">2 years</td>
                      </tr>
                      <tr className="border-b border-[var(--border)] opacity-80">
                        <td className="py-2 pr-4 font-mono text-sm">_gid</td>
                        <td className="py-2 pr-4">Distinguishes unique users for Google Analytics</td>
                        <td className="py-2">24 hours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Advertising Cookies</h3>
                <p className="text-[var(--text)] text-base sm:text-lg mb-3">
                  We use Google AdSense to display advertisements. Google and its advertising partners may set cookies to serve personalized ads and measure ad performance.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[var(--text)] text-sm sm:text-base border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="py-2 pr-4 font-semibold">Cookie</th>
                        <th className="py-2 pr-4 font-semibold">Purpose</th>
                        <th className="py-2 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--border)] opacity-80">
                        <td className="py-2 pr-4 font-mono text-sm">IDE</td>
                        <td className="py-2 pr-4">Used by Google DoubleClick to serve targeted advertisements</td>
                        <td className="py-2">1 year</td>
                      </tr>
                      <tr className="border-b border-[var(--border)] opacity-80">
                        <td className="py-2 pr-4 font-mono text-sm">DSID</td>
                        <td className="py-2 pr-4">Used by Google to identify signed-in users for ad personalization</td>
                        <td className="py-2">2 weeks</td>
                      </tr>
                      <tr className="border-b border-[var(--border)] opacity-80">
                        <td className="py-2 pr-4 font-mono text-sm">__gads</td>
                        <td className="py-2 pr-4">Used by Google AdSense to measure ad interactions</td>
                        <td className="py-2">13 months</td>
                      </tr>
                      <tr className="border-b border-[var(--border)] opacity-80">
                        <td className="py-2 pr-4 font-mono text-sm">__gpi</td>
                        <td className="py-2 pr-4">Used by Google AdSense to collect site statistics and track conversions</td>
                        <td className="py-2">13 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Managing Your Cookies</h3>
                  <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                    <li>You can manage or delete cookies through your browser settings at any time.</li>
                    <li>Disabling essential cookies may affect the functionality of the site.</li>
                    <li>To opt out of personalized ads, visit{" "}
                      <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Google Ads Settings</a>.
                    </li>
                    <li>To opt out of third-party advertising cookies, visit{" "}
                      <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">NAI Opt-Out</a>.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Consent & Changes</h3>
                  <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                    <li>When you first visit our site, a cookie consent banner gives you the option to accept cookies.</li>
                    <li>You can withdraw your consent at any time by clearing your browser cookies and revisiting the site.</li>
                    <li>We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated date.</li>
                  </ul>
                </div>
              </div>
            </div>

            <hr className="my-8 border-[var(--border)]" />
            <p className="text-[var(--text)] text-base sm:text-lg">
              For more information about how we handle your data, see our <Link href="/privacy-policy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link>.
              Questions? Reach us via <Link href="/contact" className="text-[var(--accent)] hover:underline">Contact</Link>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
