import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditPostPage from '@/app/admin/edit/[id]/page';
import { getPostById, updatePost } from '@/lib/posts';
import { Post } from '@/lib/types';

// Mock posts module
jest.mock('@/lib/posts', () => ({
  getPostById: jest.fn(),
  updatePost: jest.fn(),
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

// Mock ImageUploader to avoid Firebase import
jest.mock('@/components/admin/ImageUploader', () => {
  return function MockImageUploader({
    label,
    onUpload,
  }: {
    label?: string;
    onUpload: (url: string) => void;
  }) {
    return (
      <div data-testid="image-uploader">
        {label && <span>{label}</span>}
        <button
          type="button"
          onClick={() => onUpload('https://example.com/test.jpg')}
          data-testid="mock-upload-btn"
        >
          Upload
        </button>
      </div>
    );
  };
});

const mockGetPostById = getPostById as jest.Mock;
const mockUpdatePost = updatePost as jest.Mock;

describe('EditPostPage', () => {
  const mockPost: Post = {
    id: 'post1',
    title: 'Existing Post',
    slug: 'existing-post',
    summary: 'Existing summary',
    content: '# Existing content',
    coverImage: null,
    images: [],
    status: 'draft',
    publishedAt: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state while fetching post', () => {
    mockGetPostById.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<EditPostPage params={{ id: 'post1' }} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render form with post data after loading', async () => {
    mockGetPostById.mockResolvedValue(mockPost);

    render(<EditPostPage params={{ id: 'post1' }} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('Existing Post');
    });

    expect(screen.getByLabelText(/slug/i)).toHaveValue('existing-post');
    expect(screen.getByLabelText(/summary/i)).toHaveValue('Existing summary');
    expect(screen.getByLabelText(/content/i)).toHaveValue('# Existing content');
  });

  it('should show error when post not found', async () => {
    mockGetPostById.mockResolvedValue(null);

    render(<EditPostPage params={{ id: 'non-existent' }} />);

    await waitFor(() => {
      expect(screen.getByText(/post not found/i)).toBeInTheDocument();
    });
  });

  it('should show error when fetch fails', async () => {
    mockGetPostById.mockRejectedValue(new Error('Network error'));

    render(<EditPostPage params={{ id: 'post1' }} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load post/i)).toBeInTheDocument();
    });
  });

  it('should update post and redirect on successful submit', async () => {
    const user = userEvent.setup();
    mockGetPostById.mockResolvedValue(mockPost);
    mockUpdatePost.mockResolvedValue({ ...mockPost, title: 'Updated Post' });

    render(<EditPostPage params={{ id: 'post1' }} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('Existing Post');
    });

    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Post');

    await user.click(screen.getByRole('button', { name: /save draft/i }));

    await waitFor(() => {
      expect(mockUpdatePost).toHaveBeenCalledWith(
        'post1',
        expect.objectContaining({
          title: 'Updated Post',
        })
      );
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin');
    });
  });

  it('should show error message when update fails', async () => {
    const user = userEvent.setup();
    mockGetPostById.mockResolvedValue(mockPost);
    mockUpdatePost.mockRejectedValue(new Error('Update failed'));

    render(<EditPostPage params={{ id: 'post1' }} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('Existing Post');
    });

    await user.click(screen.getByRole('button', { name: /save draft/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to update post/i)).toBeInTheDocument();
    });
  });

  it('should have page title "Edit Post"', async () => {
    mockGetPostById.mockResolvedValue(mockPost);

    render(<EditPostPage params={{ id: 'post1' }} />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /edit post/i })).toBeInTheDocument();
    });
  });

  it('should have a back link to admin dashboard', async () => {
    mockGetPostById.mockResolvedValue(mockPost);

    render(<EditPostPage params={{ id: 'post1' }} />);

    await waitFor(() => {
      const backLink = screen.getByRole('link', { name: /back/i });
      expect(backLink).toHaveAttribute('href', '/admin');
    });
  });
});
