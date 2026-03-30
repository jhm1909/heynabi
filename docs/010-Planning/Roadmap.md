---
id: ROADMAP-001
type: roadmap
status: draft
created: 2026-03-30
linked-to: [[PRD-HeyNabi]]
---

# Hey-Nabi Roadmap

> Incremental delivery, code quality above all else.
> **Stack:** TanStack Start (RC) + Supabase + Soniox + Gemini

## Phase 1: Foundation (MVP)

> **Goal:** A basic real-time translation web app that works reliably.

| # | Feature | Epic |
|---|---|---|
| 1.1 | Project setup (TanStack Start + Supabase) | [[Epic-ProjectSetup]] |
| 1.2 | Google OAuth login | [[Epic-Auth]] |
| 1.3 | Real-time STT (mic → transcript) | [[Epic-RealtimeSTT]] |
| 1.4 | AI Translation (transcript → streaming translation) | [[Epic-Translation]] |
| 1.5 | Landing page + App layout | [[Epic-UIFoundation]] |

**Outcome:** User signs in → starts mic → sees transcript + real-time translation.

---

## Phase 2: File Processing

> **Goal:** Upload audio/video → get transcript + translation.

| # | Feature | Epic |
|---|---|---|
| 2.1 | File upload (audio/video) | [[Epic-FileUpload]] |
| 2.2 | Batch transcription (Groq Whisper) | [[Epic-BatchSTT]] |
| 2.3 | Session history (save + review) | [[Epic-SessionHistory]] |

---

## Phase 3: Intelligence

> **Goal:** Smart study tools powered by AI.

| # | Feature | Epic |
|---|---|---|
| 3.1 | Keyword extraction | [[Epic-Keywords]] |
| 3.2 | Document summarization | [[Epic-Summarize]] |
| 3.3 | Personal glossary | [[Epic-Glossary]] |

---

## Phase 4: Polish & Scale

| # | Feature | Epic |
|---|---|---|
| 4.1 | Speaker diarization | [[Epic-Diarization]] |
| 4.2 | Document translation (PDF/DOCX) | [[Epic-DocumentTranslation]] |
| 4.3 | Export (PDF, SRT subtitles) | [[Epic-Export]] |

---

## Future (Post-MVP)

- Mobile app (Expo / React Native)
- Desktop app (Tauri — highly compatible with TanStack Start)
- Offline mode (whisper.cpp local)
- System audio capture
