import TerminalWindow from '@/components/TerminalWindow'
import CommandPrompt from '@/components/CommandPrompt'
import Link from 'next/link'

export const metadata = {
  title: 'Reading List - dorayaki',
  description: 'Books I&apos;ve read and am currently reading',
}

export default function ReadingPage() {
  const currentBooks = [
    'Just Enough Software Architecture: A Risk-Driven Approach',
    'Crafting Interpreters',
    'Software Engineering at Google'
  ]

  const finishedBooks = [
    'Waltzing with Bears: Managing Risk on Software Projects',
    'The Order of Time',
    'Designing Data-Intensive Applications',
    'The Principles of Product Development Flow: Second Generation Lean Product Development',
    'Tidy First? A Personal Exercise in Empirical Software Design',
    'Team Topologies: Organizing Business and Technology Teams for Fast Flow',
    'Working Backwards: Insights, Stories, and Secrets from Inside Amazon',
    'Accelerate: The Science of Lean Software and DevOps',
    'Essentialism: The Disciplined Pursuit of Less',
    'The Psychology of Money',
    'The Annotated Turing',
    'Building Microservices: Designing Fine-Grained Systems',
    'The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography',
    'Linked: How Everything Is Connected to Everything Else',
    'Value Proposition Design: How to Create Products and Services Customers Want',
    'Fermat&apos;s Enigma: The Epic Quest to Solve the World&apos;s Greatest Mathematical Problem',
    'Grokking algorithms: An illustrated guide for programmers and other curious people',
    'Sapiens: A Brief History of Humankind',
    'Skin in the Game: Hidden Asymmetries in Daily Life',
    'Antifragile: Things That Gain from Disorder',
    'Nonviolent Communication: A Language of Life',
    'Unit Testing',
    'A Philosophy of Software Design',
    'AI Superpowers: China, Silicon Valley, And the New World Order',
    'Atomic Habits',
    'Barking Up the Wrong Tree',
    'Clean Architecture',
    'Clean Code',
    'Cloud Native DevOps with Kubernetes',
    'Deep Work: Rules for Focused Success in a Distracted World',
    'Unscripted: Life, liberty and the pursuit of entrepreneurship',
    'Grokking Algorithms',
    'Low-Level Programming: C, Assembly, and Program Execution on Intel® 64 Architecture',
    'Refactoring (2nd Edition)',
    'So Good They Can\'t Ignore You',
    'The Go Programming Language',
    'The Lean Startup',
    'The Pragmatic Programmer (2nd edition)'
  ]

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Link 
          href="/" 
          className="text-terminal-amber hover:text-terminal-text transition-colors text-sm"
        >
          ← cd ~/
        </Link>
      </div>

      <TerminalWindow title="reading.md">
        <CommandPrompt command="cat reading.md" showCursor={false}>
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-terminal-prompt mb-4">
              Reading List
            </h1>
            
            <div className="text-terminal-gray text-sm mb-6">
              *Last update at 2025-06-10*
            </div>
            
            <p className="mb-6">
              Below there&apos;s a non-exhaustive list some of the books I&apos;ve read or that I&apos;m currently reading 📚
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-terminal-prompt mb-3">
                  ### Current
                </h3>
                <ul className="space-y-2">
                  {currentBooks.map((book, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-terminal-prompt mr-2">▸</span>
                      <span>{book}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-terminal-prompt mb-3">
                  ### Finished ({finishedBooks.length} books)
                </h3>
                <ul className="space-y-2">
                  {finishedBooks.map((book, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-terminal-prompt mr-2">▸</span>
                      <span>{book}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CommandPrompt>
      </TerminalWindow>
    </div>
  )
}