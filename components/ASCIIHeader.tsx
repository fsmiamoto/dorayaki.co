import clsx from 'clsx'

interface ASCIIHeaderProps {
  text: string
  className?: string
}

export default function ASCIIHeader({ text, className = '' }: ASCIIHeaderProps) {
  if (text === 'DORAYAKI') {
    return (
      <div className={clsx('py-8', className)}>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-3">
            <span className="text-app-accent font-bold text-xl sm:text-2xl">{'>'}</span>
            <h1 className="text-3xl font-black tracking-tight text-app-foreground sm:text-4xl">
              DORAYAKI
            </h1>
            <span className="inline-block h-6 w-3 bg-app-accent animate-blink" />
          </div>
          <p className="font-mono text-sm text-app-muted pl-6">
            personal terminal
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx('py-4', className)}>
      <div className="font-mono text-sm font-bold text-app-muted/80">
        {`# ${text.toLowerCase()}`}
      </div>
    </div>
  )
}
