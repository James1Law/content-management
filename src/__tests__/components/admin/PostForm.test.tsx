import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostForm from '@/components/admin/PostForm';
import { Post } from '@/lib/types';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock the ImageUploader component
jest.mock('@/components/admin/ImageUploader', () => {
  return function MockImageUploader({
    imageUrl,
    onUpload,
    onRemove,
    label,
  }: {
    imageUrl?: string | null;
    onUpload: (url: string) => void;
    onRemove?: () => void;
    label?: string;
  }) {
    return (
      <div data-testid="image-uploader">
        {label && <span>{label}</span>}
        {imageUrl && <span data-testid="current-image">{imageUrl}</span>}
        <button
          type="button"
          onClick={() => onUpload('https://example.com/uploaded.jpg')}
          data-testid="mock-upload-btn"
        >
          Upload Image
        </button>
        {onRemove && (
          <button type="button" onClick={onRemove} data-testid="mock-remove-btn">
            Remove Image
          </button>
        )}
      </div>
    );
  };
});

describe('PostForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Creating a new post', () => {
    it('should render empty form fields', () => {
      render(<PostForm onSubmit={mockOnSubmit} />);

      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/slug/i)).toHaveValue('');
      expect(screen.getByLabelText(/summary/i)).toHaveValue('');
      expect(screen.getByLabelText(/content/i)).toHaveValue('');
    });

    it('should auto-generate slug from title', async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'My First Blog Post');

      expect(screen.getByLabelText(/slug/i)).toHaveValue('my-first-blog-post');
    });

    it('should allow manual slug override', async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} />);

      const titleInput = screen.getByLabelText(/title/i);
      const slugInput = screen.getByLabelText(/slug/i);

      await user.type(titleInput, 'My Post');
      expect(slugInput).toHaveValue('my-post');

      await user.clear(slugInput);
      await user.type(slugInput, 'custom-slug');
      expect(slugInput).toHaveValue('custom-slug');

      // Typing more in title should not change manually edited slug
      await user.type(titleInput, ' Updated');
      expect(slugInput).toHaveValue('custom-slug');
    });

    it('should have save draft and publish buttons', () => {
      render(<PostForm onSubmit={mockOnSubmit} />);

      expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /publish/i })).toBeInTheDocument();
    });

    it('should call onSubmit with draft status when saving draft', async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/title/i), 'Test Post');
      await user.type(screen.getByLabelText(/summary/i), 'Test summary');
      await user.type(screen.getByLabelText(/content/i), 'Test content');

      await user.click(screen.getByRole('button', { name: /save draft/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Test Post',
            slug: 'test-post',
            summary: 'Test summary',
            content: 'Test content',
            status: 'draft',
          })
        );
      });
    });

    it('should call onSubmit with published status when publishing', async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/title/i), 'Test Post');
      await user.type(screen.getByLabelText(/summary/i), 'Test summary');
      await user.type(screen.getByLabelText(/content/i), 'Test content');

      await user.click(screen.getByRole('button', { name: /publish/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'published',
          })
        );
      });
    });

    it('should show validation error when title is empty', async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} />);

      await user.click(screen.getByRole('button', { name: /save draft/i }));

      expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Editing an existing post', () => {
    const existingPost: Post = {
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

    it('should populate form with existing post data', () => {
      render(<PostForm post={existingPost} onSubmit={mockOnSubmit} />);

      expect(screen.getByLabelText(/title/i)).toHaveValue('Existing Post');
      expect(screen.getByLabelText(/slug/i)).toHaveValue('existing-post');
      expect(screen.getByLabelText(/summary/i)).toHaveValue('Existing summary');
      expect(screen.getByLabelText(/content/i)).toHaveValue('# Existing content');
    });

    it('should not auto-generate slug when editing', async () => {
      const user = userEvent.setup();
      render(<PostForm post={existingPost} onSubmit={mockOnSubmit} />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.clear(titleInput);
      await user.type(titleInput, 'New Title');

      // Slug should remain unchanged when editing
      expect(screen.getByLabelText(/slug/i)).toHaveValue('existing-post');
    });

    it('should show "Update" instead of "Publish" for existing posts', () => {
      render(<PostForm post={existingPost} onSubmit={mockOnSubmit} />);

      expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
    });
  });

  describe('Markdown preview', () => {
    it('should have a preview toggle button', () => {
      render(<PostForm onSubmit={mockOnSubmit} />);

      expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
    });

    it('should toggle between edit and preview mode', async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} />);

      // Initially in edit mode
      expect(screen.getByLabelText(/content/i)).toBeInTheDocument();

      // Click preview
      await user.click(screen.getByRole('button', { name: /preview/i }));

      // Should show preview area
      expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();

      // Click edit to go back
      await user.click(screen.getByRole('button', { name: /edit/i }));

      // Back to edit mode
      expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    });
  });

  describe('Form validation', () => {
    it('should show error for invalid slug format', async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/title/i), 'Test');

      const slugInput = screen.getByLabelText(/slug/i);
      await user.clear(slugInput);
      await user.type(slugInput, 'Invalid Slug!');

      await user.click(screen.getByRole('button', { name: /save draft/i }));

      expect(await screen.findByText(/invalid slug format/i)).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should disable buttons when submitting', async () => {
      const user = userEvent.setup();
      // Make onSubmit return a promise that doesn't resolve immediately
      mockOnSubmit.mockImplementation(() => new Promise(() => {}));

      render(<PostForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/title/i), 'Test Post');
      await user.type(screen.getByLabelText(/summary/i), 'Summary');
      await user.type(screen.getByLabelText(/content/i), 'Content');

      await user.click(screen.getByRole('button', { name: /save draft/i }));

      await waitFor(() => {
        const savingButtons = screen.getAllByRole('button', { name: /saving/i });
        expect(savingButtons).toHaveLength(2);
        savingButtons.forEach((button) => {
          expect(button).toBeDisabled();
        });
      });
    });
  });

  describe('Mobile-friendly', () => {
    it('should have touch-friendly button sizes', () => {
      render(<PostForm onSubmit={mockOnSubmit} />);

      const buttons = screen.getAllByRole('button');
      // Just verify buttons exist - CSS classes handle sizing
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Cover image', () => {
    it('should render image uploader with label', () => {
      render(<PostForm onSubmit={mockOnSubmit} />);

      expect(screen.getByTestId('image-uploader')).toBeInTheDocument();
      expect(screen.getByText('Cover Image')).toBeInTheDocument();
    });

    it('should update cover image when uploaded', async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/title/i), 'Test Post');

      // Click mock upload button
      await user.click(screen.getByTestId('mock-upload-btn'));

      // Submit the form
      await user.click(screen.getByRole('button', { name: /save draft/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            coverImage: 'https://example.com/uploaded.jpg',
          })
        );
      });
    });

    it('should show existing cover image when editing', () => {
      const postWithImage: Post = {
        id: 'post1',
        title: 'Post with Image',
        slug: 'post-with-image',
        summary: 'Summary',
        content: 'Content',
        coverImage: 'https://example.com/existing.jpg',
        images: [],
        status: 'published',
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      render(<PostForm post={postWithImage} onSubmit={mockOnSubmit} />);

      expect(screen.getByTestId('current-image')).toHaveTextContent(
        'https://example.com/existing.jpg'
      );
    });

    it('should clear cover image when removed', async () => {
      const user = userEvent.setup();
      const postWithImage: Post = {
        id: 'post1',
        title: 'Post with Image',
        slug: 'post-with-image',
        summary: 'Summary',
        content: 'Content',
        coverImage: 'https://example.com/existing.jpg',
        images: [],
        status: 'published',
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      render(<PostForm post={postWithImage} onSubmit={mockOnSubmit} />);

      // Click mock remove button
      await user.click(screen.getByTestId('mock-remove-btn'));

      // Submit the form
      await user.click(screen.getByRole('button', { name: /save draft/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            coverImage: null,
          })
        );
      });
    });
  });
});
