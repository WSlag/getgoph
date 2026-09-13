# Hero Section Improvement — Plan

**Date:** 2026-09-13
**Scope:** `frontend/src/components/HeroCarousel.jsx:126` + context `frontend/src/views/HomeView.jsx:493`
**Skills used:** `frontend-design` (spec) · `ui-debugger` (verify) · `production-readiness` (perf/a11y) · Playwright (E2E/visual)
**Goal:** One primary action per slide, trustworthy logistics feel, no CLS/LCP regression, mobile-first, token-driven.

---

## 1. Clarify the Screen

- **Who:** Shipper / Trucker / Broker on Home (first impression, `HomeView.jsx:355`). Also guests (`guestMarketplaceData`).
- **Primary action per slide (frontend-design rule):** Home CTA is marketplace action, not carousel browsing.
  - Slides 1-3,5: `Post Cargo` / `Find Loads` (role-aware) — drives `onPostListing` / filter change.
  - Slide 4 (pain): `How GetGo Works` (anchor/modal) — not "Struggling..." as passive.
  - Slide 6 (broker): `Activate Broker` (`HeroCarousel.jsx:505` already does this, but styling weak).
- **Platform:** Web PWA, web-first, must collapse at 390 / 768 / 1280. Desktop `max-w-7xl` gutter `HomeView.jsx:491`; hero must respect same.
- **Constraints:** Reuse `frontend/src/styles/theme.css:15` tokens only (`--primary #c2410c`, `--border`, `--shadow-*`, `--radius-*`). No new colors. Tailwind v4 (`frontend/src/index.css:1`). No inline `style={{padding:'24px'}}` sprawl (`ui-system.md:123` anti-pattern).

---

## 2. Current Audit (evidence-backed)

| Area | Finding | File:Line |
|---|---|---|
| **Content/IA** | 6 slides, 5 with no CTA — violates "one primary action per screen". Pills mix positive/negative: `Manual Follow-up, Delayed Booking` (`HeroCarousel.jsx:89`) signals failure, not value. Icon for trucks/cargo duplicated (`HeroCarousel.jsx:43,57`). | `HeroCarousel.jsx:34-120` |
| **Visual system** | All inline `style` (`HeroCarousel.jsx:170-537`), not Tailwind/theme tokens. Hard height `height = isMobile ? 240 : 340` (`HeroCarousel.jsx:167`) — no token, no aspect ratio. Border `radius 16/20` ad-hoc vs `theme.css:60` scale. Shadow `0 4px 24px` ad-hoc vs `theme.css:68-72`. | `HeroCarousel.jsx:167,183,386` |
| **A11y** | No region role, no `aria-roledescription="carousel"`, no live region. Dots `8px × 22px` (`HeroCarousel.jsx:233`) hit target <44px, no `aria-current`. Arrows no visible focus ring. `prefers-reduced-motion` respected globally (`index.css:94`) but carousel still auto-advances without pause control. | `HeroCarousel.jsx:214-248,540-591` |
| **Motion/controls** | Autoplay 5s (`HeroCarousel.jsx:149`), pause 8s on interaction (`HeroCarousel.jsx:133`) but no visible pause/play, no progress indicator. User never knows it's paused. `willChange: transform` OK, but track width `total*100%` + `translateX` is fragile on resize. | `HeroCarousel.jsx:133-151,191` |
| **Performance** | `buildSrcSet` 480/768/1200 (`HeroCarousel.jsx:122`), `sizes="(max-width:640px) 100vw, 1200px"` OK but over-fetches on 768. Only first slide `eager/high` (`HeroCarousel.jsx:315-317`). No `aspect-ratio` → CLS risk on slow image. Overlay gradient identical 6× (`HeroCarousel.jsx:40`) — text contrast not per-image tested. See §3.8 for full image/size audit (4.07 MB hero dir, 196KB jpg fallback). | `HeroCarousel.jsx:122-124,296-326` + `scripts/generate-hero-assets.js:10` + `scripts/check-perf-budgets.js:13` |
| **Mobile** | `objectPosition 68% center` (`HeroCarousel.jsx:324`) crops subject. Padding `18px 40px 42px 48px` (`HeroCarousel.jsx:394`) forces odd left inset (48px). Title `22px` mobile vs `38px` desktop— hierarchy jump too large. Pills `10px` mobile border `rgba(255,255,255,0.35)` low contrast on light hero crop. | `HeroCarousel.jsx:278,324,394,458,486` |
| **Broker CTA** | Glass button `rgba(255,255,255,0.22) border 1.5px rgba(255,255,255,0.55)` (`HeroCarousel.jsx:516`) — barely passes contrast, no `variant="gradient"` reuse, no loading/disabled state. | `HeroCarousel.jsx:505-534` |
| **Integration** | Hero isolated from search/role KPIs (`HomeView.jsx:494-504` KPIs sit in separate card below, visual disconnect). No deep link from pill to filter. | `HomeView.jsx:491-505` |

