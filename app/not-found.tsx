import TerminalWindow from "@/components/TerminalWindow";
import CommandPrompt from "@/components/CommandPrompt";
import BackNavigation from "@/components/BackNavigation";

export default function NotFound() {
  return (
    <div className="space-y-6">
      <TerminalWindow title="404.md">
        <CommandPrompt command="cat 404.md" showCursor={false}>
          <div className="space-y-4 text-center text-app-soft">
            <h1 className="text-6xl font-semibold text-app-accent">404</h1>
            <h2 className="text-2xl font-semibold text-app-foreground">Page Not Found</h2>
            <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
            <div className="flex justify-center">
              <BackNavigation label="← cd ~/" />
            </div>
          </div>
        </CommandPrompt>
      </TerminalWindow>
    </div>
  );
}
