import TerminalWindow from "@/components/TerminalWindow";
import CommandPrompt from "@/components/CommandPrompt";
import BackNavigation from "@/components/BackNavigation";
import type { Metadata } from "next";
import { absoluteUrl, withTrailingSlash } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About - dorayaki",
  description: "About Flavio Miyamoto - Software Development Engineer II at Amazon",
  alternates: {
    canonical: withTrailingSlash("/about"),
  },
  openGraph: {
    title: "About - dorayaki",
    description: "About Flavio Miyamoto - Software Development Engineer II at Amazon",
    url: absoluteUrl(withTrailingSlash("/about")),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About - dorayaki",
    description: "About Flavio Miyamoto - Software Development Engineer II at Amazon",
  },
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <BackNavigation />
      </div>

      <TerminalWindow title="about.md">
        <CommandPrompt
          command="cat about.md"
          showCursor={false}
          contentClassName="space-y-6 text-sm leading-relaxed sm:text-base"
        >
          <section className="space-y-3 text-app-soft">
            <h1 className="text-2xl font-semibold text-app-foreground sm:text-3xl">About me</h1>
            <p>Howdy!</p>
            <p>I'm a Software Engineer currently working at Amazon in Tokyo, Japan.</p>
            <p>
              My passion is building software to deliver value while learning and exploring new domains and technologies.
            </p>
            <p>
              Over my still not so long career, I had the chance of working with incredibly talented individuals on challenging projects and was able to grow and develop myself.
            </p>
          </section>

          <section className="space-y-3 text-app-soft">
            <h2 className="text-xs uppercase tracking-[0.35em] text-app-muted">
              Career highlights
            </h2>
            <ul className="space-y-2">
              <li>• Developed the financial tracking for launching Amazon Furusato in Japan.</li>
              <li>
                • Delivered a novel configuration delivery system for a global Edge Computing
                platform.
              </li>
            </ul>
          </section>

          <section className="space-y-3 text-app-soft">
            <h2 className="text-xs uppercase tracking-[0.35em] text-app-muted">Curious about</h2>
            <p>
              Cloud infrastructure, operating systems, networking, embedded systems, compilers, AI and
              language learning.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-[0.35em] text-app-muted">Positions</h2>
            <div className="space-y-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="text-app-muted shrink-0 sm:w-28">2024 – Present</span>
                <div>
                  <span className="font-semibold text-app-foreground">Amazon.co.jp</span>
                  <span className="text-app-soft ml-2">Software Development Engineer</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="text-app-muted shrink-0 sm:w-28">2022 – 2024</span>
                <div>
                  <span className="font-semibold text-app-foreground">Amazon.com.br</span>
                  <span className="text-app-soft ml-2">Software Development Engineer</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="text-app-muted shrink-0 sm:w-28">2021 – 2022</span>
                <div>
                  <span className="font-semibold text-app-foreground">Azion</span>
                  <span className="text-app-soft ml-2">Software Developer</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="text-app-muted shrink-0 sm:w-28">2019 – 2021</span>
                <div>
                  <span className="font-semibold text-app-foreground">Carbonaut</span>
                  <span className="text-app-soft ml-2">Jr. Software Developer</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-[0.35em] text-app-muted">Education</h2>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="text-app-muted shrink-0 sm:w-28">– 2017-2023</span>
              <div>
                <span className="font-semibold text-app-foreground">UTFPR</span>
                <span className="text-app-soft ml-2">B.S. Electronics Engineering</span>
              </div>
            </div>
          </section>


          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-[0.35em] text-app-muted">Languages</h2>
            <div className="space-y-1 text-app-soft">
              <p>
                <span className="font-semibold text-app-foreground">Portuguese</span> – Native
              </p>
              <p>
                <span className="font-semibold text-app-foreground">English</span> – Fluent
              </p>
              <p>
                <span className="font-semibold text-app-foreground">Japanese</span> – JLPT N2
              </p>
            </div>
          </section>

        </CommandPrompt>
      </TerminalWindow>
    </div>
  );
}
