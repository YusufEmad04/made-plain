import { cn } from "@/lib/utils";

type Tone = "paper" | "sand" | "ink" | "card";
type Width = "narrow" | "default" | "wide" | "bleed";
type Pad = "tight" | "default" | "loose";

interface SectionProps {
  children: React.ReactNode;
  tone?: Tone;
  width?: Width;
  pad?: Pad;
  id?: string;
  className?: string;
  fullBleed?: boolean;
}

const toneClass: Record<Tone, string> = {
  paper: "bg-[var(--color-paper)] text-[var(--color-ink)]",
  sand: "bg-[var(--color-sand)] text-[var(--color-ink)]",
  ink: "bg-[var(--color-ink)] text-[var(--color-paper)]",
  card: "bg-[var(--color-card-brand)] text-[var(--color-ink)]",
};

const widthClass: Record<Width, string> = {
  narrow: "max-w-[720px]",
  default: "max-w-[1120px]",
  wide: "max-w-[1320px]",
  bleed: "max-w-none",
};

const padClass: Record<Pad, string> = {
  tight: "py-12 sm:py-16",
  default: "py-20 sm:py-28",
  loose: "py-28 sm:py-40",
};

export function Section({
  children,
  tone = "paper",
  width = "default",
  pad = "default",
  id,
  className,
}: SectionProps) {
  return (
    <section id={id} className={cn("relative w-full", toneClass[tone], padClass[pad])}>
      <div
        className={cn(
          "mx-auto px-5 sm:px-8 lg:px-12",
          widthClass[width],
          className
        )}
      >
        {children}
      </div>
    </section>
  );
}
