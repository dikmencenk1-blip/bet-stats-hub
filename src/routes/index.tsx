import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Percent,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { cumulativeSeries, initialBets, money, stats } from "@/lib/betting";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — EdgeDesk Football Betting Analytics" },
      {
        name: "description",
        content:
          "Track ROI, net profit, win rate and active football bets in one premium analytics dashboard.",
      },
      { property: "og:title", content: "EdgeDesk — Football Betting Analytics Dashboard" },
      {
        property: "og:description",
        content: "ROI, profit curve and coupon history for high-volume football bettors.",
      },
    ],
  }),
  component: DashboardPage,
});

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
  tone?: "neutral" | "up" | "down";
}) {
  const toneCls =
    tone === "up" ? "text-success" : tone === "down" ? "text-destructive" : "text-foreground";
  return (
    <div className="panel border-0 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <Icon className="size-4 shrink-0 text-muted-foreground" />
      </div>
      <p className={`num mt-3 font-display text-3xl font-bold ${toneCls}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function DashboardPage() {
  const bets = initialBets;
  const s = stats(bets);
  const series = cumulativeSeries(bets);

  return (
    <AppShell title="Dashboard" subtitle="Performance across your last 30 days of action">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Total ROI"
          value={`${s.roi >= 0 ? "+" : ""}${s.roi.toFixed(1)}%`}
          hint={`${money(s.staked)} total staked`}
          icon={Percent}
          tone={s.roi >= 0 ? "up" : "down"}
        />
        <Kpi
          label="Net Profit / Loss"
          value={money(s.net)}
          hint="Settled bets only"
          icon={s.net >= 0 ? ArrowUpRight : ArrowDownRight}
          tone={s.net >= 0 ? "up" : "down"}
        />
        <Kpi
          label="Active Bets"
          value={String(s.active)}
          hint="Pending settlement"
          icon={Activity}
        />
        <Kpi
          label="Bankroll"
          value="$12,480"
          hint="Kelly-managed staking"
          icon={Wallet}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="panel border-0 p-5">
          <h2 className="text-base font-semibold">Cumulative profit</h2>
          <p className="text-sm text-muted-foreground">Running P/L across settled coupons</p>
          <div className="mt-4 h-[241px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ left: -18, right: 6, top: 8 }}>
                <defs>
                  <linearGradient id="pl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-popover-foreground)",
                  }}
                  formatter={(v: number) => [money(v), "Profit"]}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="var(--color-success)"
                  strokeWidth={2.5}
                  fill="url(#pl)"
                  isAnimationActive={false}

                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel border-0 p-5">
          <h2 className="text-base font-semibold">Win / Loss / Void</h2>
          <p className="text-sm text-muted-foreground">Settled outcome distribution</p>

          <p className="num mt-5 font-display text-4xl font-bold text-success">
            {s.winRate.toFixed(0)}%
          </p>
          <p className="text-xs text-muted-foreground">Win rate</p>

          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-success"
              style={{ width: `${s.winRate}%` }}
            />
          </div>

          <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              { l: "Won", v: s.won, c: "text-success" },
              { l: "Lost", v: s.lost, c: "text-destructive" },
              { l: "Void", v: s.voided, c: "text-muted-foreground" },
            ].map((x) => (
              <div key={x.l} className="rounded-xl border border-border bg-surface/60 py-3">
                <dt className="text-xs text-muted-foreground">{x.l}</dt>
                <dd className={`num font-display text-xl font-bold ${x.c}`}>{x.v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="panel mt-4 p-5">
        <h2 className="text-base font-semibold">Recent coupons</h2>
        <ul className="mt-3 divide-y divide-border">
          {bets.slice(0, 6).map((b) => (
            <li
              key={b.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{b.event}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {b.selection} · {b.odds.toFixed(2)} · {money(b.stake)}
                </p>
              </div>
              <StatusBadge status={b.status} />
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
