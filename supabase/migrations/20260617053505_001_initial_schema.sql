-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  title TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  email TEXT,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  tech_stack TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience table
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  current BOOLEAN DEFAULT FALSE,
  description TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  proficiency INTEGER DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  display_order INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select" ON profiles FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_delete" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "projects_select" ON projects FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "projects_insert" ON projects FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = projects.profile_id AND profiles.user_id = auth.uid())
  );
CREATE POLICY "projects_update" ON projects FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = projects.profile_id AND profiles.user_id = auth.uid())
  );
CREATE POLICY "projects_delete" ON projects FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = projects.profile_id AND profiles.user_id = auth.uid())
  );

-- Experience policies
CREATE POLICY "experience_select" ON experience FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "experience_insert" ON experience FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = experience.profile_id AND profiles.user_id = auth.uid())
  );
CREATE POLICY "experience_update" ON experience FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = experience.profile_id AND profiles.user_id = auth.uid())
  );
CREATE POLICY "experience_delete" ON experience FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = experience.profile_id AND profiles.user_id = auth.uid())
  );

-- Skills policies
CREATE POLICY "skills_select" ON skills FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "skills_insert" ON skills FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = skills.profile_id AND profiles.user_id = auth.uid())
  );
CREATE POLICY "skills_update" ON skills FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = skills.profile_id AND profiles.user_id = auth.uid())
  );
CREATE POLICY "skills_delete" ON skills FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = skills.profile_id AND profiles.user_id = auth.uid())
  );

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER experience_updated_at
  BEFORE UPDATE ON experience
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
