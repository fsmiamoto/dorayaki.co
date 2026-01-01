import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'

interface CodeBlockProps {
  children: string
  className?: string
}

function CodeBlock({ children, className }: CodeBlockProps) {
  const language = className?.replace('language-', '') || 'text'
  const codeHTML = highlight(children)
  
  return (
    <div className="relative my-4">
      <div className="absolute top-2 right-3 text-xs uppercase tracking-[0.3em] text-app-muted">
        {language}
      </div>
      <pre className="rounded-xl border border-app-border-subtle bg-app-surface-soft px-4 py-4 text-sm leading-relaxed text-app-soft shadow-pane-soft">
        <code dangerouslySetInnerHTML={{ __html: codeHTML }} />
      </pre>
    </div>
  )
}

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="mb-4 mt-8 text-3xl font-semibold text-app-foreground" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="mb-3 mt-6 text-2xl font-semibold text-app-foreground" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="mb-2 mt-4 text-xl font-semibold text-app-foreground" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-4 leading-relaxed text-app-soft" {...props} />,
  code: (props: React.HTMLAttributes<HTMLElement> & { className?: string; children: string }) => {
    if (props.className) {
      return <CodeBlock {...props} />
    }
    return <code className="rounded bg-app-surface-soft px-2 py-1 text-app-amber" {...props} />
  },
  pre: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
  a: ({ href, className, ...props }: React.ComponentPropsWithoutRef<'a'>) => {
    const hrefValue = href ?? ''
    const isInternal = hrefValue.startsWith('/') || hrefValue.startsWith('#')
    const isExternal =
      hrefValue !== '' &&
      !isInternal &&
      (hrefValue.startsWith('http://') || hrefValue.startsWith('https://') || hrefValue.startsWith('//'))

    return (
      <a
        className={[
          'text-app-accent underline transition-colors hover:text-app-accent-strong',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      />
    )
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="mb-4 list-none space-y-2 text-app-soft" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="mb-4 list-decimal list-inside space-y-2 text-app-soft" {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="flex items-start gap-2">
      <span className="text-app-accent">▸</span>
      <span {...props} />
    </li>
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-4 border-l-4 border-app-accent/60 bg-app-surface-soft/60 px-4 py-2 italic text-app-soft" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-semibold text-app-foreground" {...props} />,
  em: (props: React.HTMLAttributes<HTMLElement>) => <em className="italic text-app-accent" {...props} />,
}

interface MDXContentProps {
  source: string
}

export function MDXContent({ source }: MDXContentProps) {
  return <MDXRemote source={source} components={components} />
}
