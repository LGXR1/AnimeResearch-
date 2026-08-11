export default function AboutSection({ text }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">简介</h2>
      {text ? (
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">{text}</p>
      ) : (
        <p className="text-gray-600">暂无简介</p>
      )}
    </section>
  )
}
