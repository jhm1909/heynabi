---
id: STORY-004
type: story
status: draft
created: 2026-03-30
linked-to: [[Epic-Translation]]
complexity: M
---

# Story: AI Translation

**As a** student, **I want** the transcript to be automatically translated to my language, **so that** I understand the lecture content immediately.

## Acceptance Criteria

- [ ] Transcript text → streaming translation on UI
- [ ] Target language selectable: VI, EN, KO, ZH, JA
- [ ] Technical terms preserved with transliteration
- [ ] First token latency < 2 seconds
- [ ] Error handling when Gemini API fails
- [ ] Translation panel beside transcript panel

## Tasks

- [ ] Install `@ai-sdk/google` and `ai`
- [ ] Create `server/translate.ts` with `translateText()` server function
- [ ] Create `features/translation/prompts.ts` (academic system prompt)
- [ ] Create `features/translation/hooks/use-translation.ts`
- [ ] Create `components/session/translation-panel.tsx`
- [ ] Wire: STT final result → auto-translate → display
