import clsx from "clsx";

interface OpinionDisclaimerProps {
  className?: string;
}

export default function OpinionDisclaimer({ className }: OpinionDisclaimerProps) {
  return (
    <p className={clsx("text-app-muted/90 text-xs italic leading-relaxed sm:text-sm", className)}>
      All posts are written by me, a human. AI occasionally helps fix my bad grammar. Opinions are
      my own and do not represent my employer.
    </p>
  );
}
