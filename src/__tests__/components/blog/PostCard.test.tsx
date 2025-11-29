import { render, screen } from '@testing-library/react';
import PostCard from '@/components/blog/PostCard';
import { Post } from '@/lib/types';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('PostCard', () => {
  const mockPost: Post = {
    id: 'post1',
    title: 'My First Blog Post',
    slug: 'my-first-blog-post',
    summary: 'This is a summary of my first blog post with some interesting content.',
    content: '# Full content here',
    coverImage: 'https://example.com/cover.jpg',
    images: [],
    status: 'published',
    publishedAt: new Date('2025-01-15T12:00:00Z'),
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-15T12:00:00Z'),
  };

  it('should render post title', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText('My First Blog Post')).toBeInTheDocument();
  });

  it('should render post summary', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText(/This is a summary of my first blog post/)).toBeInTheDocument();
  });

  it('should render published date', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText(/Jan 15, 2025/)).toBeInTheDocument();
  });

  it('should link to the blog post page', () => {
    render(<PostCard post={mockPost} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/my-first-blog-post');
  });

  it('should render cover image when provided', () => {
    render(<PostCard post={mockPost} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/cover.jpg');
    expect(image).toHaveAttribute('alt', 'My First Blog Post');
  });

  it('should render placeholder when no cover image', () => {
    const postWithoutImage: Post = {
      ...mockPost,
      coverImage: null,
    };

    render(<PostCard post={postWithoutImage} />);

    // Should show a placeholder div instead of an image
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('image-placeholder')).toBeInTheDocument();
  });

  it('should have accessible structure', () => {
    render(<PostCard post={mockPost} />);

    // Should be wrapped in an article
    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});
