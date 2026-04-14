import Link from "next/link";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Art of Unsent Letters – Words We Never Said",
  description: "From Kafka's letters to Felice to the text you deleted at 2am — unsent letters are humanity's most honest form of expression. Write yours anonymously.",
  alternates: {
    canonical: '/unsent-letters',
  },
  openGraph: {
    title: "The Art of Unsent Letters – Words We Never Said",
    description: "From Kafka's letters to Felice to the text you deleted at 2am — unsent letters are humanity's most honest form of expression. Write yours anonymously.",
    url: 'https://www.ifonlyisentthis.com/unsent-letters',
    siteName: 'If Only I Sent This',
    type: 'article',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Art of Unsent Letters – Words We Never Said",
    description: "From Kafka's letters to Felice to the text you deleted at 2am — unsent letters are humanity's most honest form of expression. Write yours anonymously.",
    images: ['/opengraph-image.png'],
  },
};

export default function UnsentLetters() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Unsent Letters</h1>
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
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)] lg:shadow-sm lg:border-transparent editorial-prose text-[var(--text)]">

            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">The Art of Unsent Letters</h2>
            <p className="text-base sm:text-lg">
              Unsent letters are one of humanity&apos;s oldest forms of emotional expression &mdash; language
              composed not for delivery, but for release. Franz Kafka wrote hundreds of agonized pages to
              Felice Bauer, letters more honest and unguarded than anything in his published fiction. He
              revised them, withheld them, sent some and retracted others &mdash; the act of writing was
              itself the point. Emily Dickinson assembled her fascicles in private, stitching poems into
              booklets addressed to no audience, intended for no reader. Beethoven&apos;s letter to the
              &ldquo;Immortal Beloved&rdquo; &mdash; perhaps the most famous unsent letter in history &mdash;
              was addressed to someone whose identity remains a mystery two centuries later. These were not
              failures to communicate. They were acts of courage: the courage to feel something fully, even
              when there was no one to receive it.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Words We Never Said</h2>
            <blockquote className="border-l-4 border-[var(--accent)] pl-4 my-6 italic text-base sm:text-lg opacity-85">
              &ldquo;Words are a pretext. It is the inner bond that draws one person to another, not words.&rdquo;
              <span className="block mt-1 text-sm not-italic opacity-70">&mdash; Rumi</span>
            </blockquote>
            <p className="text-base sm:text-lg">
              The unsent letter did not disappear with the postal age &mdash; it migrated. It lives now in
              the text you typed and deleted at 2am, in the voicemail you recorded and erased before it
              could be heard, in the letter still folded inside a desk drawer, yellowing at the creases.
              Pablo Neruda wrote love poems to unnamed recipients &mdash; publicly private, intimate yet
              universal. The unsent letter is a paradox: deeply personal, yet understood by everyone who
              has ever held words back. Everyone carries language they never released &mdash; words meant
              for a parent, a friend, a lover, a version of themselves that no longer exists. The weight
              of the unsaid is one of the few experiences that requires no translation.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">A Modern Archive</h2>
            <p className="text-base sm:text-lg">
              If Only I Sent This is the digital extension of this ancient tradition. It is not social
              media. It is not a diary app. It is an archive &mdash; quiet, anonymous, and permanent (or
              impermanent, if you choose{" "}
              <Link href="/how-it-works" className="text-[var(--accent)] hover:underline">self-destructing messages</Link>).
              Your unsent letter joins thousands of others, forming a collective record of everything we
              held back. You can{" "}
              <Link href="/submit" className="text-[var(--accent)] hover:underline">write yours</Link>,{" "}
              <Link href="/memories" className="text-[var(--accent)] hover:underline">browse the archive</Link>,
              or read more about{" "}
              <Link href="/about" className="text-[var(--accent)] hover:underline">our purpose</Link>.
              No account required. No identity attached. Just the words, and the quiet act of finally
              letting them exist somewhere.
            </p>

            <p className="text-center mt-10 text-base sm:text-lg italic text-[var(--text)]">
              Write the words you never sent.
            </p>
            <div className="text-center mt-4">
              <Link
                href="/submit"
                className="inline-block bg-[var(--accent)] text-white rounded-lg px-6 py-3 hover:opacity-90 transition-opacity"
              >
                Begin
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
