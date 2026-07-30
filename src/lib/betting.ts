export type BetStatus = "won" | "lost" | "pending" | "void";

export type Bet = {
  id: string;
  date: string;
  event: string;
  selection: string;
  odds: number;
  stake: number;
  status: BetStatus;
};

export const initialBets: Bet[] = [
  { id: "b1", date: "2026-07-29", event: "Real Madrid vs Barcelona", selection: "Over 2.5 Goals", odds: 1.85, stake: 250, status: "won" },
  { id: "b2", date: "2026-07-29", event: "Arsenal vs Liverpool", selection: "BTTS - Yes", odds: 1.72, stake: 180, status: "pending" },
  { id: "b3", date: "2026-07-28", event: "Bayern vs Dortmund", selection: "Bayern -1 AH", odds: 2.05, stake: 200, status: "lost" },
  { id: "b4", date: "2026-07-28", event: "Inter vs Napoli", selection: "Draw", odds: 3.4, stake: 120, status: "won" },
  { id: "b5", date: "2026-07-27", event: "PSG vs Marseille", selection: "PSG Win", odds: 1.55, stake: 300, status: "won" },
  { id: "b6", date: "2026-07-27", event: "Chelsea vs Spurs", selection: "Under 3.5 Goals", odds: 1.62, stake: 220, status: "lost" },
  { id: "b7", date: "2026-07-26", event: "Ajax vs PSV", selection: "Over 1.5 Goals", odds: 1.28, stake: 400, status: "won" },
  { id: "b8", date: "2026-07-26", event: "Porto vs Benfica", selection: "Benfica DNB", odds: 2.2, stake: 150, status: "void" },
  { id: "b9", date: "2026-07-25", event: "Milan vs Juventus", selection: "1st Half Over 0.5", odds: 1.42, stake: 260, status: "won" },
  { id: "b10", date: "2026-07-25", event: "Atletico vs Sevilla", selection: "Atletico Win", odds: 1.95, stake: 180, status: "lost" },
  { id: "b11", date: "2026-07-24", event: "Man City vs Newcastle", selection: "City -1.5 AH", odds: 2.1, stake: 200, status: "won" },
  { id: "b12", date: "2026-07-24", event: "Roma vs Lazio", selection: "BTTS - No", odds: 1.9, stake: 140, status: "pending" },
];

export function profit(bet: Bet) {
  if (bet.status === "won") return bet.stake * (bet.odds - 1);
  if (bet.status === "lost") return -bet.stake;
  return 0;
}

export function settled(bets: Bet[]) {
  return bets.filter((b) => b.status === "won" || b.status === "lost");
}

export function stats(bets: Bet[]) {
  const s = settled(bets);
  const staked = s.reduce((a, b) => a + b.stake, 0);
  const net = s.reduce((a, b) => a + profit(b), 0);
  const won = bets.filter((b) => b.status === "won").length;
  const lost = bets.filter((b) => b.status === "lost").length;
  const voided = bets.filter((b) => b.status === "void").length;
  const active = bets.filter((b) => b.status === "pending").length;
  return {
    staked,
    net,
    roi: staked ? (net / staked) * 100 : 0,
    won,
    lost,
    voided,
    active,
    winRate: won + lost ? (won / (won + lost)) * 100 : 0,
  };
}

export function cumulativeSeries(bets: Bet[]) {
  const s = settled(bets)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map<string, number>();
  for (const b of s) byDate.set(b.date, (byDate.get(b.date) ?? 0) + profit(b));
  let running = 0;
  return [...byDate.entries()].map(([date, p]) => {
    running += p;
    return { date: date.slice(5), profit: Math.round(running) };
  });
}

export const money = (n: number) =>
  `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export function betReturn(bet: Bet) {
  if (bet.status === "won") return bet.stake * bet.odds;
  if (bet.status === "void") return bet.stake;
  if (bet.status === "lost") return 0;
  return bet.stake * bet.odds;
}