**Playwright coverage today:** No dedicated hero spec. Closest is `tests/e2e/ui/mobile-responsive.spec.js` (viewport checks) and `tests/e2e/marketplace/navigation.spec.js`. Hero not asserted.

---

## 3. Design Spec (frontend-design)

### 3.1 Flow
Entry: `/` → Home scroll container (`HomeView.jsx:356`) → hero visible above fold → pill/CTA → action: `onPostListing` or `setActiveMarket` or `onActivateBroker`. Secondary: dot/arrow/ swipe navigates, does not drive funnel.

### 3.2 Wireframes

**Desktop (≥1024, height ~360, max-w-7xl):**
```
┌──────────────────────────────────────────────────────┐
│ [image cover] + overlay 90→18%                       │
│ ┌ icon 56 │ Headline 34-38 Outfit-800                │
│ └─────────┘ Sub 16-17 / 520w  rgba(255,255,255,.9)   │
│ [pills  glass  3×  rounded-full  7×18]                │
│ [Primary CTA  h-11  rounded-full  gradient-primary ] │
│          dots 32×8  44h hit · arrows 36 circle glass │
└──────────────────────────────────────────────────────┘
```

**Mobile (390, height 220-240, 16px gutter):**
```
┌──────────────────────────────┐
│ image 68% · overlay 88→35%   │
│ Headline 20-22               │
│ Sub 13 / 2 lines clamp       │
│ pills 10px · 1 row scroll?   │
│ [CTA full-width if primary]  │
│ dots 44h hit  · arrows 28    │
└──────────────────────────────┘
```

### 3.3 Design Tokens (reuse only)
- **Colors:** `var(--primary) #c2410c`, `var(--primary-vivid) #ea580c`, `var(--gradient-primary)`, `--card`, `--border #e7e5e4`, text `white` over overlay (contrast ≥4.5 by testing per-image darkening).
- **Radius:** hero `var(--radius-xl) 20px` desktop / `16px` mobile (from `theme.css:64`).
- **Shadow:** `var(--shadow-md)` + `var(--shadow-primary)` on CTA only.
- **Type:** `Outfit 700/800`, 38→22 scale, `letter-spacing -0.02em`. Sub `13/17`, `line-height 1.4`.
- **Spacing:** 4pt (`--space-*`), hero inner `p-6 lg:p-8`, gap `12/16`.
- **Motion:** `duration-normal 300ms ease-out`, `cubic-bezier(0.4,0,0.2,1)` already used (`HeroCarousel.jsx:197`). Honor `prefers-reduced-motion`.

### 3.4 Component Inventory

- `HeroCarousel` → container `role="region" aria-roledescription="carousel" aria-label="Featured"`.
- `Slide` → `group` `role="group" aria-roledescription="slide" aria-label="{i} of {total}"` + `aria-hidden={!isActive}`.
- `Dots` → `button[aria-label="Go to slide {n}"] aria-current={isActive}` hit `min-h-[44px] min-w-[44px]` (wrap 8px dot inside).
- `NavArrow` → `button` with `focus-visible:ring-2 ring-ring`, no inline `onMouseEnter` JS (`HeroCarousel.jsx:569`) → use `hover:bg-white/30` Tailwind.
- `CTA` → reuse `components/ui/button.jsx` `variant="gradient"` (`h-11 rounded-full px-6`). Broker stays gradient; others same.
- `Pills` → semantic: `bg-white/16 border-white/30 backdrop-blur` — remove negative pills, replace with value pills: `Live Bidding`, `Verified Carriers`, `Secure GCash`.
- `Progress` (new, optional): thin `h-1` bottom bar animating 5s, pauses when `isPaused`.

