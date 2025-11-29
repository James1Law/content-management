# Changelog

All notable development progress for this project will be documented in this file.

## [Unreleased]

### Planned Next
- Implement Firebase Auth with login page
- Create AuthProvider context
- Build admin dashboard (list posts)
- Create post editor form

---

## 2025-11-29 - Session 3: Project Initialization

### Added
- Initialized Next.js 14 with App Router, TypeScript, Tailwind CSS, ESLint
- Set up Jest + React Testing Library for TDD
- Configured Firebase SDK (`src/lib/firebase.ts`)
- Created project structure:
  - `src/app/` - App Router pages
  - `src/components/` - admin/, blog/, ui/, providers/
  - `src/lib/` - utilities and Firebase
  - `src/__tests__/` - test files mirroring src structure
- Created `.env.local` with Firebase config
- First passing test (`page.test.tsx`)

### Configuration
- `next.config.mjs` - Firebase Storage image domains configured
- `jest.config.mjs` - Jest with next/jest integration
- `tailwind.config.ts` - Tailwind with CSS variables

### Working Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build (verified working)
- `npm test` - Run Jest tests (1 passing)
- `npm run lint` - ESLint

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
