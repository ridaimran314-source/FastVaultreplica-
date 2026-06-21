# FASTVault Replica

A full-stack replica of [fastvault.vercel.app](https://fastvault.vercel.app/) — the FAST-NUCES academic resource platform. Built with Next.js 15, Firebase, and Tailwind CSS following the official build documentation.

## Features

- **Homepage** — Hero, live stats counters, feature cards, testimonials, campus directory
- **Authentication** — Email/password signup, login, forgot password with Firebase Auth
- **Academic Resources** — Browse, search, filter, upload, bookmark, download
- **Admission Portal** — Calculator (NU/NAT/SAT), Merit Explorer, FAQ, admission resources
- **Student Societies** — Directory with search, filters, detail modal
- **Campus Events** — Event board with bookmark, share, registration links
- **Admin Panel** — Upload moderation, FAQ answers, manage events/societies/merit
- **Static Pages** — About, Team, Privacy, Terms, Content Policy

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Server Logic | Firebase Cloud Functions |
| Hosting | Vercel |

## Prerequisites

You need these installed locally:

1. **Node.js 20+** — [nodejs.org](https://nodejs.org/)
2. **Firebase CLI** — `npm install -g firebase-tools`
3. **A Firebase project** — [console.firebase.google.com](https://console.firebase.google.com)

## Setup Instructions

### 1. Install dependencies

```bash
npm install
cd functions && npm install && cd ..
```

### 2. Create Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com) and create a new project
2. Enable **Authentication** → Email/Password sign-in method
3. Create a **Firestore Database** (start in production mode)
4. Enable **Storage**
5. Upgrade to **Blaze plan** (required for Cloud Functions)

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your Firebase config from **Project Settings → General → Your apps → Web app**:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy Firebase rules and functions

```bash
firebase login
firebase use your_project_id
firebase deploy --only firestore:rules,firestore:indexes,storage
cd functions && npm run build && cd ..
firebase deploy --only functions
```

### 5. Seed demo data (optional)

1. Download service account key from Firebase Console → Project Settings → Service Accounts
2. Save as `serviceAccountKey.json` in project root
3. Run:

```bash
npm run seed
```

### 6. Create an admin user

1. Sign up through the app at `/signup`
2. In Firebase Console → Firestore → `users` collection
3. Find your user document and change `role` from `"student"` to `"admin"`

### 7. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 8. Deploy to Vercel

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add all `NEXT_PUBLIC_*` environment variables
4. Deploy

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── about/              # Static pages
│   ├── resources/          # Academic resources module
│   ├── admission/          # Admission portal + calculator + FAQ
│   ├── societies/          # Societies directory
│   ├── events/             # Events board
│   ├── admin/              # Admin panel
│   └── login|signup|...    # Auth pages
├── components/             # UI components
└── lib/                    # Firebase, auth, types, calculator
functions/                  # Cloud Functions
firestore.rules             # Security rules
storage.rules               # Storage rules
scripts/seed-data.ts        # Demo data seeder
```

## What You Need to Provide

| Item | Required | Notes |
|------|----------|-------|
| Firebase project | Yes | Free tier works except Cloud Functions need Blaze |
| Firebase config keys | Yes | 6 env vars in `.env.local` |
| Service account key | For seeding only | `serviceAccountKey.json` |
| Custom domain | Optional | Vercel provides a free subdomain |
| Facebook group URL | Optional | Set in `.env.local` |
| Contact email | Optional | Set in `.env.local` |
| Logo/hero video | Optional | Currently uses gradient background |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/about` | About page |
| `/resources` | Academic resources |
| `/resources/upload` | Upload resource (auth required) |
| `/admission` | Admission portal |
| `/admission/calculator` | Aggregate calculator |
| `/admission/faq` | FAQ system |
| `/societies` | Societies directory |
| `/events` | Campus events |
| `/team` | Team page |
| `/login`, `/signup` | Authentication |
| `/admin` | Admin dashboard (admin only) |

## License

Independent student project — not affiliated with FAST-NUCES.
