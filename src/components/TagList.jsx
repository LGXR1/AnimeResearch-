export default function TagList({ tags, title = '别名' }) {
  if (!tags || tags.length === 0) return null

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-[#ff6b8a]/15 text-[#ff6b8a] rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}
