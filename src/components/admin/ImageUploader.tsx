'use client';

import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { uploadImage } from '@/lib/images';

interface ImageUploaderProps {
  imageUrl?: string | null;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  label?: string;
}

export default function ImageUploader({
  imageUrl,
  onUpload,
  onRemove,
  label,
}: ImageUploaderProps): JSX.Element {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      try {
        const url = await uploadImage(file);
        onUpload(url);
      } catch (err) {
        console.error('Upload error:', err);
        setError('Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleUpload(file);
    }
  };

  // Show image preview if we have an image
  if (imageUrl) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-synth-muted">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-deep-purple border border-grid/30">
            <Image
              src={imageUrl}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-void/30 via-transparent to-transparent" />
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 min-h-[44px] min-w-[44px] px-3 py-2 bg-neon-pink text-white rounded-lg hover:shadow-neon-pink transition-all flex items-center justify-center"
              aria-label="Remove image"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show upload area
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-synth-muted">
          {label}
        </label>
      )}
      <div
        data-testid="drop-zone"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragOver
            ? 'border-neon-cyan bg-neon-cyan/5 shadow-neon-cyan-sm'
            : 'border-grid/50 hover:border-neon-pink/50 bg-deep-purple/50'
        } ${uploading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
          data-testid="file-input"
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="w-10 h-10 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-synth-muted">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <svg
              className="w-12 h-12 mx-auto text-grid"
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
            <p className="text-synth-text">
              <span className="text-neon-cyan font-medium">Click to upload</span>
              <br />
              <span className="text-sm text-synth-muted">or drag and drop</span>
            </p>
            <p className="text-xs text-grid">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-neon-pink" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
