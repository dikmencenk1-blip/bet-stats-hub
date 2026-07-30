import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  betReturn,
  initialBets,
  money,
  profit,
  type Bet,
  type BetStatus,
} from "@/lib/betting";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bets")({
  head: () => ({
    meta: [
      { title: "Bet & Coupon Tracker — EdgeDesk" },
      {
        name: "description",
        content:
          "Search, filter and log every football coupon with odds, stakes, returns and settlement status.",
      },
      { property: "og:title", content: "Bet & Coupon Tracker — EdgeDesk" },
      {
        property: "og:description",
        content: "A full historical report of your football bets, filterable by status.",
      },
    ],
  }),
  component: BetsPage,
});

const filters = [
  { key: "all", label: "All" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
  { key: "pending", label: "Active" },
] as const;

function BetsPage() {
  const [bets, setBets] = useState<Bet[]>(initialBets);
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    event: "",
    selection: "",
    odds: "1.90",
    stake: "100",
    status: "pending" as BetStatus,
  });

  const rows = useMemo(
    () =>
      bets.filter(
        (b) =>
          (filter === "all" || b.status === filter) &&
          (b.event + b.selection).toLowerCase().includes(query.toLowerCase()),
      ),
    [bets, filter, query],
  );

  function addBet() {
    if (!form.event.trim() || !form.selection.trim()) return;
    setBets((prev) => [
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        event: form.event.trim(),
        selection: form.selection.trim(),
        odds: Number(form.odds) || 1,
        stake: Number(form.stake) || 0,
        status: form.status,
      },
      ...prev,
    ]);
    setForm({ event: "", selection: "", odds: "1.90", stake: "100", status: "pending" });
    setOpen(false);
  }

  return (
    <AppShell
      title="Bet & Coupon Tracker"
      subtitle={`${rows.length} of ${bets.length} coupons`}
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Plus className="size-4" /> Add bet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new bet</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event">Match</Label>
                <Input
                  id="event"
                  placeholder="Real Madrid vs Barcelona"
                  value={form.event}
                  onChange={(e) => setForm({ ...form, event: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="selection">Selection</Label>
                <Input
                  id="selection"
                  placeholder="Over 2.5 Goals"
                  value={form.selection}
                  onChange={(e) => setForm({ ...form, selection: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="odds">Odds</Label>
                  <Input
                    id="odds"
                    type="number"
                    step="0.01"
                    value={form.odds}
                    onChange={(e) => setForm({ ...form, odds: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stake">Stake ($)</Label>
                  <Input
                    id="stake"
                    type="number"
                    value={form.stake}
                    onChange={(e) => setForm({ ...form, stake: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as BetStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="void">Void</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addBet}>Save bet</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="panel p-4 sm:p-5">
        <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                  filter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative sm:w-72">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search match or selection"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                <th className="py-3 pr-4 font-semibold">Date</th>
                <th className="py-3 pr-4 font-semibold">Event</th>
                <th className="py-3 pr-4 font-semibold">Selection</th>
                <th className="py-3 pr-4 text-right font-semibold">Odds</th>
                <th className="py-3 pr-4 text-right font-semibold">Stake</th>
                <th className="py-3 pr-4 text-right font-semibold">Return</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((b) => (
                <tr key={b.id} className="transition-colors hover:bg-accent/40">
                  <td className="num py-3 pr-4 whitespace-nowrap text-muted-foreground">
                    {b.date}
                  </td>
                  <td className="py-3 pr-4 font-medium">{b.event}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{b.selection}</td>
                  <td className="num py-3 pr-4 text-right">{b.odds.toFixed(2)}</td>
                  <td className="num py-3 pr-4 text-right">{money(b.stake)}</td>
                  <td
                    className={cn(
                      "num py-3 pr-4 text-right font-semibold",
                      b.status === "won" && "text-success",
                      b.status === "lost" && "text-destructive",
                      (b.status === "pending" || b.status === "void") &&
                        "text-muted-foreground",
                    )}
                  >
                    {b.status === "lost"
                      ? money(profit(b))
                      : money(betReturn(b))}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted-foreground">
                    No coupons match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
