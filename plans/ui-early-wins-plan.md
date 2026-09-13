# UI Early Wins — Plan

**Date:** 2026-09-13
**Scope:** Frontend images, containers, buttons · early wins that reuse `frontend/src/styles/theme.css:1`
**Skill:** `ui-debugger` (inspect → smallest fix → verify → responsive → regressions)
**Goal:** 11 minutes for 3 high-impact wins, 10 wins total — no full-page rewrite

## North Star

- One primary action per screen (Home: `Bid cargo` / `Book truck`)
- No CLS, no a11y regression, no new colors — reuse `--primary #f97316`, `--radius`, gradients in `theme.css:15`
- Every win is a single-file patch verifiable at 390 / 768 / 1280

## Ranked Wins (Impact × Effort)

| # | Fix | File:Line | Effort | Impact | Verify |
|---|---|---|---|---|---|
| 1 | Image CLS + stateful fallback (drop `style.display` hack → React state + `aspect-[4/3]`) | `components/cargo/CargoCard.jsx:321` + `truck/TruckCard.jsx` | 5 min | High (CLS, React correctness) | Block img URL in Network → fallback `Package` renders, no layout shift |
| 2 | Raw card buttons → `<Button>` (gets focus ring, disabled, aria-busy) | `CargoCard.jsx:140` compact Bid/Details | 5 min | High (a11y) | Tab to button → ring `2px #f97316` visible; disabled state `opacity-50` |
| 3 | Narrow PageContainer | `components/ui/page-container.jsx:5` | 1 min | Med (density) | `max-w-screen-2xl` → `max-w-7xl`, 3-col grid not sparse on 1440p |
| 4 | Unify card radii/shadows/duration | `card.jsx:6` vs `app-card.jsx:6` vs `CargoCard.jsx:190` | 30 min | High (consistency) | `rounded-[14px]` + `shadow-2xl duration-500` → `rounded-2xl shadow-sm hover:shadow-lg duration-200 hover:scale-[1.01]`; bar `h-1.5` |
| 5 | Inline padding → Tailwind | `CargoCard.jsx:206` `style padding 24px` etc. | 30 min | Med (maintainability) | `style={{padding:'24px'}}` → `p-5 lg:p-6 gap-4`, responsive + dark overrides work |
| 6 | Alt + focus-visible parity | `CargoCard.jsx:321` + 15 `<img>` sites | 30 min | Med (a11y/SEO) | `alt="Cargo 1"` → `alt="Reefer 12t Quezon→Cebu"`; `group-hover:opacity-100` → add `group-focus-visible:opacity-100` |
| 7 | Prune button variants 12→6 | `components/ui/button.jsx:10` | 30 min | Med (DX) | Remove `gradient-blue/green/purple/glass-dark/link`, keep 6 (default/outline/ghost/glass/destructive/secondary) |
| 8 | Image sizes/srcSet + eager LCP hero | `HeroCarousel` + thumbs | 2 hr | High (LCP) | Hero `loading="eager" fetchPriority="high"`, thumbs `sizes="(max-width:640px) 50vw, 33vw"` + Sharp srcSet |
| 9 | Skeletons + empty states | `views/HomeView.jsx:1` + `BidsView.jsx` | 2 hr | High (UX) | Grid shimmer 3×1, empty illustration + `Clear filters` + CTA |
| 10 | Consolidate Card systems | `card.jsx:1` vs `app-card.jsx:1` | 2 hr | Med | Deprecate `AppCard` → migrate to `Card` (`bg-card border-border rounded-2xl`) |

> Do first today: **#1 + #2 + #3 = 11 minutes**

## Phasing

- **Phase 0 (today):** #1 #2 #3 — patch, run `npm --prefix frontend run lint` + `vite build`, manual check 390/768/1280
- **Phase 1 (this week):** #4 #5 #6 #7 — normalize design system, lint warnings 165→<20
- **Phase 2 (next sprint):** #8 #9 #10 — LCP + UX + debt removal

## Verification (ui-debugger steps 7–9 per win)

1. Re-run failing scenario (block img, tab navigation, resize)
2. Responsive 390 / 768 / 1280 — no overflow, tap ≥44px, no safe-area clip
3. Console/network clean, no `style.display` warnings
4. Check nearby components for regressions (compact vs full cards, dark mode)

## Risks

- `KargaMarketplace.jsx:1016` 8× `no-undef` still masks gate — fix or gate before Phase 1
- Hero eager may increase initial bytes — measure LCP before/after

## Done When

- `npm --prefix frontend run lint` 0 errors
- `npm --prefix frontend run build` green (prerender/sitemap/perf-budgets)
- Screenshots 390/768/1280 for each win
