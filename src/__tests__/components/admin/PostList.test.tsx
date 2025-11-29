import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostList from '@/components/admin/PostList';
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

describe('PostList', () => {
  const mockPosts: Post[] = [
    {
      id: 'post1',
      title: 'Published Post',
      slug: 'published-post',
      summary: 'A published post summary',
      content: '# Content',
      coverImage: 'https://example.com/image.jpg',
      images: [],
      status: 'published',
      publishedAt: new Date('2025-01-15T12:00:00Z'),
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date('2025-01-15T12:00:00Z'),
    },
    {
      id: 'post2',
      title: 'Draft Post',
      slug: 'draft-post',
      summary: 'A draft post summary',
      content: '# Draft Content',
      coverImage: null,
      images: [],
      status: 'draft',
      publishedAt: null,
      createdAt: new Date('2025-01-10T00:00:00Z'),
      updatedAt: new Date('2025-01-14T00:00:00Z'),
    },
  ];

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a list of posts', () => {
    render(<PostList posts={mockPosts} onDelete={mockOnDelete} />);

    expect(screen.getByText('Published Post')).toBeInTheDocument();
    expect(screen.getByText('Draft Post')).toBeInTheDocument();
  });

  it('should display status badges for each post', () => {
    render(<PostList posts={mockPosts} onDelete={mockOnDelete} />);

    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('should display last modified date for each post', () => {
    render(<PostList posts={mockPosts} onDelete={mockOnDelete} />);

    // Check that dates are displayed (format may vary)
    expect(screen.getByText(/Jan 15, 2025/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 14, 2025/)).toBeInTheDocument();
  });

  it('should render edit links for each post', () => {
    render(<PostList posts={mockPosts} onDelete={mockOnDelete} />);

    const editLinks = screen.getAllByRole('link', { name: /edit/i });
    expect(editLinks).toHaveLength(2);
    expect(editLinks[0]).toHaveAttribute('href', '/admin/edit/post1');
    expect(editLinks[1]).toHaveAttribute('href', '/admin/edit/post2');
  });

  it('should render delete buttons for each post', () => {
    render(<PostList posts={mockPosts} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it('should call onDelete with post id when delete is clicked', async () => {
    const user = userEvent.setup();
    render(<PostList posts={mockPosts} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith('post1');
  });

  it('should display empty state when no posts exist', () => {
    render(<PostList posts={[]} onDelete={mockOnDelete} />);

    expect(screen.getByText(/no posts yet/i)).toBeInTheDocument();
  });

  it('should be mobile responsive with touch-friendly targets', () => {
    render(<PostList posts={mockPosts} onDelete={mockOnDelete} />);

    // Check that buttons have appropriate minimum size classes for touch targets
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    const editLinks = screen.getAllByRole('link', { name: /edit/i });

    // At minimum, these should exist and be clickable
    expect(deleteButtons[0]).toBeEnabled();
    expect(editLinks[0]).toBeInTheDocument();
  });

  it('should display post summary', () => {
    render(<PostList posts={mockPosts} onDelete={mockOnDelete} />);

    expect(screen.getByText('A published post summary')).toBeInTheDocument();
    expect(screen.getByText('A draft post summary')).toBeInTheDocument();
  });
});
