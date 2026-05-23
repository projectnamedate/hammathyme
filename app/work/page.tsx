import { AtriumCanvas } from "@/components/AtriumCanvas";
import { JsonLd } from "@/components/JsonLd";
import { CASE_STUDIES } from "@/lib/works";
import { buildBreadcrumbJsonLd, buildWorkIndexJsonLd, workMetadata } from "@/lib/seo";

export const metadata = workMetadata;

export default function Atrium() {
  return (
    <>
      <JsonLd
        jsonLd={[
          buildWorkIndexJsonLd(CASE_STUDIES),
          buildBreadcrumbJsonLd([
            { name: "home", path: "/" },
            { name: "work", path: "/work" },
          ]),
        ]}
      />
      <main>
        <h1 className="sr-only">work</h1>
        <AtriumCanvas />
      </main>
    </>
  );
}
