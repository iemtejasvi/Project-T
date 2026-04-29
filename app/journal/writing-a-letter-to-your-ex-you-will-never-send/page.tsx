import Link from "next/link";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import MoreOptionsDropdown from "@/components/MoreOptionsDropdown";

export const metadata: Metadata = {
  title: "Writing a Letter to Your Ex You Will Never Send, A Complete Guide",
  description: "Why writing an unsent letter to your ex after a breakup is one of the most powerful emotional exercises you can do. A practical, honest guide to writing it, what to include, and what to do with it when you are finished.",
  alternates: { canonical: '/journal/writing-a-letter-to-your-ex-you-will-never-send' },
  openGraph: {
    title: "Writing a Letter to Your Ex You Will Never Send",
    description: "Why writing an unsent letter to your ex after a breakup is one of the most powerful emotional exercises. A practical guide to writing it and finding closure.",
    url: 'https://www.ifonlyisentthis.com/journal/writing-a-letter-to-your-ex-you-will-never-send',
    siteName: 'If Only I Sent This', type: 'article',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'Writing a Letter to Your Ex' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Writing a Letter to Your Ex You Will Never Send",
    description: "Why writing an unsent letter to your ex after a breakup is one of the most powerful emotional exercises. A guide to writing it and finding closure.",
    images: ['/opengraph-image.png'],
  },
};

