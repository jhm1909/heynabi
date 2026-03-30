import { useSessionStore } from '#/stores/session-store'
import { EmptyState } from '#/components/shared/empty-state'
import { Mic } from 'lucide-react'

export function TranscriptPanel() {
    const { partialText, finalTexts } = useSessionStore()

    if (finalTexts.length === 0 && !partialText) {
        return (
            <EmptyState
                icon={<Mic className="h-10 w-10" />}
                title="No transcript yet"
                description="Press Start to begin recording and see text here."
            />
        )
    }

    return (
        <div className="flex flex-col gap-2 p-4">
            {finalTexts.map((entry, i) => (
                <p key={i} className="text-sm leading-relaxed">
                    {entry.original}
                </p>
            ))}

            {partialText && (
                <p className="text-sm leading-relaxed text-muted-foreground/60 italic">
                    {partialText}
                </p>
            )}
        </div>
    )
}
