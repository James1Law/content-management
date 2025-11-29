import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/types';

interface PostCardProps {
  post: Post;
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Card component for displaying a blog post preview
 */
export default function PostCard({ post }: PostCardProps): JSX.Element {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Cover Image */}
        <div className="relative aspect-[16/9] mb-4 rounded-lg overflow-hidden bg-gray-100">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div
              data-testid="image-placeholder"
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
            >
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
            {post.title}
          </h2>
          <p className="text-gray-600 line-clamp-2 mb-3">{post.summary}</p>
          <time className="text-sm text-gray-400">
            {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}
          </time>
        </div>
      </Link>
    </article>
  );
}
