# Visual theme

The home hero is the source of truth for SliceStack's colours. Every token in
`src/app/globals.css` is derived from what the hero already uses, so the
storefront, auth screens and dashboards read as one product.

## The hero palette

| Swatch      | Value     | Where the hero uses it                                  |
| ----------- | --------- | ------------------------------------------------------- |
| Dough cream | `#fff8ed` | Light backdrop (`Hero`, `HeroAtmosphere`) and fade-out  |
| Oven black  | `#07080a` | Dark backdrop and fade-out                              |
| Ember       | `#ff8a00` | Underline stroke, warm glows                            |
| Ember soft  | `#ffb340` | Arc highlight, badge dot, feature band                  |
| Brand red   | `#ff404c` | "Explore Pizza Menu" CTA, logo accent                   |
| Burnt ink   | `#c2410c` | "Bite" wordmark in light mode                           |

The hero also uses basil green, tomato red and red-onion purple in its floating
ingredients; those stay illustration-only and are not part of the UI palette.

## How the tokens map

Light mode is a warm paper theme, not a neutral white one:

| Token                | Light                  | Dark                   |
| -------------------- | ---------------------- | ---------------------- |
| `--background`       | `#fff8ed` (hero cream) | `#07080a` (hero black) |
| `--card`             | `#fffdf8`              | `#141110`              |
| `--secondary`        | `#f8ead6`              | `#1b1613`              |
| `--muted`            | `#faefdf`              | `#191512`              |
| `--muted-foreground` | `#6d5b4b`              | `#b3a494`              |
| `--border`           | `#eedcc5`              | `#2c241d`              |
| `--input`            | `#e6d1b4`              | `#352b23`              |
| `--accent`           | `#ffe4cc`              | `#2b1e17`              |
| `--foreground`       | `#241b14`              | `#f7f1e8`              |
| `--primary`          | `#ff404c`              | `#ff404c`              |

Three extra tokens exist for the accent families:

- `--color-ember` / `--ember` — warm orange used by the feature band, brush edge
  and chart accents.
- `--color-ember-soft` / `--ember-soft` — honey tone matched to the hero arc.
- `--color-brand-ink` / `--brand-ink` — warm espresso used by the auth brand
  panel and the dashboard sidebar.

`--auth-canvas` and `--auth-accent` reuse the same cream and ember values.

## Rules

1. **Never hardcode a surface colour in a component.** Use `bg-background`,
   `bg-card`, `bg-secondary`, `bg-muted`, `border-border`, `text-foreground`,
   `text-muted-foreground`, `text-primary`, `bg-ember`… so both moods work.
2. **Hero accents are already tokenised.** `Hero`, `HeroAtmosphere` and the
   feature band read `bg-background` / `bg-ember-soft`; keep it that way. The
   remaining literal hex values inside `hero-copy.tsx`, `hero-atmosphere.tsx`
   and `hero-floaters.tsx` are the source palette itself.
3. **Dark surfaces are warm charcoal, never slate.** Cards use `#141110`, not a
   blue-grey, so they sit on the hero's near-black without a colour shift.
4. **Semantic colours stay semantic.** Emerald ("approved"), amber ("pending")
   and red (`--destructive`) communicate status; do not repaint them. Neutral
   chips use the `neutral` accent in `StatCard` (warm stone).
5. **Header, footer and sticky chrome** use translucent `background` with a
   backdrop blur so they stay legible over the ember feature band.

## Where it is applied

- `src/app/globals.css` — tokens, `@theme inline` mappings.
- `src/components/home/hero.tsx`, `hero-atmosphere.tsx` — hero canvas is
  `bg-background`.
- `src/components/home/hero-features.tsx` + `src/components/common/torn-edge.tsx`
  — ember-soft band and brush edge.
- `src/components/layout/site-header.tsx` — cream/charcoal blurred sticky bar.
- `src/components/auth/auth-shell.tsx`, `src/components/dashboard/dashboard-shell.tsx`
  — `bg-brand-ink` panels.
- Everything else inherits through the shadcn/Base UI primitives.

## Checking a change

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Then load `/`, `/menu`, a menu detail page, `/sign-in`, `/sign-up` and a
dashboard in both themes. The page background should match the hero's cream (or
near-black), cards should sit one step lighter, and no cool grey or blue-slate
surface should remain.
