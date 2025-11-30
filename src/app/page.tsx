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
    <main className="min-h-screen bg-synth-gradient grid-bg">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero Header */}
        <header className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-4 gradient-text tracking-wider">
            BLOG
          </h1>
          <p className="text-synth-muted text-lg font-light tracking-wide">
            Thoughts, ideas, and stories from the neon frontier
          </p>
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent" />
        </header>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-synth-muted animate-pulse">Loading posts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-deep-purple border border-neon-pink/50 text-neon-pink p-6 rounded-lg shadow-neon-pink-sm text-center">
            <p className="font-orbitron">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🌌</div>
            <p className="text-synth-text text-xl font-orbitron mb-2">No transmissions yet</p>
            <p className="text-synth-muted">Check back soon for new content from the void</p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
