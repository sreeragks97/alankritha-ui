# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Next.js dev server (App Router)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint (flat config, eslint.config.mjs, extends next/core-web-vitals + next/typescript)
```

No test runner is configured. Stack: Next.js 16, React 19, TypeScript (strict), Tailwind CSS v4 (`@tailwindcss/postcss`), Supabase, TanStack Query, react-hook-form + Zod.

## Path alias quirk

`@/*` resolves to **two roots in order**: `./src/*` then `./*` (see `tsconfig.json`). So there are two parallel trees:
- `@/src/...` → the `src/` tree (services, repositories, validators, Supabase clients, DB types).
- `@/types/...`, `@/lib/...`, `@/components/...`, `@/utils/...`, `@/data/...`, `@/hooks/...` → root-level dirs.

When an import like `@/types/product` resolves, it's the root `types/`, not `src/types/`. Both `types/` (UI types) and `src/types/database.ts` (DB row types) exist — don't confuse them.

## Data layer architecture (`src/`)

Server data flows through a layered stack, each layer in its own directory:

1. **Validators** (`src/validators/*Schema.ts`) — Zod schemas; services call `.parse()` on input before writes.
2. **Repositories** (`src/repositories/*Repository.ts`) — the only place that touches Supabase tables. Constructed with a `SupabaseClient`. Every query passes its error through `assertNoError(error, message, code, status)` (`src/repositories/helpers.ts`), which throws an `AppError`.
3. **Services** (`src/services/*Service.ts`) — business logic (uniqueness checks, etc.). Instantiate via the static `Service.fromClient(client)` factory, which wires up the repository.
4. **Consumers**:
   - **Server Components / route handlers** call `getServerServices()` (`src/services/server.ts`), which builds every service from the cookie-aware server client.
   - **Client Components** use React Query hooks in `src/hooks/use*.ts`, which build services from the browser client. Query keys are centralized in `src/hooks/queryKeys.ts`; mutations invalidate by top-level key.

Errors are `AppError` (`src/utils/AppError.ts`) carrying `code` + `status`.

## Supabase clients & auth

Three client builders (all in `src/lib/`):
- `supabase.ts` — `getSupabaseBrowserClient()`, a memoized singleton for client components.
- `supabase-server.ts` — `getSupabaseServerClient()`, cookie-bound, async, for RSC/route handlers.
- `supabase-middleware.ts` — `updateSupabaseSession()`, refreshes the session in middleware.

`middleware.ts` guards `/admin/*` (matcher) — except `/admin/login`. It verifies a logged-in user, then reads the `profiles` table and requires `role` of `admin` or `super_admin`, else redirects to `/`. It also permanently redirects legacy `/admin/whatsapp-leads` → `/admin/leads`.

## DB types vs UI types — mapping boundary

Database row types live in `src/types/database.ts` (`Category`, `ProductWithRelations`, `Banner`, `TableInsert<>`, `TableUpdate<>`). The UI/components consume different shapes in `types/product.ts`, `types/admin.ts`, `types/catalog.ts`. Convert between them with the mappers:
- `src/utils/uiMappers.ts` — DB row → public UI type (e.g. `mapProductToUiProduct`, which sorts images by `sort_order` and flattens relations).
- `src/utils/adminMappers.ts` — DB row → admin UI type.

When adding a field end-to-end you typically touch: validator schema → repository → service → mapper → UI type → component.

## Legacy static-JSON layer (being superseded)

`lib/data.ts` and `lib/admin/repository.ts` (`MockAdminRepository`) read from static `data/*.json` / `data/admin/*.json`. The live pages (home, category, admin) now use the Supabase services above. Treat the JSON layer as legacy/seed data — prefer the `src/` service stack for new work.

## Cloudinary images

Uploads are **client-side, unsigned**: `ImageUploader` → `CloudinaryService` posts directly to Cloudinary using `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` + `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. Deletion is server-side and **signed**: `app/api/cloudinary/delete/route.ts` signs a `destroy` call with `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` (server-only secrets).

## Environment variables

`src/lib/env.ts` (`getPublicEnv` / `getServerEnv`) is the single accessor and throws on missing required vars:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (required)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (required), `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (optional)
- `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (server-only, read directly in the delete route)

## Component layout

- `components/ui/{image,loading,states}/` — reusable primitives (`OptimizedImage`, skeletons/shimmers, empty/error states), each with a barrel `index.ts`.
- `components/admin/{layout,ui,product}/` — admin dashboard shell, tables/modals/drawers, product form + image uploader.
- `components/catalog/`, `components/common/`, `components/layout/` — storefront pieces (filters, product cards, header/footer chrome).
