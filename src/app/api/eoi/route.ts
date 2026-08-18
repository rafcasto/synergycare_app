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

  const record = {
    first_name,
    email,
    mobile: mobile || null,
    worry_text: worry_text || null,
    q1_region: answers.q1_region ?? null,
    q2_for_whom: answers.q2_for_whom ?? null,
    q3_age: answers.q3_age ?? null,
    q4_location: answers.q4_location ?? null,
    q5_medical_remit: answers.q5_medical_remit ?? null,
    q6_budget: answers.q6_budget ?? null,
    q7_commitment: answers.q7_commitment ?? null,
    score,
    tags,
    headline_variant,
    utm_source: clean(body.utm_source, 200) || null,
    utm_medium: clean(body.utm_medium, 200) || null,
    utm_campaign: clean(body.utm_campaign, 200) || null,
    referrer: clean(body.referrer, 400) || null,
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  };

  try {
    // Doc id = email, so a resubmission updates rather than duplicating (§6).
    await db()
      .collection(COLLECTION)
      .doc(email)
      .set(record, { merge: true });
  } catch (error) {
    console.error("[eoi] Firestore write failed:", error);
    return NextResponse.json(
      { error: "We couldn't save that. Please try again in a moment." },
      { status: 500 }
    );
  }

  // Fire-and-forget: a failed email must not fail the registration.
  await sendWelcomeEmail({ first_name, email }).catch((error) =>
    console.error("[eoi] Welcome email failed:", error)
  );

  return NextResponse.json({ ok: true, score });
}
