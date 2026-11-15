import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import TerminalNav from "@/components/TerminalNav";
import StatusBar from "@/components/StatusBar";
import localFont from "next/font/local";
import { SITE_ORIGIN } from "@/lib/seo";

const jetbrainsMono = localFont({
  src: [
    { path: "./fonts/JetBrainsMono-Variable.woff2", style: "normal", weight: "100 800" },
    { path: "./fonts/JetBrainsMono-Italic-Variable.woff2", style: "italic", weight: "100 800" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "dorayaki",
  description: "Software engineer writing about systems, AI agents, and engineering culture",
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
    description: "Software engineer writing about systems, AI agents, and engineering culture",
    siteName: "dorayaki",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "dorayaki",
    description: "Software engineer writing about systems, AI agents, and engineering culture",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={jetbrainsMono.variable}>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only z-50 rounded border border-app-border bg-app-surface px-4 py-2 text-app-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
          >
            Skip to main content
          </a>
          <TerminalNav />
          <main
            id="main-content"
            className="mx-auto w-full max-w-[900px] flex-1 px-4 pb-12 pt-7 sm:px-6 sm:pb-16 sm:pt-11"
          >
            {children}
          </main>
          <StatusBar year={new Date().getFullYear()} />
        </ThemeProvider>
      </body>
    </html>
  );
}
