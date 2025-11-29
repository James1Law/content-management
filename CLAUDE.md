# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog CMS with a mobile-first admin interface for writing and publishing blog posts. Single-author system with public-facing blog.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth | Firebase Auth |
| Database | Firestore |
| Images | Firebase Storage |
| Hosting | Vercel |

## Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode

# Firebase
npm run firebase:emulators  # Run local Firebase emulators for dev
```

## Development Approach: Test-Driven Development (TDD)

**All code must be written using TDD. Follow this cycle:**

1. **Red** - Write a failing test first that defines the expected behavior
2. **Green** - Write the minimum code necessary to make the test pass
3. **Refactor** - Clean up the code while keeping tests green

### TDD Rules

- Never write implementation code without a failing test
- Each test should test one thing
- Tests should be independent and isolated
- Use descriptive test names that explain the expected behavior
- Mock external dependencies (Firebase, APIs)

### Test Structure

```
__tests__/
├── components/
│   ├── admin/
│   │   ├── PostForm.test.tsx
│   │   └── ImageUploader.test.tsx
│   └── blog/
│       └── PostCard.test.tsx
├── lib/
│   ├── firebase.test.ts
│   └── posts.test.ts
└── app/
    └── api/
        └── posts.test.ts
```

### Testing Tools

- Jest for test runner
- React Testing Library for component tests
- MSW (Mock Service Worker) for API mocking
- Firebase emulators for integration tests

## MCP Servers

This project uses MCP servers configured in `.mcp.json`:

| Server | Purpose |
|--------|---------|
| `context7` | Up-to-date documentation for libraries (use `use context7` in prompts) |
| `firebase` | Direct Firestore/Storage operations |
| `memory` | Persistent knowledge graph for project context |
| `filesystem` | Enhanced file operations |

### Using Context7

When working with Next.js, Tailwind, Firebase, or other libraries, add `use context7` to your prompt to get current documentation:
- "How do I set up Firebase Auth with Next.js App Router? use context7"
- "What's the correct way to use Tailwind CSS v4? use context7"

## Architecture

### Route Structure

```
app/
├── page.tsx                    # Homepage - published posts list
├── blog/[slug]/page.tsx        # Individual post view
├── login/page.tsx              # Firebase Auth login
├── admin/
│   ├── page.tsx                # Dashboard - all posts (drafts & published)
│   ├── new/page.tsx            # Create new post
│   └── edit/[id]/page.tsx      # Edit existing post
├── api/
│   └── ...                     # API routes if needed
└── layout.tsx                  # Root layout with providers
```

### Firestore Data Model

```
posts/{postId}
  - title: string
  - slug: string
  - summary: string
  - content: string (markdown)
  - coverImage: string (Firebase Storage URL)
  - images: string[] (additional image URLs)
  - status: "draft" | "published"
  - publishedAt: timestamp | null
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Firebase Security Rules

- Admin routes protected by Firebase Auth (single authorized user)
- Firestore rules: only authorized UID can write; public can read published posts only
- Storage rules: only authorized UID can upload

### Key Components

```
components/
├── admin/
│   ├── PostForm.tsx           # Create/edit form (mobile-optimized)
│   ├── ImageUploader.tsx      # Drag-drop + mobile file picker
│   ├── MarkdownEditor.tsx     # Mobile-friendly editor with preview
│   └── PostList.tsx           # Admin post list with status badges
├── blog/
│   ├── PostCard.tsx           # Post preview card for listings
│   ├── PostContent.tsx        # Rendered markdown content
│   └── PostHeader.tsx         # Title, date, cover image
├── ui/
│   └── ...                    # Shared UI components
└── providers/
    └── AuthProvider.tsx       # Firebase auth context
```

## Mobile-First Considerations

- All admin forms use large touch targets (min 44px)
- Image upload supports camera roll / file picker on mobile
- Auto-save drafts to prevent data loss
- Responsive typography scales for readability
- Test all admin flows on mobile viewport during development

## Environment Variables

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=
AUTHORIZED_USER_EMAIL=          # Your email for admin access
```

## Memory & Context Files

@.claude/coding-standards.md
@.claude/session-context.md

## Reference Documents

- `docs/PRD.md` - Full product requirements document
- `CHANGELOG.md` - Development progress and session history
- `.mcp.json` - MCP server configuration
