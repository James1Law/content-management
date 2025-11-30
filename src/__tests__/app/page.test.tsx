import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { getPublishedPosts } from '@/lib/posts';
import { Post } from '@/lib/types';

// Mock posts module
jest.mock('@/lib/posts', () => ({
  getPublishedPosts: jest.fn(),
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

const mockGetPublishedPosts = getPublishedPosts as jest.Mock;

describe('Home', () => {
  const mockPosts: Post[] = [
    {
      id: 'post1',
      title: 'First Published Post',
      slug: 'first-published-post',
      summary: 'This is the first post summary',
      content: '# Content',
      coverImage: 'https://example.com/image1.jpg',
      images: [],
      status: 'published',
      publishedAt: new Date('2025-01-15T12:00:00Z'),
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date('2025-01-15T12:00:00Z'),
    },
    {
      id: 'post2',
      title: 'Second Published Post',
      slug: 'second-published-post',
      summary: 'This is the second post summary',
      content: '# Content',
      coverImage: null,
      images: [],
      status: 'published',
      publishedAt: new Date('2025-01-10T12:00:00Z'),
      createdAt: new Date('2025-01-05T00:00:00Z'),
      updatedAt: new Date('2025-01-10T12:00:00Z'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the blog heading', async () => {
    mockGetPublishedPosts.mockResolvedValue(mockPosts);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /blog/i })).toBeInTheDocument();
    });
  });

  it('should display published posts', async () => {
    mockGetPublishedPosts.mockResolvedValue(mockPosts);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('First Published Post')).toBeInTheDocument();
      expect(screen.getByText('Second Published Post')).toBeInTheDocument();
    });
  });

  it('should display post summaries', async () => {
    mockGetPublishedPosts.mockResolvedValue(mockPosts);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('This is the first post summary')).toBeInTheDocument();
      expect(screen.getByText('This is the second post summary')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    mockGetPublishedPosts.mockImplementation(() => new Promise(() => {}));

    render(<Home />);

    expect(screen.getByText(/loading posts/i)).toBeInTheDocument();
  });

  it('should show empty state when no posts', async () => {
    mockGetPublishedPosts.mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/no transmissions yet/i)).toBeInTheDocument();
    });
  });

  it('should show error state when fetch fails', async () => {
    mockGetPublishedPosts.mockRejectedValue(new Error('Failed to fetch'));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load posts/i)).toBeInTheDocument();
    });
  });

  it('should link posts to their individual pages', async () => {
    mockGetPublishedPosts.mockResolvedValue(mockPosts);

    render(<Home />);

    await waitFor(() => {
      const links = screen.getAllByRole('link');
      expect(links.some((link) => link.getAttribute('href') === '/blog/first-published-post')).toBe(true);
      expect(links.some((link) => link.getAttribute('href') === '/blog/second-published-post')).toBe(true);
    });
  });
});
