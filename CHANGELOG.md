# Changelog

All notable development progress for this project will be documented in this file.

## [Unreleased]

### Planned Next (Phase 2)
- SEO meta tags for blog posts
- Rich text editor enhancements
- Tags/categories system

---

## 2025-11-30 - Session 8: Firebase Configuration & Bug Fixes

### Fixed
- **Firebase publish hanging issue** - Posts were not saving due to missing Firestore database and security rules
  - Created Firestore database in Firebase Console
  - Added proper security rules allowing public reads and authenticated admin writes
  - Created composite index for `status` + `publishedAt` query
- **Public blog not loading posts** - Security rules were blocking unauthenticated list queries
  - Updated rules to `allow read: if true` for posts collection
  - App code still filters to only show published posts to public users

### Added
- **Firebase configuration files**:
  - `firebase.json` - Firebase project configuration
  - `firestore.rules` - Firestore security rules
  - `firestore.indexes.json` - Composite index definitions
  - `storage.rules` - Firebase Storage security rules
- **Timeout error handling** - Added 10-second timeout to `createPost()` to surface Firebase permission errors instead of hanging indefinitely

### Infrastructure
- Installed Firebase CLI globally (`firebase-tools`)
- Configured Firestore security rules:
  - Anyone can read posts (app filters published only)
  - Only `officerjlaw@gmail.com` can create, update, delete
- Created composite index: `posts` collection on `status` (asc) + `publishedAt` (desc)

---

## 2025-11-29 - Session 7: Markdown Rendering Enhancement

### Added
- **Proper Markdown Rendering** with `react-markdown` and `remark-gfm`:
  - Full GitHub Flavored Markdown support (tables, task lists, strikethrough)
  - Code blocks with syntax highlighting ready
  - Headings, bold, italic, links, lists, blockquotes
  - External links open in new tab automatically
- **PostContent Component** (`src/components/blog/PostContent.tsx`):
  - Reusable markdown renderer using react-markdown
  - Prose styling for beautiful typography
  - Used in both blog post view and admin preview
- **Form Input Visibility Fix**:
  - Added explicit `text-gray-900` color to all form inputs
  - Placeholder text now clearly distinguishable from user input

### Changed
- Blog post page now uses `PostContent` component instead of basic inline renderer
- PostForm preview now uses `PostContent` for consistent rendering
- Removed redundant `MarkdownPreview` and `MarkdownContent` inline functions

### Tests
- 163 passing tests (up from 144)
- New tests: PostContent component (19 tests covering all markdown features)
- Added Jest mocks for react-markdown and remark-gfm ESM modules

### Known Issues
- Save Draft / Publish buttons hanging locally - likely Firebase auth/connection issue
- Need to verify user is logged in before creating posts

---

## 2025-11-29 - Session 6: Image Upload

### Added
- **Image Storage Service** (`src/lib/images.ts`):
  - `uploadImage()` - Upload file to Firebase Storage with unique filename
  - `deleteImage()` - Delete image by URL
  - `getImageUrl()` - Get download URL for storage path
  - Unique filename generation to prevent collisions
  - URL extraction for Firebase Storage paths
- **ImageUploader Component** (`src/components/admin/ImageUploader.tsx`):
  - Drag-and-drop file upload
  - Click to upload with file picker
  - Image preview with remove button
  - Loading state during upload
  - Error handling and display
  - Mobile-friendly with 44px touch targets
- **PostForm Integration**:
  - Cover image field added before Summary
  - Image state management
  - Pass cover image URL on form submit

### Tests
- 144 passing tests (up from 118)
- New tests: Image storage service (10), ImageUploader component (12), PostForm cover image (4)

### Phase 1 Progress
**Phase 1 Core MVP: 100% Complete!**

All features implemented:
- ✅ Authentication with Google Sign-In
- ✅ Admin Dashboard with CRUD operations
- ✅ Post Editor with markdown preview
- ✅ Cover image upload to Firebase Storage
- ✅ Public Blog Homepage
- ✅ Individual Post View

---

## 2025-11-29 - Session 5: Public Blog

### Added
- **PostCard Component** (`src/components/blog/PostCard.tsx`):
  - Displays post preview with cover image, title, summary, date
  - Links to individual post page
  - Responsive image handling with Next.js Image
- **Public Homepage** (`src/app/page.tsx`):
  - Displays grid of published posts
  - Loading, empty, and error states
  - Responsive 2-column grid on desktop
- **Blog Post Page** (`src/app/blog/[slug]/page.tsx`):
  - Full post view with cover image
  - Basic markdown rendering
  - Back navigation
  - Handles 404 for non-existent/draft posts

### Tests
- 118 passing tests (up from 96)
- New tests: PostCard (7), Homepage (7), Blog post page (9)

### Phase 1 Progress
- Phase 1.1 Authentication: ✅ Complete
- Phase 1.2 Admin Dashboard: ✅ Complete
- Phase 1.3 Post Editor: ✅ Complete (except image upload)
- Phase 1.4 Public Blog Homepage: ✅ Complete
- Phase 1.5 Post View: ✅ Complete

**Phase 1 Core MVP: ~90% Complete** (missing image upload)

---

## 2025-11-29 - Session 4: Admin Dashboard & Post Editor

### Added
- **Post Types** (`src/lib/types.ts`):
  - `Post` interface matching Firestore schema
  - `PostStatus` type ('draft' | 'published')
  - `CreatePostData` and `UpdatePostData` interfaces
