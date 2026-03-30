import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Mic, Languages, Zap, Globe } from 'lucide-react'
import { LoginButton } from '#/components/auth/login-button'

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

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        },
    }),
}

function LandingPage() {
    return (
        <div className="page-wrap flex min-h-screen flex-col items-center py-24">
            {/* Hero */}
            <motion.div
                className="flex flex-col items-center gap-6 text-center"
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    custom={0}
                    variants={fadeUp}
                    className="island-kicker rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-1.5"
                >
                    ✨ Powered by Gemini 2.5 Flash
                </motion.div>

                <motion.h1
                    custom={1}
                    variants={fadeUp}
                    className="display-title max-w-2xl text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl"
                >
                    Real-time translation for{' '}
                    <span className="bg-gradient-to-r from-[var(--lagoon-deep)] to-[var(--lagoon)] bg-clip-text text-transparent">
                        language learners
                    </span>
                </motion.h1>

                <motion.p
                    custom={2}
                    variants={fadeUp}
                    className="max-w-lg text-lg text-[var(--sea-ink-soft)]"
                >
                    Listen to lectures in Korean, Chinese, or Japanese — and read the
                    translation in your language instantly.
                </motion.p>

                <motion.div
                    custom={3}
                    variants={fadeUp}
                    className="mt-2 flex flex-col items-center gap-3"
                >
                    <LoginButton />
                    <p className="text-xs text-[var(--sea-ink-soft)]">
                        Free to use • No credit card required
                    </p>
                </motion.div>
            </motion.div>

            {/* Features */}
            <section className="mt-24 w-full">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-8 text-center text-2xl font-bold"
                >
                    Everything you need
                </motion.h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-40px' }}
                            variants={fadeUp}
                            className="feature-card rounded-xl border border-[var(--line)] p-6 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="rounded-lg bg-[var(--lagoon)]/10 p-2.5">
                                    <feature.icon className="h-5 w-5 text-[var(--lagoon-deep)]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{feature.title}</h3>
                                    <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="site-footer mt-24 w-full rounded-t-xl px-6 py-6 text-center text-sm text-[var(--sea-ink-soft)]">
                Hey Nabi 🦋 — Built for students who learn across languages
            </footer>
        </div>
    )
}
