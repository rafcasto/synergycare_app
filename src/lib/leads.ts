import "server-only";
import { db } from "./firebase-admin";
import { QUESTIONS, type QuestionId } from "./questions";

export type Lead = {
  id: string;
  first_name: string;
  email: string;
  mobile: string | null;
  worry_text: string | null;
  score: "A" | "B" | "C";
  tags: string[];
  headline_variant: "A" | "B";
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  resubmissions: number;
  created_at: string | null;
  answers: Partial<Record<QuestionId, string>>;
};

const LABELS = new Map(
  QUESTIONS.flatMap((q) => q.options.map((o) => [`${q.id}:${o.value}`, o.label] as const))
);

/** Turn a stored option value back into the words the visitor actually saw. */
export function labelFor(question: QuestionId, value: string | null | undefined) {
  if (!value) return "—";
  return LABELS.get(`${question}:${value}`) ?? value;
}

export function questionLabel(id: QuestionId) {
  return QUESTIONS.find((q) => q.id === id)?.label ?? id;
}

export async function listLeads(): Promise<Lead[]> {
  const snap = await db().collection("eoi_leads").orderBy("created_at", "desc").get();

  return snap.docs.map((doc) => {
    const d = doc.data();
    const answers: Partial<Record<QuestionId, string>> = {};
    for (const q of QUESTIONS) if (d[q.id]) answers[q.id] = d[q.id];

    return {
      id: doc.id,
      first_name: d.first_name ?? "",
      email: d.email ?? doc.id,
      mobile: d.mobile ?? null,
      worry_text: d.worry_text ?? null,
      score: d.score ?? "C",
      tags: d.tags ?? [],
      headline_variant: d.headline_variant ?? "A",
      utm_source: d.utm_source ?? null,
      utm_medium: d.utm_medium ?? null,
      utm_campaign: d.utm_campaign ?? null,
      referrer: d.referrer ?? null,
      resubmissions: d.resubmissions ?? 0,
      created_at: d.created_at?.toDate?.()?.toISOString() ?? null,
      answers,
    };
  });
}

export type Distribution = { value: string; label: string; count: number; pct: number }[];

function distribute(leads: Lead[], question: QuestionId): Distribution {
  const counts = new Map<string, number>();
  for (const lead of leads) {
    const value = lead.answers[question];
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  const order = QUESTIONS.find((q) => q.id === question)?.options ?? [];

  return order
    .filter((o) => counts.has(o.value))
    .map((o) => {
      const count = counts.get(o.value)!;
      return { value: o.value, label: o.label, count, pct: total ? (count / total) * 100 : 0 };
    })
    .sort((a, b) => b.count - a.count);
}

export type Stats = ReturnType<typeof buildStats>;

export function buildStats(leads: Lead[]) {
  const total = leads.length;
  const grade = (s: "A" | "B" | "C") => leads.filter((l) => l.score === s).length;
  const a = grade("A");
  const b = grade("B");
  const c = grade("C");

  const pct = (n: number) => (total ? (n / total) * 100 : 0);

  const now = Date.now();
  const since = (days: number) =>
    leads.filter((l) => l.created_at && now - Date.parse(l.created_at) < days * 86_400_000).length;

  const variant = (v: "A" | "B") => leads.filter((l) => l.headline_variant === v).length;

  const sources = new Map<string, number>();
  for (const lead of leads) {
    const key = lead.utm_source ?? (lead.referrer ? new URL(lead.referrer).hostname : "direct");
    sources.set(key, (sources.get(key) ?? 0) + 1);
  }

  return {
    total,
    grades: { a, b, c, aPct: pct(a), bPct: pct(b), cPct: pct(c) },
    // The validation plan's quality gate: at least 30% A- or B-grade.
    qualityPct: pct(a + b),
    qualityGateMet: pct(a + b) >= 30,
    last7: since(7),
    last30: since(30),
    provincial: leads.filter((l) => l.tags.includes("provincial")).length,
    foundingYes: leads.filter((l) => l.tags.includes("founding_yes")).length,
    withWorry: leads.filter((l) => l.worry_text).length,
    variants: { a: variant("A"), b: variant("B") },
    sources: [...sources.entries()]
      .map(([label, count]) => ({ label, count, pct: pct(count) }))
      .sort((x, y) => y.count - x.count),
    distributions: {
      q1_region: distribute(leads, "q1_region"),
      q2_for_whom: distribute(leads, "q2_for_whom"),
      q3_age: distribute(leads, "q3_age"),
      q4_location: distribute(leads, "q4_location"),
      q5_medical_remit: distribute(leads, "q5_medical_remit"),
      q6_budget: distribute(leads, "q6_budget"),
      q7_commitment: distribute(leads, "q7_commitment"),
    },
  };
}

export function toCsv(leads: Lead[]): string {
  const headers = [
    "email", "first_name", "mobile", "score", "tags", "headline_variant",
    ...QUESTIONS.map((q) => q.id),
    "worry_text", "utm_source", "utm_medium", "utm_campaign", "referrer",
    "resubmissions", "created_at",
  ];

  // Guard against CSV injection — a leading =, +, - or @ is executed by Excel.
  const cell = (v: unknown) => {
    let s = v === null || v === undefined ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };

  const rows = leads.map((l) =>
    [
      l.email, l.first_name, l.mobile, l.score, l.tags.join(" "), l.headline_variant,
      ...QUESTIONS.map((q) => labelFor(q.id, l.answers[q.id])),
      l.worry_text, l.utm_source, l.utm_medium, l.utm_campaign, l.referrer,
      l.resubmissions, l.created_at,
    ].map(cell).join(",")
  );

  return [headers.map(cell).join(","), ...rows].join("\r\n");
}
