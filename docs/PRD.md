# Product Requirements Document: Personal Blog CMS

## Overview

A personal content management system for publishing blog posts to a public-facing website. Single-author system with mobile-first admin interface.

## Goals

1. **Easy Publishing** - Write and publish blog posts from any device (desktop or mobile)
2. **Beautiful Reading Experience** - Modern, clean UI for readers with excellent typography
3. **Mobile Authoring** - Full admin functionality on mobile including photo uploads from camera roll
4. **Simple Architecture** - Minimal infrastructure, easy to maintain

## User Roles

### Admin (You)
- Single authorized user
- Can create, edit, delete posts
- Can upload images
- Can save drafts and publish
- Access via Firebase Auth (email/password or Google)

### Reader (Public)
- Can view published posts
- Can browse post listings
- No authentication required

## Features

### Phase 1: Core MVP

#### 1.1 Authentication
- [ ] Firebase Auth integration
- [ ] Login page at `/login`
- [ ] Protected admin routes (redirect to login if not authenticated)
- [ ] Single authorized user restriction (check email/UID)
- [ ] Logout functionality

#### 1.2 Admin Dashboard (`/admin`)
- [ ] List all posts (drafts and published)
- [ ] Show post status badges (draft/published)
- [ ] Show last modified date
- [ ] Quick actions: edit, delete, publish/unpublish
- [ ] "New Post" button
- [ ] Mobile-responsive layout

#### 1.3 Post Editor (`/admin/new`, `/admin/edit/[id]`)
- [ ] Title input
- [ ] Slug input (auto-generate from title, allow override)
- [ ] Summary/excerpt input (for previews)
- [ ] Cover image upload
  - [ ] Drag and drop on desktop
  - [ ] File picker on mobile (camera roll support)
  - [ ] Image preview
  - [ ] Upload to Firebase Storage
- [ ] Content editor (Markdown)
  - [ ] Mobile-friendly text input
  - [ ] Preview toggle
  - [ ] Basic formatting toolbar (optional)
- [ ] Additional images within content
- [ ] Save as draft
- [ ] Publish button
- [ ] Auto-save drafts (every 30 seconds or on blur)
- [ ] Large touch targets for mobile (min 44px)

#### 1.4 Public Blog Homepage (`/`)
- [ ] List published posts (newest first)
- [ ] Post cards showing:
  - [ ] Cover image (optimized)
  - [ ] Title
  - [ ] Summary
  - [ ] Published date
- [ ] Responsive grid layout
- [ ] Pagination or infinite scroll

#### 1.5 Post View (`/blog/[slug]`)
- [ ] Full post content rendered from Markdown
- [ ] Cover image (full width, optimized)
- [ ] Title and published date
- [ ] Responsive typography
- [ ] Image optimization via Next.js Image
- [ ] Social sharing meta tags (og:image, etc.)
- [ ] Back to home link

### Phase 2: Enhancements

#### 2.1 Rich Text Editor
- [ ] Replace plain Markdown with Tiptap or similar
- [ ] WYSIWYG editing experience
- [ ] Inline image insertion
- [ ] Mobile toolbar optimization

#### 2.2 Categories/Tags
- [ ] Add tags to posts
- [ ] Filter by tag on homepage
- [ ] Tag pages (`/tag/[tag]`)

#### 2.3 Search
- [ ] Search posts by title/content
- [ ] Search UI on homepage

#### 2.4 Analytics
- [ ] Basic view counts
- [ ] Integration with Vercel Analytics or similar

#### 2.5 RSS Feed
- [ ] Auto-generated RSS feed at `/feed.xml`

#### 2.6 SEO
- [ ] Sitemap generation
- [ ] Structured data (JSON-LD)
- [ ] Canonical URLs

### Phase 3: Nice-to-Have

- [ ] Scheduled publishing
- [ ] Post series/collections
- [ ] Code syntax highlighting
- [ ] Dark mode toggle
- [ ] Email newsletter integration
- [ ] Comments (likely via third-party like Giscus)

## Technical Requirements

### Performance
- Lighthouse score > 90 on mobile
- Images lazy-loaded and optimized
- Core Web Vitals passing

### Security
- Firebase Auth for admin access
- Firestore security rules restricting writes to authorized user
- No sensitive data exposed to client
- Environment variables for all secrets

### Accessibility
- Semantic HTML
- Keyboard navigation
- ARIA labels where needed
- Color contrast meeting WCAG AA

### Browser Support
- Modern browsers (last 2 versions)
- iOS Safari (critical for mobile authoring)
- Chrome, Firefox, Safari, Edge

## Data Model

### Post Document (Firestore: `posts/{postId}`)

| Field | Type | Description |
|-------|------|-------------|
| title | string | Post title |
| slug | string | URL-friendly identifier (unique) |
| summary | string | Short excerpt for previews |
| content | string | Full post content (Markdown) |
| coverImage | string | Firebase Storage URL |
| images | string[] | Additional image URLs |
| status | string | "draft" or "published" |
| publishedAt | timestamp | When post was published (null if draft) |
| createdAt | timestamp | When post was created |
| updatedAt | timestamp | Last modification time |

### Indexes Required
- `posts` where `status == "published"` order by `publishedAt desc`
- `posts` where `slug == X` (for lookups)

## UI/UX Guidelines

### Design Principles
- Clean, minimal aesthetic
- Focus on content/typography
- Generous whitespace
- Mobile-first responsive design

### Typography
- Readable font sizes (16px+ body on mobile)
- Good line height (1.5-1.7 for body)
- Proper heading hierarchy
- Max line width for readability (~65 characters)

### Colors
- To be defined (suggest neutral palette with single accent color)
- Ensure sufficient contrast

### Admin UI
- Clear visual distinction between draft/published
- Obvious save/publish actions
- Confirmation for destructive actions (delete)
- Loading states for async operations
- Error handling with user-friendly messages

## Success Metrics

1. Can publish a post from phone in under 2 minutes
2. Blog loads in under 2 seconds on 3G
3. Zero friction daily/weekly posting workflow
