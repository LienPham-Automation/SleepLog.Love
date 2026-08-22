/* Sleep Log service worker: caches the app shell so it works offline after first load. */
var CACHE = "sleeplog-v2";
var ASSETS = [
  "./",
  "./index.html",
  "./privacy.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  // Only handle same-origin GETs. Lead-capture POSTs (cross-origin) pass straight through.
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req).then(function (cached) {
      return cached || fetch(req).then(function (resp) {
        return caches.open(CACHE).then(function (c) { try { c.put(req, resp.clone()); } catch (err) {} return resp; });
      }).catch(function () { return caches.match("./index.html"); });
    })
  );
});
