import { ShoppingBag } from '@phosphor-icons/react'
import { useStore } from '../context/StoreContext'

export default function Navbar() {
  const { cart, products, getCalculatedPrice, formatDisplayPrice } = useStore()

  // Calcul du total réel
  let total = 0
  cart.forEach(id => {
    const product = products.find(p => p.id === id)
    if (product) {
      total += getCalculatedPrice(product)
    }
  })

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-[100]">
      <div className="bg-black/90 backdrop-blur-lg rounded-[28px] p-4 flex justify-between items-center shadow-2xl border border-white/10">
        <div
          className="flex items-center gap-4 pl-2 cursor-pointer"
          onClick={() => (window.location.hash = '#cart')}
        >
          <div className="relative">
            <ShoppingBag size={24} className="text-white" />
            <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">
              Panier
            </span>
            <span className="text-white font-black text-sm leading-none">
              {formatDisplayPrice(total)}
            </span>
          </div>
        </div>
        <button
          onClick={() => (window.location.hash = '#cart')}
          className="bg-white text-black px-6 py-3 rounded-2xl font-extrabold text-[11px] uppercase tracking-wide"
        >
          Commander
        </button>
      </div>
    </nav>
  )
}
