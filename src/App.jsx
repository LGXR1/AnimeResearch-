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
