import { createFileRoute } from '@tanstack/react-router'
import { LoginButton } from '#/components/auth/login-button'


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

            <div className="flex flex-col items-center gap-3">
                <LoginButton />
                <p className="text-xs text-muted-foreground">
                    Free to use • No credit card required
                </p>
            </div>
        </div>
    )
}
