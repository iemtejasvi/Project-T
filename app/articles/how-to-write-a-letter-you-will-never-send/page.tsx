import Link from "next/link";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Write a Letter You Will Never Send – A Reflective Guide",
  description: "A practical, thoughtful guide to writing unsent letters. Learn how to choose your recipient, find the right words, and release what you have been carrying.",
  alternates: { canonical: '/articles/how-to-write-a-letter-you-will-never-send' },
  openGraph: {
    title: "How to Write a Letter You Will Never Send",
    description: "A practical, thoughtful guide to writing unsent letters — from choosing your recipient to releasing what you have been carrying.",
    url: 'https://www.ifonlyisentthis.com/articles/how-to-write-a-letter-you-will-never-send',
    siteName: 'If Only I Sent This', type: 'article',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
};

export default function HowToWriteALetter() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">How to Write a Letter You Will Never Send</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li><Link href="/" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Home</Link></li>
              <li><Link href="/articles" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Articles</Link></li>
              <li><Link href="/submit" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Confess</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <article className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)] lg:shadow-sm lg:border-transparent editorial-prose text-[var(--text)]">

            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">The Practice of Writing Without Sending</h2>
            <p className="text-base sm:text-lg">
              There is no wrong way to write a letter you will never send. There is no grade, no audience, and no consequence.
              That is precisely what makes the practice so valuable — and so difficult. When we remove the social scaffolding
              that normally shapes our communication (politeness, strategy, self-presentation), we are left alone with what
              we actually feel. For many people, that confrontation is the hardest part.
            </p>
            <p className="text-base sm:text-lg">
              This guide is not a formula. It is a set of reflections drawn from therapeutic practice, literary tradition,
              and the experience of thousands of anonymous writers who have shared their unsent words through platforms
              like <Link href="/" className="text-[var(--accent)] hover:underline">If Only I Sent This</Link>. Use what
              resonates. Discard what does not. The only rule is honesty.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Step One: Choose Your Recipient</h2>
            <p className="text-base sm:text-lg">
              An unsent letter begins with a person — or a version of a person. This might be someone you loved and lost,
              a parent whose approval you still seek, a friend who betrayed you, a younger version of yourself, or even
              someone who has died. The recipient does not need to be alive, reachable, or even specific. Some of the most
              powerful unsent letters are addressed to &ldquo;the person who&rdquo; — the person who left, the person who
              stayed, the person who never noticed.
            </p>
            <p className="text-base sm:text-lg">
              What matters is that writing to this person activates a genuine emotional charge in you. If the thought of
              addressing them makes your chest tighten, makes you hesitate, or makes you feel a sudden rush of something
              you cannot easily name — that is the right recipient. The unsent letter works because it engages the emotions
              that ordinary communication suppresses.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Step Two: Write the First Line Without Thinking</h2>
            <p className="text-base sm:text-lg">
              The blank page is intimidating because your internal editor is already running. Before you have written a word,
              your brain is already anticipating how the letter might sound, whether it is coherent, whether it is &ldquo;too
              much.&rdquo; The most effective way to bypass this is to write the first sentence before you have decided what
              it will say.
            </p>
            <p className="text-base sm:text-lg">
              Start with whatever comes. &ldquo;I do not know how to start this.&rdquo; &ldquo;I have been thinking about
              you.&rdquo; &ldquo;I am angry and I do not know where to put it.&rdquo; The first line does not need to be
              beautiful. It needs to be true. Once you have that first sentence, the rest tends to follow — not because
              you have planned what to say, but because the emotional momentum of honesty is self-sustaining.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Step Three: Say the Thing You Have Been Avoiding</h2>
            <p className="text-base sm:text-lg">
              In almost every unsent letter, there is a sentence that the writer has been circling around — the thing they
              most need to say, and the thing they most fear saying. It might be &ldquo;I still love you.&rdquo; It might
              be &ldquo;I hate what you did to me.&rdquo; It might be &ldquo;I am afraid I am becoming you.&rdquo;
            </p>
            <p className="text-base sm:text-lg">
              The therapeutic literature on expressive writing is clear: the emotional benefit of writing is directly
              proportional to the depth of disclosure. Surface-level writing produces surface-level relief. If you find
              yourself writing around the core feeling, notice it. Take a breath. And then write the sentence you have
              been avoiding. That sentence is the reason you are writing the letter in the first place.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Step Four: Do Not Edit for Tone</h2>
            <p className="text-base sm:text-lg">
              The fastest way to kill the emotional authenticity of an unsent letter is to start editing it for how it
              sounds. The moment you revise a sentence to make it more eloquent, less angry, or more forgiving than you
              actually feel, you have shifted from emotional expression to performance. An unsent letter is not a performance.
              It is a document of your interior life at this exact moment.
            </p>
            <p className="text-base sm:text-lg">
              If your letter is messy, contradictory, grammatically imperfect, or swings between love and rage within
              the same paragraph — good. That is what real emotion looks like before it has been polished for public
              consumption. The psychologist Carl Rogers called this &ldquo;congruence&rdquo; — the alignment between
              what you feel and what you express. Unsent letters are among the few places where congruence is possible
              without social penalty.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Step Five: Decide What Happens Next</h2>
            <p className="text-base sm:text-lg">
              Once the letter is written, you have choices. You can keep it in a private notebook. You can tear it up.
              You can burn it — a ritualistic act that many therapists recommend for its symbolic power. You can read it
              aloud to an empty room. Or you can submit it anonymously to an archive
              like <Link href="/submit" className="text-[var(--accent)] hover:underline">If Only I Sent This</Link>,
              where it will be read with care, held in a public space, and perhaps discovered by someone who needed
              to know they were not alone.
            </p>
            <p className="text-base sm:text-lg">
              What you should not do is send it. The power of the unsent letter lies precisely in the fact that it was
              written for you. The recipient is secondary. The act of writing is primary. Your words do not need to
              arrive to matter. They already exist, and that is enough.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Why Unsent Letters Work</h2>
            <p className="text-base sm:text-lg">
              The unsent letter has persisted across centuries because it serves a fundamental human need: the need
              to be heard, even if only by ourselves. When you write an unsent letter, you are simultaneously the
              speaker and the listener, the confessor and the witness. That dual role is not a compromise — it is
              the entire point. You are telling yourself that what you feel is real, that it deserves language, and
              that it does not need anyone else&apos;s validation to exist.
            </p>
            <p className="text-base sm:text-lg">
              In a culture that often demands we process our emotions quickly, move on efficiently, and present
              a composed exterior, the unsent letter is a radical act of patience. It says: I am not done feeling
              this. I am not ready to let it go. But I am ready to look at it honestly. And that, in the end,
              is where healing begins.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/submit" className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm hover:opacity-90 transition-opacity">
                Write Your Letter
              </Link>
              <Link href="/articles" className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors">
                More Articles
              </Link>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
