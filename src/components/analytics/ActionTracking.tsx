"use client";

import { useEffect } from "react";
import { trackAction } from "@/lib/analytics/track";

export default function ActionTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.target instanceof Element && event.target.closest('a[data-analytics-action="apply"]')) {
        trackAction("apply");
      }
    }
    function onAuxClick(event: MouseEvent) {
      if (event.button === 1) onClick(event);
    }
    document.addEventListener("click", onClick);
    document.addEventListener("auxclick", onAuxClick);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("auxclick", onAuxClick);
    };
  }, []);
  return null;
}
