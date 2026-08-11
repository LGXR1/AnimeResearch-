import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import CharacterCard from '../components/CharacterCard'
import Pagination from '../components/Pagination'
import { searchCharacters, getAllCharacters } from '../lib/api'

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const browsePage = parseInt(searchParams.get('browse') || '1', 10)

  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [allChars, setAllChars] = useState(null)

  // Fetch all characters (paginated) on mount
  useEffect(() => {
    getAllCharacters(browsePage, 24)
      .then(setAllChars)
      .catch(() => setAllChars(null))
  }, [browsePage])

  // Search when query changes
  useEffect(() => {
    if (!query) { setResults(null); return }

    let cancelled = false
    setLoading(true)
    setError(null)

    searchCharacters(query, page)
      .then((res) => { if (!cancelled) setResults(res) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [query, page])

  const handleSearch = (newQuery) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`)
  }

  const handlePageChange = (newPage) => {
    setSearchParams({ q: query, page: String(newPage) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBrowsePage = (newPage) => {
    const params = {}
    if (query) params.q = query
    params.browse = String(newPage)
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCardClick = (id) => {
    navigate(`/character/${id}`)
  }

  const hasSearchResults = results && results.data.length > 0

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-4">动漫人物搜索</h1>
        <SearchBar initialValue={query} onSearch={handleSearch} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-[#ff6b8a] rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-10">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => setSearchParams({ q: query, page: '1' })}
            className="px-6 py-2 bg-[#ff6b8a] text-white rounded-lg hover:bg-[#ff5a7a] transition-colors">
            重试
          </button>
        </div>
      )}

      {/* ====== 搜索结果区 ====== */}
      {query && !loading && !error && results && (
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">
            {hasSearchResults ? `搜索结果：${results.data.length} 个角色` : '搜索结果：未找到相关角色'}
          </h2>
          {hasSearchResults ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.data.map((char) => (
                  <CharacterCard key={char.id} character={char} onClick={handleCardClick} />
                ))}
              </div>
              <Pagination
                currentPage={results.pagination.current_page}
                totalPages={results.pagination.last_visible_page}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p className="text-gray-500">换个关键词试试？</p>
          )}
        </div>
      )}

      {/* ====== 全部角色区（搜索结果有结果时隐藏） ====== */}
      {!hasSearchResults && allChars && !loading && (
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">
            {query ? '所有角色' : `全部角色 (${allChars.total} 个)`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {allChars.data.map((char) => (
              <CharacterCard key={char.id} character={char} onClick={handleCardClick} />
            ))}
          </div>
          <Pagination
            currentPage={allChars.pagination.current_page}
            totalPages={allChars.pagination.last_visible_page}
            onPageChange={handleBrowsePage}
          />
        </div>
      )}
    </div>
  )
}
