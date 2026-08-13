import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import CharacterCard from '../components/CharacterCard'
import Pagination from '../components/Pagination'
import Layout from '../components/Layout'
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
    <Layout>

      {/* 装饰 */}
      <div className="absolute top-4 right-8 text-[#ff6b8a]/6 text-7xl select-none rotate-12">探</div>
      <div className="absolute bottom-4 left-4 text-[#ff6b8a]/5 text-6xl select-none -rotate-6">尋</div>

      <div className="relative z-[1] px-4 py-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-3xl font-bold cursor-pointer hover:text-[#ff6b8a] transition-colors"
          style={{ textShadow: '0 0 40px rgba(255,107,138,0.1)' }}
          onClick={() => navigate('/')}>
          <span className="bg-gradient-to-r from-[#ff6b8a] via-[#ff8fab] to-[#ff6b8a] bg-clip-text text-transparent">
            动漫人物搜索
          </span>
        </h1>
        <p className="text-gray-500 text-xs tracking-widest mt-2 mb-6 flex items-center gap-2">
          <span>显示搜索结果</span>
          <span className="text-gray-600/50">結果を表示中</span>
        </p>
        <SearchBar initialValue={query} onSearch={handleSearch} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-2 border-[#ff6b8a]/20 border-t-[#ff6b8a] rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-16">
          <p className="text-red-400/80 mb-4 text-sm">{error}</p>
          <button onClick={() => setSearchParams({ q: query, page: '1' })}
            className="px-8 py-2.5 bg-[#ff6b8a]/90 text-white rounded-full text-sm hover:bg-[#ff5a7a] transition-all shadow-lg shadow-[#ff6b8a]/20">
            重试 <span className="opacity-50 text-xs">再試行</span>
          </button>
        </div>
      )}

      {/* Search results */}
      {query && !loading && !error && results && (
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-lg font-medium mb-6 text-gray-400 tracking-wide">
            {results.data.length > 0
              ? <><span className="text-[#ff6b8a]">{results.total}</span> 条搜索结果 <span className="text-gray-600/50 text-sm">件の検索結果</span></>
              : <span className="text-gray-400">没有找到该角色 <span className="text-gray-600/50 text-xs">該当なし</span></span>}
          </h2>
          {results.data.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
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
            <p className="text-gray-400 text-sm">试试其他关键词 <span className="text-gray-600/50 text-xs">新しいキーワードで試してみてください</span></p>
          )}
        </div>
      )}

      {/* All characters */}
      {!hasSearchResults && !loading && allChars && allChars.data.length > 0 && (
        <div className="max-w-5xl mx-auto pb-16">
          <h2 className="text-lg font-medium mb-6 text-gray-400 tracking-wide">
            {query ? <>全部角色 <span className="text-gray-600/50 text-sm">すべてのキャラクター</span></> : <><span className="text-[#ff6b8a]">{allChars.total}</span> 个角色收录中 <span className="text-gray-600/50 text-sm">キャラクター収録中</span></>}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
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
    </Layout>
  )
}
