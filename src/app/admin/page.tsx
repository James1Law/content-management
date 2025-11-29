'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PostList from '@/components/admin/PostList';
import { Post } from '@/lib/types';
import { getAllPosts, deletePost } from '@/lib/posts';

export default function AdminDashboard(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts(): Promise<void> {
      try {
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError('Failed to load posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  async function handleDelete(id: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await deletePost(id);
      setPosts((current) => current.filter((post) => post.id !== id));
    } catch (err) {
      setError('Failed to delete post');
      console.error('Error deleting post:', err);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link
          href="/admin/new"
          className="inline-flex items-center justify-center min-h-[44px] px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          New Post
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-gray-500">Loading posts...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {!loading && !error && <PostList posts={posts} onDelete={handleDelete} />}
    </div>
  );
}
