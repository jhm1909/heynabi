import type { SttStatus } from './use-soniox'
import { useDeepgram } from './use-deepgram'
import { useSoniox } from './use-soniox'
import { useWebSpeech } from './use-web-speech'

export type SttEngine = 'web-speech' | 'soniox' | 'deepgram'

interface UseSttOptions {
    engine: SttEngine
    language?: string
    onFinalText?: (text: string) => void
}

/**
 * Unified STT hook that switches between engines.
 * - deepgram: Deepgram Nova-3, $200 free credit (default)
 * - soniox: Premium quality, requires API key + credits
 * - web-speech: Free, built-in Chrome/Edge (fallback)
 */
export function useStt({ engine, language, onFinalText }: UseSttOptions) {
    const deepgram = useDeepgram({ language, onFinalText })
    const soniox = useSoniox({ language, onFinalText })
    const webSpeech = useWebSpeech({ language, onFinalText })

    // Return the active engine's interface
    const active = engine === 'deepgram'
        ? deepgram
        : engine === 'soniox'
            ? soniox
            : webSpeech

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
