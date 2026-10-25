-- Run once in Supabase SQL Editor. Both functions are read-only and can be replaced safely.
CREATE OR REPLACE FUNCTION public.get_site_stats()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'characters', COUNT(*),
    'anime', COUNT(DISTINCT NULLIF(BTRIM(anime_title), ''))
  )
  FROM public.characters;
$$;

REVOKE ALL ON FUNCTION public.get_site_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_site_stats() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.search_characters_ranked(
  p_query text,
  p_page integer DEFAULT 1,
  p_page_size integer DEFAULT 24
)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  WITH input AS (
    SELECT
      BTRIM(COALESCE(p_query, '')) AS query,
      GREATEST(COALESCE(p_page, 1), 1) AS page_number,
      LEAST(GREATEST(COALESCE(p_page_size, 24), 1), 100) AS page_size
  ),
  matches AS (
    SELECT
      c.id,
      c.name,
      c.image,
      c.anime_title,
      CASE
        WHEN LOWER(c.name) = LOWER(i.query) THEN 0
        WHEN LEFT(LOWER(c.name), CHAR_LENGTH(i.query)) = LOWER(i.query) THEN 1
        WHEN STRPOS(LOWER(c.name), LOWER(i.query)) > 0 THEN 2
        WHEN EXISTS (
          SELECT 1 FROM UNNEST(COALESCE(c.nicknames, '{}'::text[])) AS nick(nickname)
          WHERE LOWER(nick.nickname) = LOWER(i.query)
        ) THEN 3
        WHEN EXISTS (
          SELECT 1 FROM UNNEST(COALESCE(c.nicknames, '{}'::text[])) AS nick(nickname)
          WHERE LEFT(LOWER(nick.nickname), CHAR_LENGTH(i.query)) = LOWER(i.query)
        ) THEN 4
        WHEN EXISTS (
          SELECT 1 FROM UNNEST(COALESCE(c.nicknames, '{}'::text[])) AS nick(nickname)
          WHERE STRPOS(LOWER(nick.nickname), LOWER(i.query)) > 0
        ) THEN 5
        WHEN LOWER(c.anime_title) = LOWER(i.query) THEN 6
        WHEN STRPOS(LOWER(COALESCE(c.anime_title, '')), LOWER(i.query)) > 0 THEN 7
        WHEN EXISTS (
          SELECT 1 FROM UNNEST(COALESCE(c.traits, '{}'::text[])) AS trait(value)
          WHERE STRPOS(LOWER(trait.value), LOWER(i.query)) > 0
        ) THEN 8
        ELSE 9
      END AS relevance
    FROM public.characters AS c
    CROSS JOIN input AS i
    WHERE i.query <> ''
      AND NOT EXISTS (
        SELECT 1
        FROM REGEXP_SPLIT_TO_TABLE(i.query, '[[:space:]]+') AS words(word)
        WHERE STRPOS(LOWER(COALESCE(c.search_text, '')), LOWER(words.word)) = 0
      )
  ),
  page_rows AS (
    SELECT id, name, image, anime_title, relevance
    FROM matches
    ORDER BY relevance, CHAR_LENGTH(name), name, id
    LIMIT (SELECT page_size FROM input)
    OFFSET (SELECT (page_number::bigint - 1) * page_size FROM input)
  )
  SELECT jsonb_build_object(
    'total', (SELECT COUNT(*) FROM matches),
    'data', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'name', p.name,
          'image', p.image,
          'anime_title', p.anime_title
        )
        ORDER BY p.relevance, CHAR_LENGTH(p.name), p.name, p.id
      ) FROM page_rows AS p),
      '[]'::jsonb
    )
  );
$$;

REVOKE ALL ON FUNCTION public.search_characters_ranked(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_characters_ranked(text, integer, integer) TO anon, authenticated;

