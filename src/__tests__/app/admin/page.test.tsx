import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminDashboard from '@/app/admin/page';
import { getAllPosts, deletePost } from '@/lib/posts';
import { Post } from '@/lib/types';

// Mock posts module
jest.mock('@/lib/posts', () => ({
  getAllPosts: jest.fn(),
  deletePost: jest.fn(),
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

const mockGetAllPosts = getAllPosts as jest.Mock;
const mockDeletePost = deletePost as jest.Mock;

describe('AdminDashboard', () => {
  const mockPosts: Post[] = [
    {
      id: 'post1',
      title: 'First Post',
      slug: 'first-post',
      summary: 'First post summary',
      content: '# First Post Content',
      coverImage: null,
      images: [],
      status: 'published',
      publishedAt: new Date('2025-01-15T12:00:00Z'),
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date('2025-01-15T12:00:00Z'),
    },
    {
      id: 'post2',
      title: 'Second Post',
      slug: 'second-post',
      summary: 'Second post summary',
      content: '# Second Post Content',
      coverImage: null,
      images: [],
      status: 'draft',
      publishedAt: null,
      createdAt: new Date('2025-01-10T00:00:00Z'),
      updatedAt: new Date('2025-01-14T00:00:00Z'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
  });

  it('should show loading state initially', () => {
    mockGetAllPosts.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<AdminDashboard />);

    expect(screen.getByText(/loading posts/i)).toBeInTheDocument();
  });

  it('should display posts after loading', async () => {
    mockGetAllPosts.mockResolvedValue(mockPosts);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });
  });

  it('should display error message when fetch fails', async () => {
    mockGetAllPosts.mockRejectedValue(new Error('Network error'));

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load posts/i)).toBeInTheDocument();
    });
  });

  it('should have a "New Post" button linking to /admin/new', async () => {
    mockGetAllPosts.mockResolvedValue([]);

    render(<AdminDashboard />);

    await waitFor(() => {
      const newPostLink = screen.getByRole('link', { name: /new post/i });
      expect(newPostLink).toHaveAttribute('href', '/admin/new');
    });
  });

  it('should delete post when delete is confirmed', async () => {
    const user = userEvent.setup();
    mockGetAllPosts.mockResolvedValue(mockPosts);
    mockDeletePost.mockResolvedValue(undefined);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this post?'
    );
    expect(mockDeletePost).toHaveBeenCalledWith('post1');

    await waitFor(() => {
      expect(screen.queryByText('First Post')).not.toBeInTheDocument();
    });
  });

  it('should not delete post when delete is cancelled', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => false);
    mockGetAllPosts.mockResolvedValue(mockPosts);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(mockDeletePost).not.toHaveBeenCalled();
    expect(screen.getByText('First Post')).toBeInTheDocument();
  });

  it('should display error when delete fails', async () => {
    const user = userEvent.setup();
    mockGetAllPosts.mockResolvedValue(mockPosts);
    mockDeletePost.mockRejectedValue(new Error('Delete failed'));

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/failed to delete post/i)).toBeInTheDocument();
    });
  });

  it('should display page title', async () => {
    mockGetAllPosts.mockResolvedValue([]);

    render(<AdminDashboard />);

    expect(screen.getByRole('heading', { name: /posts/i })).toBeInTheDocument();
  });
});
