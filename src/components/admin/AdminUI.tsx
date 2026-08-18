import type { ReactNode } from "react";
import type { Distribution } from "@/lib/leads";

export function PageHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <h1 className="t-h2 text-ink">{title}</h1>
      {sub && <p className="t-body mt-2 max-w-[65ch] text-gray-600">{sub}</p>}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[16px] border border-gray-300 bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "good" | "warn";
}) {
  const color =
    tone === "good"
      ? "var(--color-success)"
      : tone === "warn"
        ? "var(--color-warning)"
        : "var(--color-ink)";

  return (
    <Panel>
      <p className="t-small text-gray-600">{label}</p>
      <p className="mt-2 font-head text-[32px] leading-none" style={{ color }}>
        {value}
      </p>
      {hint && <p className="t-small mt-2 text-gray-600">{hint}</p>}
    </Panel>
  );
}

/**
 * Horizontal bars beat a pie chart here: the labels are long, the reader is
 * comparing magnitudes, and it stays readable at any count.
 */
export function BarList({
  title,
  note,
  data,
  emphasise,
}: {
  title: string;
  note?: string;
  data: Distribution;
  emphasise?: string[];
}) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <Panel>
      <h2 className="t-h3 text-ink">{title}</h2>
      {note && <p className="t-small mt-1 text-gray-600">{note}</p>}

      {data.length === 0 ? (
        <p className="t-small mt-4 text-gray-600">No answers yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {data.map((row) => {
            const hot = emphasise?.includes(row.value);
            return (
              <li key={row.value}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="t-small text-ink">{row.label}</span>
                  <span className="t-small shrink-0 text-gray-600">
                    {row.count} · {row.pct.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-sampaguita">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(row.count / max) * 100}%`,
                      background: hot ? "var(--color-coral-600)" : "var(--color-teal-700)",
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

export function ScorePill({ score }: { score: "A" | "B" | "C" }) {
  const styles = {
    A: { background: "var(--color-gold-400)", color: "var(--color-ink)" },
    B: { background: "var(--color-teal-100)", color: "var(--color-teal-700)" },
    C: { background: "var(--color-sampaguita)", color: "var(--color-gray-600)" },
  }[score];

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[13px] font-semibold"
      style={styles}
    >
      {score}
    </span>
  );
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <Panel className="text-center">
      <p className="t-h3 text-ink">{title}</p>
      <p className="t-body mx-auto mt-2 max-w-[52ch] text-gray-600">{body}</p>
    </Panel>
  );
}
