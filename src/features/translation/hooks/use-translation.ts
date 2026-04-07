import { useCallback, useRef, useState } from 'react'
import { translateText } from '#/server/translate'

interface UseTranslationOptions {
    sourceLang: string
    targetLang: string
}

export interface TranslationEntry {
    id: number
    original: string
    translated: string | null // null = still translating
}

/**
 * Hook for managing translation requests.
 *
 * Uses a monotonic ID to match translation responses to their slots,
 * preventing race conditions when multiple translations are in-flight.
 */
export function useTranslation({ sourceLang, targetLang }: UseTranslationOptions) {
    const [entries, setEntries] = useState<TranslationEntry[]>([])
    const [isTranslating, setIsTranslating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Monotonic ID counter — survives re-renders, used to match responses to slots
    const nextIdRef = useRef(0)

    const translate = useCallback(
        async (text: string) => {
            if (!text.trim()) return

            // Reserve a slot with a unique ID
            const id = nextIdRef.current++
            setEntries((prev) => [
                ...prev,
                { id, original: text, translated: null },
            ])

            try {
                setIsTranslating(true)
                setError(null)

                const { translation, correctedOriginal } = await translateText({
                    data: { text, sourceLang, targetLang },
                })

                // Update by ID instead of array index — safe against concurrent mutations
                setEntries((prev) =>
                    prev.map((e) =>
                        e.id === id
                            ? { ...e, original: correctedOriginal ?? e.original, translated: translation }
                            : e,
                    ),
                )
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Translation failed',
                )
                setEntries((prev) =>
                    prev.map((e) =>
                        e.id === id ? { ...e, translated: 'Translation failed' } : e,
                    ),
                )
            } finally {
                setIsTranslating(false)
            }
        },
        [sourceLang, targetLang],
    )

    const reset = useCallback(() => {
        setEntries([])
        nextIdRef.current = 0
        setError(null)
    }, [])

    return {
        translate,
        entries,
        isTranslating,
        error,
        reset,
    }
}
