import { Heart, ArrowLeft } from '@phosphor-icons/react'
import { useStore } from '../context/StoreContext'

export default function ProductModal({ product, onClose }) {
  const {
    formatDisplayPrice,
    getCalculatedPrice,
    addToCart,
    favorites,
    toggleFavorite,
    products
  } = useStore()

  if (!product) return null

  const finalPrice = getCalculatedPrice(product)
  const isFav = favorites.includes(product.id)

  // Suggestions (produits similaires, sauf le produit actuel)
  const safeProducts = Array.isArray(products) ? products : []
  const suggestions = safeProducts
    .filter(p => p.id !== product.id && p.cat === product.cat)
    .slice(0, 4)

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="relative h-[55vh] bg-gray-100 p-4 pb-8">
        <button
          onClick={() => window.history.back()} // ✅ Nouveau comportement : retour arrière
          className="absolute top-6 left-6 z-30 w-10 h-10 rounded-full bg-white/50 backdrop-blur-md text-black flex items-center justify-center shadow-sm"
        >
          <ArrowLeft size={20} weight="bold" />
        </button>
        <img
          src={product.img || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

      <div className="p-8 -mt-8 bg-white rounded-t-[32px] relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h2>
            <p className="text-xl font-black text-gray-900 mt-1">
              {formatDisplayPrice(finalPrice)}
            </p>
          </div>
          <button
            onClick={() => toggleFavorite(product.id)}
            className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0"
          >
            <Heart
              size={24}
              weight={isFav ? 'fill' : 'regular'}
              className={isFav ? 'text-red-500' : 'text-gray-400'}
            />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {product.desc || 'Aucune description disponible.'}
        </p>

        <button
          onClick={() => {
            addToCart(product.id)
            // ✅ On NE FERME PAS la modale ici
            // La modale reste ouverte après l'ajout
          }}
          className="w-full bg-black text-white py-5 rounded-2xl font-bold mb-10 shadow-xl active:scale-[0.98] transition-transform"
        >
          Ajouter au panier
        </button>

        {suggestions.length > 0 && (
          <>
            <h4 className="font-extrabold text-sm mb-4">Recommandations</h4>
            <div className="grid grid-cols-2 gap-3 mb-20">
              {suggestions.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    // On change le hash, le routage fera le reste
                    window.location.hash = `#product/${p.id}`
                  }}
                  className="bg-gray-50 rounded-xl overflow-hidden cursor-pointer active:scale-95 transition"
                >
                  <img
                    src={p.img || 'https://via.placeholder.com/400'}
                    alt={p.name}
                    className="h-24 w-full object-cover"
                  />
                  <div className="p-2">
                    <p className="text-[10px] font-bold truncate">{p.name}</p>
                    <p className="text-xs font-black">
                      {formatDisplayPrice(getCalculatedPrice(p))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
