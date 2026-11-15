import { MDXRemote } from "next-mdx-remote/rsc";
import { highlight } from "sugar-high";
import React from "react";
import CopyButton from "@/components/CopyButton";
import MarkdownHeading from "@/components/MarkdownHeading";
import { remarkPostHeadingIds, type PostHeading } from "@/lib/post-headings";

interface CodeBlockProps {
  children: string;
  className?: string;
}

function CodeBlock({ children, className }: CodeBlockProps) {
  const language = className?.replace("language-", "") || "text";
  const codeHTML = highlight(children);

  return (
    <div className="relative my-4">
      <div className="flex items-center justify-between rounded-t-md border border-b-0 border-app-border-subtle bg-app-surface-muted px-4 py-1.5">
        <span className="text-xs text-app-muted">{language}</span>
        <CopyButton text={children} />
      </div>
      <pre className="rounded-b-md rounded-t-none border border-app-border-subtle bg-app-surface px-4 py-4 text-[13px] leading-relaxed text-app-soft">
        <code dangerouslySetInnerHTML={{ __html: codeHTML }} />
      </pre>
    </div>
  );
}

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mb-4 mt-9 text-2xl font-bold text-app-foreground" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <MarkdownHeading level={2} className="mb-3 mt-9 scroll-mt-24" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <MarkdownHeading level={3} className="mb-2 mt-7 scroll-mt-24" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-5 text-[15px] leading-[1.85] text-app-soft" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement> & { className?: string; children: string }) => {
    if (props.className) {
      return <CodeBlock {...props} />;
    }
    return (
      <code
        className="rounded bg-app-surface-muted px-1.5 py-0.5 font-normal text-app-amber"
        {...props}
      />
    );
  },
  pre: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
  a: ({ href, className, ...props }: React.ComponentPropsWithoutRef<"a">) => {
    const hrefValue = href ?? "";
    const isInternal = hrefValue.startsWith("/") || hrefValue.startsWith("#");
    const isExternal =
      hrefValue !== "" &&
      !isInternal &&
      (hrefValue.startsWith("http://") ||
        hrefValue.startsWith("https://") ||
        hrefValue.startsWith("//"));

    return (
      <a
        className={[
          "text-app-accent underline underline-offset-[3px] transition-colors hover:text-app-accent-strong",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      />
    );
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="mb-5 list-none space-y-2 pl-0 text-[15px] leading-[1.85] text-app-soft"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="mb-5 list-inside list-decimal space-y-2 pl-0 text-[15px] leading-[1.85] text-app-soft"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="flex items-start gap-2">
      <span className="text-app-accent">▸</span>
      <span {...props} />
    </li>
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-2 border-app-amber py-0.5 pl-[18px] font-normal not-italic [&_p]:mb-0 [&_p]:text-app-foreground [&_p]:before:content-none [&_p]:after:content-none"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-app-foreground" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-app-accent" {...props} />
  ),
};

interface MDXContentProps {
  source: string;
  headings?: PostHeading[];
}

export function MDXContent({ source, headings = [] }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [[remarkPostHeadingIds, headings]],
        },
      }}
    />
  );
}
