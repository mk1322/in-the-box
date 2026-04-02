const CACHE = "gabaryt-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./models/gabaryt-a.glb",
  "./models/gabaryt-b.glb",
  "./models/gabaryt-c.glb",
  "./models/gabaryt-a.usdz",
  "./models/gabaryt-b.usdz",
  "./models/gabaryt-c.usdz",
  "./assets/gabaryt-a-poster.webp",
  "./assets/gabaryt-b-poster.webp",
  "./assets/gabaryt-c-poster.webp",
  "./assets/favicon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      // Cache-first, fallback to network, then update cache
      const fetchPromise = fetch(e.request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
