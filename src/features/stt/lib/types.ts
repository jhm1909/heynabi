export type SttStatus = 'idle' | 'connecting' | 'recording' | 'paused' | 'error'

export interface SttHookResult {
    start: () => Promise<void>
    stop: () => void
    pause: () => void
    resume: () => void
    status: SttStatus
    error: string | null
}

/** Noop implementation for disabled engines */
export const NOOP_STT: SttHookResult = {
    start: async () => {},
    stop: () => {},
    pause: () => {},
    resume: () => {},
    status: 'idle',
    error: null,
}
