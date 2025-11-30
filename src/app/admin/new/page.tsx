'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import { createPost } from '@/lib/posts';
import { CreatePostData } from '@/lib/types';

export default function NewPostPage(): JSX.Element {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: CreatePostData): Promise<void> {
    setError(null);

    try {
      await createPost(data);
      router.push('/admin');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-orbitron font-bold text-synth-text">New Post</h1>
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

      <PostForm onSubmit={handleSubmit} />
    </div>
  );
}
