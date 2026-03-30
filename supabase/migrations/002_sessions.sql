-- Migration: 002_sessions
-- Creates sessions and utterances tables for storing translation history.

-- 1. Sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_lang TEXT NOT NULL DEFAULT 'ko',
  target_lang TEXT NOT NULL DEFAULT 'vi',
  title TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Utterances table
CREATE TABLE IF NOT EXISTS public.utterances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  original TEXT NOT NULL,
  translation TEXT,
  speaker TEXT DEFAULT 'user',
  timestamp_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utterances ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies for sessions
CREATE POLICY "Users can view own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON public.sessions FOR DELETE
  USING (auth.uid() = user_id);

-- 5. RLS policies for utterances (via session ownership)
CREATE POLICY "Users can view utterances from own sessions"
  ON public.utterances FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.sessions
    WHERE sessions.id = utterances.session_id
    AND sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert utterances to own sessions"
  ON public.utterances FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.sessions
    WHERE sessions.id = utterances.session_id
    AND sessions.user_id = auth.uid()
  ));

-- 6. Indices
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS utterances_session_id_idx ON public.utterances(session_id);
