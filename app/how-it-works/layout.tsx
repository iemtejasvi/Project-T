export { metadata } from './metadata';

const FAQ_STRUCTURED_DATA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is If Only I Sent This really free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free. No account, no subscription, no hidden fees." } },
    { "@type": "Question", name: "How long does moderation take?", acceptedAnswer: { "@type": "Answer", text: "Most messages are reviewed and approved within hours, not months." } },
    { "@type": "Question", name: "Can I search for messages about me?", acceptedAnswer: { "@type": "Answer", text: "Yes! Visit /name/yourname to see all anonymous messages written to that name." } },
    { "@type": "Question", name: "What are self-destructing messages?", acceptedAnswer: { "@type": "Answer", text: "You can set your message to automatically disappear after 1 week, 3 months, 6 months, or 1 year." } },
    { "@type": "Question", name: "Is this site like The Unsent Project?", acceptedAnswer: { "@type": "Answer", text: "Similar concept, better execution. Faster moderation, reliable search, self-destructing messages, time capsules, and a more beautiful reading experience." } },
    { "@type": "Question", name: "Can I write a message inspired by a song?", acceptedAnswer: { "@type": "Answer", text: "Absolutely. Many messages are inspired by heartbreak songs. Tag your message with the song or artist." } },
  ],
}).replace(/</g, '\\u003c');

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: FAQ_STRUCTURED_DATA }}
      />
      {children}
    </>
  );
}
