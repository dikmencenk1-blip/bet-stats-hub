import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Calculator, TrendingUp } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { money } from "@/lib/betting";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Kelly Criterion Calculator — EdgeDesk" },
      {
        name: "description",
        content:
          "Size football bets with the Kelly Criterion: enter bankroll, decimal odds and win probability for an optimal stake.",
      },
      { property: "og:title", content: "Kelly Criterion Calculator — EdgeDesk" },
      {
        property: "og:description",
        content: "Optimal stake sizing for football bettors, with negative-edge warnings.",
      },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const [bankroll, setBankroll] = useState("10000");
  const [odds, setOdds] = useState("2.10");
  const [prob, setProb] = useState("55");

  const B = Math.max(Number(bankroll) || 0, 0);
  const o = Number(odds) || 0;
  const p = Math.min(Math.max((Number(prob) || 0) / 100, 0), 1);
  const b = o - 1;
  const q = 1 - p;
  const kelly = b > 0 ? (b * p - q) / b : -1;
  const fraction = Math.max(kelly, 0);
  const stake = B * fraction;
  const edge = o * p - 1;
  const negative = kelly <= 0;

  return (
    <AppShell title="Betting Tools" subtitle="Stake sizing built on the Kelly Criterion">
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="panel p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Calculator className="size-4 text-primary" />
            <h2 className="text-base font-semibold">Kelly Criterion calculator</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            f* = (bp − q) / b, where b = odds − 1, p = win probability, q = 1 − p.
          </p>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bankroll">Bankroll size ($)</Label>
              <Input
                id="bankroll"
                type="number"
                value={bankroll}
                onChange={(e) => setBankroll(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="odds">Decimal odds</Label>
                <Input
                  id="odds"
                  type="number"
                  step="0.01"
                  value={odds}
                  onChange={(e) => setOdds(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prob">Estimated win probability (%)</Label>
                <Input
                  id="prob"
                  type="number"
                  step="0.5"
                  value={prob}
                  onChange={(e) => setProb(e.target.value)}
                />
              </div>
            </div>
            <input
              aria-label="Win probability slider"
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={Number(prob) || 0}
              onChange={(e) => setProb(e.target.value)}
              className="accent-primary"
            />
          </div>
        </section>

        <section className="panel flex flex-col p-5 sm:p-6">
          <h2 className="text-base font-semibold">Recommended stake</h2>
          <p className="text-sm text-muted-foreground">
            Implied edge: {(edge * 100).toFixed(2)}%
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface/60 p-4">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Stake % of bankroll
              </p>
              <p
                className={`num mt-2 font-display text-3xl font-bold ${
                  negative ? "text-destructive" : "text-success"
                }`}
              >
                {(fraction * 100).toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface/60 p-4">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Exact stake
              </p>
              <p
                className={`num mt-2 font-display text-3xl font-bold ${
                  negative ? "text-destructive" : "text-success"
                }`}
              >
                {money(negative ? 0 : stake)}
              </p>
            </div>
          </div>

          {negative ? (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">
                  Negative edge — no bet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  At these odds your estimated probability doesn't beat the market price.
                  Kelly recommends staking nothing.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4">
              <TrendingUp className="mt-0.5 size-4 shrink-0 text-success" />
              <div>
                <p className="text-sm font-semibold text-success">Positive edge detected</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Half-Kelly ({money(stake / 2)}) is a common lower-variance alternative.
                </p>
              </div>
            </div>
          )}

          <dl className="mt-auto grid grid-cols-3 gap-2 pt-6 text-center">
            {[
              { l: "b", v: b.toFixed(2) },
              { l: "p", v: p.toFixed(3) },
              { l: "q", v: q.toFixed(3) },
            ].map((x) => (
              <div key={x.l} className="rounded-xl border border-border bg-surface/60 py-3">
                <dt className="text-xs text-muted-foreground">{x.l}</dt>
                <dd className="num font-display text-lg font-bold">{x.v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </AppShell>
  );
}
