'use client';

import { useState, useEffect } from 'react';
import { Post, CreatePostData } from '@/lib/types';
import { generateSlug, isValidSlug } from '@/lib/slug';
import ImageUploader from './ImageUploader';
import PostContent from '@/components/blog/PostContent';

interface PostFormProps {
  post?: Post;
  onSubmit: (data: CreatePostData) => Promise<void>;
}

interface FormErrors {
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
}

export default function PostForm({ post, onSubmit }: PostFormProps): JSX.Element {
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [summary, setSummary] = useState(post?.summary ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [coverImage, setCoverImage] = useState<string | null>(post?.coverImage ?? null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!post);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Auto-generate slug from title (only for new posts, and only if not manually edited)
  useEffect(() => {
    if (!post && !slugManuallyEdited) {
      setSlug(generateSlug(title));
    }
  }, [title, post, slugManuallyEdited]);

  function handleSlugChange(value: string): void {
    setSlugManuallyEdited(true);
    setSlug(value);
  }

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!isValidSlug(slug)) {
      newErrors.slug = 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.';
    }

    return newErrors;
  }

  async function handleSubmit(status: 'draft' | 'published'): Promise<void> {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        slug: slug.trim(),
        summary: summary.trim(),
        content,
        coverImage,
        images: post?.images ?? [],
        status,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isEditing = !!post;
  const isPublished = post?.status === 'published';
  // Button text logic:
  // - New post: "Publish"
  // - Editing published post: "Update"
  // - Editing draft: "Publish"
  const publishButtonText = isEditing && isPublished ? 'Update' : 'Publish';

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
          placeholder="Enter post title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Slug
        </label>
        <div className="flex items-center">
          <span className="text-gray-500 mr-1">/blog/</span>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="flex-1 px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
            placeholder="post-slug"
          />
        </div>
        {errors.slug && (
          <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
        )}
      </div>

      {/* Cover Image */}
      <ImageUploader
        imageUrl={coverImage}
        onUpload={(url) => setCoverImage(url)}
        onRemove={() => setCoverImage(null)}
        label="Cover Image"
      />

      {/* Summary */}
      <div>
        <label
          htmlFor="summary"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Summary
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none placeholder:text-gray-400"
          placeholder="Brief summary for post previews"
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600">{errors.summary}</p>
        )}
      </div>

      {/* Content with Preview Toggle */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-blue-600 hover:text-blue-800 min-h-[44px] px-3"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>

        {showPreview ? (
          <div
            data-testid="markdown-preview"
            className="w-full min-h-[300px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
          >
            {content ? (
              <PostContent content={content} />
            ) : (
              <p className="text-gray-400 italic">Nothing to preview</p>
            )}
          </div>
        ) : (
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm placeholder:text-gray-400"
            placeholder="Write your post content in Markdown..."
          />
        )}
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={() => handleSubmit('draft')}
          disabled={isSubmitting}
          className="flex-1 min-h-[44px] px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('published')}
          disabled={isSubmitting}
          className="flex-1 min-h-[44px] px-6 py-3 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : publishButtonText}
        </button>
      </div>
    </form>
  );
}

