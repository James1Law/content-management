import React from 'react';

interface ReactMarkdownProps {
  children: string;
  remarkPlugins?: unknown[];
  components?: Record<string, React.ComponentType<unknown>>;
}

/**
 * Mock implementation of react-markdown for testing
 * Parses basic markdown syntax for test verification
 */
function ReactMarkdown({ children, components }: ReactMarkdownProps): JSX.Element {
  const CustomLink = components?.a as React.ComponentType<{
    href?: string;
    children: React.ReactNode;
  }> | undefined;

  // Parse markdown content into HTML-like structure
  const parseMarkdown = (content: string): JSX.Element[] => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Table handling
      if (line.includes('|') && line.trim().startsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].includes('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        elements.push(parseTable(tableLines, elements.length));
        continue;
      }

      // Code block handling
      if (line.startsWith('```')) {
        const codeLines: string[] = [];
        i++; // Skip opening ```
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // Skip closing ```
        elements.push(
          <pre key={elements.length}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        continue;
      }

      // Task list item
      if (line.match(/^- \[([ x])\]/)) {
        const taskItems: string[] = [];
        while (i < lines.length && lines[i].match(/^- \[([ x])\]/)) {
          taskItems.push(lines[i]);
          i++;
        }
        elements.push(
          <ul key={elements.length}>
            {taskItems.map((item, idx) => {
              const checked = item.includes('[x]');
              const text = item.replace(/^- \[([ x])\] /, '');
              return (
                <li key={idx}>
                  <input type="checkbox" checked={checked} readOnly /> {text}
                </li>
              );
            })}
          </ul>
        );
        continue;
      }

      // Unordered list
      if (line.startsWith('- ') && !line.match(/^- \[([ x])\]/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].startsWith('- ')) {
          listItems.push(lines[i].slice(2));
          i++;
        }
        elements.push(
          <ul key={elements.length}>
            {listItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered list
      if (line.match(/^\d+\. /)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].match(/^\d+\. /)) {
          listItems.push(lines[i].replace(/^\d+\. /, ''));
          i++;
        }
        elements.push(
          <ol key={elements.length}>
            {listItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        );
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={elements.length}>
            <p>{line.slice(2)}</p>
          </blockquote>
        );
        i++;
        continue;
      }

      // Headings
      if (line.startsWith('### ')) {
        elements.push(<h3 key={elements.length}>{line.slice(4)}</h3>);
        i++;
        continue;
      }
      if (line.startsWith('## ')) {
        elements.push(<h2 key={elements.length}>{line.slice(3)}</h2>);
        i++;
        continue;
      }
      if (line.startsWith('# ')) {
        elements.push(<h1 key={elements.length}>{line.slice(2)}</h1>);
        i++;
        continue;
      }

      // Empty lines
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Paragraph with inline formatting
      elements.push(<p key={elements.length}>{parseInline(line, CustomLink)}</p>);
      i++;
    }

    return elements;
  };

  const parseTable = (tableLines: string[], key: number): JSX.Element => {
    const parseRow = (row: string): string[] => {
      return row
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());
    };

    const headers = parseRow(tableLines[0]);
    const rows = tableLines.slice(2).map(parseRow);

    return (
      <table key={key}>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const parseInline = (
    text: string,
    CustomLink?: React.ComponentType<{ href?: string; children: React.ReactNode }>
  ): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIndex = 0;

    while (remaining.length > 0) {
      // Inline code
      const codeMatch = remaining.match(/`([^`]+)`/);
      if (codeMatch && codeMatch.index === 0) {
        parts.push(<code key={keyIndex++}>{codeMatch[1]}</code>);
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // Strikethrough
      const strikeMatch = remaining.match(/~~([^~]+)~~/);
      if (strikeMatch && strikeMatch.index === 0) {
        parts.push(<del key={keyIndex++}>{strikeMatch[1]}</del>);
        remaining = remaining.slice(strikeMatch[0].length);
        continue;
      }

      // Bold
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
      if (boldMatch && boldMatch.index === 0) {
        parts.push(<strong key={keyIndex++}>{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Italic
      const italicMatch = remaining.match(/\*([^*]+)\*/);
      if (italicMatch && italicMatch.index === 0) {
        parts.push(<em key={keyIndex++}>{italicMatch[1]}</em>);
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Links
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch && linkMatch.index === 0) {
        if (CustomLink) {
          parts.push(
            <CustomLink key={keyIndex++} href={linkMatch[2]}>
              {linkMatch[1]}
            </CustomLink>
          );
        } else {
          parts.push(
            <a key={keyIndex++} href={linkMatch[2]}>
              {linkMatch[1]}
            </a>
          );
        }
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // Find next special character or push remaining text
      const nextSpecial = remaining.search(/[`*~\[]/);
      if (nextSpecial > 0) {
        parts.push(remaining.slice(0, nextSpecial));
        remaining = remaining.slice(nextSpecial);
      } else if (nextSpecial === -1) {
        parts.push(remaining);
        remaining = '';
      } else {
        // nextSpecial === 0 but no match found, consume one character
        parts.push(remaining[0]);
        remaining = remaining.slice(1);
      }
    }

    return parts;
  };

  return <>{parseMarkdown(children)}</>;
}

export default ReactMarkdown;
