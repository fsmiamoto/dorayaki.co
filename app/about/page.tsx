import TerminalWindow from '@/components/TerminalWindow'
import CommandPrompt from '@/components/CommandPrompt'
import Link from 'next/link'

export const metadata = {
  title: 'About - dorayaki',
  description: 'About Flavio Miyamoto - Software Development Engineer II at Amazon',
}

export default function AboutPage() {
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

      <TerminalWindow title="about.md">
        <CommandPrompt command="cat about.md" showCursor={false}>
          <div className="space-y-4 max-w-none">
            <h1 className="text-2xl font-bold text-terminal-prompt mb-4">
              About me
            </h1>
            
            <p>Howdy!</p>
            
            <p>I&apos;m currently working as a Software Development Engineer II at Amazon in Tokyo, Japan.</p>
            
            <p>In my (not so long yet) career, I&apos;ve worked on a variety of projects, including:</p>
            
            <ul className="list-none space-y-2">
              <li className="flex items-start">
                <span className="text-terminal-prompt mr-2">▸</span>
                <span>Developing an app for COVID-19 vaccinations</span>
              </li>
              <li className="flex items-start">
                <span className="text-terminal-prompt mr-2">▸</span>
                <span>Improving how an edge computing provider distributes configurations across hundreds of servers</span>
              </li>
              <li className="flex items-start">
                <span className="text-terminal-prompt mr-2">▸</span>
                <span>Helping to launch Amazon Furusato in Japan</span>
              </li>
            </ul>
            
            <p>My academic background is in Electronics Engineering, so I also enjoy playing around with hardware.</p>
            
            <p>I&apos;m interested in various technical topics such as Cloud Computing, Operating Systems, Networking, and Systems Programming.</p>
            
            <p>Learning how things work under the hood is always fascinating to me.</p>
            
            <p>I love experimenting with technologies, both old and new, and you can find most of my projects on my GitHub profile.</p>
            
            <p>My hobbies include learning new languages and skills, as well as traveling around!</p>
            
            <div className="mt-8 pt-4 border-t border-terminal-window-border">
              <div className="flex gap-4 text-sm">
                <a 
                  href="https://github.com/fsmiamoto" 
                  className="text-terminal-amber hover:text-terminal-text transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  [github]
                </a>
                <a 
                  href="https://www.linkedin.com/in/fsmiamoto/" 
                  className="text-terminal-amber hover:text-terminal-text transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  [linkedin]
                </a>
              </div>
            </div>
          </div>
        </CommandPrompt>
      </TerminalWindow>
    </div>
  )
}