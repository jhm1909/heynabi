import { useCallback, useRef, useState } from 'react'
import { getSonioxToken } from '#/server/stt'
import { useSessionStore } from '#/stores/session-store'

export type SttStatus = 'idle' | 'connecting' | 'recording' | 'paused' | 'error'

interface UseSonioxOptions {
    language?: string
    onFinalText?: (text: string) => void
}

export function useSoniox(options: UseSonioxOptions = {}) {
    const { language = 'ko' } = options
    const [status, setStatus] = useState<SttStatus>('idle')
    const [error, setError] = useState<string | null>(null)

    const mediaStreamRef = useRef<MediaStream | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)

    const { setPartialText, addFinalText, setRecording, setPaused } =
        useSessionStore()

    const start = useCallback(async () => {
        try {
            setStatus('connecting')
            setError(null)

            // 1. Request mic permission
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 16000,
                },
            })
            mediaStreamRef.current = stream

            // 2. Get token from server
            const { apiKey } = await getSonioxToken()

            // 3. Setup MediaRecorder for audio chunks
            const recorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                    ? 'audio/webm;codecs=opus'
                    : 'audio/webm',
            })
            mediaRecorderRef.current = recorder

            // TODO: Connect to Soniox WebSocket with apiKey
            // For now, simulate recording state
            setStatus('recording')
            setRecording(true)

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    // TODO: Send audio chunk to Soniox WebSocket
                    // ws.send(event.data)
                }
            }

            recorder.start(250) // Send chunks every 250ms
        } catch (err) {
            const message =
                err instanceof DOMException && err.name === 'NotAllowedError'
                    ? 'Microphone access denied. Please allow mic access in your browser settings.'
                    : 'Failed to start recording'

            setError(message)
            setStatus('error')
            setRecording(false)
        }
    }, [language, setPartialText, addFinalText, setRecording, setPaused])

    const stop = useCallback(() => {
        if (mediaRecorderRef.current?.state !== 'inactive') {
            mediaRecorderRef.current?.stop()
        }

        mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
        mediaStreamRef.current = null
        mediaRecorderRef.current = null

        setStatus('idle')
        setRecording(false)
        setPartialText('')
    }, [setRecording, setPartialText])

    const pause = useCallback(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.pause()
            setStatus('paused')
            setPaused(true)
        }
    }, [setPaused])

    const resume = useCallback(() => {
        if (mediaRecorderRef.current?.state === 'paused') {
            mediaRecorderRef.current.resume()
            setStatus('recording')
            setPaused(false)
        }
    }, [setPaused])

    return {
        start,
        stop,
        pause,
        resume,
        status,
        error,
    }
}
