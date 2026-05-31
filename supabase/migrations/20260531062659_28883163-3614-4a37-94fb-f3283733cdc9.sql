
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  icon_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.courses TO anon, authenticated;
GRANT ALL ON public.courses TO service_role;

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are viewable by everyone"
  ON public.courses FOR SELECT
  USING (true);

INSERT INTO public.courses (title, progress, icon_name, created_at) VALUES
  ('Advanced React Patterns', 75, 'Layers', now() - interval '4 days'),
  ('TypeScript Mastery', 62, 'FileCode', now() - interval '3 days'),
  ('Next.js Architecture', 88, 'Boxes', now() - interval '2 days'),
  ('Database Design', 45, 'Database', now() - interval '1 day');
