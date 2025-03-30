import "./globals.css";
import ThemeSwitcher from "@/components/ThemeSwitcher";

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
      <body>
        <ThemeSwitcher />
        {children}
      </body>
    </html>
  );
}
