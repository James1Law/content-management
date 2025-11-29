# Coding Standards

## TypeScript

- Use strict TypeScript (`strict: true` in tsconfig)
- Prefer interfaces over types for object shapes
- Use explicit return types on functions
- No `any` types - use `unknown` if type is truly unknown

## React / Next.js

- Use functional components with hooks
- Prefer Server Components where possible (App Router default)
- Use `'use client'` directive only when needed (interactivity, hooks)
- Colocate related files (component + test + styles)

## Naming Conventions

- Components: PascalCase (`PostCard.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Utilities: camelCase (`formatDate.ts`)
- Constants: SCREAMING_SNAKE_CASE
- Test files: `*.test.ts` or `*.test.tsx`

## File Organization

- Group by feature, not file type
- Keep components small and focused
- Extract reusable logic into custom hooks
- Put shared utilities in `lib/`

## Error Handling

- Always handle errors explicitly
- Use try/catch for async operations
- Show user-friendly error messages
- Log errors for debugging (but not in production client)

## Firebase

- Use Admin SDK on server only
- Client SDK for auth and real-time listeners
- Always validate data before writing to Firestore
- Use batch writes for multiple operations
