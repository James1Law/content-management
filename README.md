# Content Management System

A retro-futuristic personal blog CMS with an 80s Synthwave/Outrun aesthetic. Features a mobile-first admin interface for writing and publishing blog posts, wrapped in neon glows and cyberpunk styling.

## Aesthetic

This isn't your typical minimalist blog. Inspired by 80s Synthwave and Outrun aesthetics:

- **Dark void backgrounds** with deep purple accents
- **Neon glow effects** in pink, cyan, and orange
- **Retro-futuristic typography** using Orbitron, Space Grotesk, and JetBrains Mono
- **Grid backgrounds** and gradient text effects
- **Cyberpunk UI elements** with glowing borders and hover states

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom Synthwave theme
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Image Storage**: Firebase Storage
- **Hosting**: Vercel

## Features

### Public Blog
- Synthwave-styled post cards with neon glow on hover
- Gradient text headings and cyberpunk typography
- Grid background effects and smooth animations
- Fast page loads with Next.js static generation

### Admin Dashboard
- Neon-accented dashboard with LIVE/DRAFT status badges
- Create, edit, and delete posts
- Draft and publish workflow
- Markdown editor with live preview
- Image upload (drag-drop on desktop, camera roll on mobile)

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
