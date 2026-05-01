import Link from "next/link";
import Footer from "@/components/Footer";
import MoreOptionsDropdown from "@/components/MoreOptionsDropdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer for If Only I Sent This. Information about user content, third-party advertisements, external links, and limitation of liability.",
  alternates: {
    canonical: '/disclaimer',
  },
  openGraph: {
    title: "Disclaimer | If Only I Sent This",
    description: "Disclaimer for If Only I Sent This. Information about user content, third-party advertisements, and limitation of liability.",
    url: 'https://www.ifonlyisentthis.com/disclaimer',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Disclaimer | If Only I Sent This",
    description: "Disclaimer for If Only I Sent This. Information about user content, third-party advertisements, and limitation of liability.",
    images: ['/opengraph-image.png'],
  },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Disclaimer</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">General Disclaimer</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>All content on this site is provided for general informational and expressive purposes only.</li>
                  <li>The service is not a substitute for professional advice, therapy, or counseling.</li>
                  <li>We make no representations or warranties about the accuracy, completeness, or reliability of any content on the site.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">User-Submitted Content</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>Memories and messages are submitted anonymously by users. We do not verify the accuracy, truthfulness, or completeness of any user content.</li>
                  <li>The views expressed in submitted memories are those of the individual authors and do not represent our views.</li>
                  <li>We are not responsible for any harm, loss, or damage resulting from user-submitted content.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Third-Party Advertisements</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>This site may display advertisements served by Google AdSense and its advertising partners (once our account is enabled).</li>
                  <li>The appearance of ads on our site does not constitute an endorsement of the advertised products, services, or companies.</li>
                  <li>We have no control over the content of ads and are not responsible for any claims, losses, or damages arising from your interaction with advertisements.</li>
                  <li>Ad targeting is managed by Google. See our <Link href="/privacy-policy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link> for details on ad personalization and opt-out options.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">External Links</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>Our site may contain links to external websites not owned or controlled by us.</li>
                  <li>We are not responsible for the content, privacy practices, or availability of any external sites.</li>
                  <li>Visiting external links is at your own risk. We encourage you to review the terms and privacy policies of any third-party site you visit.</li>
                </ul>
              </div>
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Limitation of Liability</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>To the fullest extent permitted by applicable law, If Only I Sent This and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the Service.</li>
                  <li>This includes, without limitation, damages for loss of data, goodwill, or other intangible losses, even if we have been advised of the possibility of such damages.</li>
                </ul>
              </div>
            </div>

            <hr className="my-8 border-[var(--border)]" />
            <p className="text-[var(--text)] text-base sm:text-lg">
              Questions? Reach us via <Link href="/contact" className="text-[var(--accent)] hover:underline">Contact</Link>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
