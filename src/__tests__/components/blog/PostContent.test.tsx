import React from 'react';
import { render, screen } from '@testing-library/react';
import PostContent from '@/components/blog/PostContent';

// Mock react-markdown and remark-gfm (mocks are in __mocks__ folder at root)
jest.mock('react-markdown');
jest.mock('remark-gfm');

describe('PostContent', () => {
  describe('basic rendering', () => {
    it('renders plain text content', () => {
      render(<PostContent content="Hello world" />);
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('renders multiple paragraphs', () => {
      const content = 'First paragraph.\n\nSecond paragraph.';
      render(<PostContent content={content} />);
      expect(screen.getByText('First paragraph.')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
    });
  });

  describe('headings', () => {
    it('renders h1 headings', () => {
      render(<PostContent content="# Heading 1" />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Heading 1');
    });

    it('renders h2 headings', () => {
      render(<PostContent content="## Heading 2" />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Heading 2');
    });

    it('renders h3 headings', () => {
      render(<PostContent content="### Heading 3" />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Heading 3');
    });
  });

  describe('inline formatting', () => {
    it('renders bold text', () => {
      render(<PostContent content="This is **bold** text" />);
      const bold = screen.getByText('bold');
      expect(bold.tagName).toBe('STRONG');
    });

    it('renders italic text', () => {
      render(<PostContent content="This is *italic* text" />);
      const italic = screen.getByText('italic');
      expect(italic.tagName).toBe('EM');
    });

    it('renders inline code', () => {
      render(<PostContent content="Use `console.log()` for debugging" />);
      const code = screen.getByText('console.log()');
      expect(code.tagName).toBe('CODE');
    });
  });

  describe('links', () => {
    it('renders links with href', () => {
      render(<PostContent content="Visit [Example](https://example.com)" />);
      const link = screen.getByRole('link', { name: 'Example' });
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('opens external links in new tab', () => {
      render(<PostContent content="Visit [Example](https://example.com)" />);
      const link = screen.getByRole('link', { name: 'Example' });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('lists', () => {
    it('renders unordered lists', () => {
      const content = '- Item 1\n- Item 2\n- Item 3';
      render(<PostContent content={content} />);
      const list = screen.getByRole('list');
      expect(list.tagName).toBe('UL');
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('renders ordered lists', () => {
      const content = '1. First\n2. Second\n3. Third';
      render(<PostContent content={content} />);
      const list = screen.getByRole('list');
      expect(list.tagName).toBe('OL');
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
  });

  describe('code blocks', () => {
    it('renders fenced code blocks', () => {
      const content = '```javascript\nconst x = 1;\n```';
      render(<PostContent content={content} />);
      const code = screen.getByText('const x = 1;');
      expect(code.tagName).toBe('CODE');
    });

    it('renders code blocks with pre wrapper', () => {
      const content = '```\ncode block\n```';
      render(<PostContent content={content} />);
      const code = screen.getByText('code block');
      expect(code.closest('pre')).toBeInTheDocument();
    });
  });

  describe('blockquotes', () => {
    it('renders blockquotes', () => {
      render(<PostContent content="> This is a quote" />);
      const blockquote = screen.getByText('This is a quote');
      expect(blockquote.closest('blockquote')).toBeInTheDocument();
    });
  });

  describe('GitHub Flavored Markdown', () => {
    it('renders strikethrough text', () => {
      render(<PostContent content="This is ~~deleted~~ text" />);
      const deleted = screen.getByText('deleted');
      expect(deleted.tagName).toBe('DEL');
    });

    it('renders tables', () => {
      const content = `| Header 1 | Header 2 |
| --- | --- |
| Cell 1 | Cell 2 |`;
      render(<PostContent content={content} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Header 1')).toBeInTheDocument();
      expect(screen.getByText('Cell 1')).toBeInTheDocument();
    });

    it('renders task lists', () => {
      const content = '- [ ] Unchecked\n- [x] Checked';
      render(<PostContent content={content} />);
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });
  });

  describe('styling', () => {
    it('applies prose styling class', () => {
      const { container } = render(<PostContent content="Test" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('prose');
    });
  });
});
