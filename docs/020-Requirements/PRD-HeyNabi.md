---
id: PRD-001
type: prd
status: draft
created: 2026-03-30
linked-to: [[Roadmap]]
---

# PRD — Hey-Nabi

## Vision

A real-time translation platform for Asian language learners, prioritizing academic-quality AI translation.

## Target Audience

International students at universities in South Korea, Japan, and China who need help understanding lectures in foreign languages.

## Supported Languages

| Code | Language | Priority |
|---|---|---|
| `ko` | 한국어 (Korean) | Primary |
| `vi` | Tiếng Việt (Vietnamese) | Primary |
| `en` | English | Primary |
| `zh` | 中文 (Chinese) | Secondary |
| `ja` | 日本語 (Japanese) | Secondary |

## Technical Stack

| Layer | Technology |
|---|---|
| **Framework** | TanStack Start (RC) |
| **Router** | TanStack Router (file-based, type-safe) |
| **Server State** | TanStack Query v5 |
| **Build Engine** | Vinxi (Vite + Nitro) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS v4 + Shadcn UI |
| Client State | Zustand v5 |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase (PostgreSQL) |
| STT (real-time) | Soniox Client SDK |
| STT (batch) | Groq Whisper API |
| Translation | Google Gemini 2.5 Flash |
| i18n | Paraglide JS (or custom `($lang)` routing) |
| Animation | Framer Motion v12 |
| Deploy | Vercel / Cloudflare |

## Core Features (MVP — Phase 1 + 2)

| # | Feature | Epic | Phase |
|---|---|---|---|
| F1 | Project foundation | [[Epic-ProjectSetup]] | 1 |
| F2 | Google OAuth | [[Epic-Auth]] | 1 |
| F3 | Real-time STT | [[Epic-RealtimeSTT]] | 1 |
| F4 | AI Translation (streaming) | [[Epic-Translation]] | 1 |
| F5 | UI Foundation | [[Epic-UIFoundation]] | 1 |
| F6 | File upload & batch STT | [[Epic-FileUpload]] | 2 |
| F7 | Session history | [[Epic-SessionHistory]] | 2 |

## Constraints

- **Incremental delivery** — one feature at a time
- **Code quality first** — clean, tested, maintainable
- **Web-first** — mobile/desktop are future phases
- **No monetization yet** — focus on product
