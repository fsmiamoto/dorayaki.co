import { ReactNode } from 'react'

interface TerminalTextProps {
  children: ReactNode
  className?: string
  animate?: boolean
}

export default function TerminalText({ children, className = '', animate = false }: TerminalTextProps) {
  return (
    <div className={`font-mono ${animate ? 'animate-typing overflow-hidden whitespace-nowrap' : ''} ${className}`}>
      {children}
    </div>
  )
}