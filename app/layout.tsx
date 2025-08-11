import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'dorayaki',
  description: 'personal blog of a terrible engineer',
  authors: [{ name: 'Flavio Miyamoto' }],
  keywords: ['blog', 'programming', 'software engineering', 'embedded systems', 'technology'],
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
        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full sm:max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  )
}
