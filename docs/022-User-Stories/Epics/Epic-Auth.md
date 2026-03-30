---
id: EPIC-002
type: epic
status: draft
created: 2026-03-30
linked-to: [[PRD-HeyNabi]]
---

# Epic: Authentication

## Summary

Google OAuth via Supabase Auth. Uses TanStack Start `createServerFn` and `beforeLoad` for secure route protection.

## Scope

**Included:**
- Supabase Auth with Google OAuth provider
- Login/Logout via `createServerFn` (server functions)
- Route protection via `beforeLoad` hook (type-safe)
- Auto-create user profile on signup (Supabase trigger)
- Session management (cookie-based, SSR-compatible)

**Excluded:**
- Email/password login
- Role-based access control

## Acceptance Criteria

- [ ] Click "Sign in with Google" → redirect → session created
- [ ] Routes under `/app/*` redirect to `/` if unauthenticated (via `beforeLoad`)
- [ ] Logout works and clears session
- [ ] User info displays correctly (avatar, name)
