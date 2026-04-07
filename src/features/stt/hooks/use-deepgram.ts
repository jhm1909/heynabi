import { useCallback, useEffect, useRef, useState } from 'react'
import { getDeepgramToken } from '#/server/stt-deepgram'
import { useSessionStore } from '#/stores/session-store'
import { SentenceBoundaryDetector } from '#/lib/sentence-boundary'
import type { AudioPipelineHandle } from '../lib/audio-pipeline'
import { createAudioPipeline } from '../lib/audio-pipeline'
import type { DeepgramSocketHandle, DgResults } from '../lib/deepgram-socket'
import {
    createDeepgramSocket,
    parseDgMessage,
    DEFAULT_KEYTERMS,
} from '../lib/deepgram-socket'
import type { SttStatus } from '../lib/types'

export type { SttStatus }

interface UseDeepgramOptions {
    language?: string
    keyterms?: string[]
    onFinalText?: (text: string) => void
    enabled?: boolean
}

const MAX_RECONNECT_RETRIES = 3
const RECONNECT_BASE_DELAY = 1000

/**
 * Real-time STT hook using Deepgram Nova-3 WebSocket API.
 * Delegates audio capture to AudioPipeline and WS management to DeepgramSocket.
 */
export function useDeepgram(options: UseDeepgramOptions = {}) {
    const { language = 'multi', enabled = true } = options
    const [status, setStatus] = useState<SttStatus>('idle')
    const [error, setError] = useState<string | null>(null)

    const socketRef = useRef<DeepgramSocketHandle | null>(null)
    const audioRef = useRef<AudioPipelineHandle | null>(null)
    const detectorRef = useRef<SentenceBoundaryDetector | null>(null)
    const stoppingRef = useRef(false)
    const reconnectCountRef = useRef(0)
    const pausedRef = useRef(false)
    const languageRef = useRef(language)
    const keytermsRef = useRef(options.keyterms)

    // Latency tracking
    const lastSendAtRef = useRef(0)
    const latencySamplesRef = useRef<number[]>([])
    const chunkCountRef = useRef(0)

    // Stable ref for callback
    const onFinalTextRef = useRef(options.onFinalText)
    onFinalTextRef.current = options.onFinalText

    useEffect(() => { languageRef.current = language }, [language])
    useEffect(() => { keytermsRef.current = options.keyterms }, [options.keyterms])

    const store = useSessionStore()

    const doCleanup = useCallback(() => {
        console.log('[DG] cleanup')
        socketRef.current?.close()
        socketRef.current = null
        audioRef.current?.destroy()
        audioRef.current = null
        pausedRef.current = false
        store.setRecording(false)
    }, [store])

    const start = useCallback(async () => {
        if (!enabled) return
        if (socketRef.current) {
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

            // 2. API key
            const { apiKey } = await getDeepgramToken()

            // 3. WebSocket
            const socket = createDeepgramSocket({
                apiKey,
                language: languageRef.current,
                keyterms: keytermsRef.current ?? DEFAULT_KEYTERMS,
            })
            socketRef.current = socket
            const { ws } = socket

            // 4. Initialize sentence boundary detector
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

            // 5. Start audio pipeline on WS open
            ws.addEventListener('open', async () => {
                console.log('[DG] Connected')
                chunkCountRef.current = 0
                latencySamplesRef.current = []

                const workletUrl = new URL('../pcm-processor.worklet.js', import.meta.url).href

                try {
                    audioRef.current = await createAudioPipeline(
                        stream,
                        (buffer) => {
                            if (pausedRef.current) return
                            if (ws.readyState === WebSocket.OPEN) {
                                chunkCountRef.current++
                                ws.send(buffer)
                                lastSendAtRef.current = performance.now()

                                const n = chunkCountRef.current
                                if (n <= 5 || n % 50 === 0) {
                                    console.log(`[DG] #${n}: ${buffer.byteLength}B`)
                                }
                            }
                        },
                        workletUrl,
                    )
                    setStatus('recording')
                    store.setRecording(true)
                } catch (err) {
                    console.error('[DG] AudioPipeline init failed:', err)
                    setError('Failed to initialize audio pipeline')
                    setStatus('error')
                    doCleanup()
                }
            })

            // 6. Handle messages
            ws.addEventListener('message', (event) => {
                const msg = parseDgMessage(event.data)
                if (!msg) return

                switch (msg.type) {
                    case 'Metadata':
                        console.log('[DG] Metadata:', msg.request_id)
                        break

                    case 'SpeechStarted':
                        console.log('[DG] SpeechStarted')
                        break

                    case 'UtteranceEnd':
                        console.log('[DG] UtteranceEnd')
                        detectorRef.current?.utteranceEnd()
                        break

                    case 'Results':
                        handleResults(msg)
                        break

                    case 'Error':
                        console.error('[DG] Error:', msg)
                        setError(msg.description ?? msg.message ?? 'Deepgram error')
                        setStatus('error')
                        doCleanup()
                        break
                }
            })

            // 7. Error / close
            ws.addEventListener('error', () => {
                console.error('[DG] WS Error')
                setError('WebSocket error')
                setStatus('error')
                doCleanup()
            })

            ws.addEventListener('close', (event) => {
                console.log(`[DG] Closed code=${event.code} reason="${event.reason}"`)

                if (stoppingRef.current) {
                    stoppingRef.current = false
                    return
                }

                // Auto-reconnect on unexpected disconnect
                if (event.code !== 1000 && reconnectCountRef.current < MAX_RECONNECT_RETRIES) {
                    reconnectCountRef.current++
                    const delay = RECONNECT_BASE_DELAY * Math.pow(2, reconnectCountRef.current - 1)
                    console.log(`[DG] Reconnect #${reconnectCountRef.current} in ${delay}ms`)
                    setError(`Reconnecting... (${reconnectCountRef.current}/${MAX_RECONNECT_RETRIES})`)

                    socketRef.current = null
                    setTimeout(() => {
                        if (!stoppingRef.current) {
                            socketRef.current = null
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
                doCleanup()
            })
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
    }, [enabled, store, doCleanup])

    function handleResults(msg: DgResults) {
        const { transcript, words, confidence: conf } = msg.channel.alternatives[0]
        const isFinal = msg.is_final === true
        const speechFinal = msg.speech_final === true

        // Latency tracking
        if (isFinal && lastSendAtRef.current) {
            const lat = performance.now() - lastSendAtRef.current
            latencySamplesRef.current.push(lat)
            if (latencySamplesRef.current.length > 100) latencySamplesRef.current.shift()
        }

        const flag = speechFinal ? 'SF' : isFinal ? 'IF' : '--'
        const samples = latencySamplesRef.current
        const latStr = samples.length >= 5
            ? ` lat=${Math.round(samples.reduce((a, b) => a + b, 0) / samples.length)}ms`
            : ''
        console.log(`[DG] ${flag} "${transcript}" w=${words.length} c=${(conf * 100).toFixed(0)}%${latStr}`)

        if (!transcript) return

        if (isFinal) {
            detectorRef.current?.addFinal(transcript, speechFinal, words)
        } else {
            detectorRef.current?.addInterim(transcript, words)
        }
    }

    // Reset reconnect counter on successful recording
    useEffect(() => {
        if (status === 'recording') reconnectCountRef.current = 0
    }, [status])

    const stop = useCallback(() => {
        console.log('[DG] stop()')
        stoppingRef.current = true
        detectorRef.current?.flush()
        store.setPartialText('')
        doCleanup()
        setStatus('idle')
    }, [doCleanup, store])

    const pause = useCallback(() => {
        pausedRef.current = true
        if (socketRef.current?.ws.readyState === WebSocket.OPEN) {
            socketRef.current.ws.send(JSON.stringify({ type: 'Finalize' }))
        }
        setStatus('paused')
        store.setPaused(true)
    }, [store])

    const resume = useCallback(() => {
        pausedRef.current = false
        setStatus('recording')
        store.setPaused(false)
    }, [store])

    return { start, stop, pause, resume, status, error }
}
