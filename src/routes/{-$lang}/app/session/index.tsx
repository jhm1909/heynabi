import { useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useStt } from '#/features/stt/hooks/use-stt'
import { useTranslation } from '#/features/translation/hooks/use-translation'
import { useSessionStore } from '#/stores/session-store'
import { TranscriptPanel } from '#/components/session/transcript-panel'
import { TranslationPanel } from '#/components/session/translation-panel'
import { SessionControls } from '#/components/session/session-controls'
import { LanguageSelector } from '#/components/session/language-selector'

export const Route = createFileRoute('/{-$lang}/app/session/')({
    component: SessionPage,
})

function SessionPage() {
    const {
        sourceLang,
        targetLang,
        sttEngine,
        setSourceLang,
        setTargetLang,
        setSttEngine,
        isRecording,
        finalTexts,
    } = useSessionStore()

    const lastTranslatedCount = useRef(0)

    const stt = useStt({
        engine: sttEngine,
        language: sourceLang,
    })

    const translation = useTranslation({
        sourceLang,
        targetLang,
    })

    // Auto-translate when new final text arrives from STT
    useEffect(() => {
        if (finalTexts.length > lastTranslatedCount.current) {
            const newTexts = finalTexts.slice(lastTranslatedCount.current)
            lastTranslatedCount.current = finalTexts.length

            for (const entry of newTexts) {
                translation.translate(entry.original)
            }
        }
    }, [finalTexts, translation])

    return (
        <div className="flex h-full flex-col">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-3">
                <div className="flex items-center gap-3">
                    <LanguageSelector
                        sourceValue={sourceLang}
                        targetValue={targetLang}
                        onSourceChange={setSourceLang}
                        onTargetChange={setTargetLang}
                        disabled={isRecording}
                    />

                    {/* STT Engine Toggle */}
                    <div className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs">
                        <button
                            type="button"
                            className={`rounded px-2 py-0.5 transition-colors ${sttEngine === 'web-speech'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setSttEngine('web-speech')}
                            disabled={isRecording}
                            title="Free — Chrome built-in"
                        >
                            🌐 Free
                        </button>
                        <button
                            type="button"
                            className={`rounded px-2 py-0.5 transition-colors ${sttEngine === 'soniox'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setSttEngine('soniox')}
                            disabled={isRecording}
                            title="Premium — Soniox (requires credits)"
                        >
                            ⚡ Soniox
                        </button>
                    </div>
                </div>

                <SessionControls
                    status={stt.status}
                    onStart={stt.start}
                    onStop={stt.stop}
                    onPause={stt.pause}
                    onResume={stt.resume}
                />
            </div>

            {/* Error banners */}
            {stt.error && (
                <div className="border-b bg-destructive/10 px-4 py-2 text-sm text-destructive">
                    🎤 {stt.error}
                </div>
            )}

            {/* Dual panels */}
            <div className="grid flex-1 grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
                {/* Transcript */}
                <div className="flex flex-col overflow-auto">
                    <div className="border-b px-4 py-2">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                            Transcript
                        </h2>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <TranscriptPanel />
                    </div>
                </div>

                {/* Translation */}
                <div className="flex flex-col overflow-auto">
                    <div className="border-b px-4 py-2">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                            Translation
                        </h2>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <TranslationPanel
                            translatedText={translation.translatedText}
                            isTranslating={translation.isTranslating}
                            error={translation.error}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
