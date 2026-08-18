import "server-only";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { Buffer } from "node:buffer";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "./firebase-admin";

/**
 * Images are stored in Firestore rather than Firebase Storage, because Storage
 * requires the Blaze plan and this project has no billing account attached.
 *
 * That works because there are only a handful of images on a one-page site and
 * every upload is re-encoded to WebP first, but Firestore caps a document at
 * 1 MiB — hence the hard ceiling and the quality ladder below. If billing is
 * ever enabled, only this file needs to change.
 */
const DOC_LIMIT = 1_048_576;
const SAFE_LIMIT = 900_000; // headroom for the other fields on the document
const MAX_UPLOAD = 15 * 1024 * 1024;
/**
 * The brief targets a sub-2s load on 4G and most traffic arrives from Facebook
 * on a phone, so aim well under the hard limit. Typical photographs land here
 * at quality 82; only pathological images fall through to the ceiling.
 */
const PERF_TARGET = 280_000;

export const MEDIA_SLUGS = {
  hero: { label: "Hero photo", width: 1600, note: "Shown beside the headline. Landscape works best." },
  og: { label: "Social share image", width: 1200, note: "Used when the page is shared. 1200x630 is ideal." },
  founder: { label: "Founder photo", width: 640, note: "Optional. Appears in the “Why trust us” section." },
} as const;

export type MediaSlug = keyof typeof MEDIA_SLUGS;

export function isMediaSlug(value: string): value is MediaSlug {
  return value in MEDIA_SLUGS;
}

export type StoredMedia = {
  slug: string;
  contentType: string;
  bytes: number;
  width: number;
  height: number;
  version: string;
  updatedAt: string | null;
};

/** Re-encode to WebP, stepping quality down until it fits the document limit. */
async function encode(input: Buffer, maxWidth: number) {
  const image = sharp(input, { failOn: "none" }).rotate();
  const meta = await image.metadata();
  if (!meta.width || !meta.height) throw new Error("That file isn't a readable image.");

  let smallest: Buffer | null = null;

  for (const quality of [82, 72, 62, 52, 42]) {
    const buffer = await image
      .clone()
      .resize({ width: Math.min(maxWidth, meta.width), withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    if (!smallest || buffer.length < smallest.length) smallest = buffer;
    if (buffer.length <= PERF_TARGET) break;
  }

  if (!smallest || smallest.length > SAFE_LIMIT) {
    throw new Error("That image is too detailed to compress under 1 MB. Try a smaller crop.");
  }

  const out = await sharp(smallest).metadata();
  return { buffer: smallest, width: out.width ?? 0, height: out.height ?? 0 };
}

export async function saveMedia(slug: MediaSlug, file: Buffer, editorEmail: string): Promise<StoredMedia> {
  if (file.length > MAX_UPLOAD) throw new Error("Please upload an image under 15 MB.");

  const { buffer, width, height } = await encode(file, MEDIA_SLUGS[slug].width);
  const version = createHash("sha256").update(buffer).digest("hex").slice(0, 12);

  await db()
    .collection("media")
    .doc(slug)
    .set({
      data: Buffer.from(buffer),
      content_type: "image/webp",
      bytes: buffer.length,
      width,
      height,
      version,
      updated_at: FieldValue.serverTimestamp(),
      updated_by: editorEmail,
    });

  // The landing page reads the version to build a cache-busting URL.
  if (slug === "hero" || slug === "founder" || slug === "og") {
    await db().doc("site_content/landing").set({ [`${slug}_image_version`]: version }, { merge: true });
  }

  return {
    slug,
    contentType: "image/webp",
    bytes: buffer.length,
    width,
    height,
    version,
    updatedAt: new Date().toISOString(),
  };
}

export async function deleteMedia(slug: MediaSlug) {
  await db().collection("media").doc(slug).delete();
  await db().doc("site_content/landing").set({ [`${slug}_image_version`]: FieldValue.delete() }, { merge: true });
}

/**
 * The Admin SDK hands back binary fields as a Node Buffer, but the web SDK
 * wraps them in a Bytes object. Accept either, so this keeps working if the
 * read ever moves to a different client.
 */
function toBuffer(value: unknown): Buffer {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  const bytes = value as { toUint8Array?: () => Uint8Array };
  if (typeof bytes?.toUint8Array === "function") return Buffer.from(bytes.toUint8Array());
  throw new Error("Stored media is not binary data.");
}

export async function readMedia(slug: string) {
  const snap = await db().collection("media").doc(slug).get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  return {
    buffer: toBuffer(data.data),
    contentType: (data.content_type as string) ?? "image/webp",
    version: (data.version as string) ?? "0",
  };
}

export async function listMedia(): Promise<Record<string, StoredMedia | null>> {
  const out: Record<string, StoredMedia | null> = {};
  await Promise.all(
    (Object.keys(MEDIA_SLUGS) as MediaSlug[]).map(async (slug) => {
      const snap = await db().collection("media").doc(slug).get();
      if (!snap.exists) {
        out[slug] = null;
        return;
      }
      const d = snap.data()!;
      out[slug] = {
        slug,
        contentType: d.content_type,
        bytes: d.bytes,
        width: d.width,
        height: d.height,
        version: d.version,
        updatedAt: d.updated_at?.toDate?.()?.toISOString() ?? null,
      };
    })
  );
  return out;
}

export const MEDIA_LIMITS = { DOC_LIMIT, SAFE_LIMIT, MAX_UPLOAD };
