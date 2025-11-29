/**
 * Post status - either draft (not visible to public) or published
 */
export type PostStatus = 'draft' | 'published';

/**
 * Blog post document structure matching Firestore schema
 */
export interface Post {
  /** Firestore document ID */
  id: string;
  /** Post title */
  title: string;
  /** URL-friendly identifier (unique) */
  slug: string;
  /** Short excerpt for previews */
  summary: string;
  /** Full post content in Markdown */
  content: string;
  /** Firebase Storage URL for cover image, null if none */
  coverImage: string | null;
  /** Additional image URLs used in content */
  images: string[];
  /** Publication status */
  status: PostStatus;
  /** When post was published, null if still draft */
  publishedAt: Date | null;
  /** When post was created */
  createdAt: Date;
  /** Last modification time */
  updatedAt: Date;
}

/**
 * Data for creating a new post (without auto-generated fields)
 */
export interface CreatePostData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string | null;
  images: string[];
  status: PostStatus;
}

/**
 * Data for updating an existing post (all fields optional)
 */
export interface UpdatePostData {
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  coverImage?: string | null;
  images?: string[];
  status?: PostStatus;
}
