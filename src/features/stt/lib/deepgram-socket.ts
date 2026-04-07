/**
 * Deepgram WebSocket connection factory.
 *
 * Encapsulates: URL building, auth via Sec-WebSocket-Protocol,
 * keepalive, and message type parsing.
 */

import type { DeepgramWord } from '#/lib/sentence-boundary'

/* ── Deepgram message types ── */

export interface DgMetadata {
    type: 'Metadata'
    request_id: string
}

export interface DgSpeechStarted {
    type: 'SpeechStarted'
}

export interface DgUtteranceEnd {
    type: 'UtteranceEnd'
}

export interface DgResults {
    type: 'Results'
    is_final: boolean
    speech_final: boolean
    channel: {
        alternatives: Array<{
            transcript: string
            confidence: number
            words: DeepgramWord[]
        }>
    }
}

export interface DgError {
    type: 'Error'
    description?: string
    message?: string
}

export type DgMessage = DgMetadata | DgSpeechStarted | DgUtteranceEnd | DgResults | DgError

/* ── Connection params ── */

const DG_WS_BASE = 'wss://api.deepgram.com/v1/listen'
const KEEPALIVE_INTERVAL_MS = 8000

/** Default academic Korean keyterms for recognition boosting */
export const DEFAULT_KEYTERMS = [
    '알고리즘', '데이터베이스', '프레젠테이션', '과제', '시험',
    '교수님', '수업', '학기', '레포트', '프로그래밍',
]

export interface DeepgramSocketOptions {
    apiKey: string
    language: string
    keyterms?: string[]
}

export interface DeepgramSocketHandle {
    ws: WebSocket
    /** Stop keepalive and send CloseStream */
    close: () => void
}

/**
 * Build the Deepgram WebSocket URL with all query params.
 */
function buildUrl(language: string, keyterms: string[]): string {
    const params = new URLSearchParams({
        model: 'nova-3',
        language,
        encoding: 'linear16',
        sample_rate: '16000',
        channels: '1',
        interim_results: 'true',
        punctuate: 'true',
        smart_format: 'true',
        numerals: 'true',
        endpointing: '500',
        vad_events: 'true',
        utterance_end_ms: '2000',
    })

    for (const term of keyterms) {
        params.append('keyterm', term)
    }

    return `${DG_WS_BASE}?${params.toString()}`
}

/**
 * Create a Deepgram WebSocket connection with keepalive.
 *
 * Caller is responsible for setting ws.onmessage, ws.onerror, ws.onclose.
 * Those handlers should be attached BEFORE the WebSocket opens (they are
 * set synchronously, so they will be in place by the time `onopen` fires).
 */
export function createDeepgramSocket(opts: DeepgramSocketOptions): DeepgramSocketHandle {
    const keyterms = opts.keyterms ?? DEFAULT_KEYTERMS
    const url = buildUrl(opts.language, keyterms)

    console.log(`[DG] Connecting lang=${opts.language} keyterms=${keyterms.length}`)

    const ws = new WebSocket(url, ['token', opts.apiKey])
    ws.binaryType = 'arraybuffer'

    let keepaliveTimer: ReturnType<typeof setInterval> | null = null

    const origOnOpen = ws.onopen
    ws.addEventListener('open', () => {
        keepaliveTimer = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'KeepAlive' }))
            }
        }, KEEPALIVE_INTERVAL_MS)
    })

    return {
        ws,
        close() {
            if (keepaliveTimer) {
                clearInterval(keepaliveTimer)
                keepaliveTimer = null
            }
            if (ws.readyState === WebSocket.OPEN) {
                try {
                    ws.send(JSON.stringify({ type: 'CloseStream' }))
                } catch {}
            }
            ws.close(1000)
        },
    }
}

/**
 * Parse a raw Deepgram WebSocket message into a typed DgMessage.
 * Returns null for non-string or unparseable messages.
 */
export function parseDgMessage(data: unknown): DgMessage | null {
    if (typeof data !== 'string') return null
    try {
        return JSON.parse(data) as DgMessage
    } catch {
        return null
    }
}
