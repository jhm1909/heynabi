---
id: EPIC-001
type: epic
status: draft
created: 2026-03-30
linked-to: [[PRD-HeyNabi]]
---

# Epic: Project Setup

## Summary

Initialize TanStack Start project, configure Supabase, i18n routing, and core tooling.

## Scope

**Included:**
- TanStack Start via CLI (`npx @tanstack/start@latest create`)
- TanStack Router (file-based, type-safe)
- TanStack Query v5 (server state management)
- Tailwind CSS v4 + Shadcn UI
- Zustand v5 (client state)
- Supabase client setup (`@supabase/ssr`)
- i18n routing via `($lang)` optional segment
- Paraglide JS (or custom i18n loader)
- i18n message files (vi/en/ko/zh/ja)
- `.env` configuration
- ESLint + Prettier

**Excluded:**
- Auth logic (see [[Epic-Auth]])
- UI pages (see [[Epic-UIFoundation]])

## Acceptance Criteria

- [ ] `npm run dev` runs successfully
- [ ] `npm run build` passes with no errors
- [ ] File-based routing works (`/`, `/about`)
- [ ] i18n routing works (`/vi/`, `/en/`, `/ko/`)
- [ ] Supabase connection is functional
- [ ] Route tree auto-generated with full type safety
