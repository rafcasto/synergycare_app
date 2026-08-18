import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "@/lib/firebase-admin";
import { scoreLead, tagLead } from "@/lib/scoring";
import { QUESTIONS } from "@/lib/questions";
import type { Answers, EoiPayload } from "@/lib/types";
import { sendWelcomeEmail } from "@/lib/email";

export const runtime = "nodejs";

const COLLECTION = "eoi_leads";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Only accept option values we defined — blocks junk and injection via body. */
function validateAnswers(input: unknown): Partial<Answers> {
  const raw = (input ?? {}) as Record<string, unknown>;
  const out: Partial<Answers> = {};
  for (const q of QUESTIONS) {
    const value = clean(raw[q.id], 64);
    if (q.options.some((o) => o.value === value)) out[q.id] = value;
  }
  return out;
}

/**
 * Drop empty values before a merge write. Without this, someone registering a
 * second time from a direct visit would overwrite the UTMs and the free-text
 * answer captured on their first visit with nulls — silently destroying the
 * attribution and interview notes this page exists to collect.
 */
function compact<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(
      ([, value]) => value !== null && value !== undefined && value !== ""
    )
  ) as Partial<T>;
}

export async function POST(request: Request) {
  let body: EoiPayload;
  try {
    body = (await request.json()) as EoiPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const first_name = clean(body.first_name, 80);
  const email = clean(body.email, 200).toLowerCase();
  const mobile = clean(body.mobile, 40);
  const worry_text = clean(body.worry_text, 2000);

  if (!first_name) {
    return NextResponse.json({ error: "Please tell us your first name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  const answers = validateAnswers(body.answers);
  const score = scoreLead(answers);
  const tags = tagLead(answers);
  const headline_variant = body.headline_variant === "B" ? "B" : "A";

  const record = compact({
    first_name,
    email,
    mobile,
    worry_text,
    ...answers,
    score,
    headline_variant,
    utm_source: clean(body.utm_source, 200),
    utm_medium: clean(body.utm_medium, 200),
    utm_campaign: clean(body.utm_campaign, 200),
    referrer: clean(body.referrer, 400),
  });

  let isNew = true;

  try {
    const ref = db().collection(COLLECTION).doc(email);

    // Doc id = email, so a resubmission updates rather than duplicating (§6).
    // The transaction lets us keep created_at pinned to the first registration
    // while still refreshing everything the visitor actually re-answered.
    await db().runTransaction(async (tx) => {
      const snapshot = await tx.get(ref);
      isNew = !snapshot.exists;

      tx.set(
        ref,
        {
          ...record,
          // tags[] is derived, so it must replace rather than merge —
          // otherwise a corrected answer leaves a stale tag behind.
          tags,
          updated_at: FieldValue.serverTimestamp(),
          ...(isNew
            ? { created_at: FieldValue.serverTimestamp() }
            : { resubmissions: FieldValue.increment(1) }),
        },
        { merge: true }
      );
    });
  } catch (error) {
    console.error("[eoi] Firestore write failed:", error);
    return NextResponse.json(
      { error: "We couldn't save that. Please try again in a moment." },
      { status: 500 }
    );
  }

  // Only greet first-time registrants, and never let a failed send fail the
  // registration — the lead is already safely stored.
  if (isNew) {
    await sendWelcomeEmail({ first_name, email }).catch((error) =>
      console.error("[eoi] Welcome email failed:", error)
    );
  }

  return NextResponse.json({ ok: true, score });
}
