const CACHE_NAME = 'todo-app-v1';

const APP_SHELL = [
    './offline.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// INSTALL: Simpan app shell dan offline page
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(APP_SHELL);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});

// ACTIVATE: Hapus cache versi lama
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames
                    .filter(function(cacheName) {
                        return cacheName.startsWith('todo-app-') &&
                               cacheName !== CACHE_NAME;
                    })
                    .map(function(cacheName) {
                        return caches.delete(cacheName);
                    })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

// FETCH: Atur strategi caching berdasarkan jenis resource
self.addEventListener('fetch', function(event) {
    const request = event.request;
    const url = new URL(request.url);

    // Hanya tangani request GET dari origin yang sama
    if (request.method !== 'GET' ||
        url.origin !== self.location.origin) {
        return;
    }

    // Navigasi halaman: Network First
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(function(response) {
                    return response;
                })
                .catch(function() {
                    return caches.match('./offline.html');
                })
        );
        return;
    }

    // Resource statis: Cache First
    event.respondWith(
        caches.match(request).then(function(cachedResponse) {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request).then(function(response) {
                if (response.ok) {
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(request, responseToCache);
                    });
                }

                return response;
            });
        })
    );
});

// MESSAGE: Pertahankan fitur notifikasi E04
self.addEventListener('message', function(event) {
    if (!event.data || event.data.type !== 'show-notification') {
        return;
    }

    event.waitUntil(
        self.registration.showNotification(event.data.title, {
            body: event.data.description ||
                  'You have a new todo reminder.'
        })
    );
});

// NOTIFICATION CLICK: Buka atau fokus aplikasi
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(function(clientList) {
            for (const client of clientList) {
                if ('focus' in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
