import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import FeedbackBoard from '../components/FeedbackBoard'

// 樱花花瓣
const petals = Array.from({ length: 20 }, (_, i) => ({
  left: Math.random() * 100,
  delay: Math.random() * 10,
  duration: 8 + Math.random() * 12,
  size: 8 + Math.random() * 14,
  opacity: 0.15 + Math.random() * 0.25,
}))

export default function SearchPage() {
  const navigate = useNavigate()

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #0a0a12 0%, #1a1025 30%, #0f1724 60%, #0a0a12 100%)' }}>

      {/* 樱花花瓣飘落 */}
      {petals.map((p, i) => (
        <div key={i} className="absolute pointer-events-none"
          style={{
            left: p.left + '%',
            top: '-5%',
            animation: `sakuraFall ${p.duration}s ${p.delay}s linear infinite`,
            opacity: p.opacity,
            fontSize: p.size + 'px',
          }}>
          ✿
        </div>
      ))}

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

        <p className="text-gray-500 mb-12 text-sm tracking-widest">
          キャラクター・アニメ・特徴で検索
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

      {/* 樱花动画 keyframes */}
      <style>{`
        @keyframes sakuraFall {
          0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 0; }
          5% { opacity: 0.3; }
          50% { transform: translateY(50vh) rotate(180deg) translateX(30px); opacity: 0.2; }
          100% { transform: translateY(105vh) rotate(360deg) translateX(-20px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
