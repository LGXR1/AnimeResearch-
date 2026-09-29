import { useEffect, useState } from 'react'
import { recordVisit } from '../lib/api'

// One increment per full document load. Reuse it across React remounts and Strict Mode.
let pageVisitRequest

function recordPageVisit() {
  pageVisitRequest ||= recordVisit().catch((error) => {
    pageVisitRequest = undefined
    throw error
  })
  return pageVisitRequest
}

export default function VisitCounter() {
  const [visits, setVisits] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadVisits() {
      try {
        const counts = await recordPageVisit()

        if (!cancelled) setVisits(counts)
      } catch (error) {
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
      aria-label={`今日浏览量 ${visits.today}，总浏览量 ${visits.total}`}
      title="今日浏览量与全站累计浏览量"
    >
      <span className="h-1.5 w-1.5 bg-[#ff6b8a]" aria-hidden="true" />
      <span>今日浏览量</span>
      <strong className="font-medium tabular-nums text-[#ffb1c1]">{visits.today.toLocaleString('zh-CN')}</strong>
      <span className="mx-1 h-4 border-l border-white/10" aria-hidden="true" />
      <span>总浏览量</span>
      <strong className="font-medium tabular-nums text-[#ffb1c1]">{visits.total.toLocaleString('zh-CN')}</strong>
    </div>
  )
}
