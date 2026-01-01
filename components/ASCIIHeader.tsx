import clsx from "clsx";

interface ASCIIHeaderProps {
  text: string;
  className?: string;
}

export default function ASCIIHeader({ text, className = "" }: ASCIIHeaderProps) {
  if (text === "DORAYAKI") {
    return (
      <div className={clsx("py-8", className)}>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-bold text-app-accent sm:text-2xl">{">"}</span>
            <h1 className="text-3xl font-black tracking-tight text-app-foreground sm:text-4xl">
              DORAYAKI
            </h1>
            <span className="inline-block h-6 w-3 animate-blink bg-app-accent" />
          </div>
          <p className="pl-6 font-mono text-sm text-app-muted">personal terminal</p>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("py-4", className)}>
      <div className="text-app-muted/80 font-mono text-sm font-bold">
        {`# ${text.toLowerCase()}`}
      </div>
    </div>
  );
}
