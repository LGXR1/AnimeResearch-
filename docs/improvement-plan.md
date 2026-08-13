# 动漫人物搜索 — 搜索引擎收录改进计划

> 目标：让网站（https://animeresearch.netlify.app）能被百度 / Google 等搜索引擎搜到，尤其是 1671 个角色详情页。

---

## 一、背景与问题

网站是 **React SPA（单页应用）+ 纯客户端渲染**。`index.html` 只有一个空的 `<div id="root">`，所有内容都靠浏览器执行 JS 后才生成。

搜索引擎抓取时：

| 搜索引擎 | 是否执行 JS | 结果 |
|---|---|---|
| 百度（国内主流） | 基本不执行 | 抓到空白页 |
| Google | 会渲染，但慢、对新站不积极 | 抓不全、排名低 |
| Bing / 搜狗 / 360 | 部分执行 | 不稳定 |

因此即使提交了 sitemap，爬虫进到 `/character/:id` 看到的仍是空白，**角色内容收录不了**。

另外两个短板：

- **零外链**：新站没人链接，搜索引擎难发现、难给权重。
- **通用词竞争**：「动漫人物搜索」是通用词，新站冷启动难。

---

## 二、现状（已完成）

- ✅ `index.html`：加了 `meta description` / `keywords` / Open Graph / Twitter Card
- ✅ `public/robots.txt`：允许所有爬虫 + 指向 sitemap
- ✅ `public/sitemap.xml`：由 `scripts/generate_sitemap.js` 从数据库生成，共 **1672 个 URL**（1671 角色 + 首页）
- ✅ CLAUDE.md 已加规则：新增角色后重跑 sitemap 生成脚本

**这些只是「让搜索引擎愿意来抓」，还没解决「抓不到内容」的核心问题。**

---

## 三、核心要解决的问题

让 `/character/:id` 页面在**不执行 JS 的情况下**也能返回包含角色名、简介、特征、声优等内容的 HTML。

---

## 四、方案对比

### 方案 A：构建时预渲染（SSG）— ✅ 推荐

在 `npm run build` 时，把首页 + 1671 个角色页提前渲染成静态 HTML，部署后每个 URL 都是真实 HTML 文件。

- **工具**：`vite-plugin-prerender` / `react-snap`（用 puppeteer 跑页面、等待数据加载后快照 DOM）
- **路由列表**：复用 `generate_sitemap.js` 的逻辑，从 Supabase 拉全部 `character_id`
- **优点**：
  - 对百度最友好（纯静态 HTML，收录最可靠）
  - 无运行时开销，用户和爬虫拿到的是同一份内容
- **缺点**：
  - build 时间变长（1671 页 × 等待异步数据加载）
  - 每加角色要重新 build + 部署（但本来加角色就要部署）

### 方案 B：Netlify Edge Function 动态渲染（只对爬虫）

检测 `User-Agent` 含 `baiduspider` / `googlebot` 时，从 Supabase 取角色数据拼成带内容的 HTML 返回；真实用户仍走 SPA。

- **优点**：不用全量预渲染、构建不变、真实用户体验不变
- **缺点**：
  - 要写并维护一个 Edge Function
  - 百度对「动态渲染」的识别一般，效果不如静态 HTML 稳定
  - 属于 Google 已不再主推的「dynamic rendering」做法

### 方案 C：迁移 SSR 框架（Next.js / Remix / Vike）

彻底解决，但要对已稳定运行的项目做迁移，工程量大，不划算。

---

## 五、推荐方案：A（构建时预渲染）

理由：角色数据是**批量更新、相对静态**的，非常适合 SSG；且已有 sitemap 生成脚本可复用。

---

## 六、实施步骤（方案 A）

- [ ] **1. 加预渲染依赖** — `npm i -D vite-plugin-prerender`（或 `react-snap`）
- [ ] **2. 写路由列表生成脚本** — 复用现有逻辑，产出 `routes.txt`：`/` + `/character/{id}`（1672 行）
- [ ] **3. 配置 vite.config** — 在 prerender 插件里指定路由列表 + 出口目录
- [ ] **4. 处理异步数据** — 预渲染时等待 `useEffect` 里的 `getCharacterFull()` 拉完再快照（puppeteer 类插件会等网络空闲；若太慢，可改为「构建时注入初始数据」加速）
- [ ] **5. 每页注入独立 meta** — 详情页加 `react-helmet-async` 或手动设 `document.title` / meta，让每个角色页有独立的 title + description（利于排名）
- [ ] **6. 验证** — build 后检查 `dist/character/{id}.html` 是否含角色名、简介、特征；`curl` 看返回的 HTML 非空白
- [ ] **7. 部署** — Netlify 自动从 dist 部署

