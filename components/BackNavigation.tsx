import Link from 'next/link'

interface BackNavigationProps {
  href?: string
  label?: string
}

export default function BackNavigation({ 
  href = '/', 
  label = '← cd ~/' 
}: BackNavigationProps) {
  return (
    <Link 
      href={href}
      className="text-terminal-amber hover:text-terminal-text transition-colors text-sm"
    >
      {label}
    </Link>
  )
}