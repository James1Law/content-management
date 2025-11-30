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
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-synth-muted">Loading post...</p>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="text-center py-16">
        <p className="text-neon-pink mb-6 font-orbitron">{error}</p>
        <Link
          href="/admin"
          className="inline-flex items-center px-6 py-3 bg-deep-purple border border-neon-cyan text-neon-cyan rounded-lg hover:shadow-neon-cyan-sm transition-all"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-orbitron font-bold text-synth-text">Edit Post</h1>
        <Link
          href="/admin"
          className="text-synth-muted hover:text-neon-cyan min-h-[44px] flex items-center transition-colors group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          <span className="ml-2">Back</span>
        </Link>
      </div>

      {error && (
        <div className="bg-deep-purple border border-neon-pink/50 text-neon-pink p-4 rounded-lg mb-6 shadow-neon-pink-sm">
          {error}
        </div>
      )}

      {post && <PostForm post={post} onSubmit={handleSubmit} />}
    </div>
  );
}