### 3.5 Interaction & States
- **Autoplay:** 5s, pause on hover/focus/touch, show `Pause/Play` icon-toggle (visible, not just timer). `resumeAfterPause 8000` (`HeroCarousel.jsx:133`) keep, but expose state visually.
- **Swipe:** 50px threshold stays (`HeroCarousel.jsx:163`), add `onTouchMove prevent`? keep simple.
- **Keyboard:** `ArrowLeft/Right` on container, `Home/End` to first/last, `Tab` reaches dots/arrows/CTA in order, no trap.
- **Hover/focus:** CTA `gradient-primary-hover`, arrows `bg-white/30`, dots `bg-white`.
- **Loading/empty/error:** `isImage` already has `STONE_PLACEHOLDER` (`HeroCarousel.jsx:32`) → keep; add `onError` → show stone + icon (not `display:none` hack). If `HERO_IMAGES` 404, do not blank-shift (CLS guard).
- **Reduced motion:** if `prefers-reduced-motion` → autoplay off, transform transition 0ms.

### 3.6 Content Rewrite (proposed, keeps 6 but sharpens)
| # | Headline | Sub | Pills | CTA |
|---|---|---|---|---|
|1| PH Cargo Marketplace, Connected | Post cargo or find loads — Luzon to Mindanao in one place. | Verified Carriers · Live Bidding · Secure GCash | `Post Cargo` / `Find Loads` (role-aware) |
|2| Book Trucks in Seconds | Post once, get bids from available truckers — faster than manual dispatch. | Fast Dispatch · Verified Truckers · Better Pricing | `Post Cargo` |
|3| Nationwide Coverage You Can Trust | From Luzon to Mindanao — rated drivers, transparent payments. | Rated Drivers · Secure Payments · Real Tracking | `Browse Trucks` |
|4| One Platform to Control Logistics | Post, track, and settle — no more scattered chats and sheets. | Cargo Marketplace · Live Tracking · Smart Bidding | `How It Works` |
|5| Cut Empty Backloads | Turn return trips into revenue — optimizer finds backloads en route. | Route Optimizer · Backload Matches · Fuel Savings | `Optimize Route` |
|6| Be a Broker — Zero Capital | Refer deals, earn commission on every completed contract. | Commission · Zero Capital · Unlimited Earn | `Activate Broker` (existing) |

Negative "Manual Follow-up" removed.

### 3.7 Backend Contract
Hero is UI-only; CTAs call existing handlers:
- `onPostListing` → opens `PostModal` (no API yet).
- `Browse Trucks / Find Loads` → `onMarketChange('trucks'|'cargo')` + `trackAnalyticsEvent('hero_cta_click')`.
- `Activate Broker` → `onActivateBroker` (`HomeView.jsx:493`).
- No new endpoints. Analytics: add `hero_cta_click { slide_id, cta_label, workspace_role }`.

### 3.8 Images & Size — Detailed Audit

**Build pipeline:** `frontend/scripts/generate-hero-assets.js:10` `variants [480,768,1200]` sharp `avif q55/e5`, `webp q70/e6`, `jpg q78 mozjpeg 4:4:4`. Source PNGs `2.2-2.5 MB` (`frontend/public/assets/trucker-phone-cab.png:2.5MB`, `warehouse-worker-phone.png:2.2MB`, `highway-sunset-truck.png:2.5MB`, etc). Pre-build `npm run generate:hero-assets` runs in `frontend/package.json:19 build`.

**Current output (measured 2026-09-13, `frontend/public/assets/hero/`):**
| Slide | 480 avif/webp/jpg | 768 avif/webp/jpg | 1200 avif/webp/jpg | Note |
|---|---|---|---|---|
| truckers | 27 / 29 / 64 KB | 50 / 55 / 128 KB | 70 / 81 / 196 KB | |
| cargo | 24 / 25 / 63 KB | 42 / 47 / 122 KB | 58 / 69 / 184 KB | source `warehouse-worker-phone.png` |
| solution | 24 / 25 / 63 KB | 42 / 47 / 122 KB | 58 / 69 / 184 KB | **duplicate of cargo** — same bytes (`generate-hero-assets.js:14,17`) |
| network | 24 / 24 / 51 KB | 56 / 57 / 120 KB | 88 / 93 / 195 KB | largest avif 88KB |
| manage | 29 / 31 / 65 KB | 52 / 59 / 130 KB | 73 / 86 / 199 KB | |
| broker | 31 / 31 / 70 KB | 54 / 58 / 138 KB | 73 / 83 / 206 KB | largest jpg 206KB |
| **Total dir** | **54 files, 4.07 MB** (all formats). Avif-only 6×3 = ~884 KB. Budget `scripts/check-perf-budgets.js:13` = `450 KB` per 1200 file — all pass today (max 206KB) but jpg wastes 2.8× vs avif.

