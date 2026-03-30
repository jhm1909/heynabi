import { useCallback, useState } from 'react'
import { translateText } from '#/server/translate'

interface UseTranslationOptions {
    sourceLang: string
    targetLang: string
}

export function useTranslation({ sourceLang, targetLang }: UseTranslationOptions) {
    const [translatedText, setTranslatedText] = useState('')
    const [isTranslating, setIsTranslating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const translate = useCallback(
        async (text: string) => {
            if (!text.trim()) return

            try {
                setIsTranslating(true)
                setError(null)

                const { translation } = await translateText({
                    data: { text, sourceLang, targetLang },
                })

                setTranslatedText((prev) =>
                    prev ? `${prev}\n${translation}` : translation,
                )
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Translation failed',
                )
            } finally {
                setIsTranslating(false)
            }
        },
        [sourceLang, targetLang],
    )

    const reset = useCallback(() => {
        setTranslatedText('')
        setError(null)
    }, [])

    return {
        translate,
        translatedText,
        isTranslating,
        error,
        reset,
    }
}
