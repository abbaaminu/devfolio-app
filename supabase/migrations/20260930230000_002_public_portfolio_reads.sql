-- Public portfolios are intentionally readable without authentication.
-- Ownership remains enforced on all write policies from the initial migration.
DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "projects_select" ON projects;
CREATE POLICY "projects_select" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "experience_select" ON experience;
CREATE POLICY "experience_select" ON experience FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "skills_select" ON skills;
CREATE POLICY "skills_select" ON skills FOR SELECT
  TO anon, authenticated USING (true);
