# Hey Nabi

Real-time lecture translation platform for international students. Listen to lectures in Korean, Chinese, or Japanese — read the translation in your language instantly.

## Architecture

```
Browser (mic)
  → AudioWorklet (PCM 16kHz, 100ms chunks)
  → WebSocket → Deepgram Nova-3 (STT)
  → SentenceBoundaryDetector (smart buffering + commit)
  → Zustand store
  → Gemini Flash (AI translation with spacing correction)
  → Interleaved UI (original + translation)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | TanStack Start (React 19 + SSR + file-based routing) |
| Styling | Tailwind CSS v4 + Shadcn UI + Framer Motion |
| State | Zustand |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| AI Translation | Google Gemini Flash via Vercel AI SDK |
| STT | Deepgram Nova-3 (primary), Soniox, Web Speech API |
| Validation | Zod |
| Build | Vite |

### Project Structure

```
src/
  features/
    stt/
      hooks/       — React hooks (use-deepgram, use-soniox, use-web-speech, use-stt)
      lib/         — Audio pipeline, WebSocket management, shared types
    translation/
      hooks/       — useTranslation hook
      prompts.ts   — Gemini translation prompts
  components/
    auth/          — Login, user menu
    landing/       — Landing page components
    layout/        — App shell (header, sidebar, mobile nav)
    session/       — Session controls, panels, language selector
    shared/        — Reusable UI (empty state, loading, search)
    ui/            — Shadcn primitives
  server/          — TanStack server functions (auth, translate, sessions, export, STT tokens)
  stores/          — Zustand stores
  lib/             — Utilities (i18n, Supabase client, sentence boundary, Korean spacing)
  routes/          — File-based routing (/{lang}/app/...)
  types/           — TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# Client-side (exposed to browser)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Server-side only
GEMINI_API_KEY=your-gemini-key
SONIOX_API_KEY=your-soniox-key
DEEPGRAM_API_KEY=your-deepgram-key
DEEPGRAM_PROJECT_ID=your-deepgram-project-id  # Required for production (scoped keys)
```

### Development

```bash
npm install
npm run dev
```

App runs at http://localhost:3000.

### Database

Supabase migrations are in `supabase/migrations/`. Apply them via the Supabase CLI:

```bash
npx supabase db push
```

### Testing

```bash
npm run test
```

### Linting & Formatting

```bash
npm run lint       # Check
npm run check      # Auto-fix
```

## Supported Languages

Korean, Vietnamese, English, Chinese, Japanese

## STT Engines

| Engine | Quality | Cost | Notes |
|--------|---------|------|-------|
| Deepgram Nova-3 | High | $200 free credit | Default, multilingual |
| Soniox | Highest | Paid | Best Korean accuracy |
| Web Speech API | Basic | Free | Chrome/Edge only, fallback |

## License

ISC
