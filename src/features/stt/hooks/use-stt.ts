import type { SttStatus, SttHookResult } from '../lib/types'
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
 * Only the selected engine is enabled — others skip initialization.
 *
 * - deepgram: Deepgram Nova-3, $200 free credit (default)
 * - soniox: Premium quality, requires API key + credits
 * - web-speech: Free, built-in Chrome/Edge (fallback)
 */
export function useStt({ engine, language, onFinalText }: UseSttOptions) {
    const deepgram = useDeepgram({ language, onFinalText, enabled: engine === 'deepgram' })
    const soniox = useSoniox({ language, onFinalText, enabled: engine === 'soniox' })
    const webSpeech = useWebSpeech({ language, onFinalText, enabled: engine === 'web-speech' })

    const active: SttHookResult =
        engine === 'deepgram' ? deepgram
            : engine === 'soniox' ? soniox
                : webSpeech

    return {
        ...active,
        engine,
    } as SttHookResult & { engine: SttEngine }
}
