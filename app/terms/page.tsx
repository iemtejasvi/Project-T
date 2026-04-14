import Link from "next/link";
import Footer from "@/components/Footer";
import MoreOptionsDropdown from "@/components/MoreOptionsDropdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for using If Only I Sent This. Submit content you own, keep it respectful, and your anonymous voice stays protected.",
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: "Terms & Conditions – If Only I Sent This",
    description: "Terms for using If Only I Sent This. Submit content you own, keep it respectful, and your anonymous voice stays protected.",
    url: 'https://www.ifonlyisentthis.com/terms',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Terms & Conditions – If Only I Sent This",
    description: "Terms for using If Only I Sent This. Submit content you own, keep it respectful, and your anonymous voice stays protected.",
    images: ['/opengraph-image.png'],
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Terms & Conditions</h1>
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
            <p className="text-[var(--text)] text-base sm:text-lg mb-8">
              By accessing or using If Only I Sent This (&quot;the Service&quot;), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Service.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Use of the Service</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>Submit only content you have the right to share. No illegal, hateful, or harmful material.</li>
                  <li>Memories may be reviewed and published at our discretion.</li>
                  <li>We may remove content that violates these terms without notice.</li>
                  <li>The service is provided &quot;as is&quot; without warranties of any kind.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Your Content</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>You retain ownership of your submitted content.</li>
                  <li>By submitting, you grant us a non-exclusive, worldwide, royalty-free right to display and distribute it on the Service.</li>
                  <li>You can request removal of a memory via the <Link href="/contact" className="text-[var(--accent)] hover:underline">contact page</Link>.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Eligibility & Conduct</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>You must be at least 13 years old to use this Service. If you are under 18, you confirm your parent or guardian consents to your use.</li>
                  <li>You must comply with all applicable laws in your jurisdiction.</li>
                  <li>Do not impersonate others or expose private sensitive information of third parties.</li>
                  <li>No spam, scams, or automated submissions.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Advertising</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>The Service displays third-party advertisements provided by Google AdSense.</li>
                  <li>We are not responsible for the content of any advertisements displayed on the Service.</li>
                  <li>Your interactions with advertisers are solely between you and the advertiser, subject to the advertiser&apos;s own terms and privacy policies.</li>
                  <li>For more information about ad personalization, see our <Link href="/privacy-policy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link>.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Intellectual Property</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>The site design, branding, logo, and original content are owned by If Only I Sent This.</li>
                  <li>You may not reproduce, distribute, or create derivative works from our content without permission.</li>
                  <li>User-submitted memories remain the property of their respective authors.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Limitation of Liability</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>We are not liable for any user-submitted content or its accuracy.</li>
                  <li>We are not responsible for third-party links, services, or advertisement content.</li>
                  <li>To the fullest extent permitted by law, our total liability is limited.</li>
                  <li>We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</li>
                </ul>
              </div>
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Changes to These Terms</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated date.</li>
                  <li>Continued use of the Service after changes constitutes acceptance of the revised Terms.</li>
                  <li>We encourage you to review this page periodically.</li>
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
