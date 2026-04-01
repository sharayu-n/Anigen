-- Supabase DB Schema for Anigen

-- Profiles: Store user metadata
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Avatars: Store character traits and consistent visuals
CREATE TABLE public.avatars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  traits JSONB DEFAULT '{}'::jsonb, -- e.g. { "hair": "silver", "eyes": "purple" }
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.avatars ENABLE ROW LEVEL SECURITY;

-- Stories: The narrative container
CREATE TABLE public.stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT DEFAULT 'Untitled Story',
  content TEXT DEFAULT '', -- Full narrative text
  status TEXT DEFAULT 'draft', -- draft, finalized, generating, completed
  metadata JSONB DEFAULT '{}'::jsonb, -- { "setting": "Neo-Tokyo", "mood": "Cyberpunk" }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Rooms: Real-time collaboration spaces
CREATE TABLE public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES auth.users ON DELETE SET NULL,
  name TEXT NOT NULL,
  story_id UUID REFERENCES public.stories ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Scenes: Individual segments of the story for media generation
CREATE TABLE public.scenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES public.stories ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  mood TEXT,
  prompts JSONB DEFAULT '{}'::jsonb, -- { "video": "...", "manga": "...", "music": "..." }
  video_url TEXT,
  manga_url TEXT,
  audio_url TEXT,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;

-- Real-time Policies (Supabase Realtime)
-- You must enable 'Realtime' for the 'stories' and 'rooms' tables in the Supabase Dashboard.
