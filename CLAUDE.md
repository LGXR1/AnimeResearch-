# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

动漫人物搜索网站 — a single-search-box anime character search site. Users search by character name, anime title, or trait keywords (e.g. "金发", "剑士"). Results show as a card grid; clicking a card opens a detail page with full character info.

## Tech stack

- **React 18** + **Vite**
- **Tailwind CSS 4** for styling
- **React Router 7** for client-side routing
- **Supabase** — PostgreSQL database, direct client-side queries via `@supabase/supabase-js`
- Deploy target: Netlify (static SPA)

## Commands

```bash
npm run dev        # start Vite dev server
npm run build      # production build → dist/
node scripts/xxx.js  # 数据脚本（需 SUPABASE_URL / SUPABASE_SECRET_KEY 环境变量）
```

## Database

Supabase project: `https://yjsthpnwcjfktwychskq.supabase.co`

Tables:
- `characters` — id, name, image, description, anime_title, nicknames (text[]), traits (text[]), search_text
- `voice_actors` — id, character_id, name, image, language

RLS: public SELECT allowed, write requires secret key.

### search_text field

Built by concatenating: `name + anime_title + nicknames + traits + voice_actor_names`

**Description is excluded** from search_text to avoid false positives (e.g. searching "艾伦" matching Mikasa's description).

When adding/updating characters, always rebuild `search_text`.

## Routing

| Route | Page | Key param |
|---|---|---|
| `/` | SearchPage | — |
| `/search?q=<keyword>` | SearchResultsPage | `q` drives search |
| `/character/:id` | CharacterDetailPage | `id` = AniList character ID |

## Visual design

Dark theme: page bg `#0f0f0f`, card bg `#1a1a1a`, accent `#ff6b8a` (sakura pink), secondary text `#9ca3af`.

## Character data spec

每个角色必须完整覆盖以下 7 个字段。信息不足时主动联网搜索（百度百科/萌娘百科/AniList），**宁缺毋滥但力求完整准确**。

**添加动漫时必须尽可能补全人物** — 每部动漫至少添加 5-8 个角色（主要角色优先），次要角色也一并补上。

- **角色中文名以常见音译为准** — 优先使用百度百科/萌娘百科/中文维基上的主流译名（如"夏尔"而非"西雅尔"、"康娜"而非"神奈神威"）。如多个译名都常见则任选一个，但标注别名。

| # | 字段 | 要求 |
|---|------|------|
| 1 | `name` | **中文名优先**，如"艾伦·耶格尔" |
| 2 | `nicknames` | 英文名 + 中文简称 + 日文名 + 常见外号，**必须非空** |
| 3 | `anime_title` | **简体中文**，如"进击的巨人"（不是"進擊的巨人"） |
| 4 | `traits` | 发色、瞳色、性格、技能、身份、武器、体型等，**至少 8-10 个** |
| 5 | `description` | 100-200 字中文简介，可自然提及其他角色名（search_text 不含 description，不影响搜索） |
| 6 | `voice_actors` | 日配声优姓名 + AniList 头像 URL（**必填**；国产番无日配可留空） |
| 7 | `search_text` | `name + anime_title + nicknames + traits + 声优名` 拼接，**不含 description** |

### 数据红线（违反即不合格，不能入库）

- traits < 8 个 → 补足再入库
- description 空 / < 100 字 → 重写
- 非国产番 voice_actors 空 → 补声优
- 图片非 AniList CDN 真实地址（含 hash 如 `-aFJLRPGAWAae`）→ 重取
- 发色/瞳色标注错误 → 修正后再入库

**发色常见坑**：花垣武道=黑发（非金发）、白龙人形=黑发（非白发）、凤凰寺风=浅绿发（非金发）。

### 添加/修改角色后的验证步骤

1. `npm run build` 确认无报错
2. 搜角色中文名 → 应命中 1 个
3. 搜英文名/别名 → 应命中 1 个
4. 搜特征词（发色/性格）→ 应命中该角色
5. 搜同动漫其他角色名 → 不应命中该角色（确认 search_text 不含 description）
6. 点进详情页 → 简介/别名/特征/声优全部显示正常
7. 全库扫描（分页）确认：traits ≥ 8、description ≥ 100 字、nicknames 非空、图片真实、声优完整

## 技术坑（血的教训）

1. **AniList voiceActorRoles 查询必须加 `node { id }`**，否则返回 null
2. **AniList 限流 90 req/min** — 串行请求 + 约 700ms 间隔，勿并发
3. **Supabase 单次查询/导出最多 1000 行** — 必须分页 `range(0,999)` 循环
4. **密钥** — publishable key 可硬编码（本就公开，前端用 `import.meta.env.VITE_* || 硬编码值` fallback）；**secret key 绝不能出现在任何前端代码或提交里**（脚本里只用 `process.env.SUPABASE_SECRET_KEY`）
5. **批量脚本不能省略字段** — 曾因 `add_30c.js` 硬编码 `traits:[]` 导致 66 个角色空数据，每个字段都要写
6. **Netlify 部署** — 前端改用环境变量后必须留 fallback，否则 Netlify 未配置会导致全黑

## Rules

- **每次修改完必须自己验证** — 改动前端就 `npm run build`，改动数据就查询验证，改动搜索就实际搜一下。不要等用户反馈才修。
- **添加角色后立即更新 ANIME_LIST.md** — 入库后立刻同步，不等提交。
- **重复动漫/人物直接跳过** — 添加前先查数据库是否已存在（同名同动漫）。
- **"添加动漫"无指定 → 随机 15 部** — 选数据库中不存在的动漫，覆盖不同类型。
- **添加角色后检查图片** — 确认 image 字段是 AniList CDN 真实地址。
- **特征标签** — 客观标签（发色/瞳色/身材/服装/能力）和网络流行词（白丝/黑丝/长腿/绝对领域/颜艺）可加；主观梗（"败犬""天降系"）谨慎。
- **不要自动 commit** — 等用户明确说"提交"。
- **提交时提醒备注** — 用用户给的备注，不用默认 message。
- **提交前检查密钥** — `grep -rn "sb_secret"` 确认无硬编码 secret key。
