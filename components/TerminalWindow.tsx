import { ReactNode } from 'react'
import clsx from 'clsx'

interface TerminalWindowProps {
  title?: string
  children: ReactNode
  className?: string
}

export default function TerminalWindow({ title = 'terminal', children, className = '' }: TerminalWindowProps) {
  return (
    <div className={clsx('terminal-window isolate', className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-app-accent via-transparent to-app-amber opacity-40" />
      <div className="terminal-title-bar">
        <div className="flex items-center gap-2">
          <span className="terminal-button terminal-button-red" />
          <span className="terminal-button terminal-button-amber" />
          <span className="terminal-button terminal-button-green" />
        </div>
        <div className="flex-1 text-center text-[0.65rem] uppercase tracking-[0.2em] text-app-muted">
          {title}
        </div>
        <div className="w-10" />
      </div>
      <div className="terminal-content px-3 py-4 sm:px-6 sm:py-6">
        {children}
      </div>
    </div>
  )
}