- **Firestore Posts Service** (`src/lib/posts.ts`):
  - `getAllPosts()` - fetch all posts for admin
  - `getPublishedPosts()` - fetch published posts for public blog
  - `getPostBySlug()` - fetch single post by URL slug
  - `getPostById()` - fetch single post by document ID
  - `createPost()` - create new post
  - `updatePost()` - update existing post
  - `deletePost()` - delete post
- **Slug Utility** (`src/lib/slug.ts`):
  - `generateSlug()` - convert title to URL-friendly slug
  - `isValidSlug()` - validate slug format
- **PostList Component** (`src/components/admin/PostList.tsx`):
  - Displays posts with status badges (Published/Draft)
  - Shows last modified date
  - Edit and Delete actions with 44px touch targets
  - Empty state with link to create first post
  - Mobile-responsive layout
- **PostForm Component** (`src/components/admin/PostForm.tsx`):
  - Title, slug, summary, content fields
  - Auto-generated slug from title (with manual override)
  - Markdown preview toggle
  - Save Draft / Publish buttons
  - Form validation
  - Loading states
- **Admin Dashboard** (`src/app/admin/page.tsx`):
  - Integrated PostList component
  - Loading and error states
  - Delete confirmation dialog
  - "New Post" button
- **New Post Page** (`src/app/admin/new/page.tsx`):
  - Create new posts with PostForm
  - Redirects to dashboard on success
- **Edit Post Page** (`src/app/admin/edit/[id]/page.tsx`):
  - Edit existing posts
  - Loads post data from Firestore
  - Updates post on save

### Tests
- 96 passing tests (up from 19)
- New tests: Post types (3), Posts service (12), Slug utility (17), PostForm (15), PostList (9), Admin pages (13)

### Phase 1 Progress
- Phase 1.1 Authentication: ✅ Complete
- Phase 1.2 Admin Dashboard: ✅ Complete
- Phase 1.3 Post Editor: ✅ Complete (except image upload)
- Phase 1.4 Public Blog Homepage: ⏳ Pending
- Phase 1.5 Post View: ⏳ Pending

---

## 2025-11-29 - Session 3: Project Initialization + Auth

### Added
- **Authentication System (Phase 1.1 complete)**:
  - `AuthProvider` context with Firebase Auth integration
  - Login page (`/login`) with email/password and Google sign-in
  - Protected admin routes with authorization check
  - Single authorized user restriction via `NEXT_PUBLIC_AUTHORIZED_USER_EMAIL`
- **Admin Layout**:
  - Protected `/admin` routes (redirects to login if unauthorized)
  - Admin header with navigation (Dashboard, New Post)
  - Sign out functionality
- **19 passing tests** (TDD approach)

### Project Setup
- Initialized Next.js 14 with App Router, TypeScript, Tailwind CSS, ESLint
- Set up Jest + React Testing Library for TDD
- Configured Firebase SDK (`src/lib/firebase.ts`)
- Created project structure with app, components, lib, and tests directories
- Created `.env.local` with Firebase config

---

## 2024-11-29 - Session 2: MCP & TDD Setup

### Added
- `.mcp.json` - MCP server configuration with:
  - Context7 (up-to-date library documentation)
  - Firebase MCP (Firestore/Storage operations)
  - Memory MCP (persistent knowledge graph)
  - Filesystem MCP (enhanced file operations)
- `.claude/coding-standards.md` - TypeScript, React, and Firebase coding standards
- `.claude/session-context.md` - Tracks current development state
- Updated `CLAUDE.md` with:
  - TDD methodology (Red-Green-Refactor cycle)
  - Test structure and testing tools
  - MCP server documentation
  - Memory file imports using `@` syntax

### Decisions Made
- **TDD Approach**: All code written test-first using Jest + React Testing Library
- **MCP Integration**: Four MCP servers configured for enhanced development workflow
- **Modular Memory**: Using Claude Code's `@import` syntax for organized memory files

### MCP Server Setup Required
To activate MCPs, user needs to:
1. Place Firebase service account JSON at `firebase-service-account.json`
2. Set `FIREBASE_STORAGE_BUCKET` environment variable
3. Restart Claude Code to load MCP configuration

---

## 2024-11-29 - Session 1: Project Planning

### Added
- Project architecture defined
- Tech stack selected:
  - Next.js 14 (App Router)
  - Tailwind CSS
  - Firebase Auth
  - Firestore
  - Firebase Storage
  - Vercel hosting
- Created `CLAUDE.md` with project guidance
- Created `docs/PRD.md` with full product requirements
- Created `CHANGELOG.md` for tracking progress
- Created `/my-memory` command for session continuity

### Decisions Made
- **All-Firestore approach**: Storing post content directly in Firestore (not MDX files) for easier mobile publishing
- **Mobile-first admin**: Full admin functionality optimized for phone usage including photo uploads from camera roll
- **Single-author system**: Firebase Auth restricted to one authorized user
- **Markdown content**: Using Markdown for post content with potential upgrade to rich text editor in Phase 2

### Architecture Defined
- Route structure planned (`/`, `/blog/[slug]`, `/admin`, `/admin/new`, `/admin/edit/[id]`, `/login`)
- Firestore data model defined (posts collection with title, slug, summary, content, coverImage, images, status, timestamps)
- Component structure outlined (admin/, blog/, ui/, providers/)

### Session Notes
- User has existing Firebase project ready to use
- Priority is mobile authoring experience
