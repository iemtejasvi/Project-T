"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--text)] p-8">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="opacity-70 mb-6">An unexpected error occurred. Please try again.</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[var(--text)] text-[var(--background)] font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
