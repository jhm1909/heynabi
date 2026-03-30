---
id: STORY-003
type: story
status: draft
created: 2026-03-30
linked-to: [[Epic-RealtimeSTT]]
complexity: L
---

# Story: Real-time Speech-to-Text

**As a** student, **I want** to speak into my microphone and see text appear in real-time, **so that** I can follow along with the lecture.

## Acceptance Criteria

- [ ] Mic permission requested on "Start" click
- [ ] Partial transcript shown (faded text — still speaking)
- [ ] Final transcript fixed (bold text — sentence complete)
- [ ] Source language selectable: KO, EN, ZH, JA
- [ ] Start / Stop / Pause controls
- [ ] Error states: mic denied, connection lost, reconnect
- [ ] Token fetched securely from server function

## Tasks

- [ ] Create `server/stt.ts` with `getSonioxToken()` server function
- [ ] Install Soniox Client SDK
- [ ] Create `features/stt/hooks/use-soniox.ts`
- [ ] Create `components/session/transcript-panel.tsx`
- [ ] Create `components/session/session-controls.tsx`
- [ ] Create `components/session/language-selector.tsx`
- [ ] Handle mic permission + error states
