
-- Enable necessary extensions
-- create extension if not exists "uuid-ossp"; -- Supabase usually has this enabled, but good to be safe if we were superuser. 
-- However, we might not have permissions to create extensions. Let's assume gen_random_uuid() is available (Postgres 13+).

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    email_verified TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- Add RLS policies (optional but recommended for Supabase)
-- For now, we are using the service_role key in the app which bypasses RLS,
-- ensuring the app works. If the user wants specific RLS, we can add it later.
-- But enabling RLS without policies effectively blocks all access for anon/authenticated roles
-- unless we use service_role. The app uses `supabaseAdmin` (service role) so it should be fine.
-- Let's just create the tables for now.
