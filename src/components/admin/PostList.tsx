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
 * Status badge component
 */
function StatusBadge({ status }: { status: Post['status'] }) {
  const isPublished = status === 'published';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isPublished
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
}

/**
 * Admin post list component
 * Displays all posts with status badges, dates, and quick actions
 */
export default function PostList({ posts, onDelete }: PostListProps): JSX.Element {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No posts yet</p>
        <Link
          href="/admin/new"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          Create your first post
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {posts.map((post) => (
        <article
          key={post.id}
          className="py-4 px-2 sm:px-4 flex flex-col sm:flex-row sm:items-center gap-3"
        >
          {/* Post info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {post.title}
              </h3>
              <StatusBadge status={post.status} />
            </div>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {post.summary}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Updated {formatDate(post.updatedAt)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={`/admin/edit/${post.id}`}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(post.id)}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
