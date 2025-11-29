'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import { getPostById, updatePost } from '@/lib/posts';
import { Post, CreatePostData } from '@/lib/types';

interface EditPostPageProps {
  params: { id: string };
}

export default function EditPostPage({ params }: EditPostPageProps): JSX.Element {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost(): Promise<void> {
      try {
        const fetchedPost = await getPostById(params.id);
        if (!fetchedPost) {
          setError('Post not found');
        } else {
          setPost(fetchedPost);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [params.id]);

  async function handleSubmit(data: CreatePostData): Promise<void> {
    setError(null);

    try {
      await updatePost(params.id, data);
      router.push('/admin');
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          href="/admin"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <Link
          href="/admin"
          className="text-gray-600 hover:text-gray-800 min-h-[44px] flex items-center"
        >
          ← Back
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {post && <PostForm post={post} onSubmit={handleSubmit} />}
    </div>
  );
}
