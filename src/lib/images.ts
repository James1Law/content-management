import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebase';

/**
 * Generate a unique filename to prevent collisions
 */
function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = originalFilename.split('.').pop() || 'jpg';
  const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
  // Sanitize the filename - remove special characters, replace spaces with hyphens
  const sanitizedName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${timestamp}-${randomStr}-${sanitizedName}.${extension}`;
}

/**
 * Extract storage path from Firebase Storage download URL
 */
function extractPathFromUrl(url: string): string {
  // Firebase Storage URLs look like:
  // https://firebasestorage.googleapis.com/v0/b/BUCKET/o/PATH?alt=media&token=...
  // We need to extract and decode the PATH portion
  const match = url.match(/\/o\/([^?]+)/);
  if (!match) {
    throw new Error('Invalid Firebase Storage URL');
  }
  return decodeURIComponent(match[1]);
}

/**
 * Upload an image file to Firebase Storage
 * @param file - The file to upload
 * @param pathPrefix - Optional path prefix (default: 'images')
 * @returns The download URL for the uploaded image
 */
export async function uploadImage(
  file: File,
  pathPrefix: string = 'images'
): Promise<string> {
  const uniqueFilename = generateUniqueFilename(file.name);
  const storagePath = `${pathPrefix}/${uniqueFilename}`;
  const storageRef = ref(storage, storagePath);

  // Add timeout to detect hanging Firebase operations (usually security rules issue)
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Image upload timed out. Please check Firebase Storage security rules in the Firebase Console.'));
    }, 30000); // 30 second timeout for uploads
  });

  const uploadPromise = async (): Promise<string> => {
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  return Promise.race([uploadPromise(), timeoutPromise]);
}

/**
 * Delete an image from Firebase Storage by its URL
 * @param imageUrl - The download URL of the image to delete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  const storagePath = extractPathFromUrl(imageUrl);
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
}

/**
 * Get the download URL for an image at a given storage path
 * @param path - The storage path of the image
 * @returns The download URL
 */
export async function getImageUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}
