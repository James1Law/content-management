import {
  getAllPosts,
  getPublishedPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '@/lib/posts';
import { Post, CreatePostData } from '@/lib/types';

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => ({ _serverTimestamp: true })),
  Timestamp: {
    fromDate: jest.fn((date: Date) => ({ toDate: () => date })),
  },
}));

// Mock the firebase module
jest.mock('@/lib/firebase', () => ({
  db: {},
}));

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

const mockGetDocs = getDocs as jest.Mock;
const mockGetDoc = getDoc as jest.Mock;
const mockAddDoc = addDoc as jest.Mock;
const mockUpdateDoc = updateDoc as jest.Mock;
const mockDeleteDoc = deleteDoc as jest.Mock;
const mockQuery = query as jest.Mock;
const mockWhere = where as jest.Mock;
const mockOrderBy = orderBy as jest.Mock;
const mockCollection = collection as jest.Mock;
const mockDoc = doc as jest.Mock;

describe('Posts Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockReturnValue('mockQuery');
    mockWhere.mockReturnValue('mockWhere');
    mockOrderBy.mockReturnValue('mockOrderBy');
    mockCollection.mockReturnValue('mockCollection');
    mockDoc.mockReturnValue('mockDocRef');
  });

  const mockPost: Post = {
    id: 'post1',
    title: 'Test Post',
    slug: 'test-post',
    summary: 'A test post summary',
    content: '# Test Content',
    coverImage: 'https://example.com/image.jpg',
    images: [],
    status: 'published',
    publishedAt: new Date('2025-01-15T12:00:00Z'),
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-15T12:00:00Z'),
  };

  const mockFirestoreDoc = {
    id: 'post1',
    data: () => ({
      title: 'Test Post',
      slug: 'test-post',
      summary: 'A test post summary',
      content: '# Test Content',
      coverImage: 'https://example.com/image.jpg',
      images: [],
      status: 'published',
      publishedAt: { toDate: () => new Date('2025-01-15T12:00:00Z') },
      createdAt: { toDate: () => new Date('2025-01-01T00:00:00Z') },
      updatedAt: { toDate: () => new Date('2025-01-15T12:00:00Z') },
    }),
  };

  describe('getAllPosts', () => {
    it('should return all posts ordered by updatedAt desc', async () => {
      mockGetDocs.mockResolvedValue({
        docs: [mockFirestoreDoc],
      });

      const posts = await getAllPosts();

      expect(mockCollection).toHaveBeenCalled();
      expect(mockOrderBy).toHaveBeenCalledWith('updatedAt', 'desc');
      expect(mockQuery).toHaveBeenCalled();
      expect(posts).toHaveLength(1);
      expect(posts[0].id).toBe('post1');
      expect(posts[0].title).toBe('Test Post');
    });

    it('should return empty array when no posts exist', async () => {
      mockGetDocs.mockResolvedValue({ docs: [] });

      const posts = await getAllPosts();

      expect(posts).toEqual([]);
    });
  });

  describe('getPublishedPosts', () => {
    it('should return only published posts ordered by publishedAt desc', async () => {
      mockGetDocs.mockResolvedValue({
        docs: [mockFirestoreDoc],
      });

      const posts = await getPublishedPosts();

      expect(mockWhere).toHaveBeenCalledWith('status', '==', 'published');
      expect(mockOrderBy).toHaveBeenCalledWith('publishedAt', 'desc');
      expect(posts).toHaveLength(1);
      expect(posts[0].status).toBe('published');
    });
  });

  describe('getPostBySlug', () => {
    it('should return post matching the slug', async () => {
      mockGetDocs.mockResolvedValue({
        docs: [mockFirestoreDoc],
      });

      const post = await getPostBySlug('test-post');

      expect(mockWhere).toHaveBeenCalledWith('slug', '==', 'test-post');
      expect(post).not.toBeNull();
      expect(post?.slug).toBe('test-post');
    });

    it('should return null when no post matches slug', async () => {
      mockGetDocs.mockResolvedValue({ docs: [] });

      const post = await getPostBySlug('non-existent');

      expect(post).toBeNull();
    });
  });

  describe('getPostById', () => {
    it('should return post by document ID', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        id: 'post1',
        data: mockFirestoreDoc.data,
      });

      const post = await getPostById('post1');

      expect(mockDoc).toHaveBeenCalled();
      expect(post).not.toBeNull();
      expect(post?.id).toBe('post1');
    });

    it('should return null when post does not exist', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      const post = await getPostById('non-existent');

      expect(post).toBeNull();
    });
  });

  describe('createPost', () => {
    it('should create a new post and return it with generated ID', async () => {
      const newPostData: CreatePostData = {
        title: 'New Post',
        slug: 'new-post',
        summary: 'A new post',
        content: 'Content here',
        coverImage: null,
        images: [],
        status: 'draft',
      };

      mockAddDoc.mockResolvedValue({ id: 'newPostId' });

      const post = await createPost(newPostData);

      expect(mockAddDoc).toHaveBeenCalled();
      expect(post.id).toBe('newPostId');
      expect(post.title).toBe('New Post');
      expect(post.status).toBe('draft');
      expect(post.publishedAt).toBeNull();
    });

    it('should set publishedAt when status is published', async () => {
      const newPostData: CreatePostData = {
        title: 'Published Post',
        slug: 'published-post',
        summary: 'A published post',
        content: 'Content here',
        coverImage: null,
        images: [],
        status: 'published',
      };

      mockAddDoc.mockResolvedValue({ id: 'publishedPostId' });

      const post = await createPost(newPostData);

      expect(post.status).toBe('published');
      expect(post.publishedAt).not.toBeNull();
    });
  });

  describe('updatePost', () => {
    it('should update post fields', async () => {
      mockUpdateDoc.mockResolvedValue(undefined);
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        id: 'post1',
        data: () => ({
          ...mockFirestoreDoc.data(),
          title: 'Updated Title',
        }),
      });

      const updatedPost = await updatePost('post1', { title: 'Updated Title' });

      expect(mockUpdateDoc).toHaveBeenCalled();
      expect(updatedPost?.title).toBe('Updated Title');
    });

    it('should set publishedAt when changing status to published', async () => {
      mockUpdateDoc.mockResolvedValue(undefined);
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        id: 'post1',
        data: () => ({
          ...mockFirestoreDoc.data(),
          status: 'published',
          publishedAt: { toDate: () => new Date() },
        }),
      });

      const updatedPost = await updatePost('post1', { status: 'published' });

      expect(mockUpdateDoc).toHaveBeenCalled();
      expect(updatedPost?.status).toBe('published');
    });
  });

  describe('deletePost', () => {
    it('should delete post by ID', async () => {
      mockDeleteDoc.mockResolvedValue(undefined);

      await deletePost('post1');

      expect(mockDoc).toHaveBeenCalled();
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});
