import { cn } from "@/lib/utils";
import { DotMark } from "./dot-mark";

export function EditorialDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-6 py-12 text-[var(--color-line)]",
        className
      )}
      aria-hidden
    >
      <span className="h-px w-24 bg-[var(--color-line)]" />
      <DotMark size="sm" />
      <span className="h-px w-24 bg-[var(--color-line)]" />
    </div>
  );
}
