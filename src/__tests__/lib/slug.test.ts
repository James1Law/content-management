import { generateSlug, isValidSlug } from '@/lib/slug';

describe('generateSlug', () => {
  it('should convert title to lowercase', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('should replace spaces with hyphens', () => {
    expect(generateSlug('my blog post')).toBe('my-blog-post');
  });

  it('should remove special characters', () => {
    expect(generateSlug('Hello, World!')).toBe('hello-world');
    expect(generateSlug("What's New?")).toBe('whats-new');
    expect(generateSlug('Price: $100')).toBe('price-100');
  });

  it('should handle multiple spaces', () => {
    expect(generateSlug('hello   world')).toBe('hello-world');
  });

  it('should trim leading and trailing spaces', () => {
    expect(generateSlug('  hello world  ')).toBe('hello-world');
  });

  it('should handle numbers', () => {
    expect(generateSlug('Top 10 Tips')).toBe('top-10-tips');
  });

  it('should remove leading/trailing hyphens', () => {
    expect(generateSlug('--hello--')).toBe('hello');
    expect(generateSlug('!hello!')).toBe('hello');
  });

  it('should handle empty string', () => {
    expect(generateSlug('')).toBe('');
  });

  it('should collapse multiple hyphens', () => {
    expect(generateSlug('hello---world')).toBe('hello-world');
    expect(generateSlug('a - b - c')).toBe('a-b-c');
  });

  it('should handle unicode characters by removing them', () => {
    expect(generateSlug('Hello 世界')).toBe('hello');
    expect(generateSlug('Café Latté')).toBe('caf-latt');
  });
});

describe('isValidSlug', () => {
  it('should return true for valid slugs', () => {
    expect(isValidSlug('hello-world')).toBe(true);
    expect(isValidSlug('my-post-123')).toBe(true);
    expect(isValidSlug('a')).toBe(true);
  });

  it('should return false for empty string', () => {
    expect(isValidSlug('')).toBe(false);
  });

  it('should return false for slugs with spaces', () => {
    expect(isValidSlug('hello world')).toBe(false);
  });

  it('should return false for slugs with uppercase', () => {
    expect(isValidSlug('Hello-World')).toBe(false);
  });

  it('should return false for slugs with special characters', () => {
    expect(isValidSlug('hello_world')).toBe(false);
    expect(isValidSlug('hello.world')).toBe(false);
    expect(isValidSlug('hello/world')).toBe(false);
  });

  it('should return false for slugs starting or ending with hyphen', () => {
    expect(isValidSlug('-hello')).toBe(false);
    expect(isValidSlug('hello-')).toBe(false);
  });

  it('should return false for slugs with consecutive hyphens', () => {
    expect(isValidSlug('hello--world')).toBe(false);
  });
});
