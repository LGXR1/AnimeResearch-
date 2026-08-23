import { useEffect, useState } from 'react'

const countKey = 'anime-character-search:visit-count'
const sessionKey = 'anime-character-search:visit-recorded'

export default function VisitCounter() {
  const [visits, setVisits] = useState(null)

  useEffect(() => {
    try {
      const previous = Number.parseInt(localStorage.getItem(countKey) || '0', 10) || 0
      const alreadyRecorded = sessionStorage.getItem(sessionKey) === 'true'
      const next = alreadyRecorded ? Math.max(previous, 1) : previous + 1

      if (!alreadyRecorded) {
        localStorage.setItem(countKey, String(next))
        sessionStorage.setItem(sessionKey, 'true')
      }
      setVisits(next)
    } catch {
      setVisits(1)
    }
  }, [])

  if (visits === null) return null

  return (
    <div
      className="fixed bottom-5 left-5 z-20 flex items-center gap-2 border border-white/10 bg-[#14131a]/85 px-3 py-2 text-xs text-gray-400 shadow-lg shadow-black/20 backdrop-blur-md"
      aria-label={`本机累计访问量 ${visits}`}
      title="本机累计访问次数"
    >
      <span className="h-1.5 w-1.5 bg-[#ff6b8a]" aria-hidden="true" />
      <span>访问量</span>
      <strong className="font-medium tabular-nums text-[#ffb1c1]">{visits.toLocaleString('zh-CN')}</strong>
    </div>
  )
}
