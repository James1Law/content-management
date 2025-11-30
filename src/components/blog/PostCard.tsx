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
 * Card component for displaying a blog post preview - Synthwave style
 */
export default function PostCard({ post }: PostCardProps): JSX.Element {
  return (
    <article className="group relative">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Card with glow effect on hover */}
        <div className="bg-deep-purple/80 border border-grid/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-neon-pink/50 hover:shadow-neon-pink-sm">
          {/* Cover Image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            {post.coverImage ? (
              <>
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-purple via-transparent to-transparent opacity-60" />
              </>
            ) : (
              <div
                data-testid="image-placeholder"
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-deep-purple to-void"
              >
                <svg
                  className="w-16 h-16 text-grid/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h2 className="text-xl font-orbitron font-semibold text-synth-text mb-2 transition-colors duration-300 group-hover:text-neon-pink">
              {post.title}
            </h2>
            <p className="text-synth-muted line-clamp-2 mb-4 text-sm leading-relaxed">
              {post.summary}
            </p>
            <div className="flex items-center justify-between">
              <time className="text-xs text-neon-cyan font-mono tracking-wider">
                {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}
              </time>
              <span className="text-neon-pink text-sm opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                Read →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