**Current markup (`HeroCarousel.jsx:296-326`):**
```jsx
<picture>
  <source type="image/avif" srcSet="...-480.avif 480w, ...-768.avif 768w, ...-1200.avif 1200w" sizes="(max-width: 640px) 100vw, 1200px" />
  <source type="image/webp" ... />
  <img src="...-1200.jpg" srcSet="...-480.jpg 480w, ..." sizes="(max-width: 640px) 100vw, 1200px" width="1200" height="630" loading={isPriority||isActive?'eager':'lazy'} fetchPriority={isPriority?'high':'low'} style={{objectFit:'cover', objectPosition: isMobile?'68% center':'center'}} />
</picture>
```
- Container: `height = isMobile?240:340` (`HeroCarousel.jsx:167`), `width: total*100%` + `translateX` (`HeroCarousel.jsx:194`), no `aspect-ratio`. Intrinsic `1200×630 = 1.9:1` but rendered aspect is `358/240=1.49:1 mobile` and `~1232/340=3.62:1 desktop` (inside `max-w-7xl` + `16/24px` gutters `HomeView.jsx:491`) → `object-fit:cover` crops heavily; vertical CLS before load because placeholder is just `linear-gradient STONE_PLACEHOLDER` (`HeroCarousel.jsx:32`).
- `sizes="(max-width:640px) 100vw, 1200px"` means 768px tablet still hints 1200 — fetches 70-88KB instead of 50-56KB. Desktop actual CSS width is ~1152 not 1200.

**Images & Size fixes (to apply in Phase 0/1):**
1. **Fix `sizes` to match layout:** `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 768px, 1152px"` — saves ~20KB per page load on tablet (768 vs 1200 avif). Keep `HERO_IMAGE_WIDTHS [480,768,1200]` as-is; option to add `640` later if 480 looks soft on 390×2 DPR.
2. **Intrinsic + aspect lock to kill CLS:** Replace hard `height` with `aspect-[16/9] lg:aspect-[21/9] min-h-[220px] lg:min-h-[360px]` on outer `div` (`HeroCarousel.jsx:180`), add `aspect-[16/9]` to `<img>` and update `width/height` to real display ratio (recommend `1200×675` = 16:9, not 630 which is 1.9:1). Keep `STONE_PLACEHOLDER` but add `onError` fallback to stone+icon, and `style aspectRatio` so first paint reserves space.
3. **Preload LCP:** Add to `frontend/index.html` (or Vite `transformIndexHtml`): `<link rel="preload" as="image" imagesrcset="/assets/hero/truckers-480.avif 480w, /assets/hero/truckers-1200.avif 1200w" imagesizes="(max-width:640px) 100vw, 1152px" type="image/avif" fetchpriority="high">`. Keep `loading eager` + `fetchPriority high` on slide 0 only (`HeroCarousel.jsx:315`).
4. **Shrink jpg fallback:** `generate-hero-assets.js:43` `jpeg({quality:78, mozjpeg:true, chromaSubsampling:'4:4:4'})` → `quality:72, chromaSubsampling:'4:2:0'` — target 1200 jpg ~120KB not 196KB. Or keep jpg but lower `heroAssetBytes` budget check still green at `check-perf-budgets.js:13 450KB`.
5. **Dedup source:** Give `solution` its own source image (replace `warehouse-worker-phone.png` duplicate at `generate-hero-assets.js:17`); cargo vs solution currently identical — hurts visual distinction noted in §2.
6. **Per-slide objectPosition:** Remove global `68% center` (`HeroCarousel.jsx:324`); set per `HERO_IMAGES` entry (e.g., `truckers: '68% center'`, `network: 'center'`, `cargo: '58% center'`) so faces/cabs not cropped.

