import { useEffect, useState } from 'react'
import { getVisitCounts, recordVisit } from '../lib/api'

// Keep the request across React remounts and Vite hot reloads within this document.
const visitRequestKey = Symbol.for('anime.siteVisitRequest')

function recordPageVisit() {
  window[visitRequestKey] ||= recordVisit()
  return window[visitRequestKey]
}

export default function VisitCounter() {
  const [visits, setVisits] = useState(null)

  useEffect(() => {
    let cancelled = false
    let initialLoadFinished = false
    let refreshing = false

    function showCounts(counts) {
      if (!cancelled) setVisits(counts)
    }

    async function refreshCounts() {
      if (cancelled || !initialLoadFinished || refreshing || document.hidden) return
      refreshing = true
      try {
        showCounts(await getVisitCounts())
      } catch (error) {
        console.error('无法刷新浏览量:', error)
      } finally {
        refreshing = false
      }
    }

    async function loadVisits() {
      try {
        showCounts(await recordPageVisit())
      } catch (error) {
        console.error('无法记录本次浏览:', error)
        if (!cancelled) {
          try {
            showCounts(await getVisitCounts())
          } catch (readError) {
            console.error('无法加载浏览量:', readError)
          }
        }
      } finally {
        initialLoadFinished = true
      }
    }

    void loadVisits()
    const refreshWhenVisible = () => { void refreshCounts() }
    const timer = window.setInterval(refreshWhenVisible, 60_000)
    document.addEventListener('visibilitychange', refreshWhenVisible)
    window.addEventListener('focus', refreshWhenVisible)
    window.addEventListener('pageshow', refreshWhenVisible)

    return () => {
      cancelled = true
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
      window.removeEventListener('focus', refreshWhenVisible)
      window.removeEventListener('pageshow', refreshWhenVisible)
    }
  }, [])

  return (
    <footer
      className="flex h-12 items-center justify-center gap-2 border-t border-white/10 bg-[#0d0d15] px-4 text-xs text-gray-400"
      aria-label={visits ? `北京时间今日浏览量 ${visits.today}，总浏览量 ${visits.total}` : '浏览量加载中'}
      title="北京时间今日浏览量与全站累计浏览量"
    >
      {visits && (
        <>
          <span className="h-1.5 w-1.5 bg-[#ff6b8a]" aria-hidden="true" />
          <span>今日浏览量</span>
          <strong className="font-medium tabular-nums text-[#ffb1c1]">{visits.today.toLocaleString('zh-CN')}</strong>
          <span className="mx-1 h-4 border-l border-white/10" aria-hidden="true" />
          <span>总浏览量</span>
          <strong className="font-medium tabular-nums text-[#ffb1c1]">{visits.total.toLocaleString('zh-CN')}</strong>
        </>
      )}
    </footer>
  )
}
