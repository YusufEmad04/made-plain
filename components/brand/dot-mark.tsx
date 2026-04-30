import { cn } from "@/lib/utils";

interface DotMarkProps {
  size?: "sm" | "md" | "lg" | "xl";
  pulse?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-2 w-2",
  md: "h-3 w-3",
  lg: "h-4 w-4",
  xl: "h-6 w-6",
};

export function DotMark({ size = "md", pulse = false, className }: DotMarkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block rounded-full bg-[var(--color-accent)] align-middle",
        sizeMap[size],
        pulse && "animate-pulse-dot",
        className
      )}
    />
  );
}
