export default function CharacterCard({ character, onClick }) {
  const imageUrl = character.image
  const animeTitle = character.animeTitle || ''

  return (
    <div
      onClick={() => onClick(character.id)}
      className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden cursor-pointer
        hover:border-[#ff6b8a]/50 hover:-translate-y-1 transition-all duration-200 group"
    >
      <div className="aspect-[3/4] overflow-hidden bg-gray-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={character.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white truncate">{character.name}</h3>
        {animeTitle && (
          <p className="text-sm text-gray-400 truncate mt-1">{animeTitle}</p>
        )}
      </div>
    </div>
  )
}
