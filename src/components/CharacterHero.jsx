export default function CharacterHero({ imageUrl, name, animeTitle }) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
      <div className="w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        {animeTitle && (
          <p className="text-gray-400 text-lg">{animeTitle}</p>
        )}
      </div>
    </div>
  )
}
