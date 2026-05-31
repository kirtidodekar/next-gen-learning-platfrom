
# Next-Gen Learning Dashboard

A premium, dark-themed bento-grid dashboard with hardware-accelerated animations, server-side Supabase data fetching, and a slim collapsible sidebar — built on the project's supported stack (TanStack Start + Next-Gen Learning Platfrom Cloud), keeping every product requirement from the brief.

## 1. Backend (Next-Gen Learning Platfrom Cloud / Supabase)

Enable Next-Gen Learning Platfrom Cloud, then create a migration:

- Table `public.courses`
  - `id uuid pk default gen_random_uuid()`
  - `title text not null`
  - `progress int not null check (0..100)`
  - `icon_name text not null`
  - `created_at timestamptz default now()`
- `GRANT SELECT ON public.courses TO anon, authenticated;` + service_role all
- RLS enabled; public read policy (`USING (true)`) — courses are public catalog data
- Seed 4 rows: Advanced React Patterns/75/Layers, TypeScript Mastery/62/FileCode, Next.js Architecture/88/Boxes, Database Design/45/Database

## 2. Data layer (server-side fetching)

- `src/lib/courses.functions.ts` — `getCourses` via `createServerFn({ method: "GET" })` using `supabaseAdmin` (public read, no user context needed); returns typed `Course[]`
- `src/types/course.ts` — `Course` interface (strict types, no `any`)
- Route loader primes TanStack Query cache; component reads via `useSuspenseQuery` → no client-side course fetching, no loading flash, SSR-friendly

## 3. Design system (`src/styles.css`)

Replace tokens with the brief's dark palette (oklch equivalents):
- `--background` #09090B, `--secondary` #111827, `--card` #18181B
- Accents: `--violet`, `--indigo`, `--cyan`, `--emerald` + gradient tokens (`--gradient-hero`, `--gradient-mesh-1..4`)
- `--shadow-glow`, `--shadow-card`
- Subtle grain (SVG noise data URI as background utility)
- Force dark mode by adding `class="dark"` to `<html>` in `__root.tsx` shell

## 4. Routes (file-based)

- `src/routes/__root.tsx` — keep shell; add dark class, grain background, QueryClientProvider already present
- `src/routes/index.tsx` — Dashboard page; loader calls `ensureQueryData(coursesQueryOptions)`; renders `<DashboardLayout>`; `pendingComponent` = skeleton bento; `errorComponent` = "Unable to load dashboard data." + retry via `router.invalidate()`; `notFoundComponent`
- Stub routes so sidebar links don't 404: `courses.tsx`, `analytics.tsx`, `settings.tsx` (each with proper head() metadata, simple "Coming soon" content using same shell)

## 5. Components

Layout
- `components/dashboard/DashboardLayout.tsx` — `<main>` with `<aside>` + `<section>`; semantic HTML
- `components/dashboard/Sidebar.tsx` — slim collapsible sidebar, Lucide icons, Framer Motion `layoutId="active-nav"` pill for active indicator, hover animations; desktop expanded / tablet icon-only via Tailwind breakpoints; mobile → `BottomNav`
- `components/dashboard/BottomNav.tsx` — fixed bottom bar on `<md`

Bento tiles
- `components/dashboard/BentoGrid.tsx` — CSS grid with responsive column spans; `motion` parent with `staggerChildren`
- `components/dashboard/HeroTile.tsx` — "Welcome back, Alex", 🔥 12 Day Streak; animated gradient mesh background (motion divs), floating glow blobs, staggered entrance
- `components/dashboard/CourseCard.tsx` — dynamic Lucide icon resolved from `icon_name` via a typed map, title, progress %, Framer Motion progress bar animating `0 → progress` with spring, gradient-mesh background, hover scale 1.02 + border glow (spring 300/20), aria-label `"{title}, {progress}% complete"`
- `components/dashboard/ActivityTile.tsx` — 7×N GitHub-style contribution grid from deterministic mock data, staggered cell fade-in, hover scale + tooltip (Radix tooltip), responsive

Skeletons
- `components/dashboard/DashboardSkeleton.tsx` — same dimensions as real tiles, shimmer keyframe in styles.css, dark-mode safe

## 6. Animation strategy

- Page load: parent `motion.div` with `variants` + `staggerChildren: 0.06`; children animate `{opacity:0, y:20} → {opacity:1, y:0}`
- Card hover: `whileHover={{ scale: 1.02 }}` spring 300/20; border glow via animated gradient ring (transform/opacity only — no layout shift)
- Sidebar active indicator: `motion.div layoutId="active-nav"` shared element
- Progress bars: `motion.div` width animated via `initial={{width:0}} animate={{width: \`${p}%\`}}` with spring
- Hero: continuous gradient drift via `animate={{ backgroundPosition: [...] }}` + 2 floating glow blobs (transform-only)

## 7. Accessibility & responsive

- Keyboard nav on all interactive elements (real `<a>`/`<button>`)
- ARIA labels on icon-only sidebar buttons and progress bars (`role="progressbar"`, `aria-valuenow`)
- Focus-visible rings using `--ring`
- Breakpoints: `>1024px` full sidebar + multi-col bento; `768–1024px` icon sidebar + 2-col; `<768px` bottom nav + single col

## 8. Files created/modified

```
supabase/migrations/<ts>_courses.sql    (new)
src/styles.css                          (rewritten tokens)
src/types/course.ts                     (new)
src/lib/courses.functions.ts            (new)
src/lib/queries/courses.ts              (queryOptions)
src/routes/__root.tsx                   (dark class, grain)
src/routes/index.tsx                    (dashboard)
src/routes/courses.tsx                  (stub)
src/routes/analytics.tsx                (stub)
src/routes/settings.tsx                 (stub)
src/components/dashboard/*.tsx          (Sidebar, BottomNav, BentoGrid,
                                         HeroTile, CourseCard, ActivityTile,
                                         DashboardLayout, DashboardSkeleton)
```

## 9. Verification

- Build passes (auto-run)
- Navigate preview to `/`, confirm bento renders with 4 seeded courses, sidebar active indicator animates between routes, progress bars animate on mount, no layout shift on hover
- Check server-function-logs if courses fail to load

No `.env` setup required — Next-Gen Learning Platfrom Cloud auto-wires Supabase credentials. No README/deployment doc needed (Next-Gen Learning Platfrom handles publish).
