import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Layout className="flex flex-col items-center justify-center px-4">
      <div className="absolute top-8 right-12 text-[#ff6b8a]/10 text-9xl select-none rotate-12">空</div>
      <div className="absolute bottom-12 left-8 text-[#ff6b8a]/8 text-8xl select-none -rotate-6">無</div>

      <div className="relative z-[1] flex flex-col items-center text-center">
        <p className="text-7xl mb-6" style={{ textShadow: '0 0 40px rgba(255,107,138,0.15)' }}>🌸</p>
        <h1 className="text-3xl font-bold mb-3">
          <span className="bg-gradient-to-r from-[#ff6b8a] via-[#ff8fab] to-[#ff6b8a] bg-clip-text text-transparent">
            ページが見つかりません
          </span>
        </h1>
        <p className="text-gray-500 text-sm mb-10 tracking-widest">这里没有你要找的角色呢</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-2.5 bg-[#ff6b8a]/90 text-white rounded-full text-sm hover:bg-[#ff5a7a] transition-all shadow-lg shadow-[#ff6b8a]/20"
        >
          返回首页
        </button>
      </div>
    </Layout>
  )
}
