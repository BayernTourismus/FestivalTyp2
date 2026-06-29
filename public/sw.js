const CACHE_NAME = 'festivaltyp-v6'
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.svg',
  '/icon-512.svg',
  '/assets/app.css',
  '/assets/app.js',
  '/assets/museo-sans-300.woff2',
  '/assets/museo-sans-300.woff',
  '/assets/museo-sans-500.woff2',
  '/assets/museo-sans-500.woff',
  '/assets/museo-sans-700.woff2',
  '/assets/museo-sans-700.woff',
  '/assets/museo-slab-300.woff2',
  '/assets/museo-slab-300.woff',
  '/assets/museo-slab-500.woff2',
  '/assets/museo-slab-500.woff',
  '/assets/museo-slab-700.woff2',
  '/assets/museo-slab-700.woff',
  '/start.png',
  '/bayern-gehoert-erlebt.mp4',
  '/result-bg/1.png',
  '/result-bg/2.png',
  '/result-bg/3.png',
  '/result-bg/4.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(event.request.url)

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy))
          return response
        })
        .catch(async () => {
          const cached = await caches.match('/index.html')
          return cached || Response.error()
        })
    )
    return
  }

  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
          return response
        })
        .catch(() => caches.match(event.request))
    )
  }
})
