# 动漫人物搜索网站 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-search-box anime character search SPA with list and detail pages, using Jikan API as the data source.

**Architecture:** React 18 SPA with Vite, Tailwind CSS 3, React Router 6. Three routes — home (`/`), search results (`/search?q=...`), character detail (`/character/:id`). No global state library; search state lives in URL params, detail state is local. Fetches Jikan API v4 directly from the browser.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, React Router 6, Jikan API v4

## Global Constraints

- Dark theme: page bg `#0f0f0f`, card bg `#1a1a1a`, accent `#ff6b8a`, secondary text `#9ca3af`
- Responsive: 1 col mobile → 2 col tablet → 3-4 col desktop
- All images lazy-load (`loading="lazy"`)
- API rate limit: ~3 req/s (Jikan)
- No auth, no backend, no PWA, no i18n in V1
- Loading state: Spinner; Empty state: "未找到相关角色"; Error state: error message + retry button

---

### Task 1: Project scaffold

**Files:**
- Create: project root via `npm create vite@latest`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Modify: `src/index.css` (Tailwind directives + dark theme base)
- Modify: `index.html` (title)

**Interfaces:**
- Produces: A running Vite dev server with Tailwind CSS working

- [ ] **Step 1: Scaffold Vite + React project**

```bash
cd "e:\AI code\anime"
npm create vite@latest . -- --template react
npm install
```

- [ ] **Step 2: Install additional dependencies**

```bash
npm install react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Tailwind in vite.config.js**

Read `vite.config.js`, then replace its content:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 4: Replace src/index.css with Tailwind directives + dark theme base**

```css
@import "tailwindcss";

body {
  background-color: #0f0f0f;
  color: #ffffff;
  min-height: 100vh;
}
```

- [ ] **Step 5: Update index.html title**

Read `index.html`, change `<title>` to `<title>动漫人物搜索</title>` and `<html lang="en">` to `<html lang="zh-CN">`.

- [ ] **Step 6: Clear src/App.css and src/App.jsx to minimal**

Delete `src/App.css`. Replace `src/App.jsx` with:

```jsx
function App() {
  return <div className="min-h-screen bg-[#0f0f0f] text-white" />
}

export default App
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Open in browser — should see dark background, no errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React + Tailwind project"
```

---

### Task 2: Routing and layout shell

**Files:**
- Create: `src/pages/SearchPage.jsx`
- Create: `src/pages/SearchResultsPage.jsx`
- Create: `src/pages/CharacterDetailPage.jsx`
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`

**Interfaces:**
- Consumes: Tailwind dark theme base from Task 1
- Produces: Three route pages accessible at `/`, `/search`, `/character/:id`

All page files start as minimal placeholders.

- [ ] **Step 1: Read src/main.jsx to know current imports**

- [ ] **Step 2: Create src/pages/SearchPage.jsx**

```jsx
export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-8">动漫人物搜索</h1>
    </div>
  )
}
```

- [ ] **Step 3: Create src/pages/SearchResultsPage.jsx**

```jsx
import { useSearchParams } from 'react-router-dom'

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-2xl mb-4">搜索: {query}</h1>
    </div>
  )
}
```

- [ ] **Step 4: Create src/pages/CharacterDetailPage.jsx**

```jsx
import { useParams } from 'react-router-dom'

export default function CharacterDetailPage() {
  const { id } = useParams()

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-2xl">角色详情 #{id}</h1>
    </div>
  )
}
```

- [ ] **Step 5: Replace src/main.jsx to wrap with BrowserRouter**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 6: Replace src/App.jsx with routes**

```jsx
import { Routes, Route } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import SearchResultsPage from './pages/SearchResultsPage'
import CharacterDetailPage from './pages/CharacterDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/character/:id" element={<CharacterDetailPage />} />
    </Routes>
  )
}
```

- [ ] **Step 7: Verify routes work in browser**

Run `npm run dev`. Navigate to `/`, `/search?q=test`, `/character/123` — each shows its placeholder content.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: set up routing with three page shells"
```

---

### Task 3: SearchBar component

**Files:**
- Create: `src/components/SearchBar.jsx`

**Interfaces:**
- Consumes: Tailwind dark theme
- Produces: `<SearchBar />` — controlled input + submit button. Accepts `initialValue` prop for pre-filling (used on results page). On submit, calls `onSearch(value)` callback.

The component is reused on SearchPage (centered, large) and SearchResultsPage (top bar, compact). Size variant controlled by a `compact` prop.

- [ ] **Step 1: Create src/components/SearchBar.jsx**

```jsx
import { useState } from 'react'

