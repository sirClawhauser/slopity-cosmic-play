// network-first: свежая версия при каждом заходе, кэш — офлайн-фолбэк
const CACHE = 'slopity-cosmic-v2'

self.addEventListener('install', e => self.skipWaiting())
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.map(k => k === CACHE ? null : caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone()
      caches.open(CACHE).then(c => c.put(e.request, copy))
      return res
    }).catch(() => caches.match(e.request)),
  )
})
