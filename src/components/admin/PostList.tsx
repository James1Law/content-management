'use client';

import Link from 'next/link';
import { Post } from '@/lib/types';

interface PostListProps {
  posts: Post[];
  onDelete: (id: string) => void;
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
 * Status badge component - Synthwave style
 */
function StatusBadge({ status }: { status: Post['status'] }) {
  const isPublished = status === 'published';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-mono tracking-wider ${
        isPublished
          ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
          : 'bg-neon-orange/20 text-neon-orange border border-neon-orange/30'
      }`}
    >
      {isPublished ? 'LIVE' : 'DRAFT'}
    </span>
  );
}

/**
 * Admin post list component - Synthwave style
 * Displays all posts with status badges, dates, and quick actions
 */
export default function PostList({ posts, onDelete }: PostListProps): JSX.Element {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 bg-deep-purple/50 rounded-lg border border-grid/30">
        <div className="text-4xl mb-4">📝</div>
        <p className="text-synth-muted text-lg mb-4">No transmissions yet</p>
        <Link
          href="/admin/new"
          className="inline-flex items-center px-6 py-3 bg-neon-pink text-white rounded-lg hover:shadow-neon-pink transition-all"
        >
          Create your first post
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-deep-purple/50 border border-grid/30 rounded-lg p-4 hover:border-neon-pink/30 hover:shadow-neon-pink-sm transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Post info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-semibold text-synth-text truncate">
                  {post.title}
                </h3>
                <StatusBadge status={post.status} />
              </div>
              <p className="mt-1 text-sm text-synth-muted line-clamp-2">
                {post.summary || 'No summary'}
              </p>
              <p className="mt-2 text-xs text-grid font-mono">
                Updated {formatDate(post.updatedAt)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/edit/${post.id}`}
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-medium text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg hover:bg-neon-cyan/20 hover:shadow-neon-cyan-sm transition-all"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(post.id)}
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-medium text-neon-pink bg-neon-pink/10 border border-neon-pink/30 rounded-lg hover:bg-neon-pink/20 hover:shadow-neon-pink-sm transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
