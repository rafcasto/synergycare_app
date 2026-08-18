"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import type { Faq, Pair, SiteContent, Tier } from "@/lib/content";
import { Panel } from "./AdminUI";

type Section = "hero" | "problem" | "how" | "tiers" | "trust" | "form" | "faq" | "footer" | "seo";

const SECTIONS: { id: Section; label: string; blurb: string }[] = [
  { id: "hero", label: "Hero", blurb: "The first thing a visitor reads, including both A/B headlines." },
  { id: "problem", label: "Sounds familiar?", blurb: "The three recognisable moments, and the brand thesis." },
  { id: "how", label: "How it works", blurb: "The three steps and the coverage note." },
  { id: "tiers", label: "Membership", blurb: "What each tier will include. Deliberately no prices." },
  { id: "trust", label: "Why trust us", blurb: "Founder story and how-we-work promises." },
  { id: "form", label: "Registration form", blurb: "Form headings, privacy note and the thank-you screen." },
  { id: "faq", label: "Questions", blurb: "The FAQ list." },
  { id: "footer", label: "Footer", blurb: "Mission line and sign-off." },
  { id: "seo", label: "Search & sharing", blurb: "Title and description used by Google and social previews." },
];

export default function ContentEditor({
  initial,
  meta,
}: {
  initial: SiteContent;
  meta: { updatedAt: string | null; updatedBy: string | null };
}) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initial);
  const [section, setSection] = useState<Section>("hero");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const dirty = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(initial),
    [content, initial]
  );

  /** Immutably update one section of the document. */
  const patch = useCallback(
    <K extends keyof SiteContent>(key: K, value: Partial<SiteContent[K]>) => {
      setContent((prev) => ({ ...prev, [key]: { ...prev[key], ...value } }));
      setStatus("idle");
    },
    []
  );

  async function save() {
    setStatus("saving");
    setError("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Could not save.");

      setStatus("saved");
      router.refresh();
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "Could not save.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <nav aria-label="Content sections" className="lg:sticky lg:top-6 lg:self-start">
        <ul className="flex flex-wrap gap-1 lg:flex-col">
          {SECTIONS.map((s) => {
            const active = section === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSection(s.id)}
                  aria-current={active ? "true" : undefined}
                  className={`w-full rounded-[12px] px-3 py-2 text-left text-[15px] transition-colors ${
                    active
                      ? "bg-teal-100 font-medium text-teal-700"
                      : "text-gray-600 hover:bg-white hover:text-ink"
                  }`}
                >
                  {s.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div>
        <Panel>
          <p className="t-small mb-6 text-gray-600">
            {SECTIONS.find((s) => s.id === section)?.blurb}
          </p>

          {section === "hero" && (
            <Fields>
              <Text
                label="Headline — variant A"
                hint="Half your visitors see this one. The peace-of-mind framing."
                value={content.hero.headlineA}
                onChange={(v) => patch("hero", { headlineA: v })}
                multiline
              />
              <Text
                label="Headline — variant B"
                hint="The other half see this. The emergency framing. Keep both live until a winner is clear."
                value={content.hero.headlineB}
                onChange={(v) => patch("hero", { headlineB: v })}
                multiline
              />
              <Text
                label="Subheadline"
                value={content.hero.subheadline}
                onChange={(v) => patch("hero", { subheadline: v })}
                multiline
              />
              <Text
                label="Button label"
                value={content.hero.ctaLabel}
                onChange={(v) => patch("hero", { ctaLabel: v })}
              />
              <Text
                label="Trust line under the button"
                value={content.hero.trustLine}
                onChange={(v) => patch("hero", { trustLine: v })}
              />
              <Text
                label="Hero photo description"
                hint="Read aloud by screen readers, and shown if the image fails to load."
                value={content.hero.imageAlt}
                onChange={(v) => patch("hero", { imageAlt: v })}
              />
            </Fields>
          )}

          {section === "problem" && (
            <Fields>
              <Text
                label="Section title"
                value={content.problem.title}
                onChange={(v) => patch("problem", { title: v })}
              />
              <ListEditor<Pair>
                label="Cards"
                items={content.problem.cards}
                blank={{ title: "", body: "" }}
                onChange={(cards) => patch("problem", { cards })}
                render={(card, update) => (
                  <>
                    <Text label="Card title" value={card.title} onChange={(v) => update({ title: v })} />
                    <Text label="Card body" value={card.body} onChange={(v) => update({ body: v })} multiline />
                  </>
                )}
              />
              <Text
                label="Closing line (the brand thesis)"
                hint="“Most of us can't be there. All of us can make sure someone is.” — the brief asks that this one is kept."
                value={content.problem.thesis}
                onChange={(v) => patch("problem", { thesis: v })}
                multiline
              />
            </Fields>
          )}

          {section === "how" && (
            <Fields>
              <Text label="Section title" value={content.how.title} onChange={(v) => patch("how", { title: v })} />
              <ListEditor<Pair>
                label="Steps"
                items={content.how.steps}
                blank={{ title: "", body: "" }}
                onChange={(steps) => patch("how", { steps })}
                render={(step, update) => (
                  <>
                    <Text label="Step title" value={step.title} onChange={(v) => update({ title: v })} />
                    <Text label="Step body" value={step.body} onChange={(v) => update({ body: v })} multiline />
                  </>
                )}
              />
              <Text label="Coverage note" value={content.how.note} onChange={(v) => patch("how", { note: v })} multiline />
            </Fields>
          )}

          {section === "tiers" && (
            <Fields>
              <Text label="Section title" value={content.tiers.title} onChange={(v) => patch("tiers", { title: v })} />
              <Text label="Intro" value={content.tiers.intro} onChange={(v) => patch("tiers", { intro: v })} multiline />
              <ListEditor<Tier>
                label="Tiers"
                items={content.tiers.items}
                blank={{ name: "", inherits: "", features: [] }}
                onChange={(items) => patch("tiers", { items })}
                render={(tier, update) => (
                  <>
                    <Text label="Name" value={tier.name} onChange={(v) => update({ name: v })} />
                    <Text
                      label="Inherits line"
                      hint="Optional, e.g. “Everything in Essentials, plus”."
                      value={tier.inherits}
                      onChange={(v) => update({ inherits: v })}
                    />
                    <StringList
                      label="Features"
                      items={tier.features}
                      onChange={(features) => update({ features })}
                    />
                  </>
                )}
              />
              <Text
                label="Footnote"
                value={content.tiers.footnote}
                onChange={(v) => patch("tiers", { footnote: v })}
                multiline
              />
            </Fields>
          )}

          {section === "trust" && (
            <Fields>
              <Text label="Section title" value={content.trust.title} onChange={(v) => patch("trust", { title: v })} />
              <StringList
                label="Founder story paragraphs"
                hint="First person, three or four sentences. This is the highest-leverage trust element on the page."
                items={content.trust.founderStory}
                onChange={(founderStory) => patch("trust", { founderStory })}
                multiline
              />
              <Text label="Founder name" value={content.trust.founderName} onChange={(v) => patch("trust", { founderName: v })} />
              <Text label="Founder role" value={content.trust.founderRole} onChange={(v) => patch("trust", { founderRole: v })} />
              <Text
                label="“How we work” heading"
                value={content.trust.howWeWorkTitle}
                onChange={(v) => patch("trust", { howWeWorkTitle: v })}
              />
              <StringList
                label="How we work promises"
                items={content.trust.howWeWork}
                onChange={(howWeWork) => patch("trust", { howWeWork })}
              />
              <Text
                label="Company and privacy line"
                value={content.trust.legal}
                onChange={(v) => patch("trust", { legal: v })}
                multiline
              />
            </Fields>
          )}

          {section === "form" && (
            <Fields>
              <Text label="Badge above the form" value={content.form.badge} onChange={(v) => patch("form", { badge: v })} />
              <Text label="Form heading" value={content.form.title} onChange={(v) => patch("form", { title: v })} />
              <Text label="Form subheading" value={content.form.subtitle} onChange={(v) => patch("form", { subtitle: v })} multiline />
              <Text label="Privacy note above submit" value={content.form.privacyNote} onChange={(v) => patch("form", { privacyNote: v })} multiline />
              <Text label="Submit button label" value={content.form.submitLabel} onChange={(v) => patch("form", { submitLabel: v })} />
              <Text
                label="Thank-you heading"
                hint="Use {name} where the person's first name should appear."
                value={content.form.confirmationTitle}
                onChange={(v) => patch("form", { confirmationTitle: v })}
              />
              <Text label="Thank-you message" value={content.form.confirmationBody} onChange={(v) => patch("form", { confirmationBody: v })} multiline />
              <Text label="Share prompt heading" value={content.form.sharePromptTitle} onChange={(v) => patch("form", { sharePromptTitle: v })} />
              <Text label="Share prompt body" value={content.form.sharePromptBody} onChange={(v) => patch("form", { sharePromptBody: v })} />
            </Fields>
          )}

          {section === "faq" && (
            <Fields>
              <Text label="Section title" value={content.faq.title} onChange={(v) => patch("faq", { title: v })} />
              <ListEditor<Faq>
                label="Questions"
                items={content.faq.items}
                blank={{ q: "", a: "" }}
                onChange={(items) => patch("faq", { items })}
                render={(faq, update) => (
                  <>
                    <Text label="Question" value={faq.q} onChange={(v) => update({ q: v })} />
                    <Text label="Answer" value={faq.a} onChange={(v) => update({ a: v })} multiline />
                  </>
                )}
              />
            </Fields>
          )}

          {section === "footer" && (
            <Fields>
              <Text label="Mission line" value={content.footer.mission} onChange={(v) => patch("footer", { mission: v })} multiline />
              <Text
                label="Sign-off"
                hint="Leave blank to hide it."
                value={content.footer.flourish}
                onChange={(v) => patch("footer", { flourish: v })}
              />
            </Fields>
          )}

          {section === "seo" && (
            <Fields>
              <Text
                label="Page title"
                hint="Shown in the browser tab and as the headline in Google results."
                value={content.seo.title}
                onChange={(v) => patch("seo", { title: v })}
              />
              <Text
                label="Description"
                hint="The grey summary under the title in search results, and the text in link previews."
                value={content.seo.description}
                onChange={(v) => patch("seo", { description: v })}
                multiline
              />
            </Fields>
          )}
        </Panel>

        <div className="sticky bottom-4 mt-6">
          <div
            className="flex flex-wrap items-center gap-4 rounded-[16px] bg-white px-5 py-4"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <button
              type="button"
              onClick={save}
              disabled={!dirty || status === "saving"}
              className="inline-flex min-h-[48px] items-center rounded-[12px] bg-teal-700 px-6 text-[16px] font-semibold text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "saving" ? "Saving…" : "Save and publish"}
            </button>

            {dirty && status !== "saving" && (
              <button
                type="button"
                onClick={() => {
                  setContent(initial);
                  setStatus("idle");
                }}
                className="t-small text-gray-600 hover:text-ink hover:underline"
              >
                Discard changes
              </button>
            )}

            <p className="t-small ml-auto text-gray-600" role="status">
              {status === "saved" && !dirty
                ? "Saved — the page is live."
                : status === "error"
                  ? error
                  : dirty
                    ? "Unsaved changes"
                    : meta.updatedAt
                      ? `Last edited ${new Date(meta.updatedAt).toLocaleDateString("en-NZ", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : "No edits yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- field primitives ---------------------------------------------------- */

function Fields({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

function Text({
  label,
  value,
  onChange,
  hint,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  multiline?: boolean;
}) {
  const shared =
    "mt-2 w-full rounded-[12px] border-[1.5px] border-gray-300 bg-white px-4 py-3 text-[16px] text-ink outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100";

  return (
    <label className="block">
      <span className="t-small font-medium text-ink">{label}</span>
      {hint && <span className="t-small mt-0.5 block text-gray-600">{hint}</span>}
      {multiline ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={shared} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`min-h-[48px] ${shared}`} />
      )}
    </label>
  );
}

function StringList({
  label,
  items,
  onChange,
  hint,
  multiline,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  hint?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="t-small font-medium text-ink">{label}</p>
      {hint && <p className="t-small mt-0.5 text-gray-600">{hint}</p>}

      <ul className="mt-2 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            {multiline ? (
              <textarea
                rows={3}
                value={item}
                onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))}
                className="w-full rounded-[12px] border-[1.5px] border-gray-300 bg-white px-4 py-3 text-[16px] text-ink outline-none focus:border-teal-600"
              />
            ) : (
              <input
                type="text"
                value={item}
                onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))}
                className="min-h-[48px] w-full rounded-[12px] border-[1.5px] border-gray-300 bg-white px-4 py-2 text-[16px] text-ink outline-none focus:border-teal-600"
              />
            )}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              aria-label={`Remove item ${i + 1}`}
              className="shrink-0 self-start rounded-[12px] p-3 text-gray-600 hover:bg-sampaguita"
              style={{ color: "var(--color-gray-600)" }}
            >
              <Trash2 size={18} strokeWidth={1.5} />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="t-small mt-2 inline-flex items-center gap-1.5 text-teal-700 hover:underline"
      >
        <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
        Add
      </button>
    </div>
  );
}

function ListEditor<T>({
  label,
  items,
  blank,
  onChange,
  render,
}: {
  label: string;
  items: T[];
  blank: T;
  onChange: (items: T[]) => void;
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div>
      <p className="t-small font-medium text-ink">{label}</p>

      <div className="mt-2 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-[16px] border border-gray-300 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="t-small text-gray-600">
                {label.replace(/s$/, "")} {i + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                aria-label={`Remove ${label.replace(/s$/, "").toLowerCase()} ${i + 1}`}
                className="rounded-[12px] p-2 text-gray-600 hover:bg-sampaguita"
              >
                <Trash2 size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="space-y-4">
              {render(item, (p) =>
                onChange(items.map((v, j) => (j === i ? { ...v, ...p } : v)))
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...items, structuredClone(blank)])}
        className="t-small mt-3 inline-flex items-center gap-1.5 text-teal-700 hover:underline"
      >
        <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
        Add {label.replace(/s$/, "").toLowerCase()}
      </button>
    </div>
  );
}