**Budget outcome:** After fixes: tablet 50-56KB avif (vs 70-88), desktop 70-73KB (vs 88), jpg fallback 120KB (vs 196), LCP discovery ~300ms earlier via preload, CLS 0 (aspect locked).

---

## 4. Implementation Route

**Framework:** React + Vite SPA (`frontend/package.json:8`), Tailwind v4 (`frontend/src/styles/tailwind.css`). Keep `HeroCarousel.jsx` but refactor styles to Tailwind+tokens, keep `picture/srcSet` pipeline (`scripts/generate-hero-assets.js:19`).

**Where it runs:** Static Vite build prerendered (`frontend/package.json:16 prerender:public`), Cloud Functions not affected.

**File changes (smallest):**
1. `HeroCarousel.jsx` — new `HERO_CTAS` map, role prop (`workspaceRole`), Tailwind conversion, a11y region/live, hit targets, pause toggle, progress bar, `useReducedMotion` hook. Plus image/size fixes: update `sizes` to `(...640...768...1152px)`, replace hard `height 240/340` with `aspect-[16/9]`, fix `width/height` to `1200×675`, per-slide `objectPosition`, add `onError` fallback.
2. `HomeView.jsx:11,493` — pass `workspaceRole`, `onPostListing`, `onMarketChange` into hero.
3. `theme.css` — no new tokens; maybe add `--hero-overlay` if needed (defer).
4. `scripts/generate-hero-assets.js` — update jpg `quality:72 4:2:0` (vs 78 4:4:4), give `solution` distinct source, keep `variants [480,768,1200]`; re-run `npm run generate:hero-assets`.
5. `frontend/index.html` — add LCP preload `<link>` for `truckers` avif (new).

**State:** Single `current` + `isPaused` stays. Add `reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')` → disable interval.

---

## 5. Playwright + Verification Plan (ui-debugger steps 7-9 per win)

### 5.1 New spec: `tests/e2e/ui/hero-carousel.spec.js`
```js
// chromium + mobile emulation (390×844, 768×1024, 1280×720)
test('hero renders without CLS, LCP image eager', ...)
test('dots/arrows keyboard nav + aria-current', ...)
test('swipe left/right on mobile', ...)
test('autoplay pauses on hover and on Pause button', ...)
test('CTA per slide visible and clickable (role-aware)', ...)
test('reduced-motion disables autoplay', ...)
test('image error fallback shows stone gradient, no shift', ...)
test('visual snapshot 390/768/1280', { toHaveScreenshot })
```

**Selectors to use:** `getByRole('region', {name:'Featured'})`, `getByRole('button', {name:/Slide|Pause|Next|Previous/})`, `getByRole('button', {name:/Post Cargo|Find Loads|Activate Broker/})`.

**Assertions:**
- No horizontal overflow: `expect(page).not.toHaveOverflow` via `window.innerWidth >= document.documentElement.scrollWidth`.
- No console errors / 404 hero assets (`page.on('console')` + `response` check).
- `await expect(page.getByRole('img').first()).toBeVisible()` and `naturalWidth > 0`.
- Axe core: `await checkA11y()` (dots have `aria-label`, contrast check on headline over overlay).
- Lighthouse-ish: `performance.getEntriesByType('largest-contentful-paint')` < prior baseline (measure before/after).

### 5.2 Existing suites to keep green
`npm run test:e2e -- tests/e2e/marketplace/navigation.spec.js tests/e2e/ui/mobile-responsive.spec.js tests/e2e/guest/guest-experience.spec.js`

### 5.3 Commands
```bash
# dev with emulator (playwright.config.js:60-96)
npm run test:e2e -- tests/e2e/ui/hero-carousel.spec.js --project=chromium --reporter=list
npm --prefix frontend run lint   # must stay 0 errors (track ui-early-wins-plan.md:50)
npm --prefix frontend run build  # prerender/sitemap/perf-budgets green
```

**Screenshots:** `playwright-report/` + `test-results/` committed not; attach to PR.

---

## 6. Phasing (small patches, not rewrite)

