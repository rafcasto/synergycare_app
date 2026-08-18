"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { CtaButton } from "@/components/ui";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const credential = await signInWithEmailAndPassword(auth(), email.trim(), password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Could not start your session.");
      }

      // Sign out of the client SDK — the httpOnly session cookie is the only
      // credential we keep, and it is not readable from JavaScript.
      await auth().signOut();

      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      const code = (caught as { code?: string }).code ?? "";
      setError(
        code.includes("invalid-credential") ||
          code.includes("wrong-password") ||
          code.includes("user-not-found")
          ? "That email and password don't match."
          : code.includes("too-many-requests")
            ? "Too many attempts. Wait a few minutes and try again."
            : caught instanceof Error
              ? caught.message
              : "Sign in failed."
      );
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="t-small block font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 min-h-[48px] w-full rounded-[12px] border-[1.5px] border-gray-300 bg-white px-4 py-3 text-[16px] text-ink outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
        />
      </div>

      <div>
        <label htmlFor="password" className="t-small block font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 min-h-[48px] w-full rounded-[12px] border-[1.5px] border-gray-300 bg-white px-4 py-3 text-[16px] text-ink outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
        />
      </div>

      {error && (
        <p role="alert" className="t-small" style={{ color: "var(--color-error)" }}>
          {error}
        </p>
      )}

      <CtaButton type="submit" disabled={busy} full>
        {busy ? "Signing in…" : "Sign in"}
      </CtaButton>
    </form>
  );
}
