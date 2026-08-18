"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAnalytics,
  isSupported,
  logEvent,
  type Analytics,
} from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let analyticsPromise: Promise<Analytics | null> | null = null;

function app(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function auth(): Auth {
  return getAuth(app());
}

/** Analytics is unsupported in SSR and some browsers — resolve to null there. */
function analytics(): Promise<Analytics | null> {
  if (!firebaseConfig.apiKey) return Promise.resolve(null);
  analyticsPromise ??= isSupported().then((ok) => (ok ? getAnalytics(app()) : null));
  return analyticsPromise;
}

/**
 * Events tracked (§5): page_view, scroll_50, form_step1_complete,
 * form_submit, share_click.
 */
export function track(event: string, params?: Record<string, unknown>) {
  void analytics()
    .then((a) => a && logEvent(a, event, params))
    .catch(() => {
      /* analytics must never break the page */
    });
}
