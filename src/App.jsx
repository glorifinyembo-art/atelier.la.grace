import { useState, useEffect } from 'react'
import { useStore, StoreProvider } from './context/StoreContext'
import Header from './components/Header'
import CurrencySelector from './components/CurrencySelector'
import SearchBar from './components/SearchBar'
import Categories from './components/Categories'
import ProductGrid from './components/ProductGrid'
import ProductModal from './components/ProductModal'
import CartView from './components/CartView'
import ConfirmView from './components/ConfirmView'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import SplashScreen from './components/SplashScreen'

const CATEGORIES = ['Tout', 'Robe', 'Ensemble', 'Boubou', 'Bazin', 'Accessoire']

function AppContent() {
  const { loading, products, view, setView, selectedProduct, setSelectedProduct } = useStore()
  const [showSplash, setShowSplash] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tout')

  // Splash screen : 2 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Routage par hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      if (hash.startsWith('#product/')) {
        const id = hash.split('/')[1]
        const product = products.find(p => p.id === id)
        if (product) {
          setSelectedProduct(product)
          setView('product')
        }
      } else if (hash === '#cart') {
        setView('cart')
      } else if (hash === '#confirm') {
        setView('confirm')
      } else {
        setView('home')
        setSelectedProduct(null)
      }
    }

    window.addEventListener('hashchange', handleHash)
    handleHash()
    return () => window.removeEventListener('hashchange', handleHash)
  }, [products, setSelectedProduct, setView])

  // Afficher le splash screen avant tout
  if (showSplash) {
    return <SplashScreen />
  }

  // Ensuite, chargement des données
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500">
        <div className="text-xl font-bold animate-pulse">Chargement...</div>
      </div>
    )
  }

  const safeProducts = Array.isArray(products) ? products : []

  const filteredProducts = safeProducts.filter(p => {
    if (!p) return false
    const matchCategory = activeCategory === 'Tout' || p.cat === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <>
      {/* 🟠 Fausse barre de statut iOS (orange) */}
      <div className="ios-top-bar"></div>

      {/* Contenu principal décalé sous la barre */}
      <div className="app-safe-top min-h-screen bg-[#f2f2f7] pb-32">
        {view === 'home' && (
          <>
            <Header />
            <CurrencySelector />
            <SearchBar onSearch={setSearch} />
            <Categories
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            <div className="px-6 mt-8">
              <h3 className="font-extrabold text-sm text-gray-800 mb-4">
                {activeCategory === 'Tout' ? 'Modèles Populaires' : `Catalogue ${activeCategory}`}
              </h3>
              <ProductGrid filteredProducts={filteredProducts} />
            </div>
          </>
        )}

        {/* Modal Produit */}
        {selectedProduct && view === 'product' && (
          <ProductModal
            product={selectedProduct}
            onClose={() => (window.location.hash = '')}
          />
        )}

        {/* Panier */}
        {view === 'cart' && (
          <CartView
            onClose={() => (window.location.hash = '')}
            onConfirm={() => (window.location.hash = '#confirm')}
          />
        )}

        {/* Confirmation */}
        {view === 'confirm' && (
          <ConfirmView
            onClose={() => (window.location.hash = '#cart')}
          />
        )}

        {/* Navbar uniquement sur l'accueil */}
        {view === 'home' && <Navbar />}

        <Toast />
      </div>
    </>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  )
}
