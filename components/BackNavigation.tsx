import Link from 'next/link'

interface BackNavigationProps {
  href?: string
  label?: string
}

export default function BackNavigation({
  href = '/',
  label = '← cd ~/',
}: BackNavigationProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-app-accent transition-colors hover:text-app-accent-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent sm:text-sm"
    >
      {label}
    </Link>
  )
}
