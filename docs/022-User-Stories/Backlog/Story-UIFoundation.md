---
id: STORY-005
type: story
status: draft
created: 2026-03-30
linked-to: [[Epic-UIFoundation]]
complexity: M
---

# Story: UI Foundation

**As a** user, **I want** a clean, modern interface, **so that** I can easily navigate and use the translation tool.

## Acceptance Criteria

- [ ] Landing page: hero section, feature highlights, CTA login
- [ ] App layout: sidebar navigation + header with user info
- [ ] Session page: dual-panel (transcript | translation) side by side
- [ ] Dark/Light mode toggle
- [ ] Responsive: mobile stacks vertically, desktop side by side
- [ ] Smooth transitions (Framer Motion)
- [ ] Loading, error, empty states

## Tasks

- [ ] Create `routes/($lang)/index.tsx` (landing page)
- [ ] Create `routes/($lang)/app/route.tsx` (app layout with sidebar + header)
- [ ] Create `components/layout/header.tsx`
- [ ] Create `components/layout/sidebar.tsx`
- [ ] Create `routes/($lang)/app/session/index.tsx` (session page)
- [ ] Setup dark/light mode (theme context)
- [ ] Create `components/shared/` (Loading, Error, EmptyState)
