import { useEffect, useState } from 'react'

export default function SearchBar({ initialValue = '', onSearch, compact = false }) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => { setValue(initialValue) }, [initialValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  const inputClasses = compact
    ? 'w-full max-w-xl px-4 py-2 pl-10 pr-20 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff6b8a] focus:ring-1 focus:ring-[#ff6b8a] transition-all'
    : 'w-full max-w-2xl px-6 py-4 pl-14 pr-24 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white text-base sm:text-lg placeholder-gray-400 focus:outline-none focus:border-[#ff6b8a] focus:ring-1 focus:ring-[#ff6b8a] transition-all'

  return (
    <form onSubmit={handleSubmit} className="w-full flex justify-center">
      <div className="relative w-full" style={{ maxWidth: compact ? undefined : '42rem' }}>
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
          aria-label="搜索角色、动漫、特征或声优"
          enterKeyHint="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="角色名 / 中文别名 / 动漫名 / 特征 / 声优…"
          className={inputClasses}
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#ff6b8a] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#ff5a7a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb1c1] disabled:cursor-not-allowed disabled:opacity-40"
        >
          搜索
        </button>
      </div>
    </form>
  )
}