**Phase 0 — Today (30-45 min): quick wins, no content change**
- Fix hit target dots `44px` + `aria-current`, arrows `focus-visible`, replace `onMouseEnter` JS with Tailwind hover, add `role=region` + live `aria-live="polite"` for slide headline.
- **Images/size quick:** update `sizes` to `(max-width:640px) 100vw, (max-width:1024px) 768px, 1152px` + add LCP preload `<link>` for truckers avif + fix `width/height 1200×675` and `aspect-[16/9]` to kill CLS (replace hard `167: height 240/340`). Verify no 404 `page.on('response')`.
- Build + lint + 390/768/1280 screenshots + check `assets/hero/*-1200.avif <80KB` (network was 88KB).

**Phase 1 — This week (2-3 hr): polish + CTA + image dedup**
- Add per-slide CTA map (role-aware), reuse `<Button variant="gradient">`, wire `onPostListing`/`onMarketChange`.
- Add visible Pause/Play toggle + progress bar + keyboard `Arrows/Home/End`.
- Rewrite `SLIDES` copy (table above), dedup cargo/trucker icons (shipper=package, trucker=truck, network=mapPin, manage=solution icon distinct).
- Tailwind conversion: remove `style=` inline, use `cn()` + tokens (`rounded-xl`, `shadow-md`, `bg-white/16`).
- **Images:** give `solution` distinct source in `generate-hero-assets.js:17`, retune `jpeg q72 4:2:0` (184→120KB), set per-slide `objectPosition` (remove global 68%).
- Playwright spec written + CI green.

**Phase 2 — Next sprint (optional, 2 hr): perf + content**
- Measure LCP before/after (hero eager + `fetchPriority high` already done, add `imagesizes` audit). Optimize `generate-hero-assets` `HERO_IMAGE_WIDTHS` if needed.
- Pill → filter deep link (click pill filters marketplace).
- Consolidate KPI card `HomeView.jsx:494` into hero sub-section if density test on 1440p shows gap.

**Done when:**
- `npm --prefix frontend run lint` 0 errors
- `npm --prefix frontend run build` green
- Playwright `hero-carousel.spec.js` 8/8 passing @ 390/768/1280
- Axe no critical, CLS 0, no new colors

---

## 7. Risks

- `KargaMarketplace.jsx:1016` `no-undef` legacy still counted — does not block this but lint gate must stay green (`plans/ui-early-wins-plan.md:46`).
- Autoplay pause UX — if progress bar over-designed, can feel noisy; keep `h-1` subtle.
- Image crop at `68%` (`HeroCarousel.jsx:278`) — test real subjects after overlay darken; adjust per `imageKey` if face/cab cropped.
- Broker CTA outside hero card `BrokerHomeCard` remains — ensure no duplicate CTA confusion; broker slide CTA should match that card's wording.

---

## 8. Open Questions

1. **Primary CTA copy per role:** Confirm: shipper=`Post Cargo`, trucker=`Find Loads`, broker=`Browse Cargo`? Or unify to `Post Cargo` for all guests?
2. **"How It Works" target:** Modal vs anchor to `/#how-it-works` vs `HelpSupportView` — which exists?
3. **5th slide "Route Optimizer":** Should gate to `workspaceRole === 'trucker'` only? Figma has trucker-only card (`HomeView.jsx:579`).
4. **Overlay darkness:** Keep `0.78` or raise to `0.82` for WCAG AA on `rgba(255,255,255,0.85)` sub? Needs per-image contrast check with Playwright screenshot + axe.

---

## 9. References

- Carousel: `frontend/src/components/HeroCarousel.jsx:1` (`SLIDES`, `HERO_IMAGES`, `buildSrcSet`, `resumeAfterPause`)
- Mount: `frontend/src/views/HomeView.jsx:492`
- Tokens: `frontend/src/styles/theme.css:1` (`--primary #c2410c`, `--radius`, `--shadow-*`)
- Global motion: `frontend/src/index.css:94` (`prefers-reduced-motion`)
- Design system: `ui-system.md:1` (anti-patterns: inline spacing, radius sprawl)
- Prior wins: `plans/ui-early-wins-plan.md:1` (#8 hero LCP, #4 radius/shadow)
- Playwright: `playwright.config.js:13` (emulator), `tests/e2e/ui/mobile-responsive.spec.js`

**Next step:** Approval to start Phase 0 → I scaffold `tests/e2e/ui/hero-carousel.spec.js` + patch `HeroCarousel.jsx:214-252` dots/region first, then show 390/768/1280 screenshots.
