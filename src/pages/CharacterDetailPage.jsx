import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCharacterFull } from '../lib/api'
import Layout from '../components/Layout'
import BackButton from '../components/BackButton'
import CharacterHero from '../components/CharacterHero'
import AboutSection from '../components/AboutSection'
import TagList from '../components/TagList'
import VoiceActorList from '../components/VoiceActorList'
import CommentSection from '../components/CommentSection'

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

  const imageUrl = character?.image
  const animeTitle = character?.animeTitle || ''
  const nicknames = character?.nicknames || []

  return (
    <Layout>
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <BackButton onClick={handleBack} />
          <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-[#ff6b8a] transition-colors">
            🏠 首页
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-[#ff6b8a] rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#ff6b8a] text-white rounded-lg hover:bg-[#ff5a7a] transition-colors"
            >
              重试
            </button>
          </div>
        )}

        {!loading && !error && !character && (
          <div className="text-center py-20">
            <p className="text-gray-400">角色数据不可用</p>
          </div>
        )}

        {!loading && !error && character && (
          <>
            <CharacterHero imageUrl={imageUrl} name={character.name} animeTitle={animeTitle} />
            <AboutSection text={character.description} />
            <TagList tags={nicknames} title="别名" />
            <TagList tags={character.traits || []} title="特征" />
            <VoiceActorList actors={character.voices || []} />
            <CommentSection characterId={Number(id)} />
          </>
        )}
      </div>
    </Layout>
  )
}
