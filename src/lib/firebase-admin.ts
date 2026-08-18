import "server-only";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Server-only Firebase Admin singleton. Credentials come from env vars —
 * never from a checked-in service-account JSON file.
 */
export function adminApp() {
  if (getApps().length) return getApp();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Env vars store the PEM with literal \n sequences; restore real newlines.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin env vars (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)."
    );
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export function db() {
  return getFirestore(adminApp());
}
