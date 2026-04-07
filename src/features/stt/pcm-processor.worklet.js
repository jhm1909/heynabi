/**
 * PCM AudioWorklet Processor — Low-latency STT streaming
 *
 * Runs on the audio rendering thread (no main-thread jank).
 * Downsamples from browser native rate (48kHz) → 16kHz,
 * buffers into 100ms chunks (1600 samples), converts to Int16 PCM.
 *
 * Latency gains vs MediaRecorder/Opus:
 *   - Zero encode overhead (raw PCM)
 *   - 67% less data (16kHz vs 48kHz)
 *   - Precise 100ms timing (vs MediaRecorder's minimum-250ms guarantee)
 */

const TARGET_SAMPLE_RATE = 16000
const CHUNK_MS = 100
const CHUNK_SAMPLES = (TARGET_SAMPLE_RATE * CHUNK_MS) / 1000 // 1600

class PcmProcessor extends AudioWorkletProcessor {
    constructor() {
        super()
        this._buffer = new Float32Array(CHUNK_SAMPLES)
        this._offset = 0
        this._resampleFraction = 0 // fractional accumulator for resampling
    }

    process(inputs) {
        const ch = inputs[0]?.[0]
        if (!ch || ch.length === 0) return true

        // Downsample ratio: e.g. 48000/16000 = 3.0
        const ratio = sampleRate / TARGET_SAMPLE_RATE

        for (let i = 0; i < ch.length; i++) {
            this._resampleFraction += 1
            if (this._resampleFraction >= ratio) {
                this._resampleFraction -= ratio
                this._buffer[this._offset++] = ch[i]

                if (this._offset >= CHUNK_SAMPLES) {
                    this._emit()
                }
            }
        }

        return true
    }

    _emit() {
        // Float32 [-1,1] → Int16 [-32768, 32767]
        const pcm = new Int16Array(this._offset)
        for (let i = 0; i < this._offset; i++) {
            const s = Math.max(-1, Math.min(1, this._buffer[i]))
            pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
        }
        this.port.postMessage(pcm.buffer, [pcm.buffer])
        this._offset = 0
    }
}

registerProcessor('pcm-processor', PcmProcessor)
