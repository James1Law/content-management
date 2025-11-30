'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/types';
import { getPostBySlug } from '@/lib/posts';
import PostContent from '@/components/blog/PostContent';

interface BlogPostPageProps {
  params: { slug: string };
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPostPage({ params }: BlogPostPageProps): JSX.Element {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost(): Promise<void> {
      try {
        const fetchedPost = await getPostBySlug(params.slug);

        // Check if post exists and is published
        if (!fetchedPost || fetchedPost.status !== 'published') {
          setNotFound(true);
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
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-synth-gradient">
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-synth-muted animate-pulse">Loading transmission...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-synth-gradient">
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-neon-pink mb-6 font-orbitron">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center text-neon-cyan hover:text-neon-pink transition-colors"
            >
              ← Return to Base
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="min-h-screen bg-synth-gradient grid-bg">
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="text-6xl mb-6">📡</div>
            <h1 className="text-3xl font-orbitron font-bold text-synth-text mb-4">
              Signal Lost
            </h1>
            <p className="text-synth-muted mb-8">
              The transmission you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-deep-purple border border-neon-cyan text-neon-cyan rounded-lg hover:shadow-neon-cyan-sm transition-all"
            >
              ← Return to Base
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-synth-gradient">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center text-synth-muted hover:text-neon-cyan transition-colors mb-8 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          <span className="ml-2">Back to all posts</span>
        </Link>

        <article>
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-orbitron font-bold gradient-text-pink-cyan mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <time className="text-neon-cyan font-mono text-sm tracking-wider">
                {post.publishedAt ? formatDate(post.publishedAt) : ''}
              </time>
            </div>
            <div className="mt-6 h-px bg-gradient-to-r from-neon-pink via-neon-purple to-transparent" />
          </header>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative aspect-[16/9] mb-10 rounded-lg overflow-hidden border border-grid/30">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-transparent" />
            </div>
          )}

          {/* Content */}
          <PostContent content={post.content} />
        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-grid/30">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-deep-purple border border-neon-pink text-neon-pink rounded-lg hover:shadow-neon-pink-sm transition-all group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            <span className="ml-2">Back to all posts</span>
          </Link>
        </footer>
      </div>
    </main>
  );
}
