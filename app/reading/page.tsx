import TerminalWindow from '@/components/TerminalWindow'
import CommandPrompt from '@/components/CommandPrompt'
import BackNavigation from '@/components/BackNavigation'
import type { Metadata } from 'next'
import { absoluteUrl, withTrailingSlash } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Reading List - dorayaki',
  description: 'My attempt to document what I\' reading',
  alternates: {
    canonical: withTrailingSlash('/reading'),
  },
  openGraph: {
    title: 'Reading List - dorayaki',
    description: 'My attempt to document what I\' reading',
    url: absoluteUrl(withTrailingSlash('/reading')),
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reading List - dorayaki',
    description: 'My attempt to document what I\' reading',
  },
}

const SECTIONS = [
  {
    title: 'Currently diving into',
    accent: 'text-app-accent',
    items: [
      'Build a Large Language Model (From Scratch)',
      'Building Applications with AI Agents',
      'SOFT SKILLS ソフトウェア開発者の人生マニュアル',
      'Generative AI Design Patterns',
    ],
  },
  {
    title: 'Recently finished',
    accent: 'text-app-amber',
    items: [
      'AI Engineering',
      'LangChainとLangGraphによるRAG・AIエージェント［実践］入門 エンジニア選書',
    ],
  },
]

const ARCHIVE = [
  'The Principles of Product Development Flow',
  '人が増えても速くならない ～変化を抱擁せよ～',
  'Waltzing with Bears: Managing Risk on Software Projects',
  'Designing Data-Intensive Applications',
  'Tidy First?',
  'コンサル時代に教わった 仕事ができる人の当たり前',
  'The Order of Time',
  'Working Backwards',
  'Accelerate',
  'Team Topologies',
  'The Culture Map',
  'Just Enough Software Architecture: A Risk-Driven Approach',
  'Crafting Interpreters',
  'Software Engineering at Google',
  'Essentialism',
  'The Psychology of Money',
  'The Annotated Turing',
  'Building Microservices',
  'The Code Book',
  'Linked',
  'Value Proposition Design',
  'Fermat\'s Enigma',
  'Grokking Algorithms',
  'Sapiens',
  'Skin in the Game',
  'Antifragile',
  'Nonviolent Communication',
  'Unit Testing',
  'A Philosophy of Software Design',
  'AI Superpowers',
  'Atomic Habits',
  'Barking Up the Wrong Tree',
  'Clean Architecture',
  'Clean Code',
  'Cloud Native DevOps with Kubernetes',
  'Deep Work',
  'Unscripted',
  'Low-Level Programming',
  'Refactoring (2nd Edition)',
  'So Good They Can\'t Ignore You',
  'The Go Programming Language',
  'The Lean Startup',
  'The Pragmatic Programmer (2nd edition)',
]

export default function ReadingPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <BackNavigation />
      </div>

      <TerminalWindow title="reading.md">
        <CommandPrompt
          command="cat reading.md"
          showCursor={false}
          contentClassName="space-y-8 text-sm leading-relaxed sm:text-base"
        >
          <header className="space-y-3">
            <h1 className="text-2xl font-semibold text-app-foreground sm:text-3xl">
              Reading List
            </h1>
            <p className="text-app-soft">
              A running log of the books that shape how I think about software, systems, and people.
              Suggestions are always welcome.
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-app-muted">
              Last update: 2025-12-30
            </p>
          </header>

          <div className="space-y-6">
            {SECTIONS.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className={`text-xs uppercase tracking-[0.35em] ${section.accent}`}>
                  {section.title}
                </h2>
                <ul className="grid gap-2 text-app-soft sm:grid-cols-2">
                  {section.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-[0.35em] text-app-info">
              Library archive ({ARCHIVE.length})
            </h2>
            <ul className="grid gap-2 text-app-soft sm:grid-cols-2 lg:grid-cols-3">
              {ARCHIVE.map((entry) => (
                <li key={entry}>• {entry}</li>
              ))}
            </ul>
          </section>
        </CommandPrompt>
      </TerminalWindow>
    </div>
  )
}
