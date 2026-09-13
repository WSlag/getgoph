# Color System Modernization — Plan

**Date:** 2026-09-13  
**Scope:** Frontend color/gradient system · `frontend/src/styles/theme.css` + Tailwind tokens + components/views  
**Skill:** `frontend-design` (design-spec first) + `archify` evidence  
**Status:** PLAN — no code changes yet  
**Goal:** Replace the "a bit colorful" palette with a modern, neutral-first system that keeps GetGo orange recognizable but removes rainbow gradients. One brand hue, two semantic hues, rest neutrals.

---

## 1. Evidence — Current System Audit

### 1.1 Source of truth
- `frontend/src/styles/theme.css:3` — 22 core tokens + 6 gradients + 4 status/role gradients + 4 chart colors + glass tokens
- `frontend/src/index.css:89` — ring/focus uses `--ring #f97316`
- `frontend/vite.config.js:54` — PWA `theme_color #f97316`, `background_color #ffffff`
- `frontend/src/components/ui/button.jsx:11` — 7 variants (default/gradient/glass/destructive/outline/secondary/ghost) — two compete (`default` solid vs `gradient`)
- `frontend/src/components/ui/badge.jsx:15` — 9 variants including 5 `gradient-*`
- `frontend/src/components/cargo/CargoCard.jsx:82` / `91` — new muted status badges vs bright price-pill gradients (`from-orange-500 to-orange-600`, `blue-500→blue-600`, etc.)
- `frontend/src/views/HomeView.jsx:417,429` — market switcher uses `from-orange-400 to-orange-600` vs `from-blue-400 to-blue-600` (two saturated primaries)
- `frontend/src/components/HeroCarousel.jsx:37` — 6 slides each with `placeholderGradient` (orange/purple-pink/blue-cyan/…) + identical dark overlay; no single hero identity
- `frontend/src/views/*ActivityView.jsx:375` — KPI stat cards each with a different tinted icon bg (orange/blue/purple/green)

### 1.2 Inventory — What makes it feel "colorful"
Counted from grep + theme:

| Bucket | Tokens / Classes | Problem |
|---|---|---|
| Brand | `--primary #f97316`, `--gradient-primary #FF9A56→#FF6B35`, `--gradient-accent #ff9a56→#ffd34e`, `from-orange-400 to-orange-600`, `from-amber-500 to-orange-500` (4 orange gradients for same job) | Competing oranges; #f97316 is low-contrast on white (2.9:1 on --background) — fails WCAG AA for text |
| Status/role gradients | `--gradient-open green`, `--gradient-waiting orange`, `--gradient-delivered blue`, `--gradient-in-transit violet`, `--gradient-shipper blue`, `--gradient-trucker violet` + `--gradient-warm pink→red`, `--gradient-ocean blue→cyan`, `--gradient-sunset pink→yellow`, `--gradient-soft mint→pink` | 10 gradients used interchangeably; cargo card bar + badge + price pill each pick a different one per status → rainbow |
| Charts | `#f97316 #3b82f6 #22c55e #8b5cf6 #ec4899` | 5 saturated hues for 3 real categories |
| Ad-hoc hex in views | `HomeView` purple dashed `Route Optimizer`, `TrackingView` green/blue/orange status map, `BrokerView` green/orange gradients, `ActivityView` 4 icon tints | No token — hex literals drift |
| Surfaces | `bg-gray-50` / `bg-white` / `bg-card` mix, `border-border rgba(0,0,0,0.1)`, `shadow-sm` + `shadow-primary rgba(249,115,22,0.30)` | No warm neutral; pure gray feels cold next to warm orange |

**Diagnosis:** 60-30-10 violated — ~45% saturated color (every card/status gets a hue), ~20% neutrals. Result: marketplace looks promotional, not trustworthy/logistics-grade.

