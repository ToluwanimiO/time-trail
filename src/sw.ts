/// <reference lib="webworker" />

import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";

import {
  NavigationRoute,
  registerRoute,
} from "workbox-routing";

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<
    string | {
      url: string;
      revision?: string | null;
    }
  >;
};

// Vite PWA injects the generated asset list here.
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

// Serve the cached React app for navigation requests.
// This lets routes such as /timer load offline.
registerRoute(
  new NavigationRoute(
    createHandlerBoundToURL("/index.html"),
    {
      denylist: [
        /^\/api\//,
        /^\/\.netlify\//,
      ],
    }
  )
);

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    (async () => {
      // Only allow known TimeTrail destinations.
      const requestedPath: unknown =
        event.notification.data?.url;
      const path =
        requestedPath === "/timer"
          ? "/timer"
          : "/";

      const targetUrl = new URL(
        path,
        self.location.origin
      ).href;

      const windowClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // Prefer an existing window already on the target route.
      const exactMatch = windowClients.find(
        (client) => client.url === targetUrl
      );

      if (exactMatch) {
        await exactMatch.focus();
        return;
      }

      // Otherwise, reuse an existing TimeTrail window.
      const appWindow = windowClients.find(
        (client) =>
          new URL(client.url).origin ===
          self.location.origin
      );

      if (appWindow) {
        try {
          const navigatedWindow =
            await appWindow.navigate(targetUrl);

          if (navigatedWindow) {
            await navigatedWindow.focus();
            return;
          }
        } catch {
          // The existing window may have closed meanwhile.
        }
      }

      // No usable app window: open TimeTrail.
      await self.clients.openWindow(targetUrl);
    })()
  );
});

export {};