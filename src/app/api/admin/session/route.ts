import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "@/lib/firebase-admin";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/admin-auth";

export const runtime = "nodejs";

/**
 * Exchanges a Firebase ID token for an httpOnly session cookie.
 *
 * The ID token never touches storage the browser can read, so an XSS bug on
 * the marketing page cannot lift admin credentials. The cookie is verified
 * server-side on every admin request.
 */
export async function POST(request: Request) {
  let idToken: string;
  try {
    ({ idToken } = (await request.json()) as { idToken: string });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!idToken) return NextResponse.json({ error: "Missing token." }, { status: 400 });

  try {
    const auth = getAuth(adminApp());
    const decoded = await auth.verifyIdToken(idToken, true);

    // Re-authentication within the last 5 minutes is required before we mint a
    // long-lived cookie, so a stolen stale token cannot open a new session.
    if (Date.now() / 1000 - decoded.auth_time > 5 * 60) {
      return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    const response = NextResponse.json({ ok: true, email: decoded.email });
    response.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });
    return response;
  } catch (error) {
    console.error("[admin/session] verification failed:", error);
    return NextResponse.json({ error: "That sign-in could not be verified." }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
