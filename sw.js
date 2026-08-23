/* Sleep Log service worker: caches the app shell so it works offline after first load. */
var CACHE = "sleeplog-v3";
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
  var isDoc = req.mode === "navigate" || url.pathname === "/" || /\.html?$/.test(url.pathname);
  if (isDoc) {
    // Network-first for the app page: always get the latest when online, fall back to cache offline.
    e.respondWith(
      fetch(req).then(function (resp) {
        var copy = resp.clone();
        caches.open(CACHE).then(function (c) { try { c.put(req, copy); } catch (err) {} });
        return resp;
      }).catch(function () {
        return caches.match(req).then(function (r) { return r || caches.match("./index.html"); });
      })
    );
  } else {
    // Cache-first for static assets (icons, manifest).
    e.respondWith(
      caches.match(req).then(function (cached) {
        return cached || fetch(req).then(function (resp) {
          var copy = resp.clone();
          caches.open(CACHE).then(function (c) { try { c.put(req, copy); } catch (err) {} });
          return resp;
        });
      })
    );
  }
});
