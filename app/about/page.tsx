import Link from "next/link";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About – A Sanctuary for Unsent Letters",
  description: "If Only I Sent This is a free, anonymous archive for unsent letters, love letters never sent, and words you never said. Write what you held back — to a person, a pet, or a moment.",
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: "About – If Only I Sent This",
    description: "A free, anonymous archive for unsent letters, love letters never sent, and words you never said.",
    url: 'https://www.ifonlyisentthis.com/about',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "About – If Only I Sent This",
    description: "A free, anonymous archive for unsent letters, love letters never sent, and words you never said.",
    images: ['/opengraph-image.png'],
  },
};

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">About</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li><Link href="/" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Home</Link></li>
              <li><Link href="/memories" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Archive</Link></li>
              <li><Link href="/submit" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Confess</Link></li>
              <li><Link href="/how-it-works" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap desktop-nav-link">How It Works</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)] editorial-prose text-[var(--text)]">

            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">A Place for the Words You Kept</h2>
            <p className="text-base sm:text-lg">
              If Only I Sent This is an anonymous archive for unsent letters &mdash; the words you wrote
              but never delivered, the confessions you held back, the things you needed to say to someone
              who may never hear them. We built this space for letters to people, to pets, to moments that
              have passed but still live with you. Here, your unspoken words have a home: quiet, anonymous,
              and free from judgment.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Why Unsent Letters Matter</h2>
            <p className="text-base sm:text-lg">
              The unsent letter is one of humanity&apos;s oldest forms of emotional expression. Kafka wrote
              hundreds of pages to Felice Bauer that he agonized over and never fully sent &mdash; more
              honest than anything he published. Frida Kahlo poured raw love and contradiction into letters
              to Diego Rivera. Beethoven addressed his most vulnerable words to an &ldquo;Immortal
              Beloved&rdquo; whose identity remains unknown. These were not failures to communicate.
              They were a different kind of truth &mdash; the kind that exists only when no one is
              expected to respond.
            </p>
            <p className="text-base sm:text-lg">
              Today, the unsent letter lives in drafts you deleted at 2am, in voicemails you recorded
              and erased, in the things you typed and couldn&apos;t send. If Only I Sent This is the
              modern continuation of that tradition: a place where love letters never sent, apologies
              left unspoken, and words you never said can finally exist somewhere outside of you.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">What We Value</h2>
            <ul className="list-disc list-inside space-y-2.5 text-base sm:text-lg mb-2">
              <li>
                <strong>Anonymity and safety</strong> &mdash; no accounts, no tracking, no identity.
                Just your words.
              </li>
              <li>
                <strong>Thoughtful curation</strong> &mdash; every message is{" "}
                <Link href="/how-it-works" className="text-[var(--accent)] hover:underline">reviewed with care</Link>{" "}
                before it enters the archive.
              </li>
              <li>
                <strong>Minimalism</strong> &mdash;{" "}
                <Link href="/submit" className="text-[var(--accent)] hover:underline">distraction-free writing</Link>{" "}
                that puts your words first.
              </li>
              <li>
                <strong>Permanence and impermanence</strong> &mdash; choose self-destructing messages
                or let your words remain in the{" "}
                <Link href="/memories" className="text-[var(--accent)] hover:underline">archive</Link>{" "}
                indefinitely.
              </li>
            </ul>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/submit" className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm hover:opacity-90 transition-opacity">
                Write Your Letter
              </Link>
              <Link href="/memories" className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors">
                Browse the Archive
              </Link>
              <Link href="/contact" className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors">
                Contact
              </Link>
              <Link href="/donate" className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors">
                Support Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