export default function SearchBar({ initialValue = '', onSearch, compact = false }) {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  const inputClasses = compact
    ? 'w-full max-w-xl px-4 py-2 pl-10 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b8a] focus:ring-1 focus:ring-[#ff6b8a] transition-all'
    : 'w-full max-w-2xl px-6 py-4 pl-14 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#ff6b8a] focus:ring-1 focus:ring-[#ff6b8a] transition-all'

  return (
    <form onSubmit={handleSubmit} className="w-full flex justify-center">
      <div className="relative w-full" style={{ maxWidth: compact ? undefined : '42rem' }}>
        {/* Search icon */}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="搜索角色名、动漫名或特征…"
          className={inputClasses}
        />
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Verify by temporarily embedding in SearchPage, then revert**

Import SearchBar into SearchPage, render `<SearchBar onSearch={(v) => console.log(v)} />`, confirm it logs on submit. Then remove the import (proper integration comes in Tasks 4 & 6).

- [ ] **Step 3: Commit**

```bash
git add src/components/SearchBar.jsx
git commit -m "feat: add SearchBar component"
```

---

### Task 4: SearchPage (home)

**Files:**
- Create: (none new)
- Modify: `src/pages/SearchPage.jsx`

**Interfaces:**
- Consumes: `SearchBar` component from Task 3
- Produces: Home page at `/` — centered title + large SearchBar that navigates to `/search?q=...` on submit

- [ ] **Step 1: Replace src/pages/SearchPage.jsx**

```jsx
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'

export default function SearchPage() {
  const navigate = useNavigate()

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold mb-2 tracking-tight">动漫人物搜索</h1>
      <p className="text-gray-400 mb-10 text-lg">
        搜索角色名、动漫名或特征关键词
      </p>
      <SearchBar onSearch={handleSearch} />
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

`npm run dev`, open `/`, type a keyword and submit — should navigate to `/search?q=xxx`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/SearchPage.jsx
git commit -m "feat: wire SearchPage with SearchBar and navigation"
```

---

### Task 5: CharacterCard and Pagination

**Files:**
- Create: `src/components/CharacterCard.jsx`
- Create: `src/components/Pagination.jsx`

**Interfaces:**
- Consumes: Tailwind dark theme
- Produces:
  - `<CharacterCard character={{ mal_id, name, images, anime }} />` — card with avatar, name, first anime title. Clickable, fires `onClick(mal_id)`.
  - `<Pagination currentPage={n} totalPages={n} onPageChange={fn} />` — page buttons. Hides when totalPages <= 1.

- [ ] **Step 1: Create src/components/CharacterCard.jsx**

```jsx
export default function CharacterCard({ character, onClick }) {
  const imageUrl = character.images?.jpg?.image_url || character.images?.webp?.image_url
  const animeTitle = character.anime?.[0]?.anime?.title || ''

  return (
    <div
      onClick={() => onClick(character.mal_id)}
      className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden cursor-pointer
        hover:border-[#ff6b8a]/50 hover:-translate-y-1 transition-all duration-200 group"
    >
      <div className="aspect-[3/4] overflow-hidden bg-gray-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={character.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white truncate">{character.name}</h3>
        {animeTitle && (
          <p className="text-sm text-gray-400 truncate mt-1">{animeTitle}</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create src/components/Pagination.jsx**

```jsx
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // Build array of page numbers to show: first, last, and pages around current
  const pages = new Set()
  pages.add(1)
  pages.add(totalPages)
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    pages.add(i)
  }
  const sorted = [...pages].sort((a, b) => a - b)

  // Insert -1 for ellipsis gaps
  const withGaps = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) withGaps.push(-1)
    withGaps.push(p)
  })

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a]
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ‹
      </button>

      {withGaps.map((p, i) =>
        p === -1 ? (
          <span key={`gap-${i}`} className="px-2 text-gray-600">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? 'bg-[#ff6b8a] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a]
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ›
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Verify by scanning code — no dev server test possible without results page (next task)**

- [ ] **Step 4: Commit**

```bash
git add src/components/CharacterCard.jsx src/components/Pagination.jsx
git commit -m "feat: add CharacterCard and Pagination components"
```

---

### Task 6: SearchResultsPage with API integration

**Files:**
- Create: `src/lib/api.js`
- Modify: `src/pages/SearchResultsPage.jsx`

**Interfaces:**
- Consumes: SearchBar (Task 3), CharacterCard (Task 5), Pagination (Task 5)
- Produces: Full search results page at `/search?q=...`. Fetches from Jikan, renders card grid + pagination. Handles loading, empty, and error states.
- Creates: `src/lib/api.js` exports `searchCharacters(query, page)` returning `{ data, pagination }`

- [ ] **Step 1: Create src/lib/api.js**

```jsx
const BASE = 'https://api.jikan.moe/v4'

export async function searchCharacters(query, page = 1) {
  const url = `${BASE}/characters?q=${encodeURIComponent(query)}&page=${page}&limit=24`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API 请求失败 (${res.status})`)
  }
  const json = await res.json()
  return {
    data: json.data || [],
    pagination: json.pagination || { current_page: 1, last_visible_page: 1 },
  }
}

