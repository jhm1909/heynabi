---
id: TASK-Phase1
type: task-breakdown
status: draft
created: 2026-03-31
linked-to: [[PRD-HeyNabi]], [[SDD-HeyNabi]]
---

# Task Breakdown — Hey-Nabi Phase 1

> **Order:** Auth → UIFoundation → RealtimeSTT → Translation
> **Total:** 28 tasks | **Route syntax:** `{-$lang}` (not `($lang)`)

---

## Story-Auth (7 tasks) — Complexity: S

### AUTH-1: Supabase SQL Migration
- **Goal:** Create `profiles` table, RLS policies, and auto-profile trigger
- **Files:** `supabase/migrations/001_profiles.sql`
- **AC:** SQL ready for `supabase db push`

### AUTH-2: Sign-out Server Function
- **Goal:** Add `signOut()` to `server/auth.ts`
- **Files:** [MODIFY] `src/server/auth.ts`
- **AC:** Clears session, returns success

### AUTH-3: OAuth Callback Route
- **Goal:** Handle Google OAuth redirect
- **Files:** [NEW] `src/routes/{-$lang}/auth/callback.tsx`
- **AC:** Exchanges code for session, redirects to `/app`

### AUTH-4: Login Button Component
- **Goal:** "Sign in with Google" button using `supabase.auth.signInWithOAuth`
- **Files:** [NEW] `src/components/auth/login-button.tsx`
- **AC:** Redirects to Google OAuth flow

### AUTH-5: User Menu Component
- **Goal:** Avatar + name + logout dropdown
- **Files:** [NEW] `src/components/auth/user-menu.tsx`
- **Deps:** Shadcn `dropdown-menu`, `avatar`

### AUTH-6: Wire Login to Landing Page
- **Goal:** Add LoginButton to landing page CTA
- **Files:** [MODIFY] `src/routes/{-$lang}/index.tsx`
- **AC:** Clicking CTA starts OAuth flow

### AUTH-7: Wire User Menu to App Layout
- **Goal:** Add UserMenu to app header
- **Files:** [MODIFY] `src/routes/{-$lang}/app/route.tsx`
- **AC:** User info visible in authenticated layout

---

## Story-UIFoundation (8 tasks) — Complexity: M

### UI-1: Install Shadcn Components
- **Goal:** Add `card`, `dropdown-menu`, `avatar`, `sheet`, `separator`, `select`, `tooltip`
- **Command:** `npx shadcn@latest add card dropdown-menu avatar sheet separator select tooltip`

### UI-2: App Header Component
- **Goal:** Header with logo, nav links, theme toggle, user menu
- **Files:** [NEW] `src/components/layout/app-header.tsx`

### UI-3: App Sidebar Component
- **Goal:** Navigation sidebar with route links
- **Files:** [NEW] `src/components/layout/app-sidebar.tsx`

### UI-4: Mobile Navigation
- **Goal:** Sheet-based mobile nav (hamburger menu)
- **Files:** [NEW] `src/components/layout/mobile-nav.tsx`

### UI-5: Shared UI Components
- **Goal:** Loading spinner, ErrorBoundary, EmptyState
- **Files:** [NEW] `src/components/shared/loading.tsx`, `error-boundary.tsx`, `empty-state.tsx`

### UI-6: Full Landing Page
- **Goal:** Hero section + feature cards + CTA + dark/light
- **Files:** [MODIFY] `src/routes/{-$lang}/index.tsx`
- **AC:** Premium design with animations (Framer Motion)

### UI-7: Wire App Layout
- **Goal:** Integrate header + sidebar into app layout
- **Files:** [MODIFY] `src/routes/{-$lang}/app/route.tsx`

### UI-8: Theme Toggle
- **Goal:** Dark/light mode toggle persisted to localStorage
- **Files:** [NEW] `src/components/shared/theme-toggle.tsx`
- **Note:** `__root.tsx` already has `THEME_INIT_SCRIPT`

---

## Story-RealtimeSTT (7 tasks) — Complexity: L

### STT-1: Soniox Token Server Function
- **Goal:** Secure token endpoint using `SONIOX_API_KEY`
- **Files:** [NEW] `src/server/stt.ts`
- **AC:** Returns temporary auth token

### STT-2: Install Soniox SDK
- **Command:** `npm install soniox`
- **AC:** SDK available for client-side usage

### STT-3: Soniox Hook
- **Goal:** React hook managing WebSocket connection + mic stream
- **Files:** [NEW] `src/features/stt/hooks/use-soniox.ts`
- **AC:** Returns `{ start, stop, pause, partialText, finalTexts, status, error }`

### STT-4: Transcript Panel
- **Goal:** Display partial (faded) + final (bold) transcript text
- **Files:** [NEW] `src/components/session/transcript-panel.tsx`

### STT-5: Session Controls
- **Goal:** Start / Stop / Pause buttons with state management
- **Files:** [NEW] `src/components/session/session-controls.tsx`

### STT-6: Language Selector
- **Goal:** Source language dropdown (KO, EN, ZH, JA)
- **Files:** [NEW] `src/components/session/language-selector.tsx`

### STT-7: Error States
- **Goal:** Handle mic denied, connection lost, reconnect
- **Files:** [MODIFY] `src/features/stt/hooks/use-soniox.ts`
- **AC:** Error toasts + retry UX

---

## Story-Translation (6 tasks) — Complexity: M

### TRANS-1: Install AI SDK
- **Command:** `npm install @ai-sdk/google ai`

### TRANS-2: Translate Server Function
- **Goal:** Streaming translation via Gemini 2.5 Flash
- **Files:** [NEW] `src/server/translate.ts`
- **AC:** Returns streamed translation text

### TRANS-3: Academic Prompt
- **Goal:** System prompt for academic context translation
- **Files:** [NEW] `src/features/translation/prompts.ts`
- **AC:** Preserves technical terms, natural tone

### TRANS-4: Translation Hook
- **Goal:** React hook consuming streaming translation
- **Files:** [NEW] `src/features/translation/hooks/use-translation.ts`
- **AC:** Returns `{ translate, translatedText, isTranslating, error }`

### TRANS-5: Translation Panel
- **Goal:** Display streaming translation beside transcript
- **Files:** [NEW] `src/components/session/translation-panel.tsx`

### TRANS-6: Wire STT → Translation
- **Goal:** Auto-translate when STT produces final text
- **Files:** [MODIFY] `src/routes/{-$lang}/app/session/index.tsx`
- **AC:** Final transcript → immediate translation stream
