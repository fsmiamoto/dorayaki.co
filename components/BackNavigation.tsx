import Link from "next/link";

interface BackNavigationProps {
  href?: string;
  label?: string;
}

export default function BackNavigation({ href = "/", label = "← cd ~/" }: BackNavigationProps) {
  return (
    <Link
      href={href}
      className="link-nav inline-flex items-center gap-2 text-xs uppercase tracking-[0.32em] sm:text-sm"
    >
      {label}
    </Link>
  );
}
