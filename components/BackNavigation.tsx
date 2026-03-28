import Link from "next/link";

interface BackNavigationProps {
  href?: string;
  label?: string;
}

export default function BackNavigation({ href = "/", label = "cd ../" }: BackNavigationProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 font-mono text-xs transition-colors duration-150 sm:text-sm"
    >
      <span className="text-app-accent/50 transition-colors group-hover:text-app-accent">$</span>
      <span className="text-app-muted transition-colors group-hover:text-app-foreground">
        {label}
      </span>
    </Link>
  );
}
