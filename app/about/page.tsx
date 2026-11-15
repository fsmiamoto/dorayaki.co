import CommandPrompt from "@/components/CommandPrompt";
import MarkdownHeading from "@/components/MarkdownHeading";
import Image from "next/image";
import type { Metadata } from "next";
import { absoluteUrl, withTrailingSlash } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About - dorayaki",
  description: "About Flavio Miyamoto - Software Engineer at Sakana AI",
  alternates: {
    canonical: withTrailingSlash("/about"),
  },
  openGraph: {
    title: "About - dorayaki",
    description: "About Flavio Miyamoto - Software Engineer at Sakana AI",
    url: absoluteUrl(withTrailingSlash("/about")),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About - dorayaki",
    description: "About Flavio Miyamoto - Software Engineer at Sakana AI",
  },
};

export default function AboutPage() {
  return (
    <CommandPrompt
      command="cat about.md"
      showCursor={false}
      contentClassName="max-w-[68ch] space-y-9 text-[15px] leading-[1.85]"
    >
      <section className="space-y-3 text-app-soft">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-[22px] font-bold leading-tight tracking-tight text-app-foreground sm:text-[28px]">
            About me
          </h1>
          <Image
            src="/icons/dorayaki-normal.webp"
            alt=""
            width={64}
            height={58}
            className="hidden h-auto w-14 shrink-0 -rotate-6 opacity-60 transition-opacity duration-300 hover:opacity-100 sm:block sm:w-16"
            aria-hidden="true"
          />
        </div>
        <p>Howdy!</p>
        <p>I'm a Software Engineer currently working at Sakana AI in Tokyo, Japan.</p>
        <p>
          My passion is building software to deliver value while learning and exploring new domains
          and technologies.
        </p>
        <p>
          Over my still not so long career, I had the chance of working with incredibly talented
          individuals on challenging projects and was able to grow and develop myself.
        </p>
      </section>

      <section className="space-y-3 text-app-soft">
        <MarkdownHeading>Career highlights</MarkdownHeading>
        <ul className="space-y-2">
          <li>• Part of the team that initially launched Amazon Furusato in Japan.</li>
          <li>
            • Delivered a novel configuration delivery system for a global Edge Computing platform.
          </li>
        </ul>
      </section>

      <section className="space-y-3 text-app-soft">
        <MarkdownHeading>Curious about</MarkdownHeading>
        <p>
          Recently been learning and reading so much about AI and Agents to figure out how to
          navigate this new world. But I'm also interested in things like operating systems,
          networking, embedded systems, compilers, and human language learning.
        </p>
      </section>

      <section className="space-y-3">
        <MarkdownHeading>Positions</MarkdownHeading>
        <div className="space-y-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="shrink-0 text-app-muted sm:w-36">2026 – Present</span>
            <div>
              <span className="font-semibold text-app-foreground">Sakana AI</span>
              <span className="ml-2 text-app-soft">Software Engineer</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="shrink-0 text-app-muted sm:w-36">2024 – 2026</span>
            <div>
              <span className="font-semibold text-app-foreground">Amazon.co.jp</span>
              <span className="ml-2 text-app-soft">Software Development Engineer</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="shrink-0 text-app-muted sm:w-36">2022 – 2024</span>
            <div>
              <span className="font-semibold text-app-foreground">Amazon.com.br</span>
              <span className="ml-2 text-app-soft">Software Development Engineer</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="shrink-0 text-app-muted sm:w-36">2021 – 2022</span>
            <div>
              <span className="font-semibold text-app-foreground">Azion</span>
              <span className="ml-2 text-app-soft">Software Developer</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="shrink-0 text-app-muted sm:w-36">2019 – 2021</span>
            <div>
              <span className="font-semibold text-app-foreground">Carbonaut</span>
              <span className="ml-2 text-app-soft">Jr. Software Developer</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <MarkdownHeading>Education</MarkdownHeading>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
          <span className="shrink-0 text-app-muted sm:w-36">– 2017-2023</span>
          <div>
            <span className="font-semibold text-app-foreground">UTFPR</span>
            <span className="ml-2 text-app-soft">B.S. Electronics Engineering</span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <MarkdownHeading>Languages</MarkdownHeading>
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
  );
}
