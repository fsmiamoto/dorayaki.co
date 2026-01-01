import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { SITE_ORIGIN } from "@/lib/seo";

export const metadata: Metadata = {
  title: "dorayaki",
  description: "personal blog of a terrible engineer",
  metadataBase: new URL(SITE_ORIGIN),
  authors: [{ name: "Flavio Miyamoto" }],
  keywords: ["blog", "programming", "software engineering", "embedded systems", "technology"],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon_16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_32.png", sizes: "32x32", type: "image/png" },
    ],
  },
  openGraph: {
    title: "dorayaki",
    description: "personal blog of a terrible engineer",
    siteName: "dorayaki",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "dorayaki",
    description: "personal blog of a terrible engineer",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body className="min-h-screen">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only z-50 rounded border border-terminal-window-border bg-terminal-window-bg px-4 py-2 text-terminal-text focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
          >
            Skip to main content
          </a>
          <main
            id="main-content"
            className="container mx-auto max-w-full px-2 py-4 sm:max-w-4xl sm:px-4 sm:py-8"
          >
            {children}
          </main>
          <div className="fixed bottom-4 right-4 z-50">
            <ThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
