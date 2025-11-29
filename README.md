# Content Management System

A personal blog CMS with a mobile-first admin interface for writing and publishing blog posts. Single-author system with a public-facing blog.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Image Storage**: Firebase Storage
- **Hosting**: Vercel

## Features

### Public Blog
- View published posts with cover images
- Clean, readable typography optimized for mobile
- Fast page loads with Next.js static generation

### Admin Dashboard
- Create, edit, and delete posts
- Draft and publish workflow
- Markdown editor with preview
- Image upload (drag-drop on desktop, camera roll on mobile)
- Auto-save drafts

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Auth, Firestore, and Storage enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/James1Law/content-management.git
cd content-management

# Install dependencies
npm install

# Copy environment template and add your Firebase config
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
AUTHORIZED_USER_EMAIL=your-email@example.com
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage - published posts
│   ├── blog/[slug]/       # Individual post view
│   ├── login/             # Authentication
│   └── admin/             # Protected admin routes
├── components/
│   ├── admin/             # Admin UI components
│   ├── blog/              # Public blog components
│   ├── ui/                # Shared UI components
│   └── providers/         # Context providers
├── lib/                   # Utilities and Firebase config
└── __tests__/             # Test files
```

## Development

This project follows Test-Driven Development (TDD). Write tests first, then implement features.

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## License

Private project - All rights reserved
