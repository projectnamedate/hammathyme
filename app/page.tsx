import { EntryHall } from "@/components/EntryHall";
import { JsonLd } from "@/components/JsonLd";
import { buildHomePageJsonLd, homeMetadata } from "@/lib/seo";

export const metadata = homeMetadata;

export default function HomePage() {
  return (
    <>
      <JsonLd jsonLd={buildHomePageJsonLd()} />
      <EntryHall />
    </>
  );
}
