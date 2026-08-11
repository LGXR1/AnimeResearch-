export default function VoiceActorList({ actors }) {
  if (!actors || actors.length === 0) return null

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">声优</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {actors.map((actor, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
              {actor.person?.images?.jpg?.image_url ? (
                <img
                  src={actor.person.images.jpg.image_url}
                  alt={actor.person.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                  VA
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {actor.person?.name || '未知'}
              </p>
              <p className="text-xs text-gray-500">{actor.language || ''}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
