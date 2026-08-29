-- 在 Supabase SQL Editor 执行一次，启用首页全站共享访问量。
CREATE TABLE IF NOT EXISTS public.site_visits (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total BIGINT NOT NULL DEFAULT 0 CHECK (total >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.site_visits (id, total)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.increment_site_visits()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_total BIGINT;
BEGIN
  INSERT INTO public.site_visits (id, total)
  VALUES (1, 1)
  ON CONFLICT (id) DO UPDATE
    SET total = site_visits.total + 1,
        updated_at = NOW()
  RETURNING total INTO next_total;
  RETURN next_total;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_site_visits() TO anon, authenticated;

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'site_visits'
      AND policyname = 'site_visits public read'
  ) THEN
    CREATE POLICY "site_visits public read" ON public.site_visits
      FOR SELECT USING (true);
  END IF;
END;
$$;
