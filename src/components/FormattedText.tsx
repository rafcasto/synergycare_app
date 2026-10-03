import type { ReactNode } from "react";

const BULLET = /^\s*[-*•·–]\s+(.*)$/;
const NUMBERED = /^\s*(\d+)[.)]\s+(.*)$/;

type Block =
  | { kind: "p"; lines: string[] }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[]; start: number };

/**
 * Groups plain text typed in the CMS into paragraphs and lists. A blank line
 * starts a new paragraph, a single line break is kept, and lines starting
 * with "-", "*" or "•" (or "1.") become list items. Numbered lists keep the
 * number that was typed, so a list interrupted by a paragraph carries on from
 * where it left off rather than restarting at 1.
 */
function parse(text: string): Block[] {
  const blocks: Block[] = [];
  let current: Block | null = null;

  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trimEnd();

    if (!line.trim()) {
      current = null;
      continue;
    }

    const bullet = line.match(BULLET);
    const numbered = bullet ? null : line.match(NUMBERED);
    const kind = bullet ? "ul" : numbered ? "ol" : "p";
    const value = bullet?.[1] ?? numbered?.[2] ?? line.trim();

    if (!current || current.kind !== kind) {
      if (kind === "p") current = { kind, lines: [] };
      else if (kind === "ul") current = { kind, items: [] };
      else current = { kind, items: [], start: Number(numbered![1]) };
      blocks.push(current);
    }
    if (current.kind === "p") current.lines.push(value);
    else current.items.push(value);
  }

  return blocks;
}

/** Renders CMS text with its paragraphs, line breaks and bullet points intact. */
export default function FormattedText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const blocks = parse(text);

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, i) => {
        if (block.kind === "p") {
          return (
            <p key={i}>
              {block.lines.map((line, j): ReactNode => (
                <span key={j}>
                  {j > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          );
        }

        const items = block.items.map((item, j) => <li key={j}>{item}</li>);

        return block.kind === "ul" ? (
          <ul key={i} className="list-disc space-y-1 pl-6">
            {items}
          </ul>
        ) : (
          <ol key={i} start={block.start} className="list-decimal space-y-1 pl-6">
            {items}
          </ol>
        );
      })}
    </div>
  );
}
