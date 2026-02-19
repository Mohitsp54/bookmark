# Bookmark Manager

A modern, real-time bookmark manager built with Next.js, featuring Google OAuth authentication and live updates across multiple tabs.

## Features

- 🔐 **Google OAuth Authentication** - Secure login with Google (no email/password)
- 📚 **Personal Bookmarks** - Each user has their own private bookmark collection
- ⚡ **Real-time Updates** - Changes sync across all open tabs within 3 seconds
- 🗑️ **Easy Management** - Add and delete bookmarks with a clean, modern UI
- 🎨 **Premium Design** - Glassmorphism effects, gradients, and smooth animations
- 📱 **Responsive** - Works beautifully on desktop and mobile

## Tech Stack

- **Next.js 14** (App Router)
- **NextAuth.js v5** - Authentication
- **Supabase Postgres** - PostgreSQL database
- **SWR** - Real-time data fetching with polling
- **Tailwind CSS** - Styling

## Setup Instructions

### 1. Clone and Install

```bash
cd d:/bookmark
npm install
```

### 2. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.vercel.app/api/auth/callback/google`
7. Copy Client ID and Client Secret

### 3. Configure Environment Variables

Update `.env.local` with your credentials:

```env
# Supabase Postgres URLs
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

Generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

### 4. Set Up Database

```bash
# Create tables in Supabase SQL editor
# (users, bookmarks)
```

### 5. Run Development Server

```bash
npm run start
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
d:/bookmark/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js  # NextAuth handlers
│   │   └── bookmarks/
│   │       ├── route.js                  # GET, POST bookmarks
│   │       └── [id]/route.js             # DELETE bookmark
│   ├── globals.css                       # Global styles
│   ├── layout.js                         # Root layout
│   └── page.jsx                          # Main page
├── components/
│   ├── AddBookmarkForm.jsx               # Add bookmark form
│   ├── BookmarkList.jsx                  # Bookmark list with SWR
│   ├── Header.jsx                        # Header with user info
│   └── LoginPage.jsx                     # Google OAuth login
├── lib/
│   └── auth.js                           # NextAuth configuration
├── .env.local                            # Environment variables (local)
└── package.json
```

## Challenges & Solutions

During the development of this project, several technical hurdles were encountered and resolved:

### 1. Database & Auth Synchronization

**Problem**: Google OAuth provides user details, but we needed a persistent record in our own Supabase DB to link bookmarks to a unique `userId`.
**Solution**: I implemented an `upsert` logic in the `signIn` callback in `lib/auth.js`. This ensures that every time a user logs in, their profile is either created or updated in our `users` table, and their unique DB ID is attached to the session.

### 2. Real-time Feel without Complexity

**Problem**: I wanted the dashboard to update automatically across tabs without the overhead and complexity of setting up a WebSocket server or Supabase Realtime complexity.
**Solution**: I utilized **SWR** (Stale-While-Revalidate) with a 3-second polling interval. This provides a "near real-time" experience that is highly reliable, handles offline states automatically, and requires zero backend infrastructure changes.

### 3. API Security (Insecure Direct Object Reference)

**Problem**: Dynamic routes like `api/bookmarks/[id]` could be vulnerable if a user tries to delete a bookmark by guessing another user's ID.
**Solution**: Every sensitive API route performs a dual check. I don't just delete by ID; I verify that the `user_id` of the bookmark matches the `id` of the authenticated user in the current session before allowing any database modifications.
