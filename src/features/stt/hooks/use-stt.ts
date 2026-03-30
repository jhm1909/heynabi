import type { SttStatus } from './use-soniox'
import { useSoniox } from './use-soniox'
import { useWebSpeech } from './use-web-speech'

export type SttEngine = 'web-speech' | 'soniox'

interface UseSttOptions {
    engine: SttEngine
    language?: string
    onFinalText?: (text: string) => void
}

/**
 * Unified STT hook that switches between engines.
 * - web-speech: Free, built-in Chrome/Edge (default)
 * - soniox: Premium quality, requires API key + credits
 */
export function useStt({ engine, language, onFinalText }: UseSttOptions) {
    const soniox = useSoniox({ language, onFinalText })
    const webSpeech = useWebSpeech({ language, onFinalText })

    // Return the active engine's interface
    const active = engine === 'soniox' ? soniox : webSpeech

    return {
        ...active,
        engine,
    } as {
        start: () => Promise<void>
        stop: () => void
        pause: () => void
        resume: () => void
        status: SttStatus
        error: string | null
        engine: SttEngine
    }
}