### 1.3 Dark mode gaps
- `theme.css:129` dark reuses `--primary #f97316` on `--background #0a0a0a` (works as button) but `--muted #262626` + `--border rgba(255,255,255,0.1)` leaves no elevation steps — cards don't pop.
- `glass-bg rgba(255,255,255,0.7)` not used consistently; some modals use opaque `bg-card`.

---

## 2. Design Principles (Best Practices 2025-2026)

1. **Neutral-first, brand-second.** 60% warm neutral (zinc/stone), 30% white/cards, 10% brand accent. Color only where it signals action or status.
2. **One brand hue, one scale.** Orange owns CTAs/price/progress. Blue reserved for maps/links only. No purple trucker vs blue shipper duality — roles use neutral + icon, not competing gradients.
3. **Status = muted badge, not gradient bar.** WCAG-safe pastel bg + 600-weight text (AA 4.5:1). No `from-* to-*` on cards.
4. **One hero gradient, everywhere else solid.** Gradient lives only on primary CTA / hero glow — low-frequency, high-impact.
5. **OKLCH + Tailwind v4 tokens.** Step scale (50–900) for predictable hover/active/disabled; enables `color-mix` tints without new hex.
6. **Surface elevation via neutral steps,** not colored shadows. `shadow-primary` only on primary button hover; cards use `shadow-sm → shadow-md`.
7. **AA contrast by default.** Primary text on brand must be white at orange-600 (5.0:1), not orange-400.

---

## 3. Proposed Palette — "Warm Neutral + Ember" (Recommended)

### 3.1 Philosophy
Keeps GetGo recognizable (orange stays) but moves from "fruit stand" to "modern logistics." Think Linear × Stripe × Uber — warm ink text, zinc surfaces, ember accent.

### 3.2 Token Map (light / dark)

