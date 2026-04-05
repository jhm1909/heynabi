import { describe, it, expect, beforeEach } from 'vitest'
import { useSessionStore } from './session-store'

describe('session-store', () => {
    beforeEach(() => {
        // Reset store to initial state before each test
        useSessionStore.getState().reset()
    })

    it('has correct initial state', () => {
        const state = useSessionStore.getState()
        expect(state.isRecording).toBe(false)
        expect(state.isPaused).toBe(false)
        expect(state.sourceLang).toBe('ko')
        expect(state.targetLang).toBe('vi')
        expect(state.sttEngine).toBe('deepgram')
        expect(state.partialText).toBe('')
        expect(state.finalTexts).toEqual([])
    })

    it('setRecording toggles isRecording', () => {
        useSessionStore.getState().setRecording(true)
        expect(useSessionStore.getState().isRecording).toBe(true)

        useSessionStore.getState().setRecording(false)
        expect(useSessionStore.getState().isRecording).toBe(false)
    })

    it('setPaused toggles isPaused', () => {
        useSessionStore.getState().setPaused(true)
        expect(useSessionStore.getState().isPaused).toBe(true)
    })

    it('setSourceLang and setTargetLang update languages', () => {
        useSessionStore.getState().setSourceLang('en')
        useSessionStore.getState().setTargetLang('ja')
        const state = useSessionStore.getState()
        expect(state.sourceLang).toBe('en')
        expect(state.targetLang).toBe('ja')
    })

    it('setSttEngine switches engine', () => {
        useSessionStore.getState().setSttEngine('soniox')
        expect(useSessionStore.getState().sttEngine).toBe('soniox')

        useSessionStore.getState().setSttEngine('web-speech')
        expect(useSessionStore.getState().sttEngine).toBe('web-speech')
    })

    it('setPartialText updates partial text', () => {
        useSessionStore.getState().setPartialText('hello wor')
        expect(useSessionStore.getState().partialText).toBe('hello wor')
    })

    it('addFinalText appends to finalTexts array', () => {
        useSessionStore.getState().addFinalText('안녕하세요', 'Xin chào')
        useSessionStore.getState().addFinalText('감사합니다', 'Cảm ơn')

        const texts = useSessionStore.getState().finalTexts
        expect(texts).toHaveLength(2)
        expect(texts[0]).toEqual({ original: '안녕하세요', translated: 'Xin chào' })
        expect(texts[1]).toEqual({ original: '감사합니다', translated: 'Cảm ơn' })
    })

    it('reset returns to initial state', () => {
        // Mutate everything
        const store = useSessionStore.getState()
        store.setRecording(true)
        store.setPaused(true)
        store.setSourceLang('en')
        store.setTargetLang('ja')
        store.setSttEngine('soniox')
        store.setPartialText('partial')
        store.addFinalText('test', 'test')

        // Reset
        useSessionStore.getState().reset()

        const state = useSessionStore.getState()
        expect(state.isRecording).toBe(false)
        expect(state.isPaused).toBe(false)
        expect(state.sourceLang).toBe('ko')
        expect(state.targetLang).toBe('vi')
        expect(state.sttEngine).toBe('deepgram')
        expect(state.partialText).toBe('')
        expect(state.finalTexts).toEqual([])
    })
})
