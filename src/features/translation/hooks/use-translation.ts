import { useCallback, useRef, useState } from 'react'
import { translateText } from '#/server/translate'

interface UseTranslationOptions {
    sourceLang: string
    targetLang: string
}

export interface TranslationEntry {
    original: string
    translated: string | null // null = still translating
}

export function useTranslation({ sourceLang, targetLang }: UseTranslationOptions) {
    const [entries, setEntries] = useState<TranslationEntry[]>([])
    const [isTranslating, setIsTranslating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Stable index counter — avoids stale closure from entries.length in deps
    const nextIdxRef = useRef(0)

    const translate = useCallback(
        async (text: string) => {
            if (!text.trim()) return

            // Reserve a slot immediately so order is preserved
            const idx = nextIdxRef.current++
            setEntries((prev) => [
                ...prev,
                { original: text, translated: null },
            ])

            try {
                setIsTranslating(true)
                setError(null)

                const { translation, correctedOriginal } = await translateText({
                    data: { text, sourceLang, targetLang },
                })

                // Update the reserved slot with the result + corrected spacing
                setEntries((prev) =>
                    prev.map((e, i) =>
                        i === idx
                            ? { ...e, original: correctedOriginal ?? e.original, translated: translation }
                            : e,
                    ),
                )
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Translation failed',
                )
                // Mark as failed so spinner disappears
                setEntries((prev) =>
                    prev.map((e, i) =>
                        i === idx ? { ...e, translated: 'Translation failed' } : e,
                    ),
                )
            } finally {
                setIsTranslating(false)
            }
        },
        [sourceLang, targetLang],
    )

    // Keep backward compat: single concatenated string
    const translatedText = entries
        .map((e) => e.translated ?? '')
        .filter(Boolean)
        .join('\n')

    const reset = useCallback(() => {
        setEntries([])
        setError(null)
    }, [])

    return {
        translate,
        entries,
        translatedText,
        isTranslating,
        error,
        reset,
    }
}
