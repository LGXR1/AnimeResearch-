# AGENTS.md

动漫角色搜索站（React 18、Vite、Tailwind 4、React Router 7、Supabase，部署到 Netlify）。按任务只读相关文件，避免无关的全仓扫描；默认简洁汇报。

## 常用命令

- `npm run dev`：本地开发；`npm run build`：生产构建。
- 数据脚本需 `SUPABASE_URL`、`SUPABASE_SECRET_KEY` 环境变量。

## 数据库与搜索

Supabase：`https://yjsthpnwcjfktwychskq.supabase.co`。主要表：`characters`（角色资料及 `search_text`）、`voice_actors`（角色声优）。公开读取；写入仅用 secret key。

`search_text` 由角色名、动漫名、别名、特征、声优名拼接，**不含简介**，避免简介中的其他角色名造成误命中。写入或修改角色时必须重建它。

## 动漫与角色数据

未指定作品时，添加数据库里没有的随机 15 部动漫，题材尽量多样；每部至少 5 位主要角色，并尽量补全其他重要角色。写入前按动漫名和角色名查重，已存在则跳过。

每个角色必须满足：

- `name`：常见简体中文译名优先；其他常见译名放入别名。
- `nicknames`：非空，尽量含英文名、日文名、中文简称和常见外号。
- `anime_title`：简体中文名。
- `traits`：至少 8 个准确特征，涵盖外观、性格、身份或能力等。
- `description`：100–200 字中文简介。
- `voice_actors`：非国产番填写日配声优和 AniList 头像；国产番无日配可为空。
- 角色及声优图片使用真实 AniList CDN 地址（含图片 hash）；核对发色、瞳色等事实。

特征以客观信息为主；网络流行标签可酌情添加，主观梗谨慎使用。易错例：花垣武道、白龙人形为黑发；凤凰寺风为浅绿发。

## 操作与验证

- AniList 请求串行发送，间隔约 700ms；查询声优角色时包含 `node { id }`。
- Supabase 查询和导出按页处理，每页最多 1000 条。
- 新增或修改角色后更新 `ANIME_LIST.md`，并运行 `node --env-file=.env.local scripts/generate_sitemap.js`。
- 前端改动运行 `npm run build`；数据改动查询本次新增或修改的记录，核对数量、中文名/别名/特征搜索、详情字段及简介不参与搜索。只在用户要求全库审计或发现全库问题时扫描全库。
- 不要自动提交。用户明确要求提交后，检查暂存改动中无 secret key；按近期 Git 提交风格撰写中文备注，用户指定备注时优先使用。
- 前端只能使用公开 publishable key；可用 `import.meta.env.VITE_*` 并保留部署 fallback。secret key 仅供本地数据脚本使用，绝不写入前端或提交。
- AniList 资料不完整时查可靠来源；信息无法核实时不要编造，补齐后再入库。
