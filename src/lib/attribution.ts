"use client";

import type { HeadlineVariant } from "./content";

const VARIANT_KEY = "sc_headline_variant";
const UTM_KEY = "sc_utm";

export type Utm = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
};

/**
 * 50/50 headline A/B, persisted per visitor so the page doesn't flip between
 * sessions and the variant recorded on submit is the one they actually saw.
 * `?v=A|B` forces a variant for QA and for screenshotting ad creative.
 */
export function resolveVariant(): HeadlineVariant {
  if (typeof window === "undefined") return "A";

  const forced = new URLSearchParams(window.location.search).get("v")?.toUpperCase();
  if (forced === "A" || forced === "B") {
    window.localStorage.setItem(VARIANT_KEY, forced);
    return forced;
  }

  const stored = window.localStorage.getItem(VARIANT_KEY);
  if (stored === "A" || stored === "B") return stored;

  const assigned: HeadlineVariant = Math.random() < 0.5 ? "A" : "B";
  window.localStorage.setItem(VARIANT_KEY, assigned);
  return assigned;
}

/**
 * Capture UTMs on first landing and keep them — a visitor who arrives from an
 * ad, leaves, and returns direct should still be attributed to the ad.
 */
export function captureUtm(): Utm {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const fresh: Utm = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
    const value = params.get(key);
    if (value) fresh[key] = value.slice(0, 200);
  }
  if (document.referrer && !document.referrer.includes(window.location.host)) {
    fresh.referrer = document.referrer.slice(0, 400);
  }

  if (Object.keys(fresh).length) {
    window.sessionStorage.setItem(UTM_KEY, JSON.stringify(fresh));
    return fresh;
  }

  try {
    return JSON.parse(window.sessionStorage.getItem(UTM_KEY) ?? "{}") as Utm;
  } catch {
    return {};
  }
}
