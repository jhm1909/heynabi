---
id: STORY-001
type: story
status: draft
created: 2026-03-30
linked-to: [[Epic-ProjectSetup]]
complexity: M
---

# Story: Project Setup

**As a** developer, **I want** a properly structured TanStack Start project, **so that** I can build features with full type safety from day one.

## Acceptance Criteria

- [ ] TanStack Start initialized with TypeScript
- [ ] Tailwind CSS v4 + Shadcn UI configured
- [ ] Supabase client setup (browser + server)
- [ ] TanStack Query provider wired up
- [ ] Zustand store boilerplate created
- [ ] `($lang)` optional route segment works for i18n
- [ ] i18n message files for 5 locales (vi/en/ko/zh/ja)
- [ ] `.env` example with all required variables
- [ ] `npm run dev` and `npm run build` pass

## Tasks

- [ ] Run `npx @tanstack/start@latest create` with TypeScript + Tailwind
- [ ] Install: `@supabase/ssr`, `zustand`, `framer-motion`, `@tanstack/react-query`
- [ ] Create `src/lib/supabase/` (client.ts, server.ts)
- [ ] Create `src/lib/i18n/` (locale detection, message loader)
- [ ] Create `src/messages/{vi,en,ko,zh,ja}/common.json`
- [ ] Setup `($lang)` route layout with locale context
- [ ] Create `src/router.tsx`, `src/client.tsx`, `src/ssr.tsx`
- [ ] Init Shadcn UI
- [ ] Create feature folder skeleton
- [ ] Verify build passes
