import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/Footer";

export default function Donate() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Support Us</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li>
                <Link href="/" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/submit" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">
                  Confess
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap desktop-nav-link">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 py-8">
        <section className="bg-[var(--card-bg)] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Support Our Mission</h2>
          <p className="text-[var(--text)] text-lg mb-6">
            Your donations help us maintain the platform and continue providing a safe space for unsent memories. Every contribution, big or small, makes a difference.
          </p>

          <div className="bg-[var(--background)] p-6 rounded-lg mt-6 flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold text-[var(--text)] mb-4">Support via Buy Me a Coffee</h3>
            <p className="text-[var(--text)] text-base mb-4">
              Prefer using Buy Me a Coffee? Use the link or scan the QR below.
            </p>
            <Link
              href="https://buymeacoffee.com/ifonlyisentthis"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="px-4 py-2 bg-[var(--accent)] text-[var(--text)] rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto text-center underline"
            >
              Support Us on Buy Me a Coffee
            </Link>
            <Image
              src="/qr-code.png"
              width={256}
              height={256}
              alt="Buy Me a Coffee QR code for If Only I Sent This"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain mt-6"
              priority
            />
          </div>

          <p className="text-[var(--text)] text-lg mt-8">
            Thank you for your support!
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
