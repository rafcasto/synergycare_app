import { Check } from "lucide-react";
import type { SiteContent } from "@/lib/content";

/**
 * Package comparison matrix: feature rows down the left, one dark column card
 * per package. On desktop it's a single CSS grid so every row lines up across
 * all four columns no matter how a label wraps. On mobile each package becomes
 * its own stacked card listing every feature, so nothing scrolls sideways.
 */
export default function PackageTable({ tiers }: { tiers: SiteContent["tiers"] }) {
  const { columns, rows } = tiers;
  if (!columns.length || !rows.length) return null;

  return (
    <>
      {/* --- Desktop matrix ------------------------------------------------ */}
      <div
        className="mt-8 hidden md:grid md:gap-x-4"
        style={{ gridTemplateColumns: `minmax(0, 1.7fr) repeat(${columns.length}, minmax(0, 1fr))` }}
        role="table"
        aria-label={tiers.title}
      >
        {/* Header row */}
        <div role="columnheader" aria-hidden="true" />
        {columns.map((name, ci) => (
          <div
            key={`${name}-${ci}`}
            role="columnheader"
            className="t-h3 rounded-t-[16px] bg-teal-700 px-3 pb-3 pt-5 text-center text-white"
          >
            {name}
          </div>
        ))}

        {/* Body rows */}
        {rows.map((row, ri) => {
          const first = ri === 0;
          const last = ri === rows.length - 1;
          return (
            <div key={`${row.label}-${ri}`} role="row" className="contents">
              <div
                role="rowheader"
                className={`flex min-h-[56px] items-center border-gray-300 bg-white px-6 py-3 ${
                  first ? "rounded-t-[16px] border-t" : ""
                } ${last ? "rounded-b-[16px] border-b" : "border-b"} border-x`}
              >
                <span className="t-body font-medium" style={{ color: "var(--color-teal-700)" }}>
                  {row.label}
                </span>
              </div>

              {columns.map((name, ci) => (
                <div
                  key={`${name}-${ci}`}
                  role="cell"
                  className={`bg-teal-700 px-2 ${last ? "rounded-b-[16px] pb-2" : ""}`}
                >
                  <div
                    className={`flex h-full min-h-[56px] items-center justify-center bg-white px-3 py-3 ${
                      first ? "rounded-t-[12px]" : ""
                    } ${last ? "rounded-b-[12px]" : "border-b border-gray-300"}`}
                  >
                    <Cell value={row.cells[ci] ?? ""} />
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* --- Mobile stacked cards ----------------------------------------- */}
      <div className="mt-8 space-y-5 md:hidden">
        {columns.map((name, ci) => (
          <section
            key={`${name}-${ci}`}
            aria-labelledby={`package-${ci}`}
            className="rounded-[16px] bg-teal-700 p-2"
          >
            <h3 id={`package-${ci}`} className="t-h3 px-3 pb-3 pt-2 text-center text-white">
              {name}
            </h3>
            <ul className="divide-y divide-gray-300 rounded-[12px] bg-white px-4">
              {rows.map((row, ri) => {
                const value = row.cells[ci] ?? "";
                const included = value.trim() !== "";
                return (
                  <li
                    key={`${row.label}-${ri}`}
                    className={`flex items-center justify-between gap-4 py-3 ${
                      included ? "" : "opacity-50"
                    }`}
                  >
                    <span className="t-body text-ink">{row.label}</span>
                    <span className="shrink-0">
                      {included ? <Cell value={value} /> : <span aria-label="Not included">—</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

const TICK_VALUES = new Set(["✓", "✔", "check", "tick", "yes"]);

function Cell({ value }: { value: string }) {
  const v = value.trim();
  if (!v) return <span className="sr-only">Not included</span>;

  if (TICK_VALUES.has(v.toLowerCase())) {
    return (
      <Check
        size={22}
        strokeWidth={2}
        style={{ color: "var(--color-teal-700)" }}
        aria-label="Included"
        role="img"
      />
    );
  }

  return <span className="t-body text-ink">{v}</span>;
}
