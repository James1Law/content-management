'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/blog/PostCard';
import { Post } from '@/lib/types';
import { getPublishedPosts } from '@/lib/posts';

export default function Home(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts(): Promise<void> {
      try {
        const fetchedPosts = await getPublishedPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-gray-600">Thoughts, ideas, and stories</p>
      </header>

      {loading && (
        <div className="flex justify-center py-12">
          <p className="text-gray-500">Loading posts...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts yet</p>
          <p className="text-gray-400 mt-2">Check back soon for new content!</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
