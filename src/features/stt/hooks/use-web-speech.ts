import { useCallback, useEffect, useRef, useState } from 'react'
import { useSessionStore } from '#/stores/session-store'
import type { SttStatus } from '../lib/types'

export type { SttStatus }

interface UseWebSpeechOptions {
    language?: string
    onFinalText?: (text: string) => void
    enabled?: boolean
}

// Language code mapping for Web Speech API (BCP-47)
const LANG_MAP: Record<string, string> = {
    vi: 'vi-VN',
    ko: 'ko-KR',
    en: 'en-US',
    zh: 'zh-CN',
    ja: 'ja-JP',
}

/**
 * Free STT using the browser's built-in Web Speech API.
 * Works in Chrome/Edge. No API key required.
 * Same interface as useSoniox for drop-in replacement.
 */
export function useWebSpeech(options: UseWebSpeechOptions = {}) {
    const { language = 'ko', enabled = true } = options
    const [status, setStatus] = useState<SttStatus>('idle')
    const [error, setError] = useState<string | null>(null)

    const recognitionRef = useRef<SpeechRecognition | null>(null)
    const languageRef = useRef(language)
    const statusRef = useRef<SttStatus>(status)

    useEffect(() => {
        languageRef.current = language
    }, [language])

    useEffect(() => {
        statusRef.current = status
    }, [status])

    const store = useSessionStore()

    const cleanup = useCallback(() => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop() } catch { /* ignore */ }
            recognitionRef.current = null
        }
        store.setRecording(false)
    }, [store])

    const start = useCallback(async () => {
        if (!enabled) return
        try {
            // Check browser support — runtime feature detection
            /* eslint-disable @typescript-eslint/no-unnecessary-condition */
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition
            if (!SpeechRecognition) {
                setError('Web Speech API is not supported in this browser. Use Chrome or Edge.')
                setStatus('error')
                return
            }
            /* eslint-enable @typescript-eslint/no-unnecessary-condition */

            setStatus('connecting')
            setError(null)

            const recognition = new SpeechRecognition()
            recognitionRef.current = recognition

            // Configure
            recognition.lang = LANG_MAP[languageRef.current] ?? languageRef.current
            recognition.continuous = true
            recognition.interimResults = true
            recognition.maxAlternatives = 1

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let interimTranscript = ''
                let finalTranscript = ''

                console.debug('[STT] onresult event:', {
                    resultIndex: event.resultIndex,
                    resultsLength: event.results.length,
                })

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i]
                    const transcript = result[0].transcript

                    console.debug(`[STT] result[${i}]:`, {
                        isFinal: result.isFinal,
                        transcript,
                        confidence: result[0].confidence,
                    })

                    if (result.isFinal) {
                        finalTranscript += transcript
                    } else {
                        interimTranscript += transcript
                    }
                }

                if (finalTranscript.trim()) {
                    console.debug('[STT] ✅ Final transcript:', finalTranscript.trim())
                    store.setPartialText('')
                    store.addFinalText(finalTranscript.trim(), '')
                    options.onFinalText?.(finalTranscript.trim())
                }

                if (interimTranscript) {
                    console.debug('[STT] 📝 Interim:', interimTranscript)
                    store.setPartialText(interimTranscript)
                }
            }

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.debug('[STT] ❌ onerror:', event.error)
                if (event.error === 'not-allowed') {
                    setError('Microphone access denied. Please allow mic access.')
                } else if (event.error === 'no-speech') {
                    // Ignore — happens when user is silent
                    return
                } else if (event.error === 'aborted') {
                    return
                } else {
                    setError(`Speech recognition error: ${event.error}`)
                }
                setStatus('error')
                cleanup()
            }

            recognition.onend = () => {
                console.debug('[STT] 🔚 onend, statusRef:', statusRef.current)
                // Auto-restart if still recording (Web Speech API stops after silence)
                if (statusRef.current === 'recording' && recognitionRef.current) {
                    try {
                        recognition.start()
                    } catch {
                        setStatus('idle')
                        cleanup()
                    }
                }
            }

            recognition.onstart = () => {
                console.debug('[STT] 🟢 onstart — recognition active, lang:', recognition.lang)
                setStatus('recording')
                store.setRecording(true)
            }

            recognition.start()
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to start speech recognition',
            )
            setStatus('error')
            store.setRecording(false)
        }
    }, [store, cleanup, options.onFinalText, status])

    const stop = useCallback(() => {
        store.setPartialText('')
        cleanup()
        setStatus('idle')
    }, [cleanup, store])

    const pause = useCallback(() => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop() } catch { /* ignore */ }
        }
        setStatus('paused')
        store.setPaused(true)
    }, [store])

    const resume = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start()
            } catch { /* ignore */ }
        }
        setStatus('recording')
        store.setPaused(false)
    }, [store])

    return { start, stop, pause, resume, status, error }
}
