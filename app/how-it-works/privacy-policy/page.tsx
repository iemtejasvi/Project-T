import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)]">Privacy Policy</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <Link href="/how-it-works" className="text-[var(--accent)] hover:underline">Back</Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow max-w-5xl mx-auto px-4 py-8">
        <p className="text-[var(--text)] text-lg">
          We value your privacy. The information you provide—including your IP address, location data, and device details—is collected solely for improving our service and ensuring a safe community. We do not share your information with third parties without your consent.
        </p>
      </main>
      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
