import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageUploader from '@/components/admin/ImageUploader';
import { uploadImage, deleteImage } from '@/lib/images';

// Mock the images module
jest.mock('@/lib/images', () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
}));

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

const mockUploadImage = uploadImage as jest.Mock;
const mockDeleteImage = deleteImage as jest.Mock;

describe('ImageUploader', () => {
  const mockOnUpload = jest.fn();
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render upload area when no image is set', () => {
    render(<ImageUploader onUpload={mockOnUpload} />);

    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
    expect(screen.getByText(/or drag and drop/i)).toBeInTheDocument();
  });

  it('should render image preview when imageUrl is provided', () => {
    render(
      <ImageUploader
        imageUrl="https://example.com/image.jpg"
        onUpload={mockOnUpload}
        onRemove={mockOnRemove}
      />
    );

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should show remove button when image is present', () => {
    render(
      <ImageUploader
        imageUrl="https://example.com/image.jpg"
        onUpload={mockOnUpload}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });

  it('should accept image files only', () => {
    render(<ImageUploader onUpload={mockOnUpload} />);

    const input = screen.getByTestId('file-input');
    expect(input).toHaveAttribute('accept', 'image/*');
  });

  it('should upload file and call onUpload with URL', async () => {
    const mockUrl = 'https://storage.example.com/uploaded-image.jpg';
    mockUploadImage.mockResolvedValue(mockUrl);

    render(<ImageUploader onUpload={mockOnUpload} />);

    const file = new File(['test content'], 'test-image.jpg', {
      type: 'image/jpeg',
    });
    const input = screen.getByTestId('file-input');

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(mockUploadImage).toHaveBeenCalledWith(file);
      expect(mockOnUpload).toHaveBeenCalledWith(mockUrl);
    });
  });

  it('should show loading state during upload', async () => {
    mockUploadImage.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve('url'), 100))
    );

    render(<ImageUploader onUpload={mockOnUpload} />);

    const file = new File(['test content'], 'test-image.jpg', {
      type: 'image/jpeg',
    });
    const input = screen.getByTestId('file-input');

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText(/uploading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalled();
    });
  });

  it('should show error message on upload failure', async () => {
    mockUploadImage.mockRejectedValue(new Error('Upload failed'));

    render(<ImageUploader onUpload={mockOnUpload} />);

    const file = new File(['test content'], 'test-image.jpg', {
      type: 'image/jpeg',
    });
    const input = screen.getByTestId('file-input');

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
    });
  });

  it('should call onRemove when remove button is clicked', async () => {
    render(
      <ImageUploader
        imageUrl="https://example.com/image.jpg"
        onUpload={mockOnUpload}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByRole('button', { name: /remove/i });
    await userEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalled();
  });

  it('should display label text when provided', () => {
    render(<ImageUploader onUpload={mockOnUpload} label="Cover Image" />);

    expect(screen.getByText('Cover Image')).toBeInTheDocument();
  });

  it('should have minimum touch target size of 44px for mobile', () => {
    render(
      <ImageUploader
        imageUrl="https://example.com/image.jpg"
        onUpload={mockOnUpload}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByRole('button', { name: /remove/i });
    expect(removeButton).toHaveClass('min-h-[44px]');
  });

  it('should support drag and drop', async () => {
    const mockUrl = 'https://storage.example.com/dropped-image.jpg';
    mockUploadImage.mockResolvedValue(mockUrl);

    render(<ImageUploader onUpload={mockOnUpload} />);

    const dropZone = screen.getByTestId('drop-zone');

    const file = new File(['test content'], 'dropped-image.jpg', {
      type: 'image/jpeg',
    });

    const dataTransfer = {
      files: [file],
      items: [{ kind: 'file', type: 'image/jpeg', getAsFile: () => file }],
      types: ['Files'],
    };

    fireEvent.dragOver(dropZone, { dataTransfer });
    fireEvent.drop(dropZone, { dataTransfer });

    await waitFor(() => {
      expect(mockUploadImage).toHaveBeenCalledWith(file);
      expect(mockOnUpload).toHaveBeenCalledWith(mockUrl);
    });
  });

  it('should highlight drop zone on drag over', () => {
    render(<ImageUploader onUpload={mockOnUpload} />);

    const dropZone = screen.getByTestId('drop-zone');

    fireEvent.dragEnter(dropZone);
    expect(dropZone).toHaveClass('border-blue-500');

    fireEvent.dragLeave(dropZone);
    expect(dropZone).not.toHaveClass('border-blue-500');
  });
});
