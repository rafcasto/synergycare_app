import { getSiteContent, getContentMeta } from "@/lib/site-content";
import { PageHeading } from "@/components/admin/AdminUI";
import ContentEditor from "@/components/admin/ContentEditor";
import type { SiteContent } from "@/lib/content";

export default async function ContentPage() {
  const resolved = await getSiteContent();
  const meta = await getContentMeta();

  // Strip the derived image field — the editor only owns text.
  const { heroImage: _heroImage, ...content } = resolved;

  return (
    <>
      <PageHeading
        title="Page content"
        sub="Every word on the landing page. Changes go live as soon as you save."
      />
      <ContentEditor initial={content as SiteContent} meta={meta} />
    </>
  );
}
