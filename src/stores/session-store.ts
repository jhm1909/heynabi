import { create } from 'zustand'

import type { SttEngine } from '#/features/stt/hooks/use-stt'

interface SessionState {
    isRecording: boolean
    isPaused: boolean
    sourceLang: string
    targetLang: string
    sttEngine: SttEngine
    partialText: string
    finalTexts: Array<{ original: string; translated: string }>

    setRecording: (value: boolean) => void
    setPaused: (value: boolean) => void
    setSourceLang: (lang: string) => void
    setTargetLang: (lang: string) => void
    setSttEngine: (engine: SttEngine) => void
    setPartialText: (text: string) => void
    addFinalText: (original: string, translated: string) => void
    reset: () => void
}

const initialState = {
    isRecording: false,
    isPaused: false,
    sourceLang: 'ko',
    targetLang: 'vi',
    sttEngine: 'web-speech' as SttEngine,
    partialText: '',
    finalTexts: [],
}

export const useSessionStore = create<SessionState>((set) => ({
    ...initialState,

    setRecording: (value) => set({ isRecording: value }),
    setPaused: (value) => set({ isPaused: value }),
    setSourceLang: (lang) => set({ sourceLang: lang }),
    setTargetLang: (lang) => set({ targetLang: lang }),
    setSttEngine: (engine) => set({ sttEngine: engine }),
    setPartialText: (text) => set({ partialText: text }),
    addFinalText: (original, translated) =>
        set((state) => ({
            finalTexts: [...state.finalTexts, { original, translated }],
        })),
    reset: () => set(initialState),
}))
