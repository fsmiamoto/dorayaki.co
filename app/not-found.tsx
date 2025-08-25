import TerminalWindow from '@/components/TerminalWindow'
import CommandPrompt from '@/components/CommandPrompt'
import BackNavigation from '@/components/BackNavigation'

export default function NotFound() {
  return (
    <div className="space-y-6">
      <TerminalWindow title="404.md">
        <CommandPrompt command="cat 404.md" showCursor={false}>
          <div className="space-y-4 text-center">
            <h1 className="text-6xl font-bold text-terminal-prompt mb-4">
              404
            </h1>
            
            <h2 className="text-2xl font-bold text-terminal-text mb-4">
              Page Not Found
            </h2>
            
            <p className="text-terminal-white mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <BackNavigation label="← cd ~/" />
          </div>
        </CommandPrompt>
      </TerminalWindow>
    </div>
  )
}