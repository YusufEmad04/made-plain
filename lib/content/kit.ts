/**
 * Kit metadata. Source of truth for what a buyer receives.
 * Storage keys are S3 object paths once storage is wired.
 */
export type KitArtifact = {
  slug: string;
  name: string;
  description: string;
  spec: string;
  /** S3 object key under the protected bucket. Mock until storage is live. */
  storageKey: string;
  /** Bytes. For UI hint only. */
  size?: number;
  format: "pdf" | "epub" | "zip" | "notion" | "sheets" | "web";
};

export const KIT_ARTIFACTS: KitArtifact[] = [
  {
    slug: "handbook",
    name: "The Handbook",
    description: "150-page operator's book covering every domain of business.",
    spec: "PDF + EPUB",
    storageKey: "kit/v1/handbook.pdf",
    format: "pdf",
  },
  {
    slug: "connection-map",
    name: "The Connection Map",
    description: "Printable A1 poster + interactive web version.",
    spec: "A1 PDF + Web",
    storageKey: "kit/v1/connection-map.pdf",
    format: "pdf",
  },
  {
    slug: "books-distilled",
    name: "30 Books, Distilled",
    description: "The most important business books, summarized.",
    spec: "~50-page PDF",
    storageKey: "kit/v1/books-distilled.pdf",
    format: "pdf",
  },
  {
    slug: "glossary",
    name: "The Glossary",
    description: "200 essential terms, formulas, and acronyms.",
    spec: "25-page PDF",
    storageKey: "kit/v1/glossary.pdf",
    format: "pdf",
  },
  {
    slug: "worksheets",
    name: "The Worksheet Pack",
    description: "12 fillable templates. Positioning, pricing, CAC/LTV, runway.",
    spec: "PDF + Notion + Sheets",
    storageKey: "kit/v1/worksheets.zip",
    format: "zip",
  },
  {
    slug: "exercises",
    name: "The Exercise Booklet",
    description: "25 short exercises that force application to your business.",
    spec: "40-page PDF",
    storageKey: "kit/v1/exercises.pdf",
    format: "pdf",
  },
  {
    slug: "quick-start",
    name: "Quick Start Paths",
    description: "Four pre-sequenced paths through the kit.",
    spec: "15-page PDF",
    storageKey: "kit/v1/quick-start.pdf",
    format: "pdf",
  },
];

/** Single launch price. */
export const KIT_PRICE = 19;

export function activePrice() {
  return { name: "Launch", price: KIT_PRICE };
}
