<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# slicestack-client

Next.js 16 App Router client (TypeScript, Tailwind v4, shadcn `base-nova`) for the SliceStack pizza storefront.

## Commands

- `npm run dev` / `npm run build` / `npm start`
- `npm run lint` — flat ESLint config in `eslint.config.mjs` (no `--fix` wired into the script).
- `npx tsc --noEmit` — there is no `typecheck` script, so use this directly.
- No test runner is configured. Don't invent `npm test`.
- Use npm (`package-lock.json`). Node 22+ is required (the `cn` package declares that engine).

## Conventions that differ from framework defaults

- **UI primitives are Base UI, not Radix.** `components.json` uses style `base-nova`; components import from `@base-ui/react/*` (see `src/components/ui/button.tsx`). Add shadcn components with `npx shadcn@latest add <name>` rather than hand-writing Radix-based code.
- **`cn` comes from the `cn` package**, not `clsx` + `tailwind-merge`. `src/lib/utils.ts` only re-exports it; import `{ cn }` from `@/lib/utils`.
- **Tailwind v4 is CSS-first**: there is no `tailwind.config.*`. Theme tokens, the dark variant, and palette values live in `src/app/globals.css`. `next.config.ts` wires `@tailwindcss/turbopack` as a loader for `*.css` — keep it.
- **Light/dark theming uses `next-themes`**: `ThemeProvider` wraps the app in `src/app/layout.tsx` with `attribute="class"`; the header toggle is `src/components/layout/theme-toggle.tsx`. Use theme tokens (`bg-card`, `text-muted-foreground`, …) rather than hardcoded colors so both moods work.
- **Typography**: Fredoka is the display face (`font-heading`) for the logo, H1/H2 and buttons; Nunito is the body/UI face and H3. Brand scale (mobile/desktop): H1 36/48, H2 28/36, H3 22/26, body 15/18. `Logo` accepts `size="lg"` for the 40/56px footer lockup; headers use the compact default. The brand mark is `public/logo.png` (transparent PNG, rendered through `next/image` in `src/components/brand/logo.tsx`).
- **React Compiler is enabled** (`reactCompiler: true` in `next.config.ts`); don't add `useMemo`/`useCallback`/`React.memo` by default.
- Typed props like `LayoutProps<"/">` in `src/app/layout.tsx` are globals generated into `.next/types`; don't import them. Run `next dev` or `next build` to regenerate.
- Pages that share the site header/footer live under the `(root)` route group; `src/app/(root)/layout.tsx` owns that chrome. Don't add a second `layout.tsx` at `src/app/` for site chrome.
- Links styled as buttons use `buttonVariants(...)` on `<Link>`, not `<Button render={<Link />}>` — Base UI logs an accessibility warning when a button renders an anchor.

## Layout

- `src/app/(root)/` — storefront routes: home, `/menu`, `/menu/[slug]`.
- `src/app/(auth)/` — `/sign-in` and `/sign-up`, rendered outside the storefront chrome. `src/components/auth/auth-shell.tsx` owns the split brand-panel + form layout; the warm form canvas and side-panel accent come from `--auth-canvas` / `--auth-accent` in `globals.css` so both moods work.
- `src/components/home/` — landing sections; `src/components/menu/` — menu/detail components; `src/components/layout/` — header, footer, mobile nav; `src/components/brand/` — logo and SVG pizza art; `src/components/common/` — shared section heading and `BrushEdge`.
- The home hero is theme-aware (`bg-background` / `text-foreground`): the copy sits inside a rounded `max-w-4xl` panel with `public/images/banner-img.webp` contained behind it (`HeroBackdrop`, eased from blur/depth into focus) and basil/garlic/onion accents in `HeroFloaters` at `lg+`. Both are client components driven by `motion/react` (`motion` package) and honour `prefers-reduced-motion`. The feature band (`hero-features.tsx`) is rendered after the hero in `page.tsx` and uses `BrushEdge` for its painted top edge.
- `src/data/menu.ts` — single source of truth for pizzas and categories; `src/types/menu.ts` holds the shapes. Update data there, not inside components.
- `@/*` maps to `./src/*` (`tsconfig.json`).
