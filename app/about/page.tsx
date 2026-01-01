import TerminalWindow from '@/components/TerminalWindow'
import CommandPrompt from '@/components/CommandPrompt'
import BackNavigation from '@/components/BackNavigation'
import type { Metadata } from 'next'
import { absoluteUrl, withTrailingSlash } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'About - dorayaki',
  description: 'About Flavio Miyamoto - Software Development Engineer II at Amazon',
  alternates: {
    canonical: withTrailingSlash('/about'),
  },
  openGraph: {
    title: 'About - dorayaki',
    description: 'About Flavio Miyamoto - Software Development Engineer II at Amazon',
    url: absoluteUrl(withTrailingSlash('/about')),
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About - dorayaki',
    description: 'About Flavio Miyamoto - Software Development Engineer II at Amazon',
  },
}

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <BackNavigation />
      </div>

      <TerminalWindow title="about.md">
        <CommandPrompt
          command="cat about.md"
          showCursor={false}
          contentClassName="space-y-6 text-sm leading-relaxed sm:text-base"
        >
          <section className="space-y-3 text-app-soft">
            <h1 className="text-2xl font-semibold text-app-foreground sm:text-3xl">
              About me
            </h1>
            <p>Howdy!</p>
            <p>
              I'm a Software Engineer currently working at Amazon in Tokyo, Japan.
            </p>
            <p>
              My passion is building software to deliver value while learning and exploring technologies.
            </p>
          </section>

          <section className="space-y-3 text-app-soft">
            <h2 className="text-xs uppercase tracking-[0.35em] text-app-muted">
              Career highlights
            </h2>
            <ul className="space-y-2">
              <li>• Developed the financial tracking for launching Amazon Furusato in Japan.</li>
              <li>• Delivered a novel configuration delivery system for a global Edge Computing platform.</li>
            </ul>
          </section>

          <section className="space-y-3 text-app-soft">
            <h2 className="text-xs uppercase tracking-[0.35em] text-app-muted">
              Curious about
            </h2>
            <p>
              Cloud infrastructure, operating systems, networking, embedded systems, compilers and language learning.
            </p>
          </section>
        </CommandPrompt>
      </TerminalWindow>
    </div>
  )
}
