import { useStore } from '../context/StoreContext'
import ProductCard from './ProductCard'

export default function ProductGrid({ filteredProducts }) {
  const { products } = useStore()
  const sourceItems = filteredProducts || products

  // ✅ Sécurité : on enlève les undefined ou null
  const items = sourceItems.filter(item => item !== undefined && item !== null)

  return (
    <div className="mt-8">
      <div className="grid grid-cols-2 gap-4">
        {items.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
        {items.length === 0 && (
          <p className="col-span-2 text-center py-10 text-gray-400">
            Aucun modèle trouvé
          </p>
        )}
      </div>
    </div>
  )
}
