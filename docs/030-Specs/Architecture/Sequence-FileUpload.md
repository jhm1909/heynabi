---
id: SEQ-002
type: sequence
status: draft
created: 2026-03-30
linked-to: [[SDD-HeyNabi]]
---

# Sequence: File Upload

```mermaid
sequenceDiagram
    actor User
    participant UI as Browser UI
    participant SF_T as serverFn: transcribe
    participant GROQ as Groq Whisper
    participant SF_TR as serverFn: translate
    participant AI as Gemini 2.5 Flash
    participant DB as Supabase

    User->>UI: Upload audio/video file
    UI->>UI: Validate (format, size)
    UI->>SF_T: transcribeFile(file)
    SF_T->>GROQ: Send audio
    GROQ-->>SF_T: {text, segments[]}
    SF_T-->>UI: Full transcript

    UI->>SF_TR: translateText(text, src, tgt)
    SF_TR->>AI: Stream request
    AI-->>SF_TR: Stream response
    SF_TR-->>UI: Stream translation

    UI->>DB: Save session + utterances
    UI-->>User: Display transcript + translation
```

## Notes

- **Max file size:** 25MB (Groq limit)
- **Supported formats:** mp3, mp4, m4a, wav, webm
- **Groq Whisper:** ~228x real-time speed
- **Translation:** runs after full transcript is ready
