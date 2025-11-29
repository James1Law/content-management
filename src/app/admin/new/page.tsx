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
        <h1 className="text-2xl font-bold">New Post</h1>
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

      <PostForm onSubmit={handleSubmit} />
    </div>
  );
}
