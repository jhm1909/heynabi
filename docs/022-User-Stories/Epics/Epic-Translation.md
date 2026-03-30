---
id: EPIC-004
type: epic
status: draft
created: 2026-03-30
linked-to: [[PRD-HeyNabi]]
---

# Epic: AI Translation

## Summary

Transcript → Gemini 2.5 Flash → streaming translation. Uses `createServerFn` for secure API calls.

## Scope

**Included:**
- Server function for translation (Gemini 2.5 Flash)
- Streaming response to client
- Custom system prompt for academic-quality translation
- Source/Target language pair selection
- Preserves technical terms with original pronunciation

**Excluded:**
- Document translation (Phase 4)
- Offline translation (Future)

## Acceptance Criteria

- [ ] Transcript text → streaming translation on UI
- [ ] KO→VI, KO→EN, EN→VI, JA→VI, ZH→VI all work
- [ ] Technical/academic terms preserved with transliteration
- [ ] First token latency < 2 seconds
