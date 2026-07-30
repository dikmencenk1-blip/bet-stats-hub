import type { BetStatus } from "@/lib/betting";
import { cn } from "@/lib/utils";

const map: Record<BetStatus, { label: string; cls: string }> = {
  won: { label: "Won", cls: "bg-success/15 text-success border-success/30" },
  lost: { label: "Lost", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  pending: { label: "Pending", cls: "bg-warning/15 text-warning border-warning/30" },
  void: { label: "Void", cls: "bg-muted text-muted-foreground border-border" },
};

export function StatusBadge({ status, className }: { status: BetStatus; className?: string }) {
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        s.cls,
        className,
      )}
    >
      {s.label}
    </span>
  );
}
