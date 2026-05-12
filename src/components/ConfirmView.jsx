import { CheckCircle, WhatsappLogo } from '@phosphor-icons/react'
import { useStore } from '../context/StoreContext'
import { useState, useEffect } from 'react'

export default function ConfirmView({ onClose }) {
  const {
    cart,
    products,
    getCalculatedPrice,
    formatDisplayPrice,
    clearCart
  } = useStore()

  // Récupérer les infos client depuis localStorage
  const [clientName, setClientName] = useState('')
  const [clientAddress, setClientAddress] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('grace_client_name') || 'Client Web'
    const address = localStorage.getItem('grace_client_address') || 'Non précisée'
    setClientName(name)
    setClientAddress(address)
  }, [])

  if (cart.length === 0) {
    onClose()
    return null
  }

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

  // Générer le message WhatsApp
  const generateWhatsAppMessage = () => {
    let msg = `Bonjour Atelier la Grâce, je suis ${clientName}.%0A`
    msg += `Adresse/Provenance : ${clientAddress}%0A%0A`
    msg += 'Je souhaite commander :%0A'
    items.forEach(item => {
      msg += `${item.name} (x${item.quantity}) : ${formatDisplayPrice(item.unitPrice * item.quantity)}%0A`
    })
    msg += `%0A*Total : ${formatDisplayPrice(total)}*`
    return msg
  }

  const handleSendWhatsApp = () => {
    const msg = generateWhatsAppMessage()
    clearCart()
    
    // Nettoyer localStorage après envoi
    localStorage.removeItem('grace_client_name')
    localStorage.removeItem('grace_client_address')
    
    window.open(`https://wa.me/243977855146?text=${msg}`, '_blank')
    onClose()
  }

  return (
    <div className="flex flex-col h-full bg-white p-8 text-center pt-20">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} weight="fill" className="text-green-500" />
      </div>

      <h2 className="text-2xl font-extrabold mb-4">Vérification finale</h2>

      <p className="text-gray-500 text-sm mb-6 px-2 leading-relaxed">
        Votre panier est prêt. Cliquez ci-dessous pour nous l'envoyer sur WhatsApp.
        <br /><br />
        <b className="text-gray-800">Besoin de conseils ou d'une personnalisation ? N'hésitez pas à en discuter avec nous directement !</b>
      </p>

      <div className="bg-gray-50 rounded-2xl p-4 text-left mb-10 text-sm">
        {items.map(item => (
          <div key={item.id} className="flex justify-between py-1">
            <span>{item.name} (x{item.quantity})</span>
            <span className="font-bold">{formatDisplayPrice(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-black text-lg">
          <span>Adresse/Provenance : {clientAddress}</span>
        </div>
        <div className="flex justify-between font-black text-lg mt-2">
          <span>TOTAL À PAYER</span>
          <span>{formatDisplayPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={handleSendWhatsApp}
        className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl"
      >
        <WhatsappLogo size={24} weight="fill" />
        Envoyer sur WhatsApp
      </button>

      <button
        onClick={onClose}
        className="mt-6 text-gray-400 font-bold text-sm"
      >
        Modifier la commande
      </button>
    </div>
  )
}
