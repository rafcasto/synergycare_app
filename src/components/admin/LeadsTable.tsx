"use client";

import { useMemo, useState } from "react";
import { Download, Search, X } from "lucide-react";
import { QUESTIONS } from "@/lib/questions";
import type { Lead } from "@/lib/leads";
import { Panel, ScorePill } from "./AdminUI";

const OPTION_LABELS = new Map<string, string>(
  QUESTIONS.flatMap((q) => q.options.map((o) => [`${q.id}:${o.value}`, o.label] as [string, string]))
);

function label(questionId: string, value?: string) {
  if (!value) return "—";
  return OPTION_LABELS.get(`${questionId}:${value}`) ?? value;
}

function when(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type Filter = "all" | "A" | "B" | "C" | "provincial" | "worry";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Everyone" },
  { id: "A", label: "A-grade" },
  { id: "B", label: "B-grade" },
  { id: "C", label: "C-grade" },
  { id: "provincial", label: "Provincial" },
  { id: "worry", label: "Wrote a worry" },
];

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Lead | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const passesFilter =
        filter === "all"
          ? true
          : filter === "provincial"
            ? lead.tags.includes("provincial")
            : filter === "worry"
              ? Boolean(lead.worry_text)
              : lead.score === filter;

      if (!passesFilter) return false;
      if (!q) return true;

      return (
        lead.first_name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.worry_text ?? "").toLowerCase().includes(q)
      );
    });
  }, [leads, filter, query]);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={`min-h-[40px] rounded-full border-[1.5px] px-4 text-[15px] transition-colors ${
                  active
                    ? "border-teal-700 bg-teal-100 font-medium text-ink"
                    : "border-gray-300 bg-white text-gray-600 hover:border-teal-600"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="relative ml-auto">
          <Search
            size={18}
            strokeWidth={1.5}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email or worry"
            aria-label="Search registrations"
            className="min-h-[40px] w-[260px] rounded-[12px] border-[1.5px] border-gray-300 bg-white py-2 pl-10 pr-3 text-[15px] text-ink outline-none focus:border-teal-600"
          />
        </div>

        <a
          href="/api/admin/leads"
          className="inline-flex min-h-[40px] items-center gap-2 rounded-[12px] border-[1.5px] border-teal-700 px-4 text-[15px] font-semibold text-teal-700 hover:bg-teal-100"
        >
          <Download size={16} strokeWidth={1.5} aria-hidden="true" />
          Export CSV
        </a>
      </div>

      <p className="t-small mb-3 text-gray-600">
        Showing {visible.length} of {leads.length}
      </p>

      <Panel className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-300">
              {["", "Name", "Email", "Parents live", "Would pay", "Founding group", "Registered"].map(
                (h) => (
                  <th key={h} className="t-small px-4 py-3 font-medium text-gray-600">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {visible.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => setOpen(lead)}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setOpen(lead)}
                className="cursor-pointer border-b border-gray-300 last:border-0 hover:bg-sampaguita"
              >
                <td className="px-4 py-3">
                  <ScorePill score={lead.score} />
                </td>
                <td className="t-small px-4 py-3 font-medium text-ink">{lead.first_name}</td>
                <td className="t-small px-4 py-3 text-gray-600">{lead.email}</td>
                <td className="t-small px-4 py-3 text-ink">
                  {label("q4_location", lead.answers.q4_location)}
                </td>
                <td className="t-small px-4 py-3 text-ink">
                  {label("q6_budget", lead.answers.q6_budget)}
                </td>
                <td className="t-small px-4 py-3 text-ink">
                  {label("q7_commitment", lead.answers.q7_commitment)}
                </td>
                <td className="t-small px-4 py-3 text-gray-600">{when(lead.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {open && <LeadDetail lead={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function LeadDetail({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Registration from ${lead.first_name}`}
      className="fixed inset-0 z-50 flex justify-end bg-[rgba(30,43,42,0.4)]"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-[520px] overflow-y-auto bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <ScorePill score={lead.score} />
              <h2 className="t-h3 text-ink">{lead.first_name}</h2>
            </div>
            <p className="t-small mt-1 text-gray-600">{when(lead.created_at)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-[12px] p-2 text-gray-600 hover:bg-sampaguita"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <dl className="mt-6 space-y-4">
          <Row term="Email">
            <a href={`mailto:${lead.email}`} className="text-teal-700 hover:underline">
              {lead.email}
            </a>
          </Row>
          {lead.mobile && (
            <Row term="Mobile">
              <a href={`tel:${lead.mobile}`} className="text-teal-700 hover:underline">
                {lead.mobile}
              </a>
            </Row>
          )}

          {QUESTIONS.map((q) => (
            <Row key={q.id} term={q.label}>
              {label(q.id, lead.answers[q.id])}
            </Row>
          ))}

          {lead.worry_text && (
            <div className="rounded-[16px] bg-sampaguita p-4">
              <dt className="t-small font-medium text-gray-600">
                What worries them most right now
              </dt>
              <dd className="t-body mt-2 whitespace-pre-wrap text-ink">{lead.worry_text}</dd>
            </div>
          )}

          <Row term="Headline seen">Variant {lead.headline_variant}</Row>
          <Row term="Source">
            {lead.utm_source ?? lead.referrer ?? "direct"}
            {lead.utm_campaign ? ` · ${lead.utm_campaign}` : ""}
          </Row>
          {lead.tags.length > 0 && (
            <Row term="Tags">
              <span className="flex flex-wrap gap-1.5">
                {lead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[13px] text-teal-700"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            </Row>
          )}
          {lead.resubmissions > 0 && (
            <Row term="Resubmitted">{lead.resubmissions} more time(s)</Row>
          )}
        </dl>
      </div>
    </div>
  );
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="t-small text-gray-600">{term}</dt>
      <dd className="t-body mt-0.5 text-ink">{children}</dd>
    </div>
  );
}
