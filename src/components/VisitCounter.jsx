import { useEffect, useState } from 'react'
import { getVisitCount, recordVisit } from '../lib/api'

const sessionKey = 'anime-character-search:visit-recorded'
let visitRequest

export default function VisitCounter() {
  const [visits, setVisits] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadVisits() {
      try {
        const alreadyRecorded = sessionStorage.getItem(sessionKey) === 'true'
        if (alreadyRecorded) {
          const total = await getVisitCount()
          if (!cancelled) setVisits(total)
          return
        }

        // React Strict Mode may mount twice in development; reuse the same request.
        visitRequest ||= recordVisit()
        const total = await visitRequest
        sessionStorage.setItem(sessionKey, 'true')

        if (!cancelled) setVisits(total)
      } catch (error) {
        try { sessionStorage.removeItem(sessionKey) } catch {}
        console.error('无法加载全站访问量:', error)
      }
    }

    loadVisits()
    return () => { cancelled = true }
  }, [])

  if (visits === null) return null

  return (
    <div
      className="fixed bottom-5 left-5 z-20 flex items-center gap-2 border border-white/10 bg-[#14131a]/85 px-3 py-2 text-xs text-gray-400 shadow-lg shadow-black/20 backdrop-blur-md"
      aria-label={`全站访问量 ${visits}`}
      title="全站累计访问量"
    >
      <span className="h-1.5 w-1.5 bg-[#ff6b8a]" aria-hidden="true" />
      <span>全站访问量</span>
      <strong className="font-medium tabular-nums text-[#ffb1c1]">{visits.toLocaleString('zh-CN')}</strong>
    </div>
  )
}
