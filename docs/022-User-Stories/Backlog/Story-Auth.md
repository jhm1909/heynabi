---
id: STORY-002
type: story
status: draft
created: 2026-03-30
linked-to: [[Epic-Auth]]
complexity: S
---

# Story: Google Authentication

**As a** user, **I want** to sign in with my Google account, **so that** my translation history and preferences are saved securely.

## Acceptance Criteria

- [ ] "Sign in with Google" button on landing page
- [ ] OAuth redirect → callback → session created
- [ ] Protected routes redirect to landing if unauthenticated (via `beforeLoad`)
- [ ] User avatar + name displayed in header
- [ ] Logout clears session and redirects
- [ ] Profile row auto-created on first login (Supabase trigger)

## Tasks

- [ ] Configure Supabase Auth Google provider in dashboard
- [ ] Create `server/auth.ts` with `getUser()`, `signOut()` server functions
- [ ] Create `routes/auth/callback.tsx` for OAuth callback
- [ ] Add `beforeLoad` guard in `routes/($lang)/app/route.tsx`
- [ ] Create login button component using `supabase.auth.signInWithOAuth`
- [ ] Add user info to Header component
- [ ] Create Supabase trigger: `on auth.users insert → create profile`
