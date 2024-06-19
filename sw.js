const OFFLINE_VERSION = 1;
// const CACHE_OFFLINE = "offline";
// const OFFLINE_URL = "/offline.html";
const CACHE = "primary";
const CACHE_URL = "/primary.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      // const offlineCache = await caches.open(CACHE_OFFLINE);
      // await offlineCache.add(new Request(OFFLINE_URL, { cache: "reload" }));

      const cache = await caches.open(CACHE);
      await cache.add(new Request(CACHE_URL, { cache: "reload" }));
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.log("Fetch failed; returning offline page instead.", error);

          // const offlineCache = await caches.open(CACHE);
          // const offlineCachedResponse = await offlineCache.match(CACHE_URL);

          const cache = await caches.open(CACHE);
          const cachedResponse = await cache.match(CACHE_URL);

          return cachedResponse;
        }
      })()
    );
  }
});
