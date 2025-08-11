import { ReactNode } from 'react'

interface CommandPromptProps {
  user?: string
  directory?: string
  command?: string
  children?: ReactNode
  showCursor?: boolean
}

export default function CommandPrompt({ 
  user = 'fmiamoto', 
  directory = '~', 
  command,
  children,
  showCursor = true 
}: CommandPromptProps) {
  return (
    <div className="flex flex-wrap items-start gap-1 font-mono">
      <span className="prompt">
        {user}@dorayaki:{directory}$
      </span>
      {command && (
        <span className="command">
          {command}
        </span>
      )}
      {showCursor && <span className="cursor"></span>}
      {children && (
        <div className="w-full mt-2">
          {children}
        </div>
      )}
    </div>
  )
}