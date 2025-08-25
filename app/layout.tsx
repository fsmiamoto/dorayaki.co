import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'dorayaki',
  description: 'personal blog of a terrible engineer',
  authors: [{ name: 'Flavio Miyamoto' }],
  keywords: ['blog', 'programming', 'software engineering', 'embedded systems', 'technology'],
  icons: {
    icon: [
      { url: '/favicon_16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_32.png', sizes: '32x32', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'dorayaki',
    description: 'personal blog of a terrible engineer',
    url: 'https://dorayaki.co',
    siteName: 'dorayaki',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'dorayaki',
    description: 'personal blog of a terrible engineer',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-terminal-window-bg text-terminal-text px-4 py-2 rounded border border-terminal-window-border z-50"
        >
          Skip to main content
        </a>
        <main id="main-content" className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full sm:max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  )
}
