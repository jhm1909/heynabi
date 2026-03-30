---
id: SEQ-001
type: sequence
status: draft
created: 2026-03-30
linked-to: [[SDD-HeyNabi]]
---

# Sequence: Real-time Session

```mermaid
sequenceDiagram
    actor User
    participant UI as Browser UI
    participant SDK as Soniox SDK
    participant SC as Soniox Cloud
    participant SF as serverFn: translate
    participant AI as Gemini 2.5 Flash
    participant DB as Supabase

    User->>UI: Click "Start"
    UI->>SF: getSonioxToken()
    SF-->>UI: {token}
    UI->>SDK: init(token, lang)
    SDK->>SC: WebSocket connect

    loop Each utterance
        User->>SDK: Audio stream (mic)
        SDK->>SC: Audio chunks
        SC-->>SDK: Partial result
        SDK-->>UI: Display partial text
        SC-->>SDK: Final result
        SDK-->>UI: Display final text
        UI->>SF: translateText(text, src, tgt)
        SF->>AI: Stream request
        AI-->>SF: Stream response
        SF-->>UI: Stream translation
        UI->>DB: Save utterance
    end

    User->>UI: Click "Stop"
    UI->>SDK: stop()
    UI->>DB: Update session (ended_at)
```

## Notes

- **Soniox SDK** runs in browser, connects directly to Soniox Cloud
- **Token** fetched via server function to protect API key
- **Translation** runs in parallel with STT — doesn't wait for full paragraph
- **Save** happens after each final utterance
