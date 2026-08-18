"use client";

import { useEffect } from "react";
import { track } from "@/lib/firebase-client";
import { captureUtm, resolveVariant } from "@/lib/attribution";

/** Fires page_view (with variant + UTMs) and a one-shot scroll_50. */
export default function Analytics() {
  useEffect(() => {
    const utm = captureUtm();
    track("page_view", { headline_variant: resolveVariant(), ...utm });

    let fired = false;
    const onScroll = () => {
      if (fired) return;
      const scrolled = window.scrollY + window.innerHeight;
      const height = document.documentElement.scrollHeight;
      if (height > 0 && scrolled / height >= 0.5) {
        fired = true;
        track("scroll_50");
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
