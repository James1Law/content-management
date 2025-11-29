import { uploadImage, deleteImage, getImageUrl } from '@/lib/images';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

// Mock Firebase Storage
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  storage: {},
}));

const mockRef = ref as jest.Mock;
const mockUploadBytes = uploadBytes as jest.Mock;
const mockGetDownloadURL = getDownloadURL as jest.Mock;
const mockDeleteObject = deleteObject as jest.Mock;

describe('Image Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload an image and return the download URL', async () => {
      const mockFile = new File(['test content'], 'test-image.jpg', {
        type: 'image/jpeg',
      });
      const mockStorageRef = { fullPath: 'images/test-image.jpg' };
      const mockDownloadUrl = 'https://storage.example.com/images/test-image.jpg';

      mockRef.mockReturnValue(mockStorageRef);
      mockUploadBytes.mockResolvedValue({ ref: mockStorageRef });
      mockGetDownloadURL.mockResolvedValue(mockDownloadUrl);

      const result = await uploadImage(mockFile);

      expect(mockRef).toHaveBeenCalledWith(storage, expect.stringContaining('images/'));
      expect(mockUploadBytes).toHaveBeenCalledWith(mockStorageRef, mockFile);
      expect(mockGetDownloadURL).toHaveBeenCalledWith(mockStorageRef);
      expect(result).toBe(mockDownloadUrl);
    });

    it('should generate a unique filename to prevent collisions', async () => {
      const mockFile = new File(['test content'], 'test-image.jpg', {
        type: 'image/jpeg',
      });
      const mockStorageRef = { fullPath: 'images/unique-id-test-image.jpg' };

      mockRef.mockReturnValue(mockStorageRef);
      mockUploadBytes.mockResolvedValue({ ref: mockStorageRef });
      mockGetDownloadURL.mockResolvedValue('https://storage.example.com/test.jpg');

      await uploadImage(mockFile);

      // The path should contain the original filename but with a unique prefix
      const calledPath = mockRef.mock.calls[0][1];
      expect(calledPath).toMatch(/^images\/[a-z0-9-]+-test-image\.jpg$/);
    });

    it('should preserve file extension', async () => {
      const mockFilePng = new File(['test content'], 'my-photo.png', {
        type: 'image/png',
      });
      const mockStorageRef = { fullPath: 'images/unique-id-my-photo.png' };

      mockRef.mockReturnValue(mockStorageRef);
      mockUploadBytes.mockResolvedValue({ ref: mockStorageRef });
      mockGetDownloadURL.mockResolvedValue('https://storage.example.com/test.png');

      await uploadImage(mockFilePng);

      const calledPath = mockRef.mock.calls[0][1];
      expect(calledPath).toMatch(/\.png$/);
    });

    it('should throw error on upload failure', async () => {
      const mockFile = new File(['test content'], 'test-image.jpg', {
        type: 'image/jpeg',
      });

      mockRef.mockReturnValue({});
      mockUploadBytes.mockRejectedValue(new Error('Upload failed'));

      await expect(uploadImage(mockFile)).rejects.toThrow('Upload failed');
    });

    it('should allow custom path prefix', async () => {
      const mockFile = new File(['test content'], 'cover.jpg', {
        type: 'image/jpeg',
      });
      const mockStorageRef = { fullPath: 'posts/abc123/cover.jpg' };

      mockRef.mockReturnValue(mockStorageRef);
      mockUploadBytes.mockResolvedValue({ ref: mockStorageRef });
      mockGetDownloadURL.mockResolvedValue('https://storage.example.com/posts/abc123/cover.jpg');

      await uploadImage(mockFile, 'posts/abc123');

      const calledPath = mockRef.mock.calls[0][1];
      expect(calledPath).toMatch(/^posts\/abc123\//);
    });
  });

  describe('deleteImage', () => {
    it('should delete an image by URL', async () => {
      const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/bucket/o/images%2Ftest.jpg?alt=media';
      const mockStorageRef = { fullPath: 'images/test.jpg' };

      mockRef.mockReturnValue(mockStorageRef);
      mockDeleteObject.mockResolvedValue(undefined);

      await deleteImage(imageUrl);

      expect(mockRef).toHaveBeenCalled();
      expect(mockDeleteObject).toHaveBeenCalledWith(mockStorageRef);
    });

    it('should throw error on delete failure', async () => {
      const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/bucket/o/images%2Ftest.jpg?alt=media';

      mockRef.mockReturnValue({});
      mockDeleteObject.mockRejectedValue(new Error('Delete failed'));

      await expect(deleteImage(imageUrl)).rejects.toThrow('Delete failed');
    });

    it('should handle URLs with encoded characters', async () => {
      const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/bucket/o/images%2Fmy%20photo.jpg?alt=media';
      const mockStorageRef = { fullPath: 'images/my photo.jpg' };

      mockRef.mockReturnValue(mockStorageRef);
      mockDeleteObject.mockResolvedValue(undefined);

      await deleteImage(imageUrl);

      expect(mockDeleteObject).toHaveBeenCalled();
    });
  });

  describe('getImageUrl', () => {
    it('should get download URL for a storage path', async () => {
      const path = 'images/test.jpg';
      const mockStorageRef = { fullPath: path };
      const mockDownloadUrl = 'https://storage.example.com/images/test.jpg';

      mockRef.mockReturnValue(mockStorageRef);
      mockGetDownloadURL.mockResolvedValue(mockDownloadUrl);

      const result = await getImageUrl(path);

      expect(mockRef).toHaveBeenCalledWith(storage, path);
      expect(mockGetDownloadURL).toHaveBeenCalledWith(mockStorageRef);
      expect(result).toBe(mockDownloadUrl);
    });

    it('should throw error if path does not exist', async () => {
      const path = 'images/nonexistent.jpg';

      mockRef.mockReturnValue({});
      mockGetDownloadURL.mockRejectedValue(new Error('Object not found'));

      await expect(getImageUrl(path)).rejects.toThrow('Object not found');
    });
  });
});
