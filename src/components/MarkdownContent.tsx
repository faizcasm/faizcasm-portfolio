import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Components } from 'react-markdown';
import CodeBlock from './CodeBlock';
import { nodeText, slugify } from '@/lib/headings';

interface MarkdownContentProps {
  content: string;
}

/**
 * Renders markdown on the server with anchor ids on every heading,
 * so the table of contents can deep-link to sections.
 */
const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  const heading = (Tag: 'h1' | 'h2' | 'h3' | 'h4', className: string) =>
    function Heading({ node, children, ...props }: any) {
      return (
        <Tag id={slugify(nodeText(children))} className={`${className} scroll-mt-24`} {...props}>
          {children}
        </Tag>
      );
    };

  const components: Components = {
    code({ node, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');

      return match ? (
        <CodeBlock language={match[1]} code={String(children)} />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    h1: heading('h1', 'text-4xl font-bold my-4'),
    h2: heading('h2', 'text-3xl font-semibold my-3'),
    h3: heading('h3', 'text-2xl font-semibold my-2'),
    h4: heading('h4', 'text-xl font-semibold my-2'),
    p: ({ node, ...props }) => <p className="my-2 leading-relaxed" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc list-inside my-2" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-2" {...props} />,
    li: ({ node, ...props }) => <li className="my-1" {...props} />,
    a: ({ node, ...props }) => (
      <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2 dark:border-gray-600" {...props} />
    ),
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
