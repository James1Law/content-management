import { Post, PostStatus } from '@/lib/types';

describe('Post type', () => {
  it('should have all required fields with correct types', () => {
    const post: Post = {
      id: 'abc123',
      title: 'My First Post',
      slug: 'my-first-post',
      summary: 'A brief summary of the post',
      content: '# Hello World\n\nThis is the post content.',
      coverImage: 'https://storage.googleapis.com/bucket/image.jpg',
      images: ['https://storage.googleapis.com/bucket/img1.jpg'],
      status: 'draft',
      publishedAt: null,
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date('2025-01-01T00:00:00Z'),
    };

    expect(post.id).toBe('abc123');
    expect(post.title).toBe('My First Post');
    expect(post.slug).toBe('my-first-post');
    expect(post.summary).toBe('A brief summary of the post');
    expect(post.content).toBe('# Hello World\n\nThis is the post content.');
    expect(post.coverImage).toBe('https://storage.googleapis.com/bucket/image.jpg');
    expect(post.images).toEqual(['https://storage.googleapis.com/bucket/img1.jpg']);
    expect(post.status).toBe('draft');
    expect(post.publishedAt).toBeNull();
    expect(post.createdAt).toEqual(new Date('2025-01-01T00:00:00Z'));
    expect(post.updatedAt).toEqual(new Date('2025-01-01T00:00:00Z'));
  });

  it('should allow published status with publishedAt date', () => {
    const post: Post = {
      id: 'xyz789',
      title: 'Published Post',
      slug: 'published-post',
      summary: 'This post is published',
      content: 'Content here',
      coverImage: null,
      images: [],
      status: 'published',
      publishedAt: new Date('2025-01-15T12:00:00Z'),
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date('2025-01-15T12:00:00Z'),
    };

    expect(post.status).toBe('published');
    expect(post.publishedAt).toEqual(new Date('2025-01-15T12:00:00Z'));
    expect(post.coverImage).toBeNull();
    expect(post.images).toEqual([]);
  });

  it('should enforce PostStatus as draft or published', () => {
    const draftStatus: PostStatus = 'draft';
    const publishedStatus: PostStatus = 'published';

    expect(draftStatus).toBe('draft');
    expect(publishedStatus).toBe('published');
  });
});
