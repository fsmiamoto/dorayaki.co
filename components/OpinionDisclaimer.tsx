import clsx from "clsx";

interface OpinionDisclaimerProps {
  className?: string;
}

export default function OpinionDisclaimer({ className }: OpinionDisclaimerProps) {
  return (
    <p className={clsx("text-app-muted/90 text-xs italic leading-relaxed sm:text-sm", className)}>
      All posts reflect my own thoughts and opinions and do not represent my employer.
    </p>
  );
}
