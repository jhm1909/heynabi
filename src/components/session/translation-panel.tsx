import { Loader2, Languages } from 'lucide-react'
import { EmptyState } from '#/components/shared/empty-state'

interface TranslationPanelProps {
    translatedText: string
    isTranslating: boolean
    error: string | null
}

export function TranslationPanel({
    translatedText,
    isTranslating,
    error,
}: TranslationPanelProps) {
    if (error) {
        return (
            <div className="p-4">
                <p className="text-sm text-destructive">{error}</p>
            </div>
        )
    }

    if (!translatedText && !isTranslating) {
        return (
            <EmptyState
                icon={<Languages className="h-10 w-10" />}
                title="No translation yet"
                description="Start recording to see translations here."
            />
        )
    }

    return (
        <div className="flex flex-col gap-2 p-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {translatedText}
            </div>

            {isTranslating && (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-xs">Translating...</span>
                </div>
            )}
        </div>
    )
}
