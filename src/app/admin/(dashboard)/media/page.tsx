import { listMedia, MEDIA_SLUGS } from "@/lib/media-store";
import { PageHeading } from "@/components/admin/AdminUI";
import MediaManager from "@/components/admin/MediaManager";

export default async function MediaPage() {
  const media = await listMedia();

  return (
    <>
      <PageHeading
        title="Images"
        sub="Upload a photo and it appears on the page straight away. Everything is resized and converted to WebP for you, so a phone photo is fine."
      />
      <MediaManager slots={MEDIA_SLUGS} media={media} />
    </>
  );
}
