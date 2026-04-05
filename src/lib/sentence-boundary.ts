/**
 * Smart Sentence Boundary Detector for Deepgram streaming STT.
 *
 * Accumulates `is_final` text chunks and commits complete sentences
 * based on multiple triggers (priority order):
 *
 * 1. speech_final   – speaker paused (endpointing)
 * 2. Punctuation     – sentence-ending mark detected
 * 3. Time limit      – buffer older than maxBufferAge
 * 4. Char limit      – buffer longer than maxBufferLength
 * 5. UtteranceEnd    – Deepgram silence event (fallback)
 * 6. flush()         – user pressed Stop
 */

export interface DeepgramWord {
    word: string
    punctuated_word?: string
    start: number
    end: number
    confidence: number
}

export interface SentenceBoundaryOptions {
    /** Max ms before auto-commit (default: 8000) */
    maxBufferAge?: number
    /** Max chars before auto-commit (default: 120) */
    maxBufferLength?: number
    /** Called when a sentence is ready */
    onSentence: (sentence: string) => void
    /** Called when pending display text updates (buffer + partial) */
    onPartialUpdate: (text: string) => void
}

// Sentence-ending punctuation (includes Korean sentence enders)
const SENTENCE_END = /[.?!。]\s*$/

/**
 * Build a correctly-spaced transcript from Deepgram's words array.
 * Falls back to raw transcript if words array is empty.
 */
export function buildSpacedText(transcript: string, words?: DeepgramWord[]): string {
    if (words && words.length > 0) {
        return words.map(w => w.punctuated_word ?? w.word).join(' ')
    }
    return transcript
}

export class SentenceBoundaryDetector {
    private buffer = ''
    private bufferStartTime = 0
    private readonly maxBufferAge: number
    private readonly maxBufferLength: number
    private readonly onSentence: (s: string) => void
    private readonly onPartialUpdate: (s: string) => void

    constructor(opts: SentenceBoundaryOptions) {
        this.maxBufferAge = opts.maxBufferAge ?? 8000
        this.maxBufferLength = opts.maxBufferLength ?? 120
        this.onSentence = opts.onSentence
        this.onPartialUpdate = opts.onPartialUpdate
    }

    /** Reset state for a new session */
    reset(): void {
        this.buffer = ''
        this.bufferStartTime = 0
    }

    /** Get current buffer content */
    getBuffer(): string {
        return this.buffer
    }

    /**
     * Feed an is_final result from Deepgram.
     * @param transcript - raw transcript string
     * @param speechFinal - true if endpointing detected a pause
     * @param words - Deepgram word-level data (used for correct spacing)
     */
    addFinal(transcript: string, speechFinal: boolean, words?: DeepgramWord[]): void {
        if (!transcript) return

        // Build correctly-spaced text from words array
        const spacedChunk = buildSpacedText(transcript, words)

        // Start timer on first accumulation
        if (!this.buffer) {
            this.bufferStartTime = Date.now()
        }

        // Append with space separator (words are already spaced)
        this.buffer = this.buffer
            ? `${this.buffer} ${spacedChunk}`
            : spacedChunk

        // Priority 1: speech_final — speaker paused
        if (speechFinal) {
            this.commit('speech_final')
            return
        }

        // Priority 2: sentence-ending punctuation
        if (SENTENCE_END.test(this.buffer)) {
            this.commit('punctuation')
            return
        }

        // Priority 3: time limit
        const age = Date.now() - this.bufferStartTime
        if (age >= this.maxBufferAge) {
            this.commit('time_limit')
            return
        }

        // Priority 4: char limit
        if (this.buffer.length >= this.maxBufferLength) {
            this.commit('char_limit')
            return
        }

        // Not committing yet — show buffer as pending partial
        this.onPartialUpdate(this.buffer)
    }

    /**
     * Update partial display with current interim text.
     * Shows buffer + interim combined.
     */
    addInterim(transcript: string, words?: DeepgramWord[]): void {
        const spacedInterim = buildSpacedText(transcript, words)
        const combined = this.buffer
            ? `${this.buffer} ${spacedInterim}`
            : spacedInterim
        this.onPartialUpdate(combined)
    }

    /** Deepgram UtteranceEnd event — commit remaining buffer */
    utteranceEnd(): void {
        if (this.buffer.trim()) {
            this.commit('utterance_end')
        }
    }

    /** Flush remaining buffer (user pressed Stop) */
    flush(): void {
        if (this.buffer.trim()) {
            this.commit('flush')
        }
    }

    /** Commit the buffer as a completed sentence */
    private commit(reason: string): void {
        const sentence = this.buffer.trim()
        if (sentence) {
            console.log(`[SBD] 📝 Commit (${reason}): "${sentence.slice(0, 60)}..."`)
            this.onSentence(sentence)
        }
        this.buffer = ''
        this.bufferStartTime = 0
        this.onPartialUpdate('')
    }
}
