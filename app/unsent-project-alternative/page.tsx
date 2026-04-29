import Link from "next/link";
import Footer from "@/components/Footer";
import MoreOptionsDropdown from "@/components/MoreOptionsDropdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Best Unsent Project Alternative .  Free, Fast & Anonymous",
  description: "Looking for an Unsent Project alternative? If Only I Sent This is a modern, free archive for unsent letters, anonymous confessions, and messages you never sent. No glitches, no waiting .  write and share instantly.",
  alternates: {
    canonical: '/unsent-project-alternative',
  },
  openGraph: {
    title: "The Best Unsent Project Alternative .  If Only I Sent This",
    description: "A modern, free archive for unsent letters and anonymous confessions. Faster, cleaner, and always online. The best alternative to The Unsent Project.",
    url: 'https://www.ifonlyisentthis.com/unsent-project-alternative',
    siteName: 'If Only I Sent This',
    type: 'article',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This .  Unsent Project Alternative' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Best Unsent Project Alternative .  If Only I Sent This",
    description: "A modern, free archive for unsent letters and anonymous confessions. Faster, cleaner, and always online.",
    images: ['/opengraph-image.png'],
  },
};

export default function UnsentProjectAlternative() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text)] desktop-heading">
            The Best Unsent Project Alternative
          </h1>
          <p className="mt-2 text-[var(--text)] opacity-70 text-base sm:text-lg">
            A modern sanctuary for unsent letters, confessions, and messages never sent.
          </p>
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
          <div className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)] lg:shadow-sm lg:border-transparent editorial-prose text-[var(--text)]">

            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Why People Look for Alternatives</h2>
            <p className="text-base sm:text-lg">
              The Unsent Project popularised the idea of anonymous, colour-coded messages to first loves.
              Millions of people used it to say the things they couldn&apos;t say in person. But if you&apos;ve
              tried submitting recently, you may have noticed long wait times, site outages, or limitations
              in what you can write. Many users search for &ldquo;sites like The Unsent Project&rdquo; or
              &ldquo;Unsent Project alternative&rdquo; because they want the same emotional release ,
              but with a smoother, more reliable experience.
            </p>
            <p className="text-base sm:text-lg mt-4">
              That&apos;s exactly why <strong>If Only I Sent This</strong> exists.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-10 mb-4">What Makes If Only I Sent This Different</h2>

            <div className="grid gap-6 sm:grid-cols-2 mt-6">
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                <h3 className="font-semibold text-lg mb-2">✍️ Write to Anyone</h3>
                <p className="text-sm opacity-80">
                  Not just first loves. Write to an ex, a parent, a friend you lost, a pet,
                  a version of yourself, or someone who passed away. No restrictions on who
                  your letter is for.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                <h3 className="font-semibold text-lg mb-2">⚡ Instant &amp; Reliable</h3>
                <p className="text-sm opacity-80">
                  No waiting weeks for your message to appear. Every submission is reviewed
                  within hours and goes live the same day. The site is always online ,
                  no downtime, no glitches.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                <h3 className="font-semibold text-lg mb-2">🎨 Full Customisation</h3>
                <p className="text-sm opacity-80">
                  Choose your card colour, add animations, enable typewriter mode, or use
                  a handwritten font. Make your letter feel the way you feel , not
                  just a block of text on a coloured background.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                <h3 className="font-semibold text-lg mb-2">💣 Self-Destructing Messages</h3>
                <p className="text-sm opacity-80">
                  Set your letter to self-destruct after a time period, or schedule it as
                  a time capsule that reveals itself in the future. Features no other
                  unsent message platform offers.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                <h3 className="font-semibold text-lg mb-2">🔍 Search by Name</h3>
                <p className="text-sm opacity-80">
                  Browse the archive by recipient name. Search for someone and see every
                  anonymous letter ever written to them , a living, searchable record
                  of unspoken words.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                <h3 className="font-semibold text-lg mb-2">🔒 Truly Anonymous</h3>
                <p className="text-sm opacity-80">
                  No accounts. No emails. No tracking. Your identity is never stored or
                  linked to your letter. Write with complete freedom and zero judgement.
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold mt-10 mb-4">Side-by-Side Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-3 px-4 font-semibold">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold">If Only I Sent This</th>
                    <th className="text-center py-3 px-4 font-semibold opacity-60">The Unsent Project</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Write to anyone (not just first loves)", "✅", "❌"],
                    ["Self-destructing messages", "✅", "❌"],
                    ["Time capsule / delayed reveal", "✅", "❌"],
                    ["Custom colours & animations", "✅", "Limited"],
                    ["Night-only messages", "✅", "❌"],
                    ["Search by recipient name", "✅", "✅"],
                    ["Submissions reviewed same day", "✅", "Varies"],
                    ["Always online (99.9% uptime)", "✅", "Varies"],
                    ["No account required", "✅", "✅"],
                    ["Completely free", "✅", "✅"],
                  ].map(([feature, us, them], i) => (
                    <tr key={i} className="border-b border-[var(--border)]/30">
                      <td className="py-3 px-4">{feature}</td>
                      <td className="py-3 px-4 text-center font-medium">{us}</td>
                      <td className="py-3 px-4 text-center opacity-60">{them}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold mt-10 mb-4">More Than a Message Board</h2>
            <p className="text-base sm:text-lg">
              If Only I Sent This isn&apos;t just an alternative , it&apos;s a different philosophy.
              We believe unsent letters aren&apos;t just for first loves. They&apos;re for the apology you
              never gave, the goodbye you never got to say, the grief you&apos;re still carrying, the
              friendship that ended without closure, and the words you whisper to someone who&apos;s
              no longer here.
            </p>
            <p className="text-base sm:text-lg mt-4">
              Our{" "}
              <Link href="/journal" className="text-[var(--accent)] hover:underline">journal</Link>{" "}
              explores the psychology and healing power of expressive writing. Our{" "}
              <Link href="/memories" className="text-[var(--accent)] hover:underline">archive</Link>{" "}
              holds thousands of real, anonymous letters. And our{" "}
              <Link href="/submit" className="text-[var(--accent)] hover:underline">submission form</Link>{" "}
              lets you write yours in under a minute , no sign-up, no friction, no judgement.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/submit"
                className="px-6 py-3 rounded-lg bg-[var(--accent)] text-white text-sm hover:opacity-90 transition-opacity"
              >
                Write Your Letter Now
              </Link>
              <Link
                href="/memories"
                className="px-6 py-3 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors"
              >
                Browse the Archive
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
