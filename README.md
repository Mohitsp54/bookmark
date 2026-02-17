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
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 3. Configure Environment Variables on Vercel

In Vercel project settings → Environment Variables, add:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your server-side service role key
- `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
- `NEXTAUTH_SECRET` - Same secret from local development
- `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret

### 4. Update Google OAuth Redirect URI

Add your production callback URL to Google Cloud Console:

```
https://your-app.vercel.app/api/auth/callback/google
```

### 5. Deploy

Vercel will automatically deploy. After deployment:

1. Visit your live URL
2. Test Google OAuth login
3. Add bookmarks
4. Open multiple tabs to verify real-time sync

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

## How It Works

### Authentication

- Users sign in with Google OAuth
- NextAuth.js manages sessions
- User data stored in Supabase Postgres

### Real-time Updates

- SWR polls `/api/bookmarks` every 3 seconds
- When you add/delete a bookmark, all tabs refresh automatically
- No WebSocket needed - simple and reliable

### Privacy

- All API routes check authentication
- Bookmarks filtered by `userId`
- Users can only see and delete their own bookmarks

## Troubleshooting

**OAuth Error**: Make sure redirect URIs match exactly in Google Console

**Database Error**: Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, and ensure required tables exist

**Real-time not working**: Check browser console for errors, ensure SWR is polling

## License

MIT
