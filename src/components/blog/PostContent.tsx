'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Components } from 'react-markdown';

interface PostContentProps {
  content: string;
}

/**
 * PostContent component
 * Renders markdown content using react-markdown with GitHub Flavored Markdown support
 */
export default function PostContent({ content }: PostContentProps): JSX.Element {
  const components: Components = {
    // Open external links in new tab
    a: ({ href, children, ...props }) => {
      const isExternal = href?.startsWith('http');
      return (
        <a
          href={href}
          {...(isExternal && {
            target: '_blank',
            rel: 'noopener noreferrer',
          })}
          {...props}
        >
          {children}
        </a>
      );
    },
  };

  return (
    <div className="prose prose-lg prose-synthwave max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
