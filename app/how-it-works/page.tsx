import Link from "next/link";
import Footer from "@/components/Footer";
import MoreOptionsDropdown from "@/components/MoreOptionsDropdown";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] desktop-heading">How It Works</h1>
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
          <article className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)] lg:shadow-sm lg:border-transparent editorial-prose text-[var(--text)]">

            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Write Your Unsent Letter</h2>
            <p className="text-base sm:text-lg">
              You arrive. You write. You choose a color, an effect, a mood. Then you send it , not
              to the person, but into the archive. No account required, no email, no identity. Just the
              words you never said, given a place to exist. Your anonymous confession or unsent letter
              joins thousands of others in a quiet, curated collection.
            </p>
            <p className="text-base sm:text-lg">
              <Link href="/submit" className="text-[var(--accent)] hover:underline">Start writing</Link> ,
              it takes less than a minute.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">What Happens Next</h2>
            <p className="text-base sm:text-lg">
              Every message is reviewed with care , not by an algorithm, but by a person. We read
              each submission to keep the archive safe, meaningful, and respectful. Approved messages
              enter the{" "}
              <Link href="/memories" className="text-[var(--accent)] hover:underline">archive</Link>,
              where they can be discovered by name, browsed like pages in a book of confessions,
              or found by someone who needed to read exactly those words.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Features</h2>
            <ul className="list-disc list-inside space-y-2.5 text-base sm:text-lg">
              <li>
                <strong>Self-destructing messages</strong> , set your words to disappear
                after a week, three months, six months, or a year.
              </li>
              <li>
                <strong>Time capsules</strong> , schedule your letter to appear in the future.
                Write to your future self, or to someone on a date that matters.
              </li>
              <li>
                <strong>40+ color themes</strong> , choose the emotional tone of your card,
                from quiet neutrals to deep blues to warm ambers.
              </li>
              <li>
                <strong>Text effects</strong> , handwritten, rough paper, or cursive styling
                to give your words a physical texture.
              </li>
              <li>
                <strong>Name search</strong> , every name has its own page of unsent messages.
                Search for yours, or for someone else&apos;s.
              </li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4 text-base sm:text-lg">
              <div>
                <p className="font-semibold">Is If Only I Sent This really free?</p>
                <p className="opacity-80">Yes, completely free. No account, no subscription, no hidden fees.</p>
              </div>
              <div>
                <p className="font-semibold">How long does moderation take?</p>
                <p className="opacity-80">Most messages are reviewed and approved within hours.</p>
              </div>
              <div>
                <p className="font-semibold">Is my letter really anonymous?</p>
                <p className="opacity-80">We don&apos;t require an account, email, or any identifying information. Your words are yours alone.</p>
              </div>
              <div>
                <p className="font-semibold">Can I search for messages about me?</p>
                <p className="opacity-80">
                  Yes , visit{" "}
                  <Link href="/memories" className="text-[var(--accent)] hover:underline">/memories</Link>{" "}
                  and search by name, or go directly to /name/yourname.
                </p>
              </div>
              <div>
                <p className="font-semibold">What are self-destructing messages?</p>
                <p className="opacity-80">You can set your message to automatically disappear after 1 week, 3 months, 6 months, or 1 year.</p>
              </div>
              <div>
                <p className="font-semibold">Is this site like The Unsent Project?</p>
                <p className="opacity-80">Similar concept, better execution. Faster moderation, reliable search, self-destructing messages, time capsules, and a more beautiful reading experience.</p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/submit" className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm hover:opacity-90 transition-opacity">
                Write Your Letter
              </Link>
              <Link href="/memories" className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors">
                Browse the Archive
              </Link>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
