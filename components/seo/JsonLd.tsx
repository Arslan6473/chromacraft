/**
 * components/seo/JsonLd.tsx
 * Renders a <script type="application/ld+json"> tag for structured data.
 * Usage: <JsonLd data={schemaObject} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted server-side JSON
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

