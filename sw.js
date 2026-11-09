// Sattva service worker.
// Strategy: network-first for the app page so site updates reach users immediately
// (same behaviour as before); cached copy is only an offline fallback.
// Audio (.mp3) is deliberately NOT cached or intercepted: iOS Safari breaks on
// service-worker-served audio because it relies on HTTP range requests.
var CACHE = 'sattva-shell-v1';
var SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;           // Stripe, Worker, fonts, etc. go straight to network
  if (/\.mp3$/i.test(url.pathname) || req.headers.has('range')) return; // audio: let the browser handle it

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        // Only the app page itself may refresh the offline copy (not privacy-policy.html etc.)
        var isApp = /\/(index\.html)?$/.test(url.pathname);
        if (res.ok && isApp) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
        }
        return res;
      }).catch(function () {
        return caches.match('./index.html');
      })
    );
    return;
  }

  // Other same-origin static files (icons, manifest): cache-first, refresh in background
  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
