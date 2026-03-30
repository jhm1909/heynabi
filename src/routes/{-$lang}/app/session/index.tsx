import { createFileRoute } from '@tanstack/react-router'
import { useSoniox } from '#/features/stt/hooks/use-soniox'
import { useSessionStore } from '#/stores/session-store'
import { TranscriptPanel } from '#/components/session/transcript-panel'
import { SessionControls } from '#/components/session/session-controls'
import { LanguageSelector } from '#/components/session/language-selector'

export const Route = createFileRoute('/{-$lang}/app/session/')({
    component: SessionPage,
})

function SessionPage() {
    const {
        sourceLang,
        targetLang,
        setSourceLang,
        setTargetLang,
        isRecording,
    } = useSessionStore()

    const stt = useSoniox({
        language: sourceLang,
    })

    return (
        <div className="flex h-full flex-col">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-3">
                <LanguageSelector
                    sourceValue={sourceLang}
                    targetValue={targetLang}
                    onSourceChange={setSourceLang}
                    onTargetChange={setTargetLang}
                    disabled={isRecording}
                />

                <SessionControls
                    status={stt.status}
                    onStart={stt.start}
                    onStop={stt.stop}
                    onPause={stt.pause}
                    onResume={stt.resume}
                />
            </div>

            {/* Error banner */}
            {stt.error && (
                <div className="border-b bg-destructive/10 px-4 py-2 text-sm text-destructive">
                    {stt.error}
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

                {/* Translation — will be wired in Story-Translation */}
                <div className="flex flex-col overflow-auto">
                    <div className="border-b px-4 py-2">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                            Translation
                        </h2>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                        <p className="text-sm text-muted-foreground">
                            Translations will appear here when you start recording...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
