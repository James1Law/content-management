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
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Post, CreatePostData, UpdatePostData } from './types';

const POSTS_COLLECTION = 'posts';

/**
 * Convert Firestore document to Post type
 */
function docToPost(doc: { id: string; data: () => Record<string, unknown> }): Post {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title as string,
    slug: data.slug as string,
    summary: data.summary as string,
    content: data.content as string,
    coverImage: data.coverImage as string | null,
    images: data.images as string[],
    status: data.status as Post['status'],
    publishedAt: data.publishedAt
      ? (data.publishedAt as { toDate: () => Date }).toDate()
      : null,
    createdAt: (data.createdAt as { toDate: () => Date }).toDate(),
    updatedAt: (data.updatedAt as { toDate: () => Date }).toDate(),
  };
}

/**
 * Get all posts (for admin dashboard), ordered by updatedAt descending
 */
export async function getAllPosts(): Promise<Post[]> {
  const postsRef = collection(db, POSTS_COLLECTION);
  const q = query(postsRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(docToPost);
}

/**
 * Get published posts only (for public blog), ordered by publishedAt descending
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const postsRef = collection(db, POSTS_COLLECTION);
  const q = query(
    postsRef,
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(docToPost);
}

/**
 * Get a single post by its slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const postsRef = collection(db, POSTS_COLLECTION);
  const q = query(postsRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);

  if (snapshot.docs.length === 0) {
    return null;
  }

  return docToPost(snapshot.docs[0]);
}

/**
 * Get a single post by its document ID
 */
export async function getPostById(id: string): Promise<Post | null> {
  const docRef = doc(db, POSTS_COLLECTION, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return docToPost({ id: snapshot.id, data: () => snapshot.data() as Record<string, unknown> });
}

/**
 * Create a new post
 */
export async function createPost(data: CreatePostData): Promise<Post> {
  const now = new Date();
  const postsRef = collection(db, POSTS_COLLECTION);

  const postData = {
    ...data,
    publishedAt: data.status === 'published' ? Timestamp.fromDate(now) : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(postsRef, postData);

  return {
    id: docRef.id,
    ...data,
    publishedAt: data.status === 'published' ? now : null,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Update an existing post
 */
export async function updatePost(
  id: string,
  data: UpdatePostData
): Promise<Post | null> {
  const docRef = doc(db, POSTS_COLLECTION, id);

  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  // Set publishedAt when changing status to published
  if (data.status === 'published') {
    updateData.publishedAt = serverTimestamp();
  }

  await updateDoc(docRef, updateData);

  // Fetch and return the updated document
  return getPostById(id);
}

/**
 * Delete a post by ID
 */
export async function deletePost(id: string): Promise<void> {
  const docRef = doc(db, POSTS_COLLECTION, id);
  await deleteDoc(docRef);
}
