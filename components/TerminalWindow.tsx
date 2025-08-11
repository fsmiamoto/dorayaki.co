import { ReactNode } from 'react'

interface TerminalWindowProps {
  title?: string
  children: ReactNode
  className?: string
}

export default function TerminalWindow({ title = 'terminal', children, className = '' }: TerminalWindowProps) {
  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-title-bar">
        <div className="flex gap-2">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-amber"></div>
          <div className="terminal-button terminal-button-green"></div>
        </div>
        <div className="flex-1 text-center text-xs text-terminal-gray">
          {title}
        </div>
        <div className="w-12"></div>
      </div>
      <div className="terminal-content px-2 py-4 sm:px-6 sm:py-6">
        {children}
      </div>
    </div>
  )
}