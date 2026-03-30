import { useCallback, useEffect, useRef, useState } from 'react'
import { getSonioxToken } from '#/server/stt'
import { useSessionStore } from '#/stores/session-store'

export type SttStatus = 'idle' | 'connecting' | 'recording' | 'paused' | 'error'

interface UseSonioxOptions {
    language?: string
    onFinalText?: (text: string) => void
}

const SPECIAL_TOKENS = new Set(['<end>', '<fin>'])
const WS_URL = 'wss://stt-rt.soniox.com/transcribe-websocket'

/**
 * Real-time speech-to-text hook using Soniox WebSocket API.
 * Protocol matches the official @soniox/node SDK's RealtimeSttSession.
 */
export function useSoniox(options: UseSonioxOptions = {}) {
    const { language = 'ko' } = options
    const [status, setStatus] = useState<SttStatus>('idle')
    const [error, setError] = useState<string | null>(null)

    const wsRef = useRef<WebSocket | null>(null)
    const mediaStreamRef = useRef<MediaStream | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const processorRef = useRef<ScriptProcessorNode | null>(null)
    const keepaliveRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const partialRef = useRef('')
    const languageRef = useRef(language)

    // Keep language ref in sync
    useEffect(() => {
        languageRef.current = language
    }, [language])

    const store = useSessionStore()

    const doCleanup = useCallback(() => {
        if (keepaliveRef.current) {
            clearInterval(keepaliveRef.current)
            keepaliveRef.current = null
        }
        processorRef.current?.disconnect()
        processorRef.current = null
        audioContextRef.current?.close().catch(() => { })
        audioContextRef.current = null
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
        mediaStreamRef.current = null
        if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
            wsRef.current.close(1000)
        }
        wsRef.current = null
        partialRef.current = ''
        store.setRecording(false)
    }, [store])

    const start = useCallback(async () => {
        try {
            setStatus('connecting')
            setError(null)

            // 1. Mic permission
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
            })
            mediaStreamRef.current = stream

            // 2. Get API key
            const { apiKey } = await getSonioxToken()

            // 3. Connect WebSocket
            const ws = new WebSocket(WS_URL)
            wsRef.current = ws
            ws.binaryType = 'arraybuffer'

            ws.onopen = () => {
                // Send config (matches SDK buildConfigMessage)
                ws.send(JSON.stringify({
                    api_key: apiKey,
                    model: 'stt-rt-preview',
                    audio_format: 'pcm_s16le',
                    sample_rate: 16000,
                    num_channels: 1,
                    language_hints: [languageRef.current],
                    enable_endpoint_detection: true,
                }))

                // Start audio capture
                const ctx = new AudioContext({ sampleRate: 16000 })
                audioContextRef.current = ctx
                const source = ctx.createMediaStreamSource(stream)
                const processor = ctx.createScriptProcessor(4096, 1, 1)
                processorRef.current = processor

                processor.onaudioprocess = (e) => {
                    if (ws.readyState === WebSocket.OPEN) {
                        const input = e.inputBuffer.getChannelData(0)
                        const pcm = new Int16Array(input.length)
                        for (let i = 0; i < input.length; i++) {
                            const s = Math.max(-1, Math.min(1, input[i]))
                            pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff
                        }
                        ws.send(pcm.buffer)
                    }
                }
                source.connect(processor)
                processor.connect(ctx.destination)

                // Keepalive (5s, matching SDK)
                keepaliveRef.current = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'keepalive' }))
                    }
                }, 5000)

                setStatus('recording')
                store.setRecording(true)
            }

            ws.onmessage = (event) => {
                if (typeof event.data !== 'string') return
                try {
                    const result = JSON.parse(event.data)

                    // Error response
                    if (result.error_code || result.error_message) {
                        setError(result.error_message ?? `Error ${result.error_code}`)
                        setStatus('error')
                        doCleanup()
                        return
                    }

                    if (!result.tokens || !Array.isArray(result.tokens)) return

                    const userTokens = result.tokens.filter(
                        (t: { text: string }) => !SPECIAL_TOKENS.has(t.text),
                    )
                    const hasEndpoint = result.tokens.some(
                        (t: { text: string }) => t.text === '<end>',
                    )
                    const text = userTokens.map((t: { text: string }) => t.text).join('')
                    const hasFinal = userTokens.some((t: { is_final?: boolean }) => t.is_final)

                    if (hasFinal && text.trim()) {
                        store.setPartialText('')
                        partialRef.current = ''
                        store.addFinalText(text.trim(), '')
                        options.onFinalText?.(text.trim())
                    } else if (hasEndpoint && partialRef.current.trim()) {
                        store.setPartialText('')
                        store.addFinalText(partialRef.current.trim(), '')
                        options.onFinalText?.(partialRef.current.trim())
                        partialRef.current = ''
                    } else if (text) {
                        partialRef.current = text
                        store.setPartialText(text)
                    }

                    if (result.finished) {
                        if (partialRef.current.trim()) {
                            store.addFinalText(partialRef.current.trim(), '')
                            partialRef.current = ''
                        }
                        store.setPartialText('')
                        setStatus('idle')
                        doCleanup()
                    }
                } catch {
                    // ignore parse errors
                }
            }

            ws.onerror = () => {
                setError('WebSocket error. Check your Soniox API key.')
                setStatus('error')
                doCleanup()
            }

            ws.onclose = (event) => {
                if (event.code !== 1000) {
                    setError(`Connection closed: ${event.reason || 'Unknown'}`)
                    setStatus('error')
                }
                doCleanup()
            }
        } catch (err) {
            setError(
                err instanceof DOMException && err.name === 'NotAllowedError'
                    ? 'Microphone access denied. Please allow mic access.'
                    : err instanceof Error
                        ? err.message
                        : 'Failed to start recording',
            )
            setStatus('error')
            store.setRecording(false)
        }
    }, [store, doCleanup, options.onFinalText])

    const stop = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send('')
        }
        store.setPartialText('')
        doCleanup()
        setStatus('idle')
    }, [doCleanup, store])

    const pause = useCallback(() => {
        mediaStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = false })
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'finalize' }))
        }
        setStatus('paused')
        store.setPaused(true)
    }, [store])

    const resume = useCallback(() => {
        mediaStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = true })
        setStatus('recording')
        store.setPaused(false)
    }, [store])

    return { start, stop, pause, resume, status, error }
}
