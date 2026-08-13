import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import FeedbackBoard from '../components/FeedbackBoard'
import Layout from '../components/Layout'
import { Sakura, Bubble, Star } from 'acgui'

export default function SearchPage() {
  const navigate = useNavigate()
  const effectsRef = useRef(null)

  // 初始化 AcgUI 特效（樱花 + 气泡）
  useEffect(() => {
    if (!effectsRef.current) return

    const sakura = new Sakura({
      container: effectsRef.current,
      density: 25,
      speed: 1.5,
      color: '#ffb7c5',
      opacity: 0.5,
    }).init()

    const bubble = new Bubble({
      container: effectsRef.current,
      density: 8,
      speed: 1,
      color: 'rgba(170, 230, 255, 0.4)',
    }).init()

    // 星星点缀（边缘分布，避开中间标题和搜索框）
    const stars = [
      { position: { x: 12, y: 18 }, size: 34, color: 'rgba(255,255,255,0.5)' },
      { position: { x: 86, y: 12 }, size: 26, color: 'rgba(255,215,0,0.45)' },
      { position: { x: 7, y: 55 }, size: 22, color: 'rgba(255,255,255,0.4)' },
      { position: { x: 93, y: 44 }, size: 30, color: 'rgba(255,215,0,0.4)' },
      { position: { x: 18, y: 82 }, size: 20, color: 'rgba(255,255,255,0.35)' },
    ].map((cfg) => new Star({ container: effectsRef.current, ...cfg }).init())

    return () => {
      sakura.destroy()
      bubble.destroy()
      stars.forEach((s) => s.destroy())
    }
  }, [])

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <Layout className="flex flex-col items-center justify-center px-4">

      {/* AcgUI 特效层（樱花飘落 + 气泡上升） */}
      <div ref={effectsRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* 右上角装饰 */}
      <div className="absolute top-8 right-12 text-[#ff6b8a]/10 text-9xl select-none rotate-12">桜</div>
      <div className="absolute bottom-12 left-8 text-[#ff6b8a]/8 text-8xl select-none -rotate-6">夢</div>

      {/* 主内容 */}
      <div className="relative z-[1] flex flex-col items-center">
        {/* 日式标题 */}
        <div className="mb-2 flex items-center gap-3">
          <span className="text-[#ff6b8a]/60 text-lg font-light">〜</span>
          <span className="text-[#ff6b8a]/40 text-xs tracking-[0.3em] uppercase">Anime Character Search</span>
          <span className="text-[#ff6b8a]/60 text-lg font-light">〜</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-wider"
          style={{ textShadow: '0 0 80px rgba(255,107,138,0.15)' }}>
          <span className="bg-gradient-to-r from-[#ff6b8a] via-[#ff8fab] to-[#ff6b8a] bg-clip-text text-transparent">
            动漫人物搜索
          </span>
        </h1>

        <p className="text-gray-400 mb-12 text-sm tracking-widest flex items-center justify-center gap-3">
          <span>按角色 · 动漫 · 特征搜索</span>
          <span className="text-gray-600/60 text-xs">キャラクター・アニメ・特徴で検索</span>
        </p>

        <div className="w-full max-w-2xl">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* 底部 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-700 text-xs tracking-wider">
        768 characters · 206 anime · and counting
      </div>

      {/* 悬浮反馈栏 */}
      <aside className="fixed right-4 top-1/2 -translate-y-1/2 w-64 max-h-[60vh] bg-[#1a1a1a]/90 backdrop-blur-md border border-gray-700/50 rounded-2xl p-4 overflow-y-auto hidden xl:block z-10 shadow-2xl shadow-black/30">
        <FeedbackBoard compact />
      </aside>
    </Layout>
  )
}
