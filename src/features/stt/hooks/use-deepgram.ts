import { useCallback, useEffect, useRef, useState } from 'react'
import { getDeepgramToken } from '#/server/stt-deepgram'
import { useSessionStore } from '#/stores/session-store'
import { SentenceBoundaryDetector } from '#/lib/sentence-boundary'
import type { DeepgramWord } from '#/lib/sentence-boundary'

export type SttStatus = 'idle' | 'connecting' | 'recording' | 'paused' | 'error'

interface UseDeepgramOptions {
    language?: string
    /** Custom keyterms to boost recognition (max 100) */
    keyterms?: string[]
    onFinalText?: (text: string) => void
}

const DG_WS_BASE = 'wss://api.deepgram.com/v1/listen'
const MAX_RECONNECT_RETRIES = 3
const RECONNECT_BASE_DELAY = 1000 // ms

// Default academic Korean keyterms
const DEFAULT_KEYTERMS = [
    '알고리즘', '데이터베이스', '프레젠테이션', '과제', '시험',
    '교수님', '수업', '학기', '레포트', '프로그래밍',
]

/**
 * Real-time STT hook using Deepgram Nova-3 WebSocket API.
 * Uses MediaRecorder (WebM/Opus) — Deepgram auto-detects format from container.
 */
export function useDeepgram(options: UseDeepgramOptions = {}) {
    const { language = 'multi' } = options
    const [status, setStatus] = useState<SttStatus>('idle')
    const [error, setError] = useState<string | null>(null)

    const wsRef = useRef<WebSocket | null>(null)
    const mediaStreamRef = useRef<MediaStream | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null) // keep for hooks order
    const processorRef = useRef<MediaRecorder | null>(null) // reused for MediaRecorder
    const keepaliveRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const stoppingRef = useRef(false)
    const detectorRef = useRef<SentenceBoundaryDetector | null>(null)
    const reconnectCountRef = useRef(0)
    const languageRef = useRef(language)
    const keytermsRef = useRef(options.keyterms)

    // Stable ref for callback — avoid recreating start()
    const onFinalTextRef = useRef(options.onFinalText)
    onFinalTextRef.current = options.onFinalText

    useEffect(() => {
        languageRef.current = language
    }, [language])

    useEffect(() => {
        keytermsRef.current = options.keyterms
    }, [options.keyterms])

    const store = useSessionStore()

    const doCleanup = useCallback(() => {
        console.log('[DG] cleanup')
        if (keepaliveRef.current) {
            clearInterval(keepaliveRef.current)
            keepaliveRef.current = null
        }
        if (processorRef.current && processorRef.current.state !== 'inactive') {
            processorRef.current.stop()
        }
        processorRef.current = null
        audioContextRef.current = null
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
        mediaStreamRef.current = null
        if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
            try { wsRef.current.send(JSON.stringify({ type: 'CloseStream' })) } catch { }
            wsRef.current.close(1000)
        }
        wsRef.current = null
        store.setRecording(false)
    }, [store])

    const start = useCallback(async () => {
        if (wsRef.current) {
            console.log('[DG] Already running')
            return
        }

        try {
            setStatus('connecting')
            setError(null)

            // 1. Mic
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
            })
            mediaStreamRef.current = stream

            // 2. API key
            const { apiKey } = await getDeepgramToken()

            // 3. WebSocket URL — tuned for Korean lecture/broadcast
            const params = new URLSearchParams({
                model: 'nova-3',
                language: languageRef.current,
                interim_results: 'true',
                punctuate: 'true',
                smart_format: 'true',
                numerals: 'true',
                endpointing: '500',
                vad_events: 'true',
                utterance_end_ms: '2000',
            })

            // Keyterm prompting — boost academic vocabulary
            const terms = keytermsRef.current ?? DEFAULT_KEYTERMS
            for (const term of terms) {
                params.append('keyterm', term)
            }

            const wsUrl = `${DG_WS_BASE}?${params.toString()}`
            console.log(`[DG] Connecting lang=${languageRef.current} keyterms=${terms.length}`)

            const ws = new WebSocket(wsUrl, ['token', apiKey])
            wsRef.current = ws
            ws.binaryType = 'arraybuffer'

            ws.onopen = () => {
                console.log('[DG] ✅ Connected')

                // MediaRecorder sends WebM/Opus — Deepgram auto-detects
                const recorder = new MediaRecorder(stream, {
                    mimeType: 'audio/webm;codecs=opus',
                })
                processorRef.current = recorder

                let chunkN = 0
                recorder.addEventListener('dataavailable', (event) => {
                    if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
                        chunkN++
                        ws.send(event.data)
                        if (chunkN <= 5 || chunkN % 40 === 0) {
                            console.log(`[DG] 📤 #${chunkN}: ${event.data.size}B`)
                        }
                    }
                })

                recorder.start(250) // 250ms chunks
                console.log('[DG] 🎙️ Recording (webm/opus, 250ms)')

                // KeepAlive every 5s
                keepaliveRef.current = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'KeepAlive' }))
                        console.log('[DG] 💓')
                    }
                }, 5000)

                setStatus('recording')
                store.setRecording(true)
            }

            // Initialize sentence boundary detector for this session
            detectorRef.current = new SentenceBoundaryDetector({
                maxBufferAge: 8000,
                maxBufferLength: 120,
                onSentence: (sentence) => {
                    store.addFinalText(sentence, '')
                    onFinalTextRef.current?.(sentence)
                },
                onPartialUpdate: (text) => {
                    store.setPartialText(text)
                },
            })

            ws.onmessage = (event) => {
                if (typeof event.data !== 'string') return
                try {
                    const msg = JSON.parse(event.data)

                    if (msg.type === 'Metadata') {
                        console.log('[DG] 📋 Metadata:', msg.request_id)
                        return
                    }
                    if (msg.type === 'SpeechStarted') {
                        console.log('[DG] 🗣️ SpeechStarted')
                        return
                    }
                    if (msg.type === 'UtteranceEnd') {
                        console.log('[DG] 🔚 UtteranceEnd')
                        detectorRef.current?.utteranceEnd()
                        return
                    }

                    if (msg.type === 'Results') {
                        const alt = msg.channel?.alternatives?.[0]
                        const transcript = alt?.transcript ?? ''
                        const words: DeepgramWord[] = alt?.words ?? []
                        const isFinal = msg.is_final === true
                        const speechFinal = msg.speech_final === true
                        const conf = alt?.confidence ?? 0

                        const flag = speechFinal ? '🟢SF' : isFinal ? '🔵IF' : '⚪'
                        console.log(`[DG] ${flag} "${transcript}" w=${words.length} c=${(conf * 100).toFixed(0)}% s=${msg.start} d=${msg.duration?.toFixed(2)}`)

                        if (!transcript) return

                        if (isFinal) {
                            detectorRef.current?.addFinal(transcript, speechFinal, words)
                        } else {
                            detectorRef.current?.addInterim(transcript, words)
                        }
                    }

                    if (msg.type === 'Error') {
                        console.error('[DG] ❌', msg)
                        setError(msg.description ?? msg.message ?? 'Deepgram error')
                        setStatus('error')
                        doCleanup()
                    }
                } catch { }
            }

            ws.onerror = (e) => {
                console.error('[DG] ❌ WS Error:', e)
                setError('WebSocket error')
                setStatus('error')
                doCleanup()
            }

            ws.onclose = (event) => {
                console.log(`[DG] 🔴 Closed code=${event.code} reason="${event.reason}"`)

                // Skip redundant cleanup if stop() already handled it
                if (stoppingRef.current) {
                    stoppingRef.current = false
                    return
                }

                // Auto-reconnect on unexpected disconnect
                if (event.code !== 1000 && reconnectCountRef.current < MAX_RECONNECT_RETRIES) {
                    reconnectCountRef.current++
                    const delay = RECONNECT_BASE_DELAY * Math.pow(2, reconnectCountRef.current - 1)
                    console.log(`[DG] 🔄 Auto-reconnect #${reconnectCountRef.current} in ${delay}ms`)
                    setError(`Reconnecting... (${reconnectCountRef.current}/${MAX_RECONNECT_RETRIES})`)

                    // Clean up current WS but preserve mic stream & detector
                    if (keepaliveRef.current) { clearInterval(keepaliveRef.current); keepaliveRef.current = null }
                    wsRef.current = null

                    setTimeout(() => {
                        // Re-trigger start if not stopped by user
                        if (!stoppingRef.current) {
                            wsRef.current = null // ensure start() won't bail
                            start()
                        }
                    }, delay)
                    return
                }

                if (event.code !== 1000) {
                    setError(`Closed: ${event.reason || `Code ${event.code}`}`)
                    setStatus('error')
                } else {
                    setStatus('idle')
                }
                reconnectCountRef.current = 0
                // Inline cleanup (no circular doCleanup→close)
                if (keepaliveRef.current) { clearInterval(keepaliveRef.current); keepaliveRef.current = null }
                if (processorRef.current && processorRef.current.state !== 'inactive') processorRef.current.stop()
                processorRef.current = null
                audioContextRef.current = null
                mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
                mediaStreamRef.current = null
                wsRef.current = null
                store.setRecording(false)
            }
        } catch (err) {
            console.error('[DG] Start error:', err)
            setError(
                err instanceof DOMException && err.name === 'NotAllowedError'
                    ? 'Mic access denied'
                    : err instanceof Error ? err.message : 'Failed to start',
            )
            setStatus('error')
            store.setRecording(false)
        }
    }, [store, doCleanup])

    const stop = useCallback(() => {
        console.log('[DG] stop()')
        stoppingRef.current = true

        // Flush any remaining buffer as final sentence
        detectorRef.current?.flush()

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'CloseStream' }))
        }
        store.setPartialText('')
        doCleanup()
        setStatus('idle')
    }, [doCleanup, store])

    const pause = useCallback(() => {
        if (processorRef.current && processorRef.current.state === 'recording') {
            processorRef.current.pause()
        }
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'Finalize' }))
        }
        setStatus('paused')
        store.setPaused(true)
    }, [store])

    const resume = useCallback(() => {
        if (processorRef.current && processorRef.current.state === 'paused') {
            processorRef.current.resume()
        }
        setStatus('recording')
        store.setPaused(false)
    }, [store])

    return { start, stop, pause, resume, status, error }
}
