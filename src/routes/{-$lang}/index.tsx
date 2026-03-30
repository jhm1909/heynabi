import { createFileRoute } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/{-$lang}/')({
    component: LandingPage,
})

function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
            <div className="flex flex-col items-center gap-4 text-center">
                <h1 className="text-5xl font-bold tracking-tight">
                    Hey Nabi 🦋
                </h1>
                <p className="max-w-md text-lg text-muted-foreground">
                    Real-time translation platform for language learners
                </p>
            </div>

            <Button size="lg" variant="default">
                Get Started
            </Button>
        </div>
    )
}
