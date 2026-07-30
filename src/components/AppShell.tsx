import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Calculator, LayoutDashboard, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/bets", label: "Bet Tracker", icon: BarChart3 },
  { to: "/tools", label: "Betting Tools", icon: Calculator },
] as const;

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="sticky top-0 z-20 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <div className="flex items-center gap-2.5 px-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Trophy className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-sidebar-foreground">
              EdgeDesk
            </p>
            <p className="truncate text-xs text-muted-foreground">Betting analytics</p>
          </div>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.to
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
          <p className="text-xs font-semibold text-sidebar-foreground">Bankroll</p>
          <p className="num mt-1 font-display text-xl font-bold text-primary">$12,480</p>
          <p className="mt-1 text-xs text-muted-foreground">Updated just now</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <h1 className="truncate font-display text-xl font-bold sm:text-2xl">{title}</h1>
              {subtitle && (
                <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {actions}
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-border px-2 py-2 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                  pathname === item.to
                    ? "bg-accent text-primary"
                    : "text-muted-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
