import clsx from 'clsx'

interface ASCIIHeaderProps {
  text: string
  className?: string
}

export default function ASCIIHeader({ text, className = '' }: ASCIIHeaderProps) {
  if (text === 'DORAYAKI') {
    return (
      <div
        className={clsx(
          'flex flex-col items-start gap-2 py-6',
          className,
        )}
      >
        <div className="inline-flex items-center gap-3 rounded-[1.75rem] border border-app-border-subtle bg-app-surface-soft/80 px-5 py-3 text-sm uppercase tracking-[0.4em] text-app-foreground shadow-pane-soft">
          <span className="text-app-accent-strong text-base">{'>'}</span>
          <span className="text-base sm:text-lg">DORAYAKI</span>
          <span
            className="inline-block h-5 w-[2px] rounded bg-app-accent animate-blink"
            aria-hidden="true"
          />
        </div>
        <span className="text-[0.7rem] uppercase tracking-[0.32em] text-app-muted">
          personal terminal
        </span>
      </div>
    )
  }

  return (
    <div className={clsx('py-2', className)}>
      <div className="font-mono text-sm font-semibold uppercase tracking-[0.35em] text-app-muted">
        {`# ${text.toUpperCase()}`}
      </div>
    </div>
  )
}
