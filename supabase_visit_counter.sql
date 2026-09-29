-- 在 Supabase SQL Editor 执行一次，启用首页全站共享访问量。
CREATE TABLE IF NOT EXISTS public.site_visits (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total BIGINT NOT NULL DEFAULT 0 CHECK (total >= 0),
  today_total BIGINT NOT NULL DEFAULT 0 CHECK (today_total >= 0),
  today_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Also upgrades the table when this script is run on an existing project.
ALTER TABLE public.site_visits
  ADD COLUMN IF NOT EXISTS today_total BIGINT NOT NULL DEFAULT 0 CHECK (today_total >= 0),
  ADD COLUMN IF NOT EXISTS today_date DATE;

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
  visit_day DATE := (NOW() AT TIME ZONE 'Asia/Shanghai')::DATE;
BEGIN
  INSERT INTO public.site_visits (id, total, today_total, today_date)
  VALUES (1, 1, 1, visit_day)
  ON CONFLICT (id) DO UPDATE
    SET total = site_visits.total + 1,
        today_total = CASE
          WHEN site_visits.today_date = visit_day THEN site_visits.today_total + 1
          ELSE 1
        END,
        today_date = visit_day,
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
