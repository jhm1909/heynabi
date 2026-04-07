import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { DeepgramWord } from '../sentence-boundary'
import { SentenceBoundaryDetector, buildSpacedText } from '../sentence-boundary'

function makeWord(word: string, start = 0, end = 0.1, confidence = 0.99): DeepgramWord {
    return { word, punctuated_word: word, start, end, confidence }
}

function makeWords(text: string): DeepgramWord[] {
    return text.split(' ').map((w, i) => makeWord(w, i * 0.5, i * 0.5 + 0.4))
}

describe('buildSpacedText', () => {
    it('joins words from Deepgram words array', () => {
        const words = makeWords('안녕하세요 오늘 수업을 시작하겠습니다')
        const result = buildSpacedText('안녕하세요오늘수업을시작하겠습니다', words)
        expect(result).toBe('안녕하세요 오늘 수업을 시작하겠습니다')
    })

    it('uses punctuated_word when available', () => {
        const words: DeepgramWord[] = [
            { word: '안녕하세요', punctuated_word: '안녕하세요.', start: 0, end: 0.5, confidence: 0.99 },
        ]
        expect(buildSpacedText('안녕하세요', words)).toBe('안녕하세요.')
    })

    it('falls back to Korean spacing when words array is empty', () => {
        const result = buildSpacedText('안녕하세요오늘수업을시작합니다')
        // Should insert at least some spaces (heuristic)
        expect(result.includes(' ')).toBe(true)
    })

    it('returns short text unchanged when no words provided', () => {
        expect(buildSpacedText('a')).toBe('a')
        expect(buildSpacedText('')).toBe('')
    })
})

describe('SentenceBoundaryDetector', () => {
    let onSentence: ReturnType<typeof vi.fn>
    let onPartialUpdate: ReturnType<typeof vi.fn>
    let detector: SentenceBoundaryDetector

    beforeEach(() => {
        onSentence = vi.fn()
        onPartialUpdate = vi.fn()
        detector = new SentenceBoundaryDetector({
            maxBufferAge: 8000,
            maxBufferLength: 120,
            onSentence,
            onPartialUpdate,
        })
    })

    describe('commit triggers', () => {
        it('commits on speech_final', () => {
            detector.addFinal('안녕하세요', true, makeWords('안녕하세요'))
            expect(onSentence).toHaveBeenCalledWith('안녕하세요')
        })

        it('commits on sentence-ending punctuation', () => {
            detector.addFinal('오늘 수업을 시작합니다.', false, makeWords('오늘 수업을 시작합니다.'))
            expect(onSentence).toHaveBeenCalledWith('오늘 수업을 시작합니다.')
        })

        it('commits on question mark', () => {
            detector.addFinal('이해가 되시나요?', false, makeWords('이해가 되시나요?'))
            expect(onSentence).toHaveBeenCalledWith('이해가 되시나요?')
        })

        it('commits on exclamation mark', () => {
            detector.addFinal('좋습니다!', false, makeWords('좋습니다!'))
            expect(onSentence).toHaveBeenCalledWith('좋습니다!')
        })

        it('commits on char limit', () => {
            const longText = '가'.repeat(130)
            const words = [makeWord(longText)]
            detector.addFinal(longText, false, words)
            expect(onSentence).toHaveBeenCalledWith(longText)
        })

        it('commits on time limit', () => {
            vi.useFakeTimers()
            try {
                // First chunk starts the timer
                detector.addFinal('첫번째', false, makeWords('첫번째'))
                expect(onSentence).not.toHaveBeenCalled()

                // Advance time past maxBufferAge
                vi.advanceTimersByTime(9000)

                // Second chunk triggers time-based commit
                detector.addFinal('두번째', false, makeWords('두번째'))
                expect(onSentence).toHaveBeenCalledWith('첫번째 두번째')
            } finally {
                vi.useRealTimers()
            }
        })

        it('commits on utteranceEnd', () => {
            detector.addFinal('부분 텍스트', false, makeWords('부분 텍스트'))
            expect(onSentence).not.toHaveBeenCalled()

            detector.utteranceEnd()
            expect(onSentence).toHaveBeenCalledWith('부분 텍스트')
        })

        it('commits on flush', () => {
            detector.addFinal('남은 버퍼', false, makeWords('남은 버퍼'))
            expect(onSentence).not.toHaveBeenCalled()

            detector.flush()
            expect(onSentence).toHaveBeenCalledWith('남은 버퍼')
        })
    })

    describe('buffering behavior', () => {
        it('accumulates multiple chunks before commit', () => {
            detector.addFinal('오늘', false, makeWords('오늘'))
            detector.addFinal('수업은', false, makeWords('수업은'))
            expect(onSentence).not.toHaveBeenCalled()

            // speech_final triggers commit of accumulated buffer
            detector.addFinal('여기까지', true, makeWords('여기까지'))
            expect(onSentence).toHaveBeenCalledWith('오늘 수업은 여기까지')
        })

        it('updates partial text while buffering', () => {
            detector.addFinal('첫번째', false, makeWords('첫번째'))
            expect(onPartialUpdate).toHaveBeenCalledWith('첫번째')
        })

        it('clears partial text after commit', () => {
            detector.addFinal('완료.', false, makeWords('완료.'))
            // After commit, partial should be cleared
            expect(onPartialUpdate).toHaveBeenCalledWith('')
        })

        it('shows combined buffer + interim in partial', () => {
            detector.addFinal('버퍼', false, makeWords('버퍼'))
            onPartialUpdate.mockClear()

            detector.addInterim('인터림', makeWords('인터림'))
            expect(onPartialUpdate).toHaveBeenCalledWith('버퍼 인터림')
        })
    })

    describe('reset', () => {
        it('clears buffer state', () => {
            detector.addFinal('데이터', false, makeWords('데이터'))
            detector.reset()
            expect(detector.getBuffer()).toBe('')
        })
    })

    describe('edge cases', () => {
        it('ignores empty transcripts', () => {
            detector.addFinal('', false, [])
            expect(onSentence).not.toHaveBeenCalled()
            expect(onPartialUpdate).not.toHaveBeenCalled()
        })

        it('utteranceEnd with empty buffer is a no-op', () => {
            detector.utteranceEnd()
            expect(onSentence).not.toHaveBeenCalled()
        })

        it('flush with empty buffer is a no-op', () => {
            detector.flush()
            expect(onSentence).not.toHaveBeenCalled()
        })

        it('handles rapid sequential commits', () => {
            detector.addFinal('첫번째.', false, makeWords('첫번째.'))
            detector.addFinal('두번째.', false, makeWords('두번째.'))
            detector.addFinal('세번째.', false, makeWords('세번째.'))

            expect(onSentence).toHaveBeenCalledTimes(3)
            expect(onSentence).toHaveBeenNthCalledWith(1, '첫번째.')
            expect(onSentence).toHaveBeenNthCalledWith(2, '두번째.')
            expect(onSentence).toHaveBeenNthCalledWith(3, '세번째.')
        })
    })
})
