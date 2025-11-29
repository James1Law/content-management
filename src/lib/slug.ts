/**
 * Generate a URL-friendly slug from a title
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters
 * - Collapses multiple hyphens
 * - Trims leading/trailing hyphens
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove all non-alphanumeric characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Collapse multiple hyphens into one
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Validate that a slug is properly formatted
 * - Lowercase letters, numbers, and hyphens only
 * - No leading/trailing hyphens
 * - No consecutive hyphens
 * - Not empty
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false;

  // Must be lowercase alphanumeric with hyphens
  // Cannot start or end with hyphen
  // Cannot have consecutive hyphens
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}
