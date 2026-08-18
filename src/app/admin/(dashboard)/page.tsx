import Link from "next/link";
import { buildStats, listLeads } from "@/lib/leads";
import { getContentMeta } from "@/lib/site-content";
import { BarList, Empty, PageHeading, Panel, ScorePill, Stat } from "@/components/admin/AdminUI";

function when(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const [leads, meta] = await Promise.all([listLeads(), getContentMeta()]);
  const s = buildStats(leads);

  if (s.total === 0) {
    return (
      <>
        <PageHeading
          title="Dashboard"
          sub="Everything visitors tell you, in one place. Nothing has come in yet."
        />
        <Empty
          title="No registrations yet"
          body="Once someone completes the form, you'll see who they are, where their parents live, what they'd pay, and how they found you. Share the page to start collecting."
        />
      </>
    );
  }

  return (
    <>
      <PageHeading
        title="Dashboard"
        sub={`${s.total} ${s.total === 1 ? "family has" : "families have"} registered interest.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total registrations" value={s.total} hint={`${s.last7} in the last 7 days`} />
        <Stat
          label="A-grade leads"
          value={s.grades.a}
          hint={`${s.grades.aPct.toFixed(0)}% — interview and pilot first`}
          tone={s.grades.a > 0 ? "good" : "default"}
        />
        <Stat
          label="A or B grade"
          value={`${s.qualityPct.toFixed(0)}%`}
          hint={s.qualityGateMet ? "Above the 30% quality gate" : "Below the 30% quality gate"}
          tone={s.qualityGateMet ? "good" : "warn"}
        />
        <Stat
          label="Want the paid pilot"
          value={s.foundingYes}
          hint="Answered “Yes — count me in”"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Parents in the provinces" value={s.provincial} hint="Decides pilot geography" />
        <Stat label="Wrote about their worry" value={s.withWorry} hint="Interview and copy material" />
        <Stat
          label="Headline A vs B"
          value={`${s.variants.a} / ${s.variants.b}`}
          hint="Submissions per variant"
        />
        <Stat label="Last 30 days" value={s.last30} hint="Registrations" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <BarList
          title="What they'd pay each month"
          note="For the Complete membership. This is your pricing evidence."
          data={s.distributions.q6_budget}
        />
        <BarList
          title="Where their parents live"
          note="Provincial and rural answers are highlighted — they set fulfilment difficulty."
          data={s.distributions.q4_location}
          emphasise={["province_rural"]}
        />
        <BarList
          title="Have they sent money for a medical need?"
          note="Emergencies are the strongest demand signal on the form."
          data={s.distributions.q5_medical_remit}
          emphasise={["emergency", "both"]}
        />
        <BarList
          title="Interest in the paid founding group"
          data={s.distributions.q7_commitment}
          emphasise={["yes"]}
        />
        <BarList title="Where they are in New Zealand" data={s.distributions.q1_region} />
        <BarList title="Who the care is for" data={s.distributions.q2_for_whom} />
        <BarList title="Parent's age" data={s.distributions.q3_age} emphasise={["75_plus"]} />

        <Panel>
          <h2 className="t-h3 text-ink">How they found you</h2>
          <ul className="mt-4 space-y-2">
            {s.sources.map((row) => (
              <li key={row.label} className="t-small flex justify-between gap-4">
                <span className="text-ink">{row.label}</span>
                <span className="text-gray-600">
                  {row.count} · {row.pct.toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-8">
        <Panel>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="t-h3 text-ink">Latest registrations</h2>
            <Link href="/admin/leads" className="t-small text-teal-700 hover:underline">
              See all {s.total} →
            </Link>
          </div>

          <ul className="mt-4 divide-y divide-gray-300">
            {leads.slice(0, 6).map((lead) => (
              <li key={lead.id} className="flex flex-wrap items-center gap-3 py-3">
                <ScorePill score={lead.score} />
                <span className="t-body font-medium text-ink">{lead.first_name}</span>
                <span className="t-small text-gray-600">{lead.email}</span>
                <span className="t-small ml-auto text-gray-600">{when(lead.created_at)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {meta.updatedAt && (
        <p className="t-small mt-6 text-gray-600">
          Page content last edited {when(meta.updatedAt)}
          {meta.updatedBy ? ` by ${meta.updatedBy}` : ""}.
        </p>
      )}
    </>
  );
}
