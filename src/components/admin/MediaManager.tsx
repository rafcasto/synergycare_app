"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Upload } from "lucide-react";
import type { StoredMedia } from "@/lib/media-store";
import { Panel } from "./AdminUI";

type Slot = { label: string; width: number; note: string };

export default function MediaManager({
  slots,
  media,
}: {
  slots: Record<string, Slot>;
  media: Record<string, StoredMedia | null>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Object.entries(slots).map(([slug, slot]) => (
        <MediaSlot key={slug} slug={slug} slot={slot} current={media[slug] ?? null} />
      ))}
    </div>
  );
}

function MediaSlot({
  slug,
  slot,
  current,
}: {
  slug: string;
  slot: Slot;
  current: StoredMedia | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    setError("");

    const body = new FormData();
    body.append("slug", slug);
    body.append("file", file);

    try {
      const response = await fetch("/api/admin/media", { method: "POST", body });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Upload failed.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await fetch(`/api/admin/media?slug=${slug}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel>
      <h2 className="t-h3 text-ink">{slot.label}</h2>
      <p className="t-small mt-1 text-gray-600">{slot.note}</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void upload(file);
        }}
        className={`mt-4 rounded-[16px] border-[1.5px] border-dashed p-4 transition-colors ${
          dragging ? "border-teal-600 bg-teal-100" : "border-gray-300"
        }`}
      >
        {current ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/media/${slug}?v=${current.version}`}
              alt={`Current ${slot.label.toLowerCase()}`}
              className="w-full rounded-[12px] object-cover"
            />
            <p className="t-small mt-3 text-gray-600">
              {current.width}×{current.height} · {(current.bytes / 1024).toFixed(0)} KB · WebP
            </p>
          </>
        ) : (
          <p className="t-small py-8 text-center text-gray-600">
            Drop an image here, or choose a file below.
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="t-small mt-3" style={{ color: "var(--color-error)" }}>
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label
          className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-[12px] border-[1.5px] border-teal-700 px-4 text-[15px] font-semibold text-teal-700 hover:bg-teal-100 ${
            busy ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <Upload size={16} strokeWidth={1.5} aria-hidden="true" />
          {busy ? "Working…" : current ? "Replace" : "Choose image"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </label>

        {current && (
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="t-small inline-flex min-h-[44px] items-center gap-1.5 rounded-[12px] px-3 text-gray-600 hover:bg-sampaguita disabled:opacity-60"
          >
            <Trash2 size={16} strokeWidth={1.5} aria-hidden="true" />
            Remove
          </button>
        )}
      </div>
    </Panel>
  );
}
