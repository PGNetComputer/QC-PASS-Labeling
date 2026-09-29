/* QC PASS Labeling — service worker: menyimpan TAMPILAN di HP supaya langsung terbuka.
   Panggilan ke Apps Script (JSONP, ada "callback=") tidak pernah disimpan. */
var CACHE = 'qcpass-338bfdf3';
var ASET = ['./', 'index.html', 'config.js', 'manifest.json', 'ikon-192.png', 'ikon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASET); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.search.indexOf('callback=') > -1) return;
  e.respondWith(fetch(e.request).then(function (r) {
    var salin = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, salin); }); return r;
  }).catch(function () {
    return caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || caches.match('index.html'); });
  }));
});
