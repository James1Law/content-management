import { render, screen, waitFor } from '@testing-library/react';
import BlogPostPage from '@/app/blog/[slug]/page';
import { getPostBySlug } from '@/lib/posts';
import { Post } from '@/lib/types';

// Mock posts module
jest.mock('@/lib/posts', () => ({
  getPostBySlug: jest.fn(),
}));

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
  }: {
    src: string;
    alt: string;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  };
});

const mockGetPostBySlug = getPostBySlug as jest.Mock;

describe('BlogPostPage', () => {
  const mockPost: Post = {
    id: 'post1',
    title: 'My Test Blog Post',
    slug: 'my-test-blog-post',
    summary: 'This is a summary of my test blog post',
    content: '# Hello World\n\nThis is the full content of my blog post.\n\n## Section Two\n\nMore content here.',
    coverImage: 'https://example.com/cover.jpg',
    images: [],
    status: 'published',
    publishedAt: new Date('2025-01-15T12:00:00Z'),
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-15T12:00:00Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    mockGetPostBySlug.mockImplementation(() => new Promise(() => {}));

    render(<BlogPostPage params={{ slug: 'my-test-blog-post' }} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display post title', async () => {
    mockGetPostBySlug.mockResolvedValue(mockPost);

    render(<BlogPostPage params={{ slug: 'my-test-blog-post' }} />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'My Test Blog Post' })).toBeInTheDocument();
    });
  });

  it('should display published date', async () => {
    mockGetPostBySlug.mockResolvedValue(mockPost);

    render(<BlogPostPage params={{ slug: 'my-test-blog-post' }} />);

    await waitFor(() => {
      expect(screen.getByText(/January 15, 2025/)).toBeInTheDocument();
    });
  });

  it('should display post content', async () => {
    mockGetPostBySlug.mockResolvedValue(mockPost);

    render(<BlogPostPage params={{ slug: 'my-test-blog-post' }} />);

    await waitFor(() => {
      expect(screen.getByText(/Hello World/)).toBeInTheDocument();
      expect(screen.getByText(/This is the full content/)).toBeInTheDocument();
    });
  });

  it('should display cover image when provided', async () => {
    mockGetPostBySlug.mockResolvedValue(mockPost);

    render(<BlogPostPage params={{ slug: 'my-test-blog-post' }} />);

    await waitFor(() => {
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://example.com/cover.jpg');
    });
  });

  it('should show 404 when post not found', async () => {
    mockGetPostBySlug.mockResolvedValue(null);

    render(<BlogPostPage params={{ slug: 'non-existent' }} />);

    await waitFor(() => {
      expect(screen.getByText(/post not found/i)).toBeInTheDocument();
    });
  });

  it('should show error when fetch fails', async () => {
    mockGetPostBySlug.mockRejectedValue(new Error('Network error'));

    render(<BlogPostPage params={{ slug: 'my-test-blog-post' }} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });

  it('should have a back link to homepage', async () => {
    mockGetPostBySlug.mockResolvedValue(mockPost);

    render(<BlogPostPage params={{ slug: 'my-test-blog-post' }} />);

    await waitFor(() => {
      const backLinks = screen.getAllByRole('link', { name: /back/i });
      expect(backLinks.length).toBeGreaterThan(0);
      expect(backLinks[0]).toHaveAttribute('href', '/');
    });
  });

  it('should not display draft posts', async () => {
    const draftPost: Post = {
      ...mockPost,
      status: 'draft',
      publishedAt: null,
    };
    mockGetPostBySlug.mockResolvedValue(draftPost);

    render(<BlogPostPage params={{ slug: 'my-test-blog-post' }} />);

    await waitFor(() => {
      expect(screen.getByText(/post not found/i)).toBeInTheDocument();
    });
  });
});
