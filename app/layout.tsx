// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "If Only I Sent This",
  description: "A modern archive for unsent memories and heartfelt messages.",
  icons: {
    icon: "data:,", // blank favicon
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
