-- 动漫人物搜索 - 数据库表结构
-- 在 Supabase SQL Editor 中执行

-- 启用 pg_trgm 扩展（加速中文/日文模糊搜索）
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 角色表
CREATE TABLE IF NOT EXISTS characters (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  image       TEXT,
  description TEXT,
  anime_title TEXT,
  nicknames   TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 声优表
CREATE TABLE IF NOT EXISTS voice_actors (
  id           SERIAL PRIMARY KEY,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  image        TEXT,
  language     TEXT DEFAULT 'Japanese'
);

-- 模糊搜索索引（支持中日英混合搜索）
CREATE INDEX IF NOT EXISTS idx_characters_name_trgm
  ON characters USING GIN (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_characters_anime_trgm
  ON characters USING GIN (anime_title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_characters_desc_trgm
  ON characters USING GIN (description gin_trgm_ops);

-- 声优索引
CREATE INDEX IF NOT EXISTS idx_voice_actors_char
  ON voice_actors(character_id);

-- 评论表（角色详情页评论区，匿名）
CREATE TABLE IF NOT EXISTS comments (
  id           BIGSERIAL PRIMARY KEY,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_character
  ON comments(character_id);

-- 评论 RLS：公开读 + 公开写（匿名评论，后续有垃圾信息再收紧）
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read comments" ON comments;
CREATE POLICY "public read comments" ON comments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "public insert comments" ON comments;
CREATE POLICY "public insert comments" ON comments
  FOR INSERT WITH CHECK (true);