export async function getCharacterFull(id) {
  const url = `${BASE}/characters/${id}/full`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API 请求失败 (${res.status})`)
  }
  const json = await res.json()
  return json.data
}
```

- [ ] **Step 2: Replace src/pages/SearchResultsPage.jsx**

```jsx
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import CharacterCard from '../components/CharacterCard'
import Pagination from '../components/Pagination'
import { searchCharacters } from '../lib/api'

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) return

    let cancelled = false
    setLoading(true)
    setError(null)

    searchCharacters(query, page)
      .then((res) => {
        if (!cancelled) setResults(res)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [query, page])

  const handleSearch = (newQuery) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`)
  }

  const handlePageChange = (newPage) => {
    setSearchParams({ q: query, page: String(newPage) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCardClick = (malId) => {
    navigate(`/character/${malId}`)
  }

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Top search bar */}
      <div className="mb-8">
        <SearchBar initialValue={query} onSearch={handleSearch} compact />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-[#ff6b8a] rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => setSearchParams({ q: query, page: '1' })}
            className="px-6 py-2 bg-[#ff6b8a] text-white rounded-lg hover:bg-[#ff5a7a] transition-colors"
          >
            重试
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && results && results.data.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">未找到相关角色</p>
          <p className="text-gray-600 mt-2">换个关键词试试？</p>
        </div>
      )}

      {/* Results grid */}
      {!loading && !error && results && results.data.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.data.map((char) => (
              <CharacterCard
                key={char.mal_id}
                character={char}
                onClick={handleCardClick}
              />
            ))}
          </div>
          <Pagination
            currentPage={results.pagination.current_page}
            totalPages={results.pagination.last_visible_page}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

`npm run dev`. Search for "sakura", "naruto", "金发" — should see card grid load, pagination work, and empty/error states when appropriate.

- [ ] **Step 4: Commit**

```bash
git add src/lib/api.js src/pages/SearchResultsPage.jsx
git commit -m "feat: add search results page with Jikan API integration"
```

---

### Task 7: Character detail sub-components

**Files:**
- Create: `src/components/BackButton.jsx`
- Create: `src/components/CharacterHero.jsx`
- Create: `src/components/AboutSection.jsx`
- Create: `src/components/TagList.jsx`
- Create: `src/components/VoiceActorList.jsx`

**Interfaces:**
- Produces:
  - `<BackButton onClick={fn} />` — left arrow + "返回" link
  - `<CharacterHero imageUrl name animeTitle />` — large avatar + name + anime
  - `<AboutSection text />` — "简介" heading + paragraph; if empty, shows "暂无简介"
  - `<TagList tags={string[]} />` — pink tag chips
  - `<VoiceActorList actors={[{ person, language }]} />` — VA cards

All are presentational — no data fetching.

- [ ] **Step 1: Create src/components/BackButton.jsx**

```jsx
export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      返回
    </button>
  )
}
```

- [ ] **Step 2: Create src/components/CharacterHero.jsx**

```jsx
export default function CharacterHero({ imageUrl, name, animeTitle }) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
      <div className="w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        {animeTitle && (
          <p className="text-gray-400 text-lg">{animeTitle}</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create src/components/AboutSection.jsx**

```jsx
export default function AboutSection({ text }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">简介</h2>
      {text ? (
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">{text}</p>
      ) : (
        <p className="text-gray-600">暂无简介</p>
      )}
    </section>
  )
}
```

- [ ] **Step 4: Create src/components/TagList.jsx**

```jsx
export default function TagList({ tags }) {
  if (!tags || tags.length === 0) return null

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">标签</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-[#ff6b8a]/15 text-[#ff6b8a] rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create src/components/VoiceActorList.jsx**

```jsx
export default function VoiceActorList({ actors }) {
  if (!actors || actors.length === 0) return null

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">声优</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {actors.map((actor, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
              {actor.person?.images?.jpg?.image_url ? (
                <img
                  src={actor.person.images.jpg.image_url}
                  alt={actor.person.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                  VA
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {actor.person?.name || '未知'}
              </p>
              <p className="text-xs text-gray-500">{actor.language || ''}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/BackButton.jsx src/components/CharacterHero.jsx src/components/AboutSection.jsx src/components/TagList.jsx src/components/VoiceActorList.jsx
git commit -m "feat: add character detail sub-components"
```

---

### Task 8: CharacterDetailPage with API integration

**Files:**
- Modify: `src/pages/CharacterDetailPage.jsx`

**Interfaces:**
- Consumes: Task 7 sub-components, `getCharacterFull` from Task 6's `api.js`
- Produces: Full detail page at `/character/:id`. Fetches Jikan full character data. Loading/error/empty states. Data not available from API (tags) shown gracefully.

- [ ] **Step 1: Replace src/pages/CharacterDetailPage.jsx**

```jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCharacterFull } from '../lib/api'
import BackButton from '../components/BackButton'
import CharacterHero from '../components/CharacterHero'
import AboutSection from '../components/AboutSection'
import TagList from '../components/TagList'
import VoiceActorList from '../components/VoiceActorList'

export default function CharacterDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getCharacterFull(id)
      .then((data) => {
        if (!cancelled) setCharacter(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  const handleBack = () => {
    navigate(-1)
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen px-4 py-6 max-w-4xl mx-auto">
        <BackButton onClick={handleBack} />
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-[#ff6b8a] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen px-4 py-6 max-w-4xl mx-auto">
        <BackButton onClick={handleBack} />
        <div className="text-center py-20">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#ff6b8a] text-white rounded-lg hover:bg-[#ff5a7a] transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  // No data
  if (!character) {
    return (
      <div className="min-h-screen px-4 py-6 max-w-4xl mx-auto">
        <BackButton onClick={handleBack} />
        <div className="text-center py-20">
          <p className="text-gray-400">角色数据不可用</p>
        </div>
      </div>
    )
  }

  const imageUrl = character.images?.jpg?.image_url || character.images?.webp?.image_url
  const animeTitle = character.anime?.[0]?.anime?.title || ''
  // Jikan doesn't have explicit tags; derive some from the about text or anime appearances
  const nicknames = character.nicknames || []

  return (
    <div className="min-h-screen px-4 py-6 max-w-4xl mx-auto">
      <BackButton onClick={handleBack} />
      <CharacterHero imageUrl={imageUrl} name={character.name} animeTitle={animeTitle} />
      <AboutSection text={character.about} />
      <TagList tags={nicknames} />
      <VoiceActorList actors={character.voices || []} />
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

`npm run dev`. Search for a character, click its card — detail page loads with name, image, about, nicknames (as tags), and voice actors. Test back button navigates correctly. Test a non-existent ID like `/character/99999999` — should show error state.

- [ ] **Step 3: Commit**

```bash
git add src/pages/CharacterDetailPage.jsx
git commit -m "feat: add character detail page with Jikan full API"
```

---

### Task 9: Polish — scrolling, edge cases, responsive verification

**Files:**
- Modify: `src/index.css` (smooth scroll, base adjustments)

**What to check:**

- [ ] **Step 1: Add scrollbar styling in src/index.css**

Append to `src/index.css`:

```css
/* Custom scrollbar for dark theme */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #0f0f0f;
}
::-webkit-scrollbar-thumb {
  background: #2a2a2a;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3a3a3a;
}
```

- [ ] **Step 2: Manual verification checklist**

Run `npm run dev` and verify:
1. Home page (`/`): centered layout, search box focuses with pink glow
2. Search: type "naruto" → loads cards, grid is responsive (resize browser)
3. Cards hover: border brightens, card lifts 4px
4. Pagination: click pages, URL updates, results change
5. Empty: search "xyznonexistent123" → "未找到相关角色" message
6. Detail: click a card → full detail loads, back button works
7. Detail: VA list shows avatars, nicknames show as pink tags
8. Mobile: all pages look correct at 375px width
9. Error: disconnect internet, search → error + retry button

- [ ] **Step 3: Any bug fixes from verification**

Fix issues found, commit individually.

- [ ] **Step 4: Final commit**

```bash
git add src/index.css
git commit -m "style: add scrollbar styling and final polish"
```