### 独立于方案的前置/配套步骤

- [ ] **提交到搜索引擎**（任何方案都要做）：
  - Google：`https://search.google.com/search-console` 添加站点 + 提交 sitemap
  - 百度：`https://ziyuan.baidu.com`（百度搜索资源平台）验证站点 + 提交 sitemap
  - Bing：`https://www.bing.com/webmasters`
- [ ] **考虑绑定自有域名** — Netlify 子域名权重低，自有域名利于长期 SEO（可选）
- [ ] **积累外链** — 在贴吧 / 微博 / 知乎 / 论坛等自然引流（长期）

---

## 七、验证与验收标准

- `site:animeresearch.netlify.app` 能查到首页
- 搜具体角色名（如「艾伦·耶格尔」）能命中对应详情页（需预渲染完成后才有意义）
- `curl https://animeresearch.netlify.app/character/{id}` 返回的 HTML 里包含角色名和简介（非空白 `<div id="root">`）

---

## 八、风险与注意

- **预渲染时长**：1671 页若每页等 1–2 秒网络，build 可能到 20–40 分钟。可考虑只预渲染「高价值页」或并行/缓存，后续再评估。
- **数据一致性**：预渲染的是构建时快照，角色更新后需重新构建部署（与现有「加角色→部署」流程一致）。
- **百度爬虫策略**：即便静态 HTML 就绪，收录也需要时间（数周），且零外链会拖慢；不要期待立竿见影。

---

## 附录：审计 8 项处理状态（含未做/延后事项）

> 记录最近一次代码审计（8 项建议）的完整处理结果，重点是「未做/延后」项，避免丢失。

| # | 事项 | 状态 | 未做部分的下一步 |
|---|---|---|---|
| 1 | 统一数据访问（前端走 /api） | ❌ 不做 | 纯静态 SPA 无后端，用户搜索本就单一路径；限流诉求并入 #4 |
| 2 | 补全并版本化 schema | ✅ 已完成 | — |
| 3 | 搜索性能 | 🔶 部分 | `search_text` trigram 索引已加；相关性排序、多词 AND/OR 显式化等到万级数据再评估 |
| 4 | 评论/反馈滥用防护 | 🔶 部分 | 已加长度约束 + 蜜罐；**按 IP 限流、敏感词过滤未做**（见下） |
| 5 | SEO | 🔶 部分 | meta/robots/sitemap 已完成；**预渲染 + 每页独立 meta 未做**（见本文正文） |
| 6 | 收敛数据维护脚本 | ⏳ 延后 | 建议抽「共用导入函数」防 traits:[] 类错误再犯；历史脚本不重构 |
| 7 | 最小测试覆盖 | ⏳ 延后 | 用 Vitest 覆盖搜索词拆分 / 分页 / 数据映射 / 空结果 / 错误 |
| 8 | 中文编码核验 | ⏳ 延后 | 花 1 分钟确认 build 产物 HTML 的 meta 是正常 UTF-8 中文 |

### #4 未做项：按 IP 限流 + 敏感词过滤

**按 IP 限流**
- 为什么没做：匿名评论无用户身份，RLS 拿不到客户端 IP，必须引入后端。
- 做法：Supabase Edge Function（或 Netlify Function）在写评论前读 `x-forwarded-for`，做「每 IP 每分钟 N 条」限制；前端改调该函数而非直插 Supabase。
- 触发条件：评论区出现被刷迹象后再上。

**敏感词过滤**
- 为什么没做：客户端过滤可被绕过，需服务端校验才有意义（同样依赖后端）。
- 做法：维护敏感词表，在 Edge Function 里匹配/替换；或接入第三方内容审核。

### #3 未做项：相关性排序 + 多词语义

- 当前搜索为多词 **AND**（`split` 后链式 `ilike`），语义已确定，无需改。
- 结果排序目前按 `id` 默认序；等数据量上万后，可改为「名称精确/前缀命中优先 + 其余按 id」。
- `pg_trgm` 对 2 字中文关键词加速有限，真到万级数据再考虑切全文检索（`tsvector` / zhparser）。
