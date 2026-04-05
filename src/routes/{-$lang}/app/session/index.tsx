import { useCallback, useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Languages, Loader2, ArrowDown } from 'lucide-react'
import { useStt } from '#/features/stt/hooks/use-stt'
import { useTranslation } from '#/features/translation/hooks/use-translation'
import { useSessionStore } from '#/stores/session-store'
import { EmptyState } from '#/components/shared/empty-state'
import { SummaryPanel } from '#/components/session/summary-panel'
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
        partialText,
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
                            className={`rounded px-2 py-0.5 transition-colors ${sttEngine === 'deepgram'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setSttEngine('deepgram')}
                            disabled={isRecording}
                            title="Deepgram Nova-3 — Premium multilingual"
                        >
                            🚀 Deepgram
                        </button>
                        <button
                            type="button"
                            className={`rounded px-2 py-0.5 transition-colors ${sttEngine === 'soniox'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setSttEngine('soniox')}
                            disabled={isRecording}
                            title="Soniox — Highest accuracy Korean"
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

            {/* Main content: Center (Unified) + Right (Summary) */}
            <div className="flex flex-1 overflow-hidden">
                {/* ── Center: Interleaved original + translation ── */}
                <div className="flex flex-1 flex-col overflow-auto">
                    <div className="border-b px-4 py-2">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                            Translation
                        </h2>
                    </div>
                    <ScrollablePanel
                        finalTexts={finalTexts}
                        translationEntries={translation.entries}
                        partialText={partialText}
                        translationError={translation.error}
                    />
                </div>

                {/* ── Right: Quick Summary ── */}
                <div className="hidden w-72 shrink-0 flex-col border-l md:flex">
                    <div className="border-b px-4 py-2">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                            Quick Summary
                        </h2>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <SummaryPanel />
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ── Scrollable Panel with auto-scroll ── */
function ScrollablePanel({
    finalTexts,
    translationEntries,
    partialText,
    translationError,
}: {
    finalTexts: Array<{ original: string; translated: string }>
    translationEntries: Array<{ original: string; translated: string | null }>
    partialText: string
    translationError: string | null
}) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const [userScrolledUp, setUserScrolledUp] = useState(false)
    const isAutoScrolling = useRef(false)

    // Detect if user scrolled away from the anchor
    const handleScroll = useCallback(() => {
        if (isAutoScrolling.current) return
        const el = scrollRef.current
        const anchor = bottomRef.current
        if (!el || !anchor) return
        // Check if anchor is within the visible viewport
        const anchorRect = anchor.getBoundingClientRect()
        const containerRect = el.getBoundingClientRect()
        const isVisible = anchorRect.top >= containerRect.top && anchorRect.top <= containerRect.bottom
        setUserScrolledUp(!isVisible)
    }, [])

    // Auto-scroll: keep the latest entry centered in the viewport
    useEffect(() => {
        if (userScrolledUp) return
        const anchor = bottomRef.current
        if (!anchor) return
        isAutoScrolling.current = true
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => { isAutoScrolling.current = false }, 500)
    }, [finalTexts.length, translationEntries.length, partialText, userScrolledUp])

    const scrollToBottom = () => {
        const anchor = bottomRef.current
        if (!anchor) return
        isAutoScrolling.current = true
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setUserScrolledUp(false)
        setTimeout(() => { isAutoScrolling.current = false }, 500)
    }

    return (
        <div className="relative flex-1">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="absolute inset-0 overflow-auto p-4"
            >
                {finalTexts.length === 0 && !partialText ? (
                    <EmptyState
                        icon={<Languages className="h-10 w-10" />}
                        title="No translation yet"
                        description="Press Start to begin recording."
                    />
                ) : (
                    <div className="flex flex-col gap-4" style={{ paddingBottom: '50vh' }}>
                        {finalTexts.map((entry, i) => {
                            const translationEntry = translationEntries.at(i)
                            const translated = translationEntry?.translated
                            // Show corrected spacing from Gemini, fall back to raw STT text
                            const displayOriginal = translationEntry?.original ?? entry.original
                            return (
                                <div key={i} className="flex flex-col gap-0.5">
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {displayOriginal}
                                    </p>
                                    {translated ? (
                                        <p className="text-sm font-medium leading-relaxed">
                                            {translated}
                                        </p>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-muted-foreground/50">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            <span className="text-xs italic">Translating...</span>
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {partialText && (
                            <p className="text-sm leading-relaxed text-muted-foreground/60 italic">
                                {partialText}
                            </p>
                        )}
                        <div ref={bottomRef} />
                    </div>
                )}

                {translationError && (
                    <p className="mt-2 text-sm text-destructive">
                        {translationError}
                    </p>
                )}
            </div>

            {/* Scroll-to-bottom button */}
            {userScrolledUp && (
                <button
                    onClick={scrollToBottom}
                    className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full border bg-background/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-lg backdrop-blur-sm transition-colors hover:text-foreground"
                >
                    <ArrowDown className="h-3.5 w-3.5" />
                    Latest ↓
                </button>
            )}
        </div>
    )
}
