import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewPostPage from '@/app/admin/new/page';
import { createPost } from '@/lib/posts';

// Mock posts module
jest.mock('@/lib/posts', () => ({
  createPost: jest.fn(),
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

const mockCreatePost = createPost as jest.Mock;

describe('NewPostPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page with title', () => {
    render(<NewPostPage />);

    expect(screen.getByRole('heading', { name: /new post/i })).toBeInTheDocument();
  });

  it('should render the PostForm component', () => {
    render(<NewPostPage />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/summary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  });

  it('should create post and redirect on successful submit', async () => {
    const user = userEvent.setup();
    mockCreatePost.mockResolvedValue({
      id: 'new-post-id',
      title: 'Test Post',
      slug: 'test-post',
    });

    render(<NewPostPage />);

    await user.type(screen.getByLabelText(/title/i), 'Test Post');
    await user.type(screen.getByLabelText(/summary/i), 'Test summary');
    await user.type(screen.getByLabelText(/content/i), 'Test content');

    await user.click(screen.getByRole('button', { name: /save draft/i }));

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Post',
          slug: 'test-post',
          summary: 'Test summary',
          content: 'Test content',
          status: 'draft',
        })
      );
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin');
    });
  });

  it('should show error message when create fails', async () => {
    const user = userEvent.setup();
    mockCreatePost.mockRejectedValue(new Error('Failed to create'));

    render(<NewPostPage />);

    await user.type(screen.getByLabelText(/title/i), 'Test Post');
    await user.type(screen.getByLabelText(/summary/i), 'Test summary');
    await user.type(screen.getByLabelText(/content/i), 'Test content');

    await user.click(screen.getByRole('button', { name: /save draft/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to create post/i)).toBeInTheDocument();
    });
  });

  it('should have a back link to admin dashboard', () => {
    render(<NewPostPage />);

    const backLink = screen.getByRole('link', { name: /back/i });
    expect(backLink).toHaveAttribute('href', '/admin');
  });
});
