const OFFLINE_VERSION = 1;
const CACHE_OFFLINE = "offline";
const OFFLINE_URL = "/offline.html";
const CACHE_PRIMARY = "primary";
const PRIMARY_URL = "/primary.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      // const cache = await caches.open(CACHE_OFFLINE);
      // await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));

      const cache = await caches.open(CACHE_PRIMARY);
      await cache.add(new Request(PRIMARY_URL, { cache: "reload" }));
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

          // const cache = await caches.open(CACHE_OFFLINE);
          // const cachedResponse = await cache.match(OFFLINE_URL);

          const cache = await caches.open(CACHE_PRIMARY);
          const cachedResponse = await cache.match(PRIMARY_URL);

          return cachedResponse;
        }
      })()
    );
  }
});
