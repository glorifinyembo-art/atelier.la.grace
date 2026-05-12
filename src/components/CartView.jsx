import { X, Trash } from '@phosphor-icons/react'
import { useStore } from '../context/StoreContext'
import { useState } from 'react'

export default function CartView({ onClose, onConfirm }) {
  const {
    cart,
    products,
    getCalculatedPrice,
    formatDisplayPrice,
    removeAllFromCart
  } = useStore()

  // États locaux pour les champs client
  const [clientName, setClientName] = useState('')
  const [clientAddress, setClientAddress] = useState('')

  // Compter les articles
  const itemCounts = {}
  cart.forEach(id => {
    itemCounts[id] = (itemCounts[id] || 0) + 1
  })

  let total = 0
  const items = Object.keys(itemCounts).map(id => {
    const product = products.find(p => p.id === id)
    if (product) {
      const price = getCalculatedPrice(product)
      total += price * itemCounts[id]
      return { ...product, quantity: itemCounts[id], unitPrice: price }
    }
    return null
  }).filter(Boolean)

  // Fonction de confirmation locale
  const handleConfirm = () => {
    if (!clientName.trim()) {
      alert('Veuillez entrer votre nom.')
      return
    }
    if (cart.length === 0) return
    
    // On stocke les infos client dans localStorage pour la confirmation
    localStorage.setItem('grace_client_name', clientName)
    localStorage.setItem('grace_client_address', clientAddress)
    
    onConfirm()
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <h2 className="text-xl font-extrabold">Mon Panier</h2>
        <button onClick={onClose} className="text-gray-400 p-2">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-center py-20 text-gray-400 font-medium">Panier vide</p>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100"
            >
              <img
                src={item.img || 'https://via.placeholder.com/400'}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h5 className="text-xs font-bold">
                  {item.name} <span className="text-gray-400">x{item.quantity}</span>
                </h5>
                <p className="font-black text-sm">
                  {formatDisplayPrice(item.unitPrice * item.quantity)}
                </p>
              </div>
              <button
                onClick={() => removeAllFromCart(item.id)}
                className="text-red-500 p-2"
              >
                <Trash size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-8 bg-gray-50 border-t rounded-t-[32px]">
        <div className="mb-4">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
            Votre Nom *
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Ex: Marie, Maman Gloire..."
            className="w-full p-4 mt-2 mb-4 rounded-2xl bg-white border border-gray-100 text-sm font-bold shadow-sm outline-none"
          />

          <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl mb-3 flex gap-3 items-start">
            <p className="text-[11px] text-blue-800 leading-snug">
              Cette section est destinée aux clients <b>à distance ou à l'étranger</b>. Si vous êtes sur place, vous pourrez récupérer votre tenue à l'atelier !
            </p>
          </div>

          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
            Adresse ou Provenance
          </label>
          <input
            type="text"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            placeholder="Ex: Paris, Kinshasa, ou Quartier..."
            className="w-full p-4 mt-2 mb-2 rounded-2xl bg-white border border-gray-100 text-sm font-bold shadow-sm outline-none"
          />
        </div>

        <div className="flex justify-between items-center text-xl font-black mb-6 px-1">
          <span>Total</span>
          <span className="text-black">
            {formatDisplayPrice(total)}
          </span>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-black text-white py-5 rounded-2xl font-bold shadow-lg"
        >
          Finaliser la commande
        </button>
      </div>
    </div>
  )
}
