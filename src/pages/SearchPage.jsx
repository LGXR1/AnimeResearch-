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
