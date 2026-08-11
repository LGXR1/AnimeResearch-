export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = new Set()
  pages.add(1)
  pages.add(totalPages)
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    pages.add(i)
  }
  const sorted = [...pages].sort((a, b) => a - b)

  const withGaps = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) withGaps.push(-1)
    withGaps.push(p)
  })

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a]
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ‹
      </button>

      {withGaps.map((p, i) =>
        p === -1 ? (
          <span key={`gap-${i}`} className="px-2 text-gray-600">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? 'bg-[#ff6b8a] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a]
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ›
      </button>
    </div>
  )
}
