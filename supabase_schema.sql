-- ============================================================
-- 动漫人物搜索 — 数据库完整结构（唯一权威 schema，可重复执行）
-- 在 Supabase SQL Editor 中执行；幂等，可反复跑（新环境 / 老环境均安全）
--
-- 版本: 2026-08-13
-- 说明: 本文件由真实库实测重构，覆盖全部表 / 列 / 索引 / RLS 策略。
--       若老库里存在不同名的旧策略，跑完后会并存但不影响行为
--       （本文件的策略均为 SELECT(USING true) / INSERT(WITH CHECK true)）。
-- ============================================================

-- 扩展：pg_trgm 加速模糊搜索
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ------------------------------------------------------------
-- 角色表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS characters (
  id          INTEGER PRIMARY KEY,          -- AniList 角色 ID（详情页路由 /character/:id）
  name        TEXT NOT NULL,                -- 中文名（常见音译）
  image       TEXT,                         -- AniList CDN 图片地址（含 hash）
  description TEXT,                         -- 简介（100-200 字）
  anime_title TEXT,                         -- 动漫名（简体中文）
  nicknames   TEXT[] DEFAULT '{}',          -- 别名（英文/简称/日文/外号）
  traits      TEXT[] DEFAULT '{}',          -- 特征标签（发色/瞳色/性格等，≥8 个）
  search_text TEXT,                         -- 搜索文本 = name+anime+nicknames+traits+声优名（不含 description）
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 声优表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS voice_actors (
  id           SERIAL PRIMARY KEY,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  image        TEXT,
  language     TEXT DEFAULT 'Japanese'
);

-- ------------------------------------------------------------
-- 反馈表（首页反馈栏，匿名）
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feedback (
  id         BIGSERIAL PRIMARY KEY,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 评论表（角色详情页评论区，匿名）
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
  id           BIGSERIAL PRIMARY KEY,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 索引
-- ============================================================
-- 模糊搜索 trigram 索引（%关键词%）
CREATE INDEX IF NOT EXISTS idx_characters_name_trgm
  ON characters USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_characters_anime_trgm
  ON characters USING GIN (anime_title gin_trgm_ops);
-- 注：description 不参与搜索，此索引为历史遗留（保留无害，可后续删除）
CREATE INDEX IF NOT EXISTS idx_characters_desc_trgm
  ON characters USING GIN (description gin_trgm_ops);
-- 搜索实际命中字段
CREATE INDEX IF NOT EXISTS idx_characters_search_text_trgm
  ON characters USING GIN (search_text gin_trgm_ops);

-- 关联查询索引
CREATE INDEX IF NOT EXISTS idx_voice_actors_char
  ON voice_actors(character_id);
CREATE INDEX IF NOT EXISTS idx_comments_character
  ON comments(character_id);

-- ============================================================
-- 约束（防滥用）：内容长度限制，避免被刷垃圾内容
-- ============================================================
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_content_length;
ALTER TABLE comments ADD CONSTRAINT comments_content_length
  CHECK (char_length(content) BETWEEN 1 AND 500);

ALTER TABLE feedback DROP CONSTRAINT IF EXISTS feedback_content_length;
ALTER TABLE feedback ADD CONSTRAINT feedback_content_length
  CHECK (char_length(content) BETWEEN 1 AND 500);

-- ============================================================
-- RLS（Row Level Security）
-- 权限模型：
--   characters / voice_actors  → 公开读，写需 service_role（服务端脚本）
--   feedback / comments        → 公开读 + 公开写（匿名），无改/删
-- ============================================================

-- characters：公开读，写需 service_role
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "characters public read" ON characters;
CREATE POLICY "characters public read" ON characters
  FOR SELECT USING (true);

-- voice_actors：公开读，写需 service_role
ALTER TABLE voice_actors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "voice_actors public read" ON voice_actors;
CREATE POLICY "voice_actors public read" ON voice_actors
  FOR SELECT USING (true);

-- feedback：公开读 + 公开写（匿名）
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "feedback public read" ON feedback;
CREATE POLICY "feedback public read" ON feedback
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "feedback public insert" ON feedback;
CREATE POLICY "feedback public insert" ON feedback
  FOR INSERT WITH CHECK (true);

-- comments：公开读 + 公开写（匿名）
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "comments public read" ON comments;
CREATE POLICY "comments public read" ON comments
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "comments public insert" ON comments;
CREATE POLICY "comments public insert" ON comments
  FOR INSERT WITH CHECK (true);
