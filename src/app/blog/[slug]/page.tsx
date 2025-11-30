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
      <main className="min-h-screen max-w-3xl mx-auto px-4 py-12">
        <div className="flex justify-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen max-w-3xl mx-auto px-4 py-12">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="min-h-screen max-w-3xl mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">
            The post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        ← Back
      </Link>

      <article>
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <time className="text-gray-500">
            {post.publishedAt ? formatDate(post.publishedAt) : ''}
          </time>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Content */}
        <PostContent content={post.content} />
      </article>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to all posts
        </Link>
      </footer>
    </main>
  );
}
