---
id: EPIC-003
type: epic
status: draft
created: 2026-03-30
linked-to: [[PRD-HeyNabi]]
---

# Epic: Real-time STT

## Summary

Enable microphone → Soniox Client SDK converts speech to text in real-time.

## Scope

**Included:**
- Soniox Client SDK (browser-side WebSocket)
- Token endpoint via `createServerFn` (protects API key)
- Microphone permission request + audio stream
- Partial + final transcript display
- Language selection (ko/en/zh/ja)
- Start/Stop/Pause controls

**Excluded:**
- System audio capture (desktop only, future)
- Speaker diarization (Phase 4)

## Acceptance Criteria

- [ ] Enable mic → real-time transcript appears
- [ ] Partial results shown (faded text), final results fixed (bold text)
- [ ] Switching source language works seamlessly
- [ ] Pause/Resume is smooth with no data loss
