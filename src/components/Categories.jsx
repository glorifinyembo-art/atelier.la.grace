// Mappage des noms de catégories (ce qu'on voit vs ce qui est stocké)
const CATEGORY_MAP = {
  'Peignoir': 'Robe',
  // Tu peux ajouter d'autres correspondances ici si besoin
}

export default function Categories({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="px-6 mt-6 flex gap-3 overflow-x-auto no-scrollbar">
      {categories.map((cat) => {
        // Affiche le nom mappé s'il existe, sinon le nom original
        const displayName = CATEGORY_MAP[cat] || cat

        return (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`shrink-0 px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeCategory === cat ? 'bg-black text-white' : 'bg-white text-gray-500'
            }`}
          >
            {displayName}
          </button>
        )
      })}
    </div>
  )
}
