/**
 * sw.js — Service Worker Self-Destruct
 *
 * This file exists to unregister any stale service workers left over
 * from a previous Serwist/next-pwa installation.
 *
 * Once browsers receive this file, they will unregister themselves
 * and stop requesting sw.js.
 */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Clear all caches left by the previous PWA setup
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      // Unregister this service worker itself
      await self.registration.unregister();

      // Take control of all clients immediately
      await self.clients.claim();

      // Tell all open tabs/windows to reload so they pick up the clean state
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});
