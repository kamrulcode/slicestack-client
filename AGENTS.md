<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# slicestack-client

Next.js 16.4.6 App Router storefront and dashboards (TypeScript, Tailwind v4, shadcn `base-nova`). This repo is the client only: product data comes from a separate Express API (`NEXT_PUBLIC_API_URL`, default `http://localhost:8000`), while Better Auth and MongoDB run inside this app.

## Commands

- `npm run dev` / `npm run build` / `npm start`
- `npm run lint` — flat ESLint config in `eslint.config.mjs`; the script is `eslint` with no `--fix`.
- `npx tsc --noEmit` — there is no `typecheck` script.
- Verification order: `npx tsc --noEmit` → `npm run lint` → `npm run build`.
- No test runner is configured. Don't invent `npm test`.
- `npm run promote-admin -- <email>` — the in-repo way to grant `admin`; it reads `.env` and updates `slicestack.user`. No UI or API route in this client changes a role.
- Use npm (`package-lock.json`). Node 22+ is required (the `cn` package declares `>=22`; the README's "Node 20+" is wrong).

## Setup

- Config lives in `.env` (gitignored via `.env*`); the README's `.env.local` is not what this repo uses. `promote-admin` reads only `.env`.
- Required keys: `NEXT_PUBLIC_API_URL`, `BETTER_AUTH_URL` (must match the app origin, e.g. `http://localhost:3000`), `BETTER_AUTH_SECRET`, `MONGODB_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `STRIPE_SECRET_KEY`.
- The Express API must be running for menu, orders, favorites, admin, subscriptions and uploads; without it pages render their error state.
- The MongoDB database name is hardcoded as `slicestack` in `src/lib/mongodb.ts`.

## Architecture

- `src/services/*.service.ts` export a factory plus a browser singleton bound to `apiFetch`. Server Components use `serverApi` from `src/services/server.ts`, bound to `serverApiFetch`. Add endpoints there instead of calling `fetch` in components.
- `apiFetch` mints a Better Auth JWT from same-origin `/api/auth/token` and sends `Authorization: Bearer …` to the Express API; `serverApiFetch` uses `auth.api.getToken()`. Pass `{ auth: false }` for public endpoints.
- `src/app/api/auth/[...all]/route.ts` is the Better Auth handler. The JWT plugin exposes `/api/auth/token` and `/api/auth/jwks` for the Express API. Client code must only `import type` from `@/lib/auth`; the value pulls in MongoDB.
- `src/lib/mongodb.ts` caches one client on `globalThis`. Never `close()` it, and do not add `proxy.ts`/middleware that imports it — that causes `MongoTopologyClosedError`. Auth redirects live in server components/layouts.
- `getCurrentUser()` (`src/lib/authorization.ts`) is React-`cache`d and always reads with `disableCookieCache: true` because vendor activation changes the role mid-session; the global cookie cache is still enabled (7-day JWT). Don't remove either behavior.
- `role` and `blocked` are Better Auth additional fields with `input: false`; never accept them from a browser payload.
- `src/app/(dashboard)/dashboard/layout.tsx` is the single signed-out gate (`requireAuth`). Pages use `requireRole([...])` or `requireVendorWorkspace()`; don't add another sign-in redirect per page.
- Vendor workspace requires role `vendor` + `APPROVED` application + `active` shop. New vendors activate through the Express API (`POST /api/vendors/apply`), not a server action.

## Routes

- `src/app/(root)/` — storefront with site header/footer: `/`, `/menu`, `/menu/[id]`, `/offers`, `/about`, `/contact`, `/help`, `/location`, `/privacy`, `/terms`.
- `src/app/(auth)/` — `/sign-in`, `/sign-up` (customer/vendor modes), `/register-as-a-vendor`; no storefront chrome.
- `src/app/(dashboard)/` — `/dashboard` role dispatcher plus `/dashboard/{admin,vendor,customer}/…`; `DashboardShell` owns the sidebar. `/admin/vendors` is only a guarded redirect to `/dashboard/admin/vendors`.
- `src/data/menu.ts` holds the category list/blurbs only; actual menu items come from the API.

## Conventions that differ from framework defaults

- **UI primitives are Base UI, not Radix.** `components.json` uses style `base-nova`; components import from `@base-ui/react/*`. Add shadcn components with `npx shadcn@latest add <name>` rather than hand-writing Radix code.
- **`cn` comes from the `cn` package**, not `clsx` + `tailwind-merge`. App code imports `{ cn }` from `@/lib/utils`; shadcn-generated files import `{ cn } from "cn"`.
- **Tailwind v4 is CSS-first**: no `tailwind.config.*`. Tokens, the dark variant and palette values live in `src/app/globals.css`; `next.config.ts` wires `@tailwindcss/turbopack` as a `*.css` loader — keep it.
- **Use theme tokens, not hex.** Light mode is warm cream, dark is warm charcoal; see `docs/theme.md`. Prefer `bg-card`, `text-muted-foreground`, `bg-ember`, …
- **Typography**: Fredoka (`font-heading`) for the logo, H1/H2 and buttons; Nunito for body/UI and H3. Brand scale (mobile/desktop): H1 36/48, H2 28/36, H3 22/26, body 15/18. `Logo` accepts `size="lg"` for the footer lockup.
- **React Compiler is enabled** (`reactCompiler: true`); don't add `useMemo`/`useCallback`/`React.memo` by default.
- Typed props like `LayoutProps<"/">` are generated into `.next/types`; don't import them. Run `next dev`/`next build` to regenerate.
- Links styled as buttons use `buttonVariants(...)` on `<Link>`, not `<Button render={<Link />}>` — Base UI warns when a button renders an anchor.
- Client mutations show errors with `toast` from `sonner` plus `errorMessage(error)`; server pages render an inline error or `EmptyState`. Keep that split.
- API-backed pages that must not be cached set `export const dynamic = "force-dynamic"` (home, public menu and admin pages already do).
- The home hero is composed in `src/components/home/hero.tsx` from `hero-atmosphere/copy/pizza/floaters` (motion-driven, reduced-motion aware); the feature band uses `BrushEdge` from `src/components/common/torn-edge.tsx`.

## Existing docs

- `docs/theme.md` — verified palette and token rules.
- `docs/rbac.md` — useful roles/data-model overview, but stale on implementation: it describes server actions and a disabled cookie cache, while activation now goes through the Express API and the cookie cache is enabled but bypassed in `getCurrentUser`. Trust the code.
- `README.md` is generic and partly stale (Node 20, `.env.local`, `src/utils`); trust `package.json` and this file.
