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
    <div className="relative">
      <div className="absolute top-2 right-2 text-xs text-terminal-gray">
        {language}
      </div>
      <pre className="bg-terminal-window-bg border border-terminal-window-border rounded p-4 overflow-x-auto">
        <code dangerouslySetInnerHTML={{ __html: codeHTML }} />
      </pre>
    </div>
  )
}

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="text-2xl font-bold text-terminal-prompt mb-4 mt-8" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-xl font-bold text-terminal-prompt mb-3 mt-6" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-lg font-bold text-terminal-prompt mb-2 mt-4" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-4 leading-relaxed" {...props} />,
  code: (props: React.HTMLAttributes<HTMLElement> & { className?: string; children: string }) => {
    if (props.className) {
      return <CodeBlock {...props} />
    }
    return <code className="bg-terminal-window-bg px-2 py-1 rounded text-terminal-amber" {...props} />
  },
  pre: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
  a: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a 
      className="text-terminal-amber underline hover:text-terminal-text transition-colors" 
      target="_blank" 
      rel="noopener noreferrer" 
      {...props} 
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="list-none mb-4 space-y-2" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="flex items-start"><span className="text-terminal-prompt mr-2">▸</span><span {...props} /></li>,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-terminal-prompt pl-4 py-2 my-4 bg-terminal-window-bg italic" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="text-terminal-amber font-bold" {...props} />,
  em: (props: React.HTMLAttributes<HTMLElement>) => <em className="text-terminal-text italic" {...props} />,
}

interface MDXContentProps {
  source: string
}

export function MDXContent({ source }: MDXContentProps) {
  return <MDXRemote source={source} components={components} />
}