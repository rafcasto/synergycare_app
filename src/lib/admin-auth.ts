import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "./firebase-admin";

export const SESSION_COOKIE = "sc_admin_session";
/** Five days, matching the session cookie we mint. */
export const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000;

export type AdminUser = { uid: string; email: string };

/**
 * Verifies the session cookie with the Admin SDK. `checkRevoked` means a
 * disabled or signed-out account stops working immediately rather than
 * staying valid until the cookie expires.
 *
 * Authentication alone is not enough: this Firebase project may one day hold
 * accounts that are not staff, so an explicit `admin` custom claim is
 * required. Grant it with `npm run grant-admin -- <email>`.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;

  try {
    const claims = await getAuth(adminApp()).verifySessionCookie(cookie, true);
    if (!claims.email || claims.admin !== true) return null;
    return { uid: claims.uid, email: claims.email };
  } catch {
    return null;
  }
}

/** For pages. Bounces to the login screen. */
export async function requireAdminPage(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** For API routes. Returns null so the caller can send a 401. */
export async function requireAdminApi(): Promise<AdminUser | null> {
  return getAdminUser();
}
