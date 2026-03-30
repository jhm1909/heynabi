import { createFileRoute } from '@tanstack/react-router'
import { LoginButton } from '#/components/auth/login-button'
import { Mic, Languages, Zap, Globe } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'

export const Route = createFileRoute('/{-$lang}/')({
    component: LandingPage,
})

const features = [
    {
        icon: Mic,
        title: 'Real-time STT',
        description: 'Speak and see text appear instantly with Soniox AI',
    },
    {
        icon: Languages,
        title: 'AI Translation',
        description: 'Gemini 2.5 Flash translates academic content accurately',
    },
    {
        icon: Zap,
        title: 'Ultra Fast',
        description: 'First token in under 2 seconds for seamless experience',
    },
    {
        icon: Globe,
        title: '5 Languages',
        description: 'Korean, Vietnamese, English, Chinese, and Japanese',
    },
]

function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Hero */}
            <section className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-20">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                        ✨ Powered by Gemini 2.5 Flash
                    </div>

                    <h1 className="max-w-2xl text-5xl font-bold tracking-tight sm:text-6xl">
                        Real-time translation for{' '}
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            language learners
                        </span>
                    </h1>

                    <p className="max-w-lg text-lg text-muted-foreground">
                        Listen to lectures in Korean, Chinese, or Japanese — and read the
                        translation in your language instantly.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <LoginButton />
                    <p className="text-xs text-muted-foreground">
                        Free to use • No credit card required
                    </p>
                </div>
            </section>

            {/* Features */}
            <section className="border-t bg-muted/30 px-4 py-16">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-8 text-center text-2xl font-bold">
                        Everything you need
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {features.map((feature) => (
                            <Card
                                key={feature.title}
                                className="border-0 bg-background/60 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <CardContent className="flex items-start gap-4 p-6">
                                    <div className="rounded-lg bg-primary/10 p-2.5">
                                        <feature.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{feature.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t px-4 py-6 text-center text-sm text-muted-foreground">
                Hey Nabi 🦋 — Built for students who learn across languages
            </footer>
        </div>
    )
}
