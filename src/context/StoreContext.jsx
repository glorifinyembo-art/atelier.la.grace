import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const StoreContext = createContext()

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within StoreProvider')
  return context
}

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [currency, setCurrency] = useState('CDF')
  const [exchangeRate, setExchangeRate] = useState(2850)
  const [loading, setLoading] = useState(true)
  
  // États pour la navigation et l'interface
  const [view, setView] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cache
        try {
          const cachedProds = localStorage.getItem('grace_products_cache')
          if (cachedProds) setProducts(JSON.parse(cachedProds))
        } catch (e) {
          localStorage.removeItem('grace_products_cache')
        }

        const savedCart = localStorage.getItem('grace_cart_v2')
        if (savedCart) setCart(JSON.parse(savedCart))

        const savedFavs = localStorage.getItem('grace_favs')
        if (savedFavs) setFavorites(JSON.parse(savedFavs))

        // Supabase
        const { data: config } = await supabase
          .from('Boutique_Config')
          .select('value')
          .eq('key', 'taux_usd_cdf')
          .single()
        if (config) setExchangeRate(parseFloat(config.value))

        const { data: productsData } = await supabase
          .from('Produits')
          .select('*')
          .eq('is_active', true)

        if (!productsData || productsData.length === 0) {
          setProducts([])
          setLoading(false)
          return
        }

        const formatted = productsData
          .filter(p => p && p.id)
          .map(p => ({
            id: String(p.id),
            name: p.name || 'Sans nom',
            basePrice: p.base_price || 0,
            currency: p.currency || 'CDF',
            desc: p.description || '',
            iaMode: p.ia_mode || 'fixed',
            cat: p.cat || 'Autre',
            img: p.img_url || 'https://via.placeholder.com/400',
            isTrend: p.force_top || false,
            stock: p.stock || 0,
            sales: p.sales || 0,
            views: p.views || 0,
            likes: p.likes || 0
          }))

        setProducts(formatted)
        localStorage.setItem('grace_products_cache', JSON.stringify(formatted))

      } catch (e) {
        console.warn('Erreur Supabase:', e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // --- Fonctions métier ---
  const getCalculatedPrice = (p) => {
    if (!p) return 0
    let price = p.basePrice
    if (p.iaMode === 'liquidation') price *= 0.7
    else if (p.iaMode === 'auto') {
      const popularite = p.views > 0 ? (p.sales / p.views) : 0
      if (popularite > 0.05 && p.stock < 5) price *= 1.15
      else if (p.views > 150 && p.sales === 0) price *= 0.9
    }
    if (currency === 'USD') {
      if (p.currency === 'CDF') return parseFloat((price / exchangeRate).toFixed(2))
      return parseFloat(price.toFixed(2))
    } else {
      if (p.currency === 'USD') return Math.round(price * exchangeRate)
      return Math.round(price)
    }
  }

  const formatDisplayPrice = (price) => {
    if (price === undefined || price === null) price = 0
    const symbol = currency === 'USD' ? ' $' : ' FC'
    const opts = currency === 'USD'
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : { maximumFractionDigits: 0 }
    return new Intl.NumberFormat('fr-FR', opts).format(price) + symbol
  }

  const addToCart = (productId) => {
    setCart(prev => {
      const newCart = [...prev, productId]
      localStorage.setItem('grace_cart_v2', JSON.stringify(newCart))
      return newCart
    })
    setToastMessage('Ajouté au panier')
    setTimeout(() => setToastMessage(''), 2000)
  }

  const removeAllFromCart = (productId) => {
    setCart(prev => {
      const newCart = prev.filter(id => id !== productId)
      localStorage.setItem('grace_cart_v2', JSON.stringify(newCart))
      return newCart
    })
  }

  const toggleFavorite = async (productId) => {
    setFavorites(prev => {
      let newFavs
      if (prev.includes(productId)) {
        newFavs = prev.filter(id => id !== productId)
      } else {
        newFavs = [...prev, productId]
        supabase.rpc('increment_likes', { row_id: parseInt(productId), amount: 1 })
      }
      localStorage.setItem('grace_favs', JSON.stringify(newFavs))
      return newFavs
    })
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('grace_cart_v2')
  }

  const value = {
    products,
    cart,
    favorites,
    currency,
    exchangeRate,
    loading,
    view,
    setView,
    selectedProduct,
    setSelectedProduct,
    toastMessage,
    setToastMessage,
    changeCurrency: setCurrency,
    getCalculatedPrice,
    formatDisplayPrice,
    addToCart,
    removeAllFromCart,
    toggleFavorite,
    clearCart
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}
