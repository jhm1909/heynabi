import { create } from 'zustand'

interface SessionState {
    isRecording: boolean
    isPaused: boolean
    sourceLang: string
    targetLang: string
    partialText: string
    finalTexts: Array<{ original: string; translated: string }>

    setRecording: (value: boolean) => void
    setPaused: (value: boolean) => void
    setSourceLang: (lang: string) => void
    setTargetLang: (lang: string) => void
    setPartialText: (text: string) => void
    addFinalText: (original: string, translated: string) => void
    reset: () => void
}

const initialState = {
    isRecording: false,
    isPaused: false,
    sourceLang: 'ko',
    targetLang: 'vi',
    partialText: '',
    finalTexts: [],
}

export const useSessionStore = create<SessionState>((set) => ({
    ...initialState,

    setRecording: (value) => set({ isRecording: value }),
    setPaused: (value) => set({ isPaused: value }),
    setSourceLang: (lang) => set({ sourceLang: lang }),
    setTargetLang: (lang) => set({ targetLang: lang }),
    setPartialText: (text) => set({ partialText: text }),
    addFinalText: (original, translated) =>
        set((state) => ({
            finalTexts: [...state.finalTexts, { original, translated }],
        })),
    reset: () => set(initialState),
}))
