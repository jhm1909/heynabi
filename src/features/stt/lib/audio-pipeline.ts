/**
 * AudioWorklet pipeline for real-time PCM streaming.
 *
 * Sets up: Mic → AudioContext (48kHz) → AudioWorkletNode (downsample 16kHz)
 * → posts Int16 PCM buffers via port.onmessage
 *
 * Returns a cleanup function that tears down the entire pipeline.
 */

export interface AudioPipelineHandle {
    /** Tear down AudioContext, Worklet, and mic stream */
    destroy: () => void
    /** Suspend audio processing (mute → worklet stops posting) */
    suspend: () => Promise<void>
    /** Resume audio processing */
    resume: () => Promise<void>
}

/**
 * Create and start the audio capture pipeline.
 *
 * @param stream - MediaStream from getUserMedia
 * @param onPcmChunk - Called on audio thread with each PCM buffer
 * @param workletUrl - URL to the pcm-processor.worklet.js module
 */
export async function createAudioPipeline(
    stream: MediaStream,
    onPcmChunk: (buffer: ArrayBuffer) => void,
    workletUrl: string,
): Promise<AudioPipelineHandle> {
    const audioCtx = new AudioContext({ sampleRate: 48000 })

    await audioCtx.audioWorklet.addModule(workletUrl)

    const source = audioCtx.createMediaStreamSource(stream)
    const workletNode = new AudioWorkletNode(audioCtx, 'pcm-processor')

    workletNode.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
        onPcmChunk(e.data)
    }

    source.connect(workletNode)

    // AudioWorklet must be connected to output to process,
    // but we mute it to avoid echo (mic → speakers)
    const muteNode = audioCtx.createGain()
    muteNode.gain.value = 0
    workletNode.connect(muteNode)
    muteNode.connect(audioCtx.destination)

    return {
        destroy() {
            workletNode.disconnect()
            source.disconnect()
            muteNode.disconnect()
            if (audioCtx.state !== 'closed') {
                audioCtx.close().catch(() => {})
            }
            stream.getTracks().forEach((t) => t.stop())
        },
        suspend: () => audioCtx.suspend(),
        resume: () => audioCtx.resume(),
    }
}
