const VERSION = 'devfolio-v1'
const APP_SHELL = `${VERSION}-shell`
const RUNTIME = `${VERSION}-runtime`
const PRECACHE = ['/', '/index.html', '/manifest.webmanifest', '/logo.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(APP_SHELL).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)))).then(() => self.clients.claim()))
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const requestUrl = new URL(event.request.url)
  if (requestUrl.origin !== self.location.origin) return

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html').then((cached) => cached || caches.match('/offline.html'))))
    return
  }

  event.respondWith(caches.match(event.request).then((cached) => {
    const network = fetch(event.request).then((response) => {
      if (response.ok) {
        const copy = response.clone()
        caches.open(RUNTIME).then((cache) => cache.put(event.request, copy))
      }
      return response
    }).catch(() => cached)
    return cached || network
  }))
})
