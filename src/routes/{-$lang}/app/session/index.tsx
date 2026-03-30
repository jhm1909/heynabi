import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$lang}/app/session/')({
    component: SessionPage,
})

function SessionPage() {
    return (
        <div className="grid h-full grid-cols-1 gap-4 p-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
                <h2 className="mb-4 text-lg font-semibold">Transcript</h2>
                <p className="text-muted-foreground">
                    Start recording to see transcript here...
                </p>
            </div>

            <div className="rounded-lg border p-4">
                <h2 className="mb-4 text-lg font-semibold">Translation</h2>
                <p className="text-muted-foreground">
                    Translations will appear here...
                </p>
            </div>
        </div>
    )
}
