-- MktRoyale Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create custom types
CREATE TYPE game_status AS ENUM ('draft', 'active', 'completed');
CREATE TYPE prestige_tier AS ENUM ('rookie', 'trader', 'expert', 'master', 'champion', 'legend');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  prestige_tier prestige_tier DEFAULT 'rookie',
  lifetime_wins INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create games table
CREATE TABLE public.games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  status game_status DEFAULT 'draft',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  prize_pool DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  UNIQUE(week_number, year)
);

-- Create lineups table
CREATE TABLE public.lineups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  stocks JSONB NOT NULL, -- Array of stock symbols with weights
  lineup_hash TEXT NOT NULL, -- Unique hash to prevent duplicate lineups
  is_locked BOOLEAN DEFAULT FALSE,
  locked_at TIMESTAMP WITH TIME ZONE,
  total_value DECIMAL(10,2),
  rank INTEGER,
  prize_won DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  UNIQUE(game_id, lineup_hash)
);

-- Create indexes for performance
CREATE INDEX idx_lineups_user_id ON public.lineups(user_id);
CREATE INDEX idx_lineups_game_id ON public.lineups(game_id);
CREATE INDEX idx_lineups_game_user ON public.lineups(game_id, user_id);
CREATE INDEX idx_games_status ON public.games(status);
CREATE INDEX idx_games_week_year ON public.games(week_number, year);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lineups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for games table (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view games" ON public.games
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for lineups table
CREATE POLICY "Users can view their own lineups" ON public.lineups
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lineups" ON public.lineups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lineups" ON public.lineups
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER handle_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_games
  BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_lineups
  BEFORE UPDATE ON public.lineups
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate prestige tier based on lifetime wins
CREATE OR REPLACE FUNCTION public.calculate_prestige_tier(wins INTEGER)
RETURNS prestige_tier AS $$
BEGIN
  CASE
    WHEN wins >= 50 THEN RETURN 'legend';
    WHEN wins >= 25 THEN RETURN 'champion';
    WHEN wins >= 15 THEN RETURN 'master';
    WHEN wins >= 8 THEN RETURN 'expert';
    WHEN wins >= 3 THEN RETURN 'trader';
    ELSE RETURN 'rookie';
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- View for leaderboard with user info
CREATE VIEW public.game_leaderboard AS
SELECT
  l.rank,
  l.total_value,
  l.prize_won,
  u.username,
  u.display_name,
  u.prestige_tier
FROM public.lineups l
JOIN public.users u ON l.user_id = u.id
WHERE l.game_id = (
  SELECT id FROM public.games
  WHERE status = 'active'
  ORDER BY created_at DESC
  LIMIT 1
)
ORDER BY l.rank ASC;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.games TO anon, authenticated;
GRANT ALL ON public.lineups TO anon, authenticated;
GRANT SELECT ON public.game_leaderboard TO anon, authenticated;
