# Bet Stats Hub

"Create a modern, clean, and responsive Football Betting Analytics and Dashboard application using Tailwind CSS and Lucide Icons. The UI should have a dark, premium sports analytics theme (e.g., slate-900 background with emerald-500 accents for wins and rose-500 for losses).

Include the following views and features switchable via a sidebar navigation:

Dashboard Overview:

High-level KPIs: Total ROI (%), Net Profit/Loss, Win/Loss/Void Ratio (with a visual win-rate progress bar), and Active Bets count.

A mock line/area chart showing cumulative profit over time.

A recent coupon history list showing match names, bet types, odds, stakes, and status badges (Won, Lost, Pending).

Bet & Coupon Tracker (Historical Reports):

A comprehensive data table for historical matches and coupons.

Columns: Date, Event (e.g., Real Madrid vs Barcelona), Bet Selection, Odds, Stake, Return, and Status.

Include status filters (All, Won, Lost, Active) and a search bar.

A simple 'Add New Bet' modal form with inputs for Match, Selection, Odds, Stake, and Status.

Betting Tools (Kelly Criterion Calculator):

An interactive calculator card for the Kelly Criterion formula.

Inputs: Bankroll Size ($), Decimal Odds, and Estimated Win Probability (%).

Output: Dynamically calculate and display the Recommended Stake % and Exact Stake Amount using the standard Kelly formula: \(f^* = \frac{bp - q}{b}\) where b = odds - 1, p = probability, and q = 1 - p. Show clear warning states if the edge is negative.

Ensure the layout is highly scannable, mobile-friendly, and feels like a professional SaaS tool for high-volume bettors."

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aa7fb311-670d-44f0-bd4e-2b94d6ab7c0a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
