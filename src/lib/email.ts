import "server-only";

/**
 * Plain-text follow-up from Rafael, sent within minutes of registering (§4).
 * The single question at the end is the Phase 1 interview pipeline — replies
 * are the point, so this must read like a person wrote it.
 */
export async function sendWelcomeEmail({
  first_name,
  email,
}: {
  first_name: string;
  email: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    console.info("[email] RESEND_API_KEY not set — skipping welcome email.");
    return;
  }

  const text = `Salamat, ${first_name}.

You're on the SynergyCare founding list. Here's what happens next: I'll be in touch personally within the week — a short conversation about your parents, where they live, and what you're dealing with right now. No pitch.

We're starting with a small group of founding families so we can get the care right before we grow. Your answers help decide where we launch first.

One question, and I read every reply:

What would make this genuinely useful for your family?

Just hit reply.

— Rafael
SynergyCare`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      reply_to: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
      subject: `Salamat, ${first_name} — you're on the founding list`,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}
