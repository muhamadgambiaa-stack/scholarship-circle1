import { ACTION_EVENTS, isPublicPath, type Action } from "./shared";

/** Send to the existing GTM container. Its GA4 event tag controls collection/consent. */
export function trackAction(action: Action) {
  if (typeof window === "undefined") return;
  const { hostname, origin, pathname } = window.location;
  if (!/^(www\.)?thescholarshipcircle\.com$/.test(hostname) || !isPublicPath(pathname)) return;
  try {
    const analyticsWindow = window as Window & { dataLayer?: Record<string, unknown>[] };
    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    analyticsWindow.dataLayer.push({
      event: ACTION_EVENTS[action],
      page_location: origin + pathname,
      page_path: pathname,
    });
  } catch {
    // Analytics must never interrupt navigation, copying, or sharing.
  }
}
