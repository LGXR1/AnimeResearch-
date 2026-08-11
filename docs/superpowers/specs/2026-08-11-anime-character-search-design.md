# 动漫人物搜索网站 — 设计文档

**日期**：2026-08-11  
**状态**：待审阅

## 目标

一个简洁的动漫人物搜索网站。用户通过**单一搜索框**输入角色名、动漫名或特征关键词（如"金发""剑士""傲娇"），获得匹配的角色列表。支持列表页浏览和详情页查看完整资料。

## 技术栈

| 层 | 选择 | 理由 |
|---|---|---|
| 框架 | React 18 + Vite | 组件化、热更新快、构建产物小 |
| 样式 | Tailwind CSS 3 | 原子化 CSS，开发快，暗色主题方便 |
| 路由 | React Router 6 | SPA 页面切换，URL 持久化搜索状态 |
| 数据源 | Jikan API v4 | 免费、无需认证、REST 接口、数据丰富 |
| 部署 | Vercel / Netlify | 免费、一键部署、自动 HTTPS |

## 页面与路由

```
/                     → SearchPage         搜索首页
/search?q=<keyword>  → SearchResultsPage  搜索结果页（角色卡片列表）
/character/:id       → CharacterDetailPage 角色详情页
```

- URL 承载搜索状态，刷新不丢失。
- 搜索结果和详情都从 URL 参数推导。

## 组件树

```
App
├── SearchPage
│   └── SearchBar              ← 居中大搜索框 + 搜索按钮
├── SearchResultsPage
│   ├── SearchBar              ← 复用，顶部固定
│   ├── CharacterCard[]        ← 角色卡片网格
│   └── Pagination             ← 分页器
└── CharacterDetailPage
    ├── BackButton             ← 返回上一页
    ├── CharacterHero          ← 大头像 + 角色名 + 动漫名
    ├── AboutSection           ← 角色简介
    ├── TagList                ← 特征/属性标签
    └── VoiceActorList         ← 声优列表
```

总计约 10 个组件，结构清晰，无深层嵌套。

## API 集成

### Jikan API v4

| 场景 | 端点 | 说明 |
|---|---|---|
| 搜索角色 | `GET /characters?q=keyword&page=N&limit=24` | 返回分页的角色列表 |
| 角色详情 | `GET /characters/:id/full` | 返回角色完整信息：简介、声优、动漫作品等 |

- 频率限制：约 3 req/s，对个人搜索足够。
- 无需 API Key，前端直接 fetch。

### 数据流

```
用户输入 → SearchBar
    │
    ▼
SearchResultsPage useEffect 监听 URL 参数变化
    │
    ▼
fetch → Jikan /characters API
    │
    ├── data[] → 渲染 CharacterCard 网格
    └── pagination → 渲染分页器
         │
         ▼
点击卡片 → react-router navigate → /character/:id
         │
         ▼
CharacterDetailPage useEffect 监听 :id 变化
    │
    ▼
fetch → Jikan /characters/:id/full
    │
    ▼
渲染完整详情
```

- 加载中：显示 Skeleton/Spinner
- 空结果：显示"未找到相关角色"提示
- 错误：显示错误信息 + 重试按钮

## 视觉设计

**暗色主题**

| 元素 | 颜色 |
|---|---|
| 页面背景 | `#0f0f0f` |
| 卡片/面板背景 | `#1a1a1a` 或 `bg-gray-900` |
| 主文字 | `#ffffff` / `text-white` |
| 次要文字 | `#9ca3af` / `text-gray-400` |
| 点缀色（按钮/标签/hover） | `#ff6b8a`（樱花粉） |
| 卡片边框 | `#2a2a2a` / `border-gray-800` |
| 卡片悬停 | 边框变亮 + 轻微上浮 4px |

**交互细节**
- 卡片悬停：`transform: translateY(-4px)` + 边框变亮，过渡 0.2s
- 搜索框聚焦：边框变为粉色，发光效果
- 页面切换：淡入过渡（可选，MVP 可不做）

## 非功能需求

- **性能**：Jikan API 图片懒加载，卡片网格使用 `loading="lazy"`
- **响应式**：手机 1 列 → 平板 2 列 → 桌面 3-4 列
- **错误处理**：API 请求失败显示错误信息 + 重试按钮，不白屏
- **浏览器支持**：现代浏览器（Chrome / Firefox / Edge / Safari 近 2 年版本）

## 范围外（V1 不做）

- 用户系统（收藏、历史）
- 服务端缓存 / 后端
- 国际化
- PWA / 离线支持
- 动画过渡效果
