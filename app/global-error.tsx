"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ backgroundColor: '#1a1a1a', color: '#e8e0d0', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '480px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong</h1>
            <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>An unexpected error occurred. Please try again.</p>
            <button
              onClick={() => reset()}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#e8e0d0', color: '#1a1a1a', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