export default function LetterToYourEx() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Writing a Letter to Your Ex You Will Never Send</h1>
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

            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">You Are Not Over It. That Is Okay.</h2>
            <p className="text-base sm:text-lg">
              You told your friends you were fine. You archived the photos, deleted the playlist, and changed your lock screen. You went through the motions of moving on. But it is three in the morning and you are staring at a blank text message, typing and deleting the same sentence over and over. You know you should not send it. You know it will not change anything. But the words keep forming anyway, because there are things that never got said, and they have been sitting in your chest like stones for weeks, or months, or years.
            </p>
            <p className="text-base sm:text-lg">
              This is the moment where most people either send a regrettable text or swallow the feeling entirely. But there is a third option that therapists, psychologists, and grief counsellors have recommended for decades: write the letter. Write everything you want to say. Be completely honest. And then do not send it.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Why Writing Works Better Than Thinking</h2>
            <p className="text-base sm:text-lg">
              When you replay a breakup in your head, the same thoughts loop endlessly. You revisit the same conversations, the same arguments, the same moments of tenderness that make the loss feel unbearable. This is rumination, and decades of research have shown that it deepens depression, increases anxiety, and delays emotional recovery. The loop continues because the brain has not finished processing the experience. It keeps returning to the wound because the wound has not been integrated into a coherent story.
            </p>
            <p className="text-base sm:text-lg">
              Writing interrupts the loop. When you force yourself to put the thoughts into sentences, on paper or on a screen, your brain shifts from circular emotional processing to linear narrative construction. You have to choose where to begin. You have to decide which details matter and which ones do not. You impose a structure on something that felt, until that moment, completely chaotic. Neuroscience research by Dr. Matthew Lieberman at UCLA has shown that the simple act of labelling emotions in writing reduces activity in the amygdala, the part of the brain responsible for the fight or flight response. In other words, writing about what you feel literally calms the part of your brain that is keeping you in distress.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">What to Write</h2>
            <p className="text-base sm:text-lg">
              There are no rules. That is the entire point. An unsent letter to your ex is the one place where you do not have to perform, impress, or protect anyone&apos;s feelings, including your own. You do not have to be fair. You do not have to be rational. You do not even have to be coherent. The letter is a container for everything you have been holding, and its only purpose is to hold it so you no longer have to.
            </p>
            <p className="text-base sm:text-lg">
              That said, there are some approaches that tend to produce the deepest emotional relief. You might consider including some of the following.
            </p>
            <p className="text-base sm:text-lg">
              <strong>The things you never said during the relationship.</strong> Not the arguments you wish you had won, but the quiet truths. The moments where you felt something and swallowed it. The compliment you were too proud to give. The fear you were too embarrassed to admit. The I love you that you said in your head but never out loud because the timing never felt right.
            </p>
            <p className="text-base sm:text-lg">
              <strong>The questions you will never get answers to.</strong> Did you ever actually love me? Was there someone else? Did you know you were going to leave, or did it surprise you too? These questions are not meant to be answered. Writing them down is a way of acknowledging that some things will remain unknown, and that the not knowing is part of what makes this so hard.
            </p>
            <p className="text-base sm:text-lg">
              <strong>What you are grateful for.</strong> This is the part most people skip, and it is often the most healing. Even the worst relationships usually contain moments of genuine connection, laughter, growth, or comfort. Acknowledging what was good does not mean the breakup was wrong. It means you are capable of holding complexity, of recognising that something can have been real and still have needed to end.
            </p>
            <p className="text-base sm:text-lg">
              <strong>What you need to forgive, in them and in yourself.</strong> You may not be ready for this part yet, and that is completely fine. Forgiveness is not something you can force. But if the words come, let them. Forgiving does not mean what happened was acceptable. It means you are choosing to stop carrying the weight of it. Sometimes writing &ldquo;I forgive you for leaving&rdquo; or &ldquo;I forgive myself for staying too long&rdquo; is the first time you realise the forgiveness was already there, waiting for permission to surface.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Why You Should Not Send It</h2>
            <p className="text-base sm:text-lg">
              The temptation to send the letter is strong, especially when the writing goes well and the words feel true and necessary. But the purpose of this exercise is not communication. It is release. Sending the letter reintroduces all the variables that make direct communication so difficult after a breakup: the possibility of rejection, misinterpretation, an unsatisfying response, or worse, no response at all. Every one of those outcomes has the potential to set back your healing.
            </p>
            <p className="text-base sm:text-lg">
              The unsent letter works precisely because it removes the other person from the equation. You are not writing for them. You are writing for you. The audience is yourself, present and future. The value of the exercise comes from the act of putting the emotions into language, not from the act of delivering that language to someone else.
            </p>
            <p className="text-base sm:text-lg">
              If you feel the need for your words to exist somewhere outside of your own private notes, consider writing them anonymously. Platforms like <Link href="/" className="text-[var(--accent)] hover:underline">If Only I Sent This</Link> allow you to submit an unsent letter without any personal information attached. Your words enter an archive of thousands of similar letters from people going through the same thing. There is something quietly powerful about knowing your words exist in the world, not delivered to the person they were meant for, but standing alongside the words of every other person who has ever loved someone and lost them.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">What to Do With the Letter Afterward</h2>
            <p className="text-base sm:text-lg">
              Once you have written the letter, you have several options. None of them involve sending it. You can delete it, which can feel like a symbolic act of letting go. You can save it somewhere private and return to it in six months to see how your perspective has shifted. You can print it and physically destroy it, which some people find cathartic. You can write a new one next week, because healing is not a single event but a process, and the letter you write today will be different from the one you write after more time has passed.
            </p>
            <p className="text-base sm:text-lg">
              Or you can do what thousands of people do every day: <Link href="/submit" className="text-[var(--accent)] hover:underline">submit it anonymously</Link> to a public archive where it becomes part of a collective record of human emotional experience. Your letter joins a library of love, loss, regret, and hope. It is no longer just yours. It belongs to everyone who has ever felt what you are feeling right now.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">One More Thing</h2>
            <p className="text-base sm:text-lg">
              You might be reading this because you just went through a breakup last week. Or you might be reading this because someone left you five years ago and you still have not fully processed it. Both are valid. There is no expiration date on grief, and there is no statute of limitations on unsent words. If the feeling is still there, it deserves to be expressed. Not to them. To yourself. Through writing.
            </p>
            <p className="text-base sm:text-lg">
              The letter does not have to be long. It does not have to be well written. It does not have to make sense to anyone but you. It just has to be honest. That is enough. That has always been enough.
            </p>
            <p className="text-base sm:text-lg">
              If you are ready, <Link href="/submit" className="text-[var(--accent)] hover:underline">you can write your letter now</Link>. It is free, it is anonymous, and it takes less than a minute. Or you can <Link href="/memories" className="text-[var(--accent)] hover:underline">browse the archive</Link> and read what others have written. You are not alone in this. You never were.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/submit" className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm hover:opacity-90 transition-opacity">
                Write Your Letter
              </Link>
              <Link href="/memories" className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors">
                Browse the Archive
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
