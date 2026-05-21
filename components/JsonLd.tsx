import type { JsonLdObject } from "@/lib/seo";

type JsonLdInput = JsonLdObject | Array<JsonLdObject | null | undefined> | null | undefined;

function stripContext(entry: JsonLdObject): JsonLdObject {
  const rest = { ...entry };
  delete rest["@context"];
  return rest;
}

function safeSerialize(jsonLd: JsonLdObject): string {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

export function JsonLd({ jsonLd }: { jsonLd: JsonLdInput }) {
  const entries = (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).filter(
    (entry): entry is JsonLdObject => Boolean(entry),
  );

  if (!entries.length) return null;

  const payload =
    entries.length === 1 && entries[0]?.["@context"]
      ? entries[0]
      : {
          "@context": "https://schema.org",
          "@graph": entries.map(stripContext),
        };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeSerialize(payload) }}
    />
  );
}
