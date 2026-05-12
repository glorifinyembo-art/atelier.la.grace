import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ✅ PWA : Service Worker avec détection de mise à jour
if ('serviceWorker' in navigator) {
  // 1. Enregistrement du Service Worker
  navigator.serviceWorker.register('/atelier.la.grace/sw.js')
    .then(registration => {
      console.log('✅ SW enregistré avec succès:', registration)

      // 2. Détection d'une nouvelle version (mise à jour)
      registration.addEventListener('updatefound', () => {
        const newSW = registration.installing
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
            // Une nouvelle version est disponible
            if (confirm('✨ Une nouvelle version est disponible. Voulez-vous rafraîchir pour appliquer les changements ?')) {
              window.location.reload()
            }
          }
        })
      })
    })
    .catch(error => {
      console.log('❌ Échec de l\'enregistrement du SW:', error)
    })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
