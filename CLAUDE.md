# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

动漫人物搜索网站 — a single-search-box anime character search site. Users search by character name, anime title, or trait keywords (e.g. "金发", "剑士"). Results show as a card grid; clicking a card opens a detail page with full character info.

## Tech stack

- **React 18** + **Vite**
- **Tailwind CSS 4** for styling
- **React Router 7** for client-side routing
- **Supabase** — PostgreSQL database, direct client-side queries via `@supabase/supabase-js`
- Deploy target: Vercel (static SPA + optional API functions)

## Commands

```bash
npm run dev        # start Vite dev server
npm run build      # production build → dist/
npm run preview    # preview production build locally
node scripts/populate.js   # fetch + translate + insert characters from AniList
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

每个角色必须完整覆盖以下 7 个字段。信息不足时主动联网搜索（百度百科/萌娘百科/AniList），**宁缺毋滥但力求完整准确**：

| # | 字段 | 要求 |
|---|------|------|
| 1 | `name` | **中文名优先**，如"艾伦·耶格尔" |
| 2 | `nicknames` | 英文名 + 中文简称 + 日文名 + 常见外号，如 `["Eren Yeager", "艾伦", "进击的巨人"]` |
| 3 | `anime_title` | **简体中文**，如"进击的巨人"（不是"進擊的巨人"） |
| 4 | `traits` | 发色、瞳色、性格、技能、身份、武器、血型、身高体型等，**每个角色至少 8-10 个** |
| 5 | `description` | 100-200 字中文简介，**简介中不提及任何其他角色名**（否则会导致搜索污染） |
| 6 | `voice_actors` | 日配声优姓名 + AniList 头像 URL |
| 7 | `search_text` | `name + anime_title + nicknames + traits + 声优名` 拼接，**不含 description** |

### 添加/修改角色后的验证步骤

1. `npm run build` 确认无报错
2. 搜角色中文名 → 应命中 1 个
3. 搜英文名/别名 → 应命中 1 个
4. 搜特征词（如发色、性格）→ 应命中该角色
5. 搜同动漫其他角色名 → 不应命中该角色（简介污染检查）
6. 点进详情页 → 简介/别名/特征/声优全部显示正常

## Rules

- **每次修改完必须自己验证** — 改动前端就 `npm run build` 确认无报错，改动数据就查询验证结果正确，改动搜索就实际搜一下看命中是否符合预期。不要等用户反馈才修。
- **添加角色后检查图片** — 用 Supabase 查询新增角色的 `image` 字段，确认 URL 是 AniList CDN 的真实地址（包含 hash 如 `-aFJLRPGAWAae`），不是拼接出来的无效 URL。
- **push 前必须询问用户** — 每次 `git push` 之前，先问用户有没有需要写的提交备注或注释，得到确认后再推送。
