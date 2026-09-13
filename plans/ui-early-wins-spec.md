# UI Early Wins — Spec

**Date:** 2026-09-13
**Derived from:** `frontend/src/styles/theme.css:1`, `components/ui/button.jsx:10`, `card.jsx:6`, `app-card.jsx:6`, `page-container.jsx:5`, `CargoCard.jsx:1`, `TruckCard.jsx:1`
**Principle:** Use existing tokens/components before inventing — no new colors

## 1. Tokens (single source)

| Token | Now | Spec |
|---|---|---|
| Primary | `--primary #f97316` `theme.css:15` | Keep |
| Gradients | `--gradient-primary 135deg #FF9A56→#FF6B35` etc. | Keep 6, reuse |
| Radius | `--radius .625rem` only | Scale: `sm 8 / md 10 / lg 16 / xl 20` — cards `lg` (16, `rounded-2xl`) |
| Shadows | Per-button only | `--shadow-sm / md / lg` + `shadow-primary/30` on primary hover |
| Spacing | Ad-hoc `px-4/6/8` | 4pt: 4/8/12/16/24/32 — cards `p-5 lg:p-6 gap-4` |
| Type | Outfit 16px base | 11 meta / 13 sm / 14 body / 18 heading / 24 display |
| Motion | `duration-500` on cards | Primary `300ms`, hover `200ms`, shake `500ms`; respect `prefers-reduced-motion` |

Dark: keep `.dark` overrides in `theme.css:100`; ensure orange pops on dark.

## 2. Components

### Images
- **Wrapper:** `aspect-[4/3] overflow-hidden rounded-xl` (thumbs), `aspect-square` (avatar), containment `max-w-full` (QR)
- **Img:** `size-full object-cover group-hover:scale-110 group-focus-visible:scale-110 transition-transform duration-300`
- **Loading:** grid thumbs `loading="lazy" decoding="async"`, hero first slide `loading="eager" fetchPriority="high"`
- **Fallback:** React state, not DOM: `const [err,setErr]=useState(false); {err ? <Fallback/> : <img onError={()=>setErr(true)} />}`
- **Alt:** meaningful: `alt="Reefer 12t Quezon→Cebu"`; avatar `alt="{name} avatar"`
- **Sizes:** `sizes="(max-width:640px) 50vw, 33vw"` + srcSet 256/512 via Sharp

### Containers
- **Page:** `max-w-7xl mx-auto w-full px-4 lg:px-6` (replaces `max-w-screen-2xl` in `page-container.jsx:5`)
- **Card:** `bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.01] hover:-translate-y-0.5`
- **Accent bar:** `h-1.5` (normalize compact `h-1` → `h-1.5`)
- **Padding:** `p-5 lg:p-6` (replaces inline `24px`)

### Buttons (12→6)

Keep: `default` (primary orange), `outline`, `ghost`, `glass`, `destructive`, `secondary`
Drop: `gradient-blue/green/purple`, `glass-dark`, `link` (use semantic prop on `default`)

States (all):
- default / hover (`shadow-lg→xl`, primary scale `105` only) / active (`scale-95`) / disabled (`opacity-50 pointer-events-none`) / loading (`spinner + aria-busy="true" disabled`) / focus (`ring-2 ring-ring ring-offset-2`)

In cards: no raw `<button style>` — use `<Button variant="default" size="sm">Bid Now</Button>` + `<Button variant="outline" size="sm">Details</Button>`

## 3. Interactions

- **Primary gating:** `Bid` disabled if price empty/below min/fee-cap exceeded; tooltip “Enter a price first”
- **Loading:** spinner inside button, preserve inputs (`GetGoApp.jsx:986` flags)
- **Error:** inline under field + red ring + `animate-shake` (`index.css:14`), keep modal open, preserve data
- **Empty:** illustration + “Clear filters” + CTA; skeleton shimmer 3×1 while loading
- **Responsive:** `lg:grid-cols-3 md:grid-cols-2 gap-4`; modals `max-w-2xl` desktop, sheet on mobile; filter bar `sticky` with `backdrop-blur`

## 4. Handoff Files (in order)

1. `styles/theme.css:1` — add radius/shadow/spacing/type scales
2. `components/ui/button.jsx:10` — prune to 6, add loading
3. `card.jsx:6` + `app-card.jsx:6` — unify to one (deprecate AppCard)
4. `page-container.jsx:5` — `max-w-7xl`
5. `components/cargo/CargoCard.jsx:1` / `truck/TruckCard.jsx:1` — images + buttons + padding
6. `views/HomeView.jsx:1` — skeletons/empty
7. `KargaMarketplace.jsx:1` — delete or gate (8 no-undef)

## 5. Backend Contract (no API change)

All via existing `services/firestoreService.js` + callables + `onSnapshot`. Spec keeps contract; just wires states:
- Post → optimistic grid + toast
- Bid → close modal → BidsView badge
- GCash pay → poll submission doc → Approved/Manual Review
- Poll vs redirect: poll for OCR verification, stay SPA for listings

## 6. Open Questions (block before code if unanswered)

- Q1: Keep `KargaMarketplace.jsx` or delete?
- Q2: Broker card always or only `shouldShowBrokerCard`?
- Q3: Admin stats real-time or cached?
- Q4: Image fallback gradient vs truck silhouette?
- Q5: GCash auto-approve threshold?

