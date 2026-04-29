import Link from "next/link";
import Footer from "@/components/Footer";
import MoreOptionsDropdown from "@/components/MoreOptionsDropdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we protect your privacy. Minimal data collection, no selling information, and your anonymous messages stay safe.",
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: "Privacy Policy .  If Only I Sent This",
    description: "How we protect your privacy. Minimal data collection, no selling information, and your anonymous messages stay safe.",
    url: 'https://www.ifonlyisentthis.com/privacy-policy',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Privacy Policy .  If Only I Sent This",
    description: "How we protect your privacy. Minimal data collection, no selling information, and your anonymous messages stay safe.",
    images: ['/opengraph-image.png'],
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Privacy Policy</h1>
          <p className="text-sm text-[var(--text)] opacity-50 mt-1">Last updated: April 14, 2026</p>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap items-center justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li><Link href="/" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Home</Link></li>
              <li><Link href="/memories" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Archive</Link></li>
              <li><Link href="/submit" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Confess</Link></li>
              <MoreOptionsDropdown />
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)]">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] mb-6 tracking-tight">Your Privacy, Simply Put</h2>
            <p className="text-[var(--text)] text-base sm:text-lg mb-8">
              If Only I Sent This (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates{" "}
              <Link href="/" className="text-[var(--accent)] hover:underline">www.ifonlyisentthis.com</Link>.
              This Privacy Policy explains what information we collect, how we use it, and your choices regarding your data.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Information We Collect</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>Submitted memory content and chosen styles (recipient, message, color, animation, effects).</li>
                  <li>Basic technical data such as browser type, device type, and general location for performance and analytics.</li>
                  <li>Anonymous identifiers (cookies/local storage) for spam prevention and abuse control.</li>
                  <li>Information collected automatically by third-party advertising and analytics partners (see below).</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">How We Use Your Information</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>To operate, maintain, and improve the archive experience.</li>
                  <li>To moderate and publish approved memories.</li>
                  <li>To keep the service secure and prevent abuse.</li>
                  <li>To display advertisements through Google AdSense.</li>
                  <li>To analyze site usage and performance via Google Analytics.</li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Advertising & Third-Party Partners</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>We use Google AdSense to display advertisements on our site. Google and its ad technology partners may use cookies to serve ads based on your prior visits to this site and other websites.</li>
                  <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your browsing activity. This may include the use of the DoubleClick cookie.</li>
                  <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website and/or other websites.</li>
                  <li>You may opt out of personalized advertising by visiting{" "}
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Google Ads Settings</a>.
                  </li>
                  <li>You may also opt out of third-party vendor cookies for personalized advertising by visiting{" "}
                    <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">www.aboutads.info</a>.
                  </li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Cookies & Tracking Technologies</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li><strong>Essential cookies:</strong> We use a unique anonymous identifier (user_uuid) stored in a cookie and local storage for spam prevention and rate limiting.</li>
                  <li><strong>Analytics cookies:</strong> Google Analytics uses cookies (_ga, _gid) to help us understand how visitors use the site.</li>
                  <li><strong>Advertising cookies:</strong> Google AdSense and its partners use cookies to serve relevant ads and measure ad performance.</li>
                  <li>You can manage or delete cookies through your browser settings. Disabling cookies may affect some site features.</li>
                  <li>For complete details, see our <Link href="/cookie-policy" className="text-[var(--accent)] hover:underline">Cookie Policy</Link>.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Data Sharing & Retention</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>We do not sell your personal data.</li>
                  <li>We share data with advertising and analytics partners (Google) as described above.</li>
                  <li>We may disclose information if required by law or to protect the safety of our service.</li>
                  <li>Approved memories remain published until removed by us or upon your request. Self-destructing memories are permanently deleted at the scheduled time.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Your Rights & Choices</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>Request removal of your submitted memories via the <Link href="/contact" className="text-[var(--accent)] hover:underline">Contact</Link> page.</li>
                  <li>Opt out of personalized advertising through <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Google Ads Settings</a>.</li>
                  <li>Manage or delete cookies through your browser settings.</li>
                  <li>If you are in the EEA/UK, you may have additional rights under GDPR including the right to access, rectify, or erase your data.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Children&apos;s Privacy</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>This service is not intended for children under 13 years of age.</li>
                  <li>We do not knowingly collect personal information from children under 13.</li>
                  <li>If you believe a child has provided us with information, please <Link href="/contact" className="text-[var(--accent)] hover:underline">contact us</Link> and we will promptly delete it.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Changes to This Policy</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</li>
                  <li>Continued use of the service after changes constitutes acceptance of the updated policy.</li>
                </ul>
              </div>
            </div>

            <hr className="my-8 border-[var(--border)]" />
            <p className="text-[var(--text)] text-base sm:text-lg">
              Questions or removal requests? Contact us via <Link href="/contact" className="text-[var(--accent)] hover:underline">Contact</Link>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
