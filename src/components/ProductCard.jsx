import { Fire, Crown, Heart } from '@phosphor-icons/react'
import { useStore } from '../context/StoreContext'

export default function ProductCard({ product, index }) {
  const { formatDisplayPrice, getCalculatedPrice, favorites } = useStore()

  // 🌟 Sécurité : si product est undefined, on ne rend rien
  if (!product) return null

  const finalPrice = getCalculatedPrice(product)
  const isFav = favorites.includes(product.id)

  return (
    <div
      onClick={() => (window.location.hash = `#product/${product.id}`)}
      className="product-card active:scale-95 relative"
    >
      <div className="relative h-44 bg-gray-100">
        <img
          src={product.img || 'https://via.placeholder.com/400'}
          alt={product.name || 'Produit'}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {index < 3 && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 shadow-md z-10">
            <Fire size={14} weight="fill" />
            POPULAIRE
          </span>
        )}

        {product.stock > 0 && product.stock <= 2 && (
          <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-black px-2 py-1 rounded border border-gray-700 flex items-center gap-1 shadow-md z-10">
            <Crown size={14} weight="fill" className="text-yellow-400" />
            RARE
          </span>
        )}

        {isFav && (
          <div className="absolute top-3 right-3 text-red-500">
            <Heart size={20} weight="fill" />
          </div>
        )}
      </div>

      <div className="p-3">
        <h4 className="text-[11px] font-bold truncate text-gray-700">
          {product.name || 'Produit inconnu'}
        </h4>
        <p className="text-sm font-black mt-0.5">
          {formatDisplayPrice(finalPrice)}
        </p>
      </div>
    </div>
  )
}
