import type { ReactNode } from "react";

/** Shared primitives. Geometry and color come from design system §5, §6. */

export function Section({
  children,
  id,
  tone = "sampaguita",
  className = "",
}: {
  children: ReactNode;
  id?: string;
  tone?: "sampaguita" | "white" | "teal";
  className?: string;
}) {
  const tones = {
    sampaguita: "bg-sampaguita",
    white: "bg-white",
    teal: "bg-teal-100",
  } as const;

  return (
    <section id={id} className={`${tones[tone]} px-5 py-16 md:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-[1120px]">{children}</div>
    </section>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="t-h2 max-w-[720px] text-ink">{children}</h2>;
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[16px] border border-gray-300 bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function CtaButton({
  children,
  href,
  onClick,
  type = "button",
  disabled,
  full,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  full?: boolean;
}) {
  const classes = `inline-flex min-h-[48px] items-center justify-center rounded-[12px] bg-teal-700 px-6 py-3 text-[16px] font-semibold text-white transition-colors duration-200 ease-out hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 ${
    full ? "w-full" : ""
  }`;

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gold-400 px-3 py-1 text-[13px] font-semibold text-ink">
      {children}
    </span>
  );
}
