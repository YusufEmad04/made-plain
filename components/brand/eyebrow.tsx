import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  tone?: "accent" | "mute" | "ink";
  prefix?: string;
}

const toneMap = {
  accent: "text-[var(--color-accent)]",
  mute: "text-[var(--color-mute)]",
  ink: "text-[var(--color-ink)]",
};

export function Eyebrow({
  children,
  className,
  tone = "accent",
  prefix,
}: EyebrowProps) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-2", toneMap[tone], className)}>
      {prefix ? <span className="opacity-70">{prefix}</span> : null}
      <span>{children}</span>
    </span>
  );
}
