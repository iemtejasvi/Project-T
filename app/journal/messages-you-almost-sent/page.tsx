import Link from "next/link";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import MoreOptionsDropdown from "@/components/MoreOptionsDropdown";

export const metadata: Metadata = {
  title: "The Messages You Almost Sent .  On Drafts, Deleted Texts, and 3 AM Confessions You Erased",
  description: "Everyone has a message they typed and never sent. The draft sitting in your notes app. The text you deleted at 3am. Why almost-sent messages haunt us .  and how to finally release them.",
  alternates: { canonical: '/journal/messages-you-almost-sent' },
  openGraph: {
    title: "The Messages You Almost Sent",
    description: "Everyone has a message they typed and never sent. Why almost-sent messages haunt us .  and how to finally release them.",
    url: 'https://www.ifonlyisentthis.com/journal/messages-you-almost-sent',
    siteName: 'If Only I Sent This', type: 'article',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
};

export default function MessagesYouAlmostSent() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">The Messages You Almost Sent</h1>
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

            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">The Graveyard in Your Drafts Folder</h2>
            <p className="text-base sm:text-lg">
              You have written messages you will never send. Everyone has. They live in the notes app on your phone,
              in the drafts folder of your email, in the text field you cleared at 3 in the morning before locking
              the screen and staring at the ceiling. Some of them are two words long. Some of them are paragraphs
              you revised four times before deleting every single character. They are the most honest things you have
              ever written, and nobody will ever read them.
            </p>
            <p className="text-base sm:text-lg">
              An unsent letter is deliberate. You sit down, you write, you choose not to send. But an almost-sent
              message is something else entirely. It is impulsive and desperate and raw. It is the thing you wrote
              while crying, while drunk, while lying in bed unable to sleep because you could not stop replaying
              a conversation that happened six months ago. The almost-sent message is not composed. It is torn
              out of you. And then, at the last second, you pulled it back.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">The Backspace as Self-Preservation</h2>
            <p className="text-base sm:text-lg">
              There is a particular kind of courage in typing something real. And there is a particular kind of
              pain in deleting it. The backspace key is not just an editing tool. For most of us, it is a
              survival mechanism. It is the split second where your brain catches up to your heart and says:
              <em> they will not respond the way you need them to. They will screenshot this. They will
              show someone. They will use it against you. They will not care. </em>
            </p>
            <p className="text-base sm:text-lg">
              So you delete it. Letter by letter, or all at once. You watch the words disappear and you feel
              something between relief and grief. Relief because you protected yourself. Grief because the
              thing you needed to say is now unsaid again, pushed back down into the place where it has been
              sitting for weeks or months or years. The message is gone but the feeling that produced it is
              still right there, unchanged, waiting for the next time you are alone at night with your phone
              in your hand.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">The 3 AM Text You Will Never Admit To</h2>
            <p className="text-base sm:text-lg">
              There is a specific hour when almost-sent messages are written. It is not during the day, when you
              are busy and distracted and performing the version of yourself that has moved on. It is at night.
              When the apartment is quiet and the performance is over and there is nothing between you and the
              truth of what you still feel. 3 AM is when people type <em>I miss you</em> into a text field
              addressed to someone who does not think about them anymore. 3 AM is when people write <em>I am
              sorry for everything</em> to someone who has already forgiven them or, worse, already forgotten them.
            </p>
            <p className="text-base sm:text-lg">
              These messages are not irrational. That is the thing no one says. They are not just the product
              of exhaustion or loneliness or bad judgment. They are the product of honesty , the raw,
              unfiltered kind that only emerges when you are too tired to lie to yourself. The 3 AM message is
              often the truest thing you will ever write about how you feel. It is also the one you are most
              likely to destroy before morning.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">The Messages We Almost Send to the Living</h2>
            <p className="text-base sm:text-lg">
              Not all almost-sent messages are about romance. Some are addressed to a parent you have not
              spoken to in years. The text that says <em>I do not hate you, I just do not know how to
              talk to you anymore.</em> Some are addressed to a friend who slowly disappeared. <em>I noticed
              when you stopped calling. I just did not know how to say it without sounding desperate.</em> Some
              are addressed to someone who hurt you and never acknowledged it. <em>You know what you did.
              I need you to know that I know it too.</em>
            </p>
            <p className="text-base sm:text-lg">
              These messages are not dramatic. They are ordinary. They are the kind of thing millions of people
              type into their phones every day and then erase because the risk of vulnerability feels greater
              than the pain of silence. We live in an age of constant communication where the most important
              things remain unsaid, not because we lack the words, but because we are terrified of what
              happens after we press send.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Why Deleted Messages Stay With Us</h2>
            <p className="text-base sm:text-lg">
              A message you send gets a response. Even if the response is silence, the act of sending
              creates a before and after. Something happened. You know where you stand. But a message
              you delete exists in a permanent state of suspension. Nothing happened. You said nothing.
              And because you said nothing, the imagined version of what <em>could</em> have happened plays on
              a loop in your head , the conversation that might have followed, the reconciliation that
              might have started, the truth that might have finally been out in the open.
            </p>
            <p className="text-base sm:text-lg">
              Psychologists call this counterfactual thinking: the brain&apos;s tendency to simulate alternate
              outcomes for decisions that were never made. Deleted messages are a perfect engine for this.
              Every unsent text becomes a fork in the road you did not take, and your mind walks down
              that road over and over, imagining what would have been different. That is why a message
              you deleted in February can still wake you up in October. It is not the words. It is
              the possibility you erased along with them.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Putting the Words Somewhere Real</h2>
            <p className="text-base sm:text-lg">
              The almost-sent message fails because it has only two options: send or delete. Vulnerability or
              nothing. But there is a third option. You can write the thing you need to say and put it
              somewhere that is neither their inbox nor your trash folder. You can give the words a place
              to exist without requiring anything from the person they are about.
            </p>
            <p className="text-base sm:text-lg">
              That is what platforms like <Link href="/" className="text-[var(--accent)] hover:underline">If Only I Sent This</Link> are
              built for. Not the composed, deliberate letter. The messy one. The one you wrote at 3 AM that
              you were too afraid to send and too honest to forget. The message does not need to reach
              the person it was written for in order to release you from carrying it. It needs to exist
              somewhere outside your own head. It needs to be <Link href="/submit" className="text-[var(--accent)] hover:underline">written
              down and let go</Link>.
            </p>
            <p className="text-base sm:text-lg">
              You do not need their permission to say what you feel. You never did. The backspace key
              told you otherwise, but it was wrong. The words were real. They mattered. And they still
              do , even if the only person who ever reads them is a stranger at 3 AM who typed
              something similar and deleted it too.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/submit" className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm hover:opacity-90 transition-opacity">
                Write Your Unsent Message
              </Link>
              <Link href="/journal" className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors">
                Browse the Journal
              </Link>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
