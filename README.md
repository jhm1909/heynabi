# Hey Nabi 🦋

> Real-time lecture translation for international students.
> Listen in Korean, Chinese, or Japanese — read in your language, instantly.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TanStack_Start-SSR-orange" alt="TanStack Start" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Gemini_Flash-AI-yellow?logo=google" alt="Gemini" />
  <img src="https://img.shields.io/badge/Deepgram-STT-purple" alt="Deepgram" />
</p>

---

## How It Works

```
🎤 Browser Mic
 → AudioWorklet (PCM 16kHz, 100ms chunks)
 → WebSocket → Deepgram Nova-3 (Speech-to-Text)
 → SentenceBoundaryDetector (smart buffering + commit)
 → Zustand Store
 → Gemini Flash (AI translation + spacing correction)
 → Interleaved UI (original ↔ translation)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | TanStack Start (React 19 + SSR + file-based routing) |
| **Styling** | Tailwind CSS v4 + Shadcn UI + Framer Motion |
| **State** | Zustand |
| **Database** | Supabase (PostgreSQL + Auth + RLS) |
| **AI Translation** | Google Gemini Flash via Vercel AI SDK |
| **STT** | Deepgram Nova-3 (primary) · Soniox · Web Speech API |
| **Validation** | Zod |
| **Build** | Vite |
| **Testing** | Vitest |

## Supported Languages

| Language | Code | UI | STT Source | Translation Target |
|----------|------|:--:|:----------:|:------------------:|
| Tiếng Việt | `vi` | ✅ | — | ✅ |
| English | `en` | ✅ | — | ✅ |
| 한국어 | `ko` | ✅ | ✅ | ✅ |
| 中文 | `zh` | ✅ | ✅ | ✅ |
| 日本語 | `ja` | ✅ | ✅ | ✅ |

## Project Structure

```
src/
├── features/
│   ├── stt/              # Speech-to-text pipeline
│   │   ├── hooks/        # use-deepgram, use-soniox, use-web-speech, use-stt
│   │   └── lib/          # Audio pipeline, WebSocket, shared types
│   └── translation/
│       ├── hooks/        # useTranslation hook
│       └── prompts.ts    # Gemini translation prompts
├── components/
│   ├── auth/             # Login, user menu
│   ├── landing/          # Landing page
│   ├── layout/           # App shell (header, sidebar, mobile nav)
│   ├── session/          # Session controls, panels, language selector
│   ├── shared/           # Reusable UI (empty state, loading, search)
│   └── ui/               # Shadcn primitives
├── server/               # TanStack server functions (auth, translate, sessions, export, STT tokens)
├── stores/               # Zustand stores
├── lib/                  # Utilities (i18n, Supabase client, sentence boundary, Korean spacing)
├── routes/               # File-based routing (/{lang}/app/...)
└── types/                # TypeScript type definitions
```

## Getting Started

### Prerequisites

- **Node.js** 20+
- **npm**

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
```

Fill in `.env`:

```bash
# Client-side (exposed to browser)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Server-side only
GEMINI_API_KEY=your-gemini-key
SONIOX_API_KEY=your-soniox-key
DEEPGRAM_API_KEY=your-deepgram-key
DEEPGRAM_PROJECT_ID=your-deepgram-project-id
```

```bash
# 3. Apply database migrations
npx supabase db push

# 4. Start dev server
npm run dev
```

App runs at **http://localhost:3000**

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests (Vitest) |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier check |
| `npm run check` | Auto-fix (Prettier + ESLint) |

## STT Engines

| Engine | Quality | Cost | Notes |
|--------|---------|------|-------|
| **Deepgram Nova-3** | High | $200 free credit | Default, multilingual |
| **Soniox** | Highest | Paid | Best Korean accuracy |
| **Web Speech API** | Basic | Free | Chrome/Edge only, fallback |

## License

ISC