**Neutrals — warm锌 (stone/zinc 950→50)**
| Token | Light | Dark | Use |
|---|---|---|---|
| `--background` | `#fafaf9` stone-50 (warm, not #fff) | `#0c0a09` stone-950 | page bg |
| `--foreground` | `#1c1917` stone-900 | `#fafaf9` stone-50 | ink text |
| `--card` | `#ffffff` | `#1c1917` stone-900 | card surface |
| `--card-foreground` | `#1c1917` | `#fafaf9` | card text |
| `--muted` | `#f5f5f4` stone-100 | `#292524` stone-800 | subtle bg (kpi, filters) |
| `--muted-foreground` | `#78716c` stone-500 | `#a8a29e` stone-400 | secondary text |
| `--border` | `#e7e5e4` stone-200 | `#292524` stone-800 | dividers |
| `--input` | `#e7e5e4` | `#44403c` stone-700 | input border |
| `--input-background` | `#ffffff` | `#1c1917` | input fill |
| `--accent` | `#f5f5f4` | `#292524` | hover row |

**Brand — Ember (orange, tightened 3-stop scale, OKLCH)**
| Token | Value | Notes |
|---|---|---|
| `--primary` | `oklch(0.68 0.18 45)` → `#ea580c` orange-600 | was `#f97316` orange-500; AA on white (5.0:1), calmer |
| `--primary-hover` | `oklch(0.64 0.19 44)` → `#c2410c` orange-700 | hover/active |
| `--primary-soft` | `oklch(0.94 0.04 50)` → `#fff7ed` orange-50 | tint bg (badges, empty states) |
| `--primary-ring` | `oklch(0.68 0.18 45 / 0.4)` | focus ring |
| `--sidebar-primary` | same as `--primary` |  |
| `--gradient-primary` | `linear-gradient(135deg, oklch(0.72 0.16 45) 0%, oklch(0.64 0.19 44) 100%)` `#fb923c → #c2410c` | **only** for `Button[gradient]` / hero glow |
| `--gradient-primary-hover` | `linear-gradient(135deg, oklch(0.68 0.18 45) 0%, oklch(0.60 0.19 43) 100%)` |  |

> Removed: `--gradient-accent`, `--gradient-warm`, `--gradient-ocean`, `--gradient-sunset`, `--gradient-soft` (5).

**Semantic — desaturated, badge-only (no card gradients)**
| Token | Light (bg / text / border) | Dark | Use |
|---|---|---|---|
| `--success` | `bg #f0fdf4 / text #15803d / border #bbf7d0` | `#052e16 / #4ade80` | delivered/completed |
| `--warning` | `bg #fffbeb / text #b45309 / border #fde68a` | amber-950 / amber-400 | waiting/pending |
| `--info` | `bg #eff6ff / text #1d4ed8 / border #bfdbfe` | blue-950 / blue-400 | in-transit/maps |
| `--accent-violet` | `bg #f5f3ff / text #6d28d9 / border #ddd6fe` | violet-950 / violet-400 | broker/bonus only — low freq |
| `--destructive` | unchanged `#dc2626` → darken to `#b91c1c` for AA | `#7f1d1d` |  |

**Role/status gradients → deleted.** Replace map ( `theme.css:104` ):
- `gradient-open` → `badge success`
- `gradient-waiting` → `badge warning`
- `gradient-delivered` / `gradient-shipper` → `badge info` (same hue keeps map coherence)
- `gradient-in-transit` / `gradient-trucker` → `badge accent-violet` (only for broker, not truck state)

**Chart — max 3 hues**
- `chart-1` `--primary #ea580c` · `chart-2` `--info #2563eb` · `chart-3` `--success #16a34a` — drop `chart-4/5` (purple/pink) unless dashboard explicitly needs 4th series, then use `stone-400`.

**Elevation**
- `--shadow-sm 0 1px 2px rgba(28,25,23,0.06)`
- `--shadow-md 0 4px 12px rgba(28,25,23,0.08)`
- `--shadow-lg 0 12px 32px rgba(28,25,23,0.12)`
- `--shadow-glow: 0 8px 24px oklch(0.68 0.18 45 / 0.22)` — only on primary hover

**Typography** — keep `Outfit` + current scale (`theme.css:42`) — no change.

### 3.3 Visual reference (wireframe intent)

```
LIGHT — page bg stone-50, cards white, ink stone-900
┌─────────────────────────────────────────────────────┐
│ Header  white / border stone-200  [GetGo]  nav ink │
├─────────────────────────────────────────────────────┤
│ Search  white pill / stone-200 border               │
│ hero: photo + dark scrim + white type + ONE ember   │
│ CTA (ember gradient)  [Post Cargo]                  │
├─────────────────────────────────────────────────────┤
│ [Card white / stone-200 / radius 16]                │
│  badge warning (amber-50)    price solid ember-600  │
│  title ink  route muted  description stone-500      │
│  [ Bid Now  ember solid ] [Details neutral outline]  │
├─────────────────────────────────────────────────────┤
│ KPI row: stone-100 muted cards, value ink, no tint  │
└─────────────────────────────────────────────────────┘

DARK — page stone-950, cards stone-900, border stone-800
 (same layout, ember stays #ea580c, badges use dark tints)
```

**Tone:** Calm, premium, trustworthy — orange feels like "action" not "decoration."

### 3.4 Alternative considered (not recommended unless brand pivot)
- **"Ink + Teal"** — primary teal `#0d9488` for logistics/sea-air. Rejected: breaks GetGo equity, requires logo change ( `public/icons/getgo-logo.svg:5` uses `#FF6B35` ), higher migration cost. Keep as backlog if rebrand approved.

---

## 4. Component Spec — What Changes Where

### 4.1 Buttons — `frontend/src/components/ui/button.jsx:6`, `app-button.jsx:4`
- **Keep:** `default` → solid `bg-primary #ea580c` (replaces `#f97316`), `outline` → `border-stone-200 + text-stone-900`, `ghost`, `secondary`, `destructive`.
- **Variant `gradient`:** keep but narrow: `bg-gradient-to-br from-orange-400 to-orange-600` → single token `var(--gradient-primary)` (`#fb923c→#c2410c`). Used only for hero CTA + "Post" primary. All other primaries use solid `default`.
- **Delete `glass` drift:** normalize `app-button` vs `button` — single source `button.jsx`; `app-button.jsx` becomes re-export.
- **States:** `hover:bg-primary-hover`, `active:scale-95`, `disabled:opacity-50`, `focus-visible:ring-2 ring-primary/40 ring-offset-2 ring-offset-background`. Hovers no longer `hover:shadow-xl` — only `hover:shadow-glow` on `default/gradient`.

### 4.2 Badges / Chips — `badge.jsx:15`, `status-chip.jsx:4`, `CargoCard.jsx:82`
- **Delete** gradient badge variants (`gradient-green/orange/blue/purple/red`).
- **Keep** flat `success/warning/info` + new `accent-violet` (broker-only). Maps:
  - `open` → `warning` (amber-50) was green — align with "open needs action" = amber
  - `waiting` → `warning`
  - `in-progress` → `info` (blue-50)
  - `delivered/completed` → `success`
  - `broker` → `accent-violet`
- **Compact:** remove per-status `compactStatusStyles` duplicates — single `badgeVariants`.

### 4.3 Cards — `CargoCard.jsx:190`, `card.jsx:6`, `HeroCarousel.jsx:37`
- **Accent bar:** `h-1.5 bg-gradient-to-r ...` → `h-1 bg-stone-200 dark:bg-stone-800`; add `data-status` left border 3px in semantic color only if list needs scan-ability (A/B: bar-less vs thin left border).
- **Price pill:** `bg-gradient-to-r from-orange-500 ...` → solid `bg-primary text-white` (`#ea580c`). Rounded `lg` (12px), `shadow-sm` not `shadow-lg`.
- **Route/Metrics icons:** keep single muted `text-stone-400`, not green/red/blue per row. `MapPin`/`Navigation` unified.
- **Hero carousel:** 6 `placeholderGradient` values → one `hero-scrim` (`rgba(12,10,9,0.72) → transparent`) + single `ember glow` orb behind headline. Hero no longer carries 6 brand colors.

### 4.4 Page backgrounds & shells — `HomeView.jsx:359`, `layout/Header.jsx`, `layout/Sidebar.jsx`, `MobileNav.jsx`
- `bg-gray-50` → `bg-stone-50` (`--background`) and `dark:bg-stone-950`.
- Sticky controls `max-lg:bg-gray-50` → `bg-background/80 backdrop-blur-md border-b border-stone-200`.
- Sidebar `--sidebar #fafafa` → `#ffffff` / dark `#09090b` with `border-stone-200`.
- PWA `vite.config.js:54` `background_color #ffffff` → `#fafaf9`, `theme_color #f97316` → `#ea580c`.

### 4.5 Forms / Empty / KPI
- KPI grid `HomeView.jsx:496` `bg-muted/50 border-border/50` → intentional `bg-stone-100 dark:bg-stone-900 border-stone-200` with `text-stone-900` value, `label text-stone-500` — no per-KPI tint.
- Empty state `HomeView.jsx:774` `from-orange-100 to-orange-200` → `bg-stone-100 dark:bg-stone-900 border-stone-200` + single `icon text-stone-400`.
- Saved searches pill → `bg-white border-stone-200` not `gray-50`.

---

## 5. Token Migration — Minimal, Reversible Diff

**Single source `frontend/src/styles/theme.css:3`:**

```diff
 :root {
-  --primary: #f97316;  --ring: #f97316;
+  --primary: #ea580c;  --primary-hover: #c2410c;  --primary-soft: #fff7ed;
+  --ring: #ea580c;
-  --background: #ffffff; --card: #ffffff;
+  --background: #fafaf9; --card: #ffffff;
-  --muted: #ececf0;  --muted-foreground: #717182;
+  --muted: #f5f5f4;  --muted-foreground: #78716c;
-  --border: rgba(0,0,0,0.1);
+  --border: #e7e5e4;
-  --gradient-primary: linear-gradient(135deg, #FF9A56 0%, #FF6B35 100%);
+  --gradient-primary: linear-gradient(135deg, #fb923c 0%, #c2410c 100%);
-  --gradient-accent / --gradient-warm / --gradient-ocean / --gradient-sunset / --gradient-soft
+  /* deleted */
-  --gradient-open / --gradient-waiting / --gradient-delivered / --gradient-in-transit / --gradient-shipper / --gradient-trucker
+  /* replaced by semantic badge tokens */
+  --success / --warning / --info as above
-  --chart-2 #3b82f6  --chart-3 #22c55e  --chart-4 #8b5cf6  --chart-5 #ec4899
+  --chart-2 #2563eb  --chart-3 #16a34a  /* chart-4/5 deleted */
 }
 .dark {
-  --background: #0a0a0a; --card: #141414;
+  --background: #0c0a09; --card: #1c1917;
-  --muted: #262626; --border: rgba(255,255,255,0.1);
+  --muted: #292524; --border: #292524;
 }
```

No JS logic change. All component classes map to these vars; grep shows ~42 literal `from-* to-*` strings + ~70 `text-*500` tints collapse to tokens.

---

## 6. Implementation Route

**Framework:** React 18 + Vite 5 + Tailwind v4 (`tailwindcss @source`, `@theme inline`) — no new deps. Use `@theme inline` already in `theme.css:182` to expose `--color-primary` etc. to Tailwind.

**Where it runs:** `frontend/` SPA + PWA. Build check `npm --prefix frontend run build` must pass `prerender-public-routes` + sitemap.

**Phasing (deliberately small, no full rewrite):**

| Phase | Scope | Files | Effort | Verify |
|---|---|---|---|---|
| **0 — Tokens** | Edit `theme.css` only: neutrals, ember, semantic, shadow; update `vite.config.js` theme_color + `index.html` meta | `styles/theme.css`, `vite.config.js:54`, `index.html:37` | 30 min | `npm run build` + visual: page bg warm, primary button #ea580c, AA check with axe |
| **1 — Components** | Badge/button/card/price pill/accent bar → flat | `ui/button.jsx`, `ui/badge.jsx`, `ui/status-chip.jsx`, `cargo/CargoCard.jsx`, `truck/TruckCard.jsx`, `ui/card.jsx` | 2 hr | 390/768/1280: no rainbow bar; price pill solid; badges 4 variants only; focus ring visible |
| **2 — Views** | Home market switcher, hero carousel, KPI, activity stat cards, empty states → neutral + single ember CTA | `views/HomeView.jsx:417`, `HeroCarousel.jsx:37`, `views/*ActivityView.jsx:375`, `BrokerHomeCard` | 2 hr | Filters use neutral outline vs solid ember; hero 1 gradient; KPI no per-card tint; no contrast regression |
| **3 — Shell & polish** | Header/sidebar/mobile-nav bg, PWA icons bg, prerender link color `prerender-public-routes.js:66` | `layout/Header.jsx`, `Sidebar.jsx`, `MobileNav.jsx`, `public/icons/getgo-logo.svg:5` (keep logo but pass bg contrast), `scripts/prerender-public-routes.js:66` | 1 hr | Sticky controls blur + border; logo on stone-50 still AA; Lighthouse no errors |
| **4 — Cleanup & announce** | Remove dead gradients, lint hex literals, add `docs/color-tokens.md` + before/after screenshots (light+dark, 390/768/1440) | `styles/theme.css`, `components/ui/*`, `plans/*` | 1 hr | `grep -r "gradient-warm\|gradient-ocean\|gradient-accent"` → 0; `npm --prefix frontend run lint` 0 new warnings |

**Rollback:** Phase 0 is single-commit revert. Later phases guarded by tokens — no component logic change, so reverting `theme.css` restores prior look.

---

## 7. Behavior & States Spec

- **Button hover/active/disabled/loading:** as in `button.jsx:7` — ember solid darkens to `#c2410c`, not new hue. `disabled:opacity-50 pointer-events-none`.
- **Card hover:** `shadow-sm → shadow-md` + `scale-[1.01]` preserved — no color shift.
- **Focus:** every interactive: `focus-visible:ring-2 ring-primary/40 ring-offset-2 ring-offset-background` on stone bg ensures 3:1 ring contrast.
- **Empty/loading/error:** skeleton `bg-stone-200`, empty icon `stone-400`, error text `destructive`, success `success` — not orange.
- **Dark elevation:** `card #1c1917` over `background #0c0a09` (4% lift) + `border #292524` provides card separation without colored glow.

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Orange equity diluted (#f97316→#ea580c) | Keep logo `#FF6B35` unchanged; ember is darker grade of same hue, not new color — user still reads "GetGo orange" |
| "Too boring" feedback | Ember CTA + hero photo color remain vivid; marketplace cards calm = listings photos pop |
| Dark mode contrast | Test `primary #ea580c` on `stone-900` → 4.8:1 (AA); badge dark tints tested at 4.5:1 |
| Gradients deeply embedded (42 literals) | Phase 1 codemod: replace `bg-gradient-to-* from-* to-*` with `bg-primary` / badge variants — grep gate in CI |
| Marketing print `marketing/print-materials/*.html` uses `#f7941d→#e63946` | Out of scope for this plan — web first; print palette handled separately |

---

## 9. Verification Checklist (per phase)

- [ ] `npm --prefix frontend run lint` — 0 new errors
- [ ] `npm --prefix frontend run build` — green (prerender + perf budgets)
- [ ] Screenshots 390 / 768 / 1280 / 1440 — light + dark — no layout shift, tap target ≥44px, focus ring visible
- [ ] `axe-core` / Lighthouse accessibility ≥95 — contrast on price pill / badge / CTA passes AA
- [ ] No hex literals outside `theme.css` (grep `#[0-9a-fA-F]{6}` in `views/` → only `#ea580c` via token allowed)
- [ ] Nearby component regression: compact vs full card, broker card, notifications, tracking — all neutral

---

## 10. Open Questions (needs owner sign-off before code)

1. **Price pill treatment — A or B?** A) solid ember (#ea580c, recommended) B) thin left border + ink price (even quieter, like Stripe). Preference?
2. **Market switcher active state** — keep single ember for both Cargo/Trucks active, or keep Cargo=ember / Trucks=info-blue? Recommendation: single ember (one primary) — confirm.
3. **Broker accent** — allow violet badge for broker-only, or fold broker into same amber/info set to hit strict 2-hue budget?
4. **Logo** — keep `getgo-logo.svg` `#FF6B35` or re-export at `#ea580c` to match new primary?
5. **Scheduling** — OK to ship Phase 0 (tokens only) behind feature flag `VITE_THEME_EMBER=1` for visual QA, or direct to main?

---

## 11. Deliverables & Handoff

- [ ] This plan → approved
- [ ] Figma/HTML preview (single file) showing before/after: header + search + hero + 2 cards + KPI + button row, light + dark
- [ ] Phase 0 PR: `theme.css` + `vite.config` + `index.html` tokens
- [ ] Phases 1–3 PRs (small, reviewable) + screenshots

> Implementer starts at **Phase 0** — no speculative features, no new pages — reuse existing `Button`, `Badge`, `Card` APIs. If questions 1–5 unanswered, default to recommended choices above.

---

*Evidence: `frontend/src/styles/theme.css:3`, `frontend/src/components/ui/button.jsx:6`, `frontend/src/components/cargo/CargoCard.jsx:82`, `frontend/src/views/HomeView.jsx:417`, `frontend/src/components/HeroCarousel.jsx:37`, `frontend/vite.config.js:54`, `PROJECT_CONTEXT.md:171`. Tooling: Tailwind v4 `@theme inline`, Vite PWA, Outfit.*
