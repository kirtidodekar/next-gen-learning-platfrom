# TanStack Start → Next.js App Router Migration Plan

## Current State

| Aspect | TanStack Start | Next.js Target |
|--------|----------------|----------------|
| Router | `@tanstack/react-router` file routes in `src/routes/` | App Router in `src/app/` |
| SSR data | Route `loader` + TanStack Query + `createServerFn` | RSC `async` pages + `lib/data/` |
| Layout | Per-page `DashboardLayout` wrapper | Same pattern (optional `(dashboard)` group later) |
| Styling | Tailwind v4 via Vite plugin | Tailwind v4 via `@tailwindcss/postcss` |
| Env vars | `VITE_*` / `SUPABASE_*` | `NEXT_PUBLIC_*` / server-only secrets |

## Route Mapping

| TanStack Route | Next.js File | Status |
|----------------|--------------|--------|
| `src/routes/__root.tsx` | `src/app/layout.tsx` | ✅ Migrated |
| `src/routes/index.tsx` | `src/app/page.tsx` | ✅ Migrated |
| `src/routes/courses.tsx` | `src/app/courses/page.tsx` | ✅ Migrated |
| `src/routes/analytics.tsx` | `src/app/analytics/page.tsx` | ✅ Migrated |
| `src/routes/settings.tsx` | `src/app/settings/page.tsx` | ✅ Migrated |
| Root 404 | `src/app/not-found.tsx` | ✅ Migrated |
| Root error | `src/app/error.tsx` + `global-error.tsx` | ✅ Migrated |

## Target Folder Structure

```
src/
├── app/
│   ├── layout.tsx              # Root HTML shell, metadata, global CSS
│   ├── page.tsx                # / — Dashboard
│   ├── loading.tsx             # Dashboard skeleton while RSC loads
│   ├── error.tsx               # Route-level error boundary
│   ├── global-error.tsx        # Root HTML error fallback
│   ├── not-found.tsx           # 404 page
│   ├── courses/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── analytics/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── components/
│   ├── dashboard/              # Client components (Framer Motion)
│   └── ui/                     # shadcn/ui (unchanged)
├── hooks/
├── integrations/supabase/
│   ├── client.ts               # Browser client (NEXT_PUBLIC_*)
│   ├── admin.ts                # Service role (server-only)
│   └── types.ts
├── lib/
│   ├── data/
│   │   └── courses.ts          # Replaces createServerFn getCourses
│   └── utils.ts
├── styles.css
└── types/
```

## Migration Phases

### Phase 1 — Scaffold (done)
- [x] Add `next`, `@tailwindcss/postcss`, `server-only`
- [x] Create `next.config.ts`, `postcss.config.mjs`, update `tsconfig.json`
- [x] Update `package.json` scripts (`dev`, `build`, `start`)

### Phase 2 — Shared Infrastructure (done)
- [x] `lib/data/courses.ts` — async server fetch (replaces `createServerFn`)
- [x] `integrations/supabase/admin.ts` — server-only admin client
- [x] Update browser Supabase client for `NEXT_PUBLIC_*` env vars
- [x] Add `"use client"` to Framer Motion / navigation components
- [x] Replace `@tanstack/react-router` `Link` → `next/link`

### Phase 3 — Route Migration (done)
1. **Root layout** — metadata from `__root.tsx`, dark mode, CSS import
2. **`/`** — RSC fetch courses, Suspense via `loading.tsx`
3. **`/courses`** — RSC fetch courses list
4. **`/analytics`** — static page (mock stats)
5. **`/settings`** — static placeholder

### Phase 4 — Cleanup (done)
- [x] Remove TanStack Start files (`src/routes/`, `router.tsx`, `server.ts`, `start.ts`, `vite.config.ts`)
- [x] Remove unused TanStack deps from `package.json`
- [x] Update `components.json` (`rsc: true`)
- [x] Update `.gitignore` for `.next/`

### Phase 5 — Future (optional)
- [ ] Add `@supabase/ssr` + middleware for auth cookies
- [ ] Consolidate `DashboardLayout` into `app/(dashboard)/layout.tsx`
- [ ] Wire `requireSupabaseAuth` equivalent in middleware
- [ ] Add login/signup routes

## Pattern Translations

| TanStack Start | Next.js App Router |
|----------------|-------------------|
| `createFileRoute("/")` | `app/page.tsx` default export |
| `head()` meta tags | `export const metadata` or `generateMetadata` |
| `loader` + `ensureQueryData` | `async function Page()` with `await getCourses()` |
| `useSuspenseQuery` | Direct RSC data fetch (or React Query + HydrationBoundary) |
| `createServerFn` | `lib/data/*.ts` with `import "server-only"` |
| `pendingComponent` | `loading.tsx` in route segment |
| `errorComponent` | `error.tsx` with `"use client"` |
| `notFoundComponent` | `not-found.tsx` |
| `@tanstack/react-router` Link | `next/link` |
| `useRouterState` pathname | `usePathname()` from `next/navigation` |

## Environment Variables

Rename in `.env`:

```env
# Client (public)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Server only
SUPABASE_SERVICE_ROLE_KEY=
```

Legacy `VITE_*` and `SUPABASE_URL` names are supported as fallbacks during transition.

## Verification

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Test each route: `/`, `/courses`, `/analytics`, `/settings`, and a bogus path for 404.
