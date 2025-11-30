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

  // Common input styles
  const inputStyles = "w-full px-4 py-3 bg-deep-purple border border-grid/50 rounded-lg text-synth-text placeholder:text-synth-muted/50 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan-sm transition-all";
  const labelStyles = "block text-sm font-medium text-synth-muted mb-2";

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className={labelStyles}>
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`${inputStyles} text-lg font-orbitron`}
          placeholder="Enter post title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-neon-pink">{errors.title}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className={labelStyles}>
          Slug
        </label>
        <div className="flex items-center gap-2">
          <span className="text-synth-muted font-mono text-sm">/blog/</span>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className={`${inputStyles} font-mono`}
            placeholder="post-slug"
          />
        </div>
        {errors.slug && (
          <p className="mt-1 text-sm text-neon-pink">{errors.slug}</p>
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
        <label htmlFor="summary" className={labelStyles}>
          Summary
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          className={`${inputStyles} resize-none`}
          placeholder="Brief summary for post previews"
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-neon-pink">{errors.summary}</p>
        )}
      </div>

      {/* Content with Preview Toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className={labelStyles}>
            Content
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`text-sm min-h-[44px] px-4 py-2 rounded-lg transition-all ${
              showPreview
                ? 'text-neon-pink bg-neon-pink/10 border border-neon-pink/30'
                : 'text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30'
            }`}
          >
            {showPreview ? '← Edit' : 'Preview →'}
          </button>
        </div>

        {showPreview ? (
          <div
            data-testid="markdown-preview"
            className="w-full min-h-[300px] px-4 py-3 bg-deep-purple border border-grid/50 rounded-lg"
          >
            {content ? (
              <PostContent content={content} />
            ) : (
              <p className="text-synth-muted/50 italic">Nothing to preview</p>
            )}
          </div>
        ) : (
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className={`${inputStyles} font-mono text-sm`}
            placeholder="Write your post content in Markdown..."
          />
        )}
        {errors.content && (
          <p className="mt-1 text-sm text-neon-pink">{errors.content}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={() => handleSubmit('draft')}
          disabled={isSubmitting}
          className="flex-1 min-h-[44px] px-6 py-3 bg-deep-purple border border-grid text-synth-muted rounded-lg font-medium hover:border-neon-orange hover:text-neon-orange hover:shadow-neon-pink-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            'Save Draft'
          )}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('published')}
          disabled={isSubmitting}
          className="flex-1 min-h-[44px] px-6 py-3 bg-neon-pink text-white rounded-lg font-medium hover:shadow-neon-pink disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            publishButtonText
          )}
        </button>
      </div>
    </form>
  );
}
