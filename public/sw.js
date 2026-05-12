const CACHE_NAME = "atelier-la-grace-v1"

const urlsToCache = [
  "/atelier.la.grace/",
  "/atelier.la.grace/index.html",
  "/atelier.la.grace/logo.png",
  "/atelier.la.grace/manifest.webmanifest"
]

// Installation : mise en cache et activation immédiate
self.addEventListener("install", event => {
  // ✅ FORCE L'ACTIVATION DU NOUVEAU SW IMMÉDIATEMENT
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  )
})

// Activation : nettoyage des anciens caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  )
  return self.clients.claim()
})

// Fetch : stratégie cache-first, puis réseau
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})
