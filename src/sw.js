/**
 * PLATAFORMA PWA REPORTES URBANOS - SERVICE WORKER (sw.js)
 * Manejo de ciclo de vida, pre-cacheador de recursos estáticos y soporte Offline.
 */

const CACHE_NAME = 'reportes-urbanos-v1.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// 1. Evento Install: Pre-cacheo de recursos críticos
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Instalando nueva versión...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Cacheando recursos estáticos esenciales');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Evento Activate: Limpieza de cachés antiguas y control de clientes
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activando y limpiando cachés obsoletas...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Eliminando caché previa:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Evento Fetch: Estrategia Cache First con fallback a Red para máxima velocidad y soporte offline
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones no HTTP/HTTPS (como chrome-extension://)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then((networkResponse) => {
            // Verificar si la respuesta es válida antes de cachear
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          })
          .catch(() => {
            // Fallback en caso de que esté completamente offline y no esté en caché
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});
