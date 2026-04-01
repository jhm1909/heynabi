import { createFileRoute } from '@tanstack/react-router'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Mic, Languages, Zap, Globe, ArrowRight, Headphones, BookOpen } from 'lucide-react'
import { LandingNavbar } from '#/components/landing/landing-navbar'
import {
    SttIllustration,
    TranslationIllustration,
    SpeedIllustration,
    GlobeIllustration,
    MicIcon,
    WaveformIcon,
    TranslateIcon,
    BoltIcon,
    GlobeSmallIcon,
    BookIcon,
    HeadphonesIcon,
    ChatIcon,
    ShieldIcon,
    KoTag,
    ViTag,
    EnTag,
    CnTag,
    JpTag,
} from '#/components/landing/svg-icons'
import { useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'

export const Route = createFileRoute('/{-$lang}/')({
    component: LandingPage,
})

/* ─── Animation helpers ─── */
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.12,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    }),
}

const staggerChildren = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 },
    },
}

const charVariant = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
}

/* ─── Data ─── */
const iconStripItems: { Icon: ComponentType<{ className?: string }>; label: string }[] = [
    { Icon: KoTag, label: 'Korean' },
    { Icon: MicIcon, label: 'Microphone' },
    { Icon: ViTag, label: 'Vietnamese' },
    { Icon: GlobeSmallIcon, label: 'Globe' },
    { Icon: EnTag, label: 'English' },
    { Icon: BoltIcon, label: 'Speed' },
    { Icon: CnTag, label: 'Chinese' },
    { Icon: BookIcon, label: 'Book' },
    { Icon: JpTag, label: 'Japanese' },
    { Icon: WaveformIcon, label: 'Waveform' },
    { Icon: HeadphonesIcon, label: 'Headphones' },
    { Icon: TranslateIcon, label: 'Translate' },
    { Icon: ShieldIcon, label: 'Privacy' },
    { Icon: ChatIcon, label: 'Chat' },
]

const features = [
    {
        icon: Mic,
        title: 'Real-time STT',
        description:
            'Soniox AI converts lectures to text in real time — supporting Korean, Chinese, Japanese, Vietnamese, and English simultaneously.',
        Illustration: SttIllustration,
    },
    {
        icon: Languages,
        title: 'AI Translation',
        description:
            'Gemini 2.5 Flash translates academic content with context-aware precision. No more lost meanings in technical lectures.',
        Illustration: TranslationIllustration,
    },
    {
        icon: Zap,
        title: 'Under 2 Seconds',
        description:
            'First translated token appears in under 2 seconds. Real-time enough to follow along without missing a beat.',
        Illustration: SpeedIllustration,
    },
    {
        icon: Globe,
        title: '5 Languages',
        description:
            'Built for international students: Korean, Vietnamese, English, Chinese, and Japanese — all in one session.',
        Illustration: GlobeIllustration,
    },
]

const stats = [
    { value: '5', label: 'Languages' },
    { value: '<2s', label: 'Latency' },
    { value: '99%', label: 'STT Accuracy' },
    { value: '24/7', label: 'Availability' },
]

/* ─── Components ─── */

/** Parallax wrapper — shifts children vertically based on scroll position */
function Parallax({
    children,
    speed = 0.15,
    className = '',
}: {
    children: ReactNode
    speed?: number
    className?: string
}) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    })
    const y = useTransform(scrollYProgress, [0, 1], [speed * 120, speed * -120])
    return (
        <motion.div ref={ref} style={{ y }} className={className}>
            {children}
        </motion.div>
    )
}

function AnimatedText({ text, className }: { text: string; className?: string }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-60px' })

    const words = text.split(' ')
    return (
        <motion.span
            ref={ref}
            className={className}
            variants={staggerChildren}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            style={{ display: 'inline' }}
        >
            {words.map((word, wi) => (
                <span key={wi} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                    {word.split('').map((char, ci) => (
                        <motion.span
                            key={`${wi}-${ci}`}
                            variants={charVariant}
                            style={{ display: 'inline-block' }}
                        >
                            {char}
                        </motion.span>
                    ))}
                    {wi < words.length - 1 && (
                        <span style={{ display: 'inline-block' }}>&nbsp;</span>
                    )}
                </span>
            ))}
        </motion.span>
    )
}

/* ─── Main Page ─── */
function LandingPage() {
    /* Hero parallax — orbs move at different rates */
    const heroRef = useRef(null)
    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    })
    const orbY1 = useTransform(heroScroll, [0, 1], [0, 160])
    const orbY2 = useTransform(heroScroll, [0, 1], [0, -100])
    const orbY3 = useTransform(heroScroll, [0, 1], [0, 200])
    const heroContentY = useTransform(heroScroll, [0, 1], [0, 60])
    const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0])

    return (
        <div className="flex min-h-screen flex-col items-center overflow-hidden">
            {/* ━━━ Navbar ━━━ */}
            <LandingNavbar />

            {/* ━━━ Hero ━━━ */}
            <section ref={heroRef} className="relative w-full">
                {/* Parallax gradient orbs */}
                <motion.div
                    className="parallax-orb parallax-orb-1"
                    style={{ y: orbY1 }}
                    aria-hidden
                />
                <motion.div
                    className="parallax-orb parallax-orb-2"
                    style={{ y: orbY2 }}
                    aria-hidden
                />
                <motion.div
                    className="parallax-orb parallax-orb-3"
                    style={{ y: orbY3 }}
                    aria-hidden
                />

                <motion.div
                    className="page-wrap relative z-10 flex flex-col items-center gap-6 pt-28 pb-16 text-center sm:pt-36 sm:pb-24"
                    style={{ y: heroContentY, opacity: heroOpacity }}
                >
                    <motion.div
                        className="flex flex-col items-center gap-6"
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            custom={0}
                            variants={fadeUp}
                            className="hero-brand"
                        >
                            <div className="hero-brand-sweep" />
                            <span className="hero-brand-letter">H</span>
                            <span className="hero-brand-letter">e</span>
                            <span className="hero-brand-letter">y</span>
                            <span className="hero-brand-letter" style={{ marginLeft: '0.25em' }}>N</span>
                            <span className="hero-brand-letter">a</span>
                            <span className="hero-brand-letter">b</span>
                            <span className="hero-brand-letter">i</span>
                            {/* Butterfly orbits around the text */}
                            <div className="hero-brand-orbit" aria-hidden>
                                <div className="hero-butterfly">
                                    <svg viewBox="0 0 18.528 35.424" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.358 35.05c.435-.175.646-.408.861-.95.374-.94.698-1.52 1.145-2.05.78-.92 1.757-1.638 2.666-1.957.603-.212.9-.204 1.505.041.843.343 1.597.25 2.062-.254.95-1.029 3.95-6.873 5.841-11.376.869-2.07.831-1.882.797-3.962-.034-2.106-.024-2.064-.927-3.887-1.639-3.31-4.426-6.582-7.147-8.392C8.71 1.298 6.715.504 5.296.328c-.718-.09-2.465-.001-3.183.16C.943.752.279 1.268.279 1.917c0 .119.437 1.136.97 2.26.533 1.126 1.044 2.291 1.135 2.591.334 1.106.776 3.567.945 5.27.065.652.357 1.286.751 1.633.419.367 1.351.786 1.964.883.286.044.534.096.553.115.018.018-.129.128-.327.244-.761.446-1.432 1.439-1.74 2.574-.216.802-.194 2.914.045 4.121.24 1.212.575 2.318 1.031 3.403.46 1.092.535 1.458.439 2.135-.223 1.575-1.958 4.03-3.489 4.937-.693.41-.885.587-1.066.98-.173.375-.185.535-.069.953.223.802 1.206 1.326 1.937 1.033z" fill="var(--lagoon-deep)" />
                                    </svg>
                                    <svg viewBox="0 0 2.4 14.4" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.2 13c0 .641-.447 1.16-1 1.16-.553 0-1-.519-1-1.16V1.4C.2.759.647.24 1.2.24c.553 0 1 .519 1 1.16z" fill="var(--lagoon-deep)" />
                                    </svg>
                                    <svg viewBox="0 0 18.528 35.424" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.105 35.155c-.42-.196-.627-.482-.902-1.253-.544-1.517-2.145-3.126-3.636-3.652-.69-.243-.887-.242-1.486.01-.617.26-1.342.278-1.798.045-.555-.283-1.76-2.262-3.476-5.708C2.628 22.232.984 18.575.455 17.144c-.236-.637-.237-.655-.237-2.485 0-2.164.01-2.209.9-4.013 1.011-2.049 2.53-4.189 4.185-5.9C7.679 2.293 9.783.995 12.49.313c.782-.197 1.554-.236 2.695-.137 1.619.14 2.38.38 2.882.909.21.22.246.321.243.684-.002.373-.122.67-.959 2.395-1.277 2.63-1.59 3.806-2.035 7.63-.111.951-.316 1.426-.809 1.87-.52.47-1.306.807-2.165.928l-.391.054.35.224c.897.574 1.58 1.674 1.834 2.956.193.969.12 2.791-.164 4.15-.222 1.061-.696 2.518-1.12 3.443-.336.735-.411 1.584-.203 2.3.505 1.738 2.056 3.692 3.736 4.705.693.417.938.83.874 1.476-.104 1.071-1.193 1.706-2.153 1.256z" fill="var(--lagoon-deep)" />
                                    </svg>
                                    {/* Glowing particles */}
                                    {[0, 1, 2, 3, 4, 5].map(i => (
                                        <span key={i} className="btf-particle" style={{ '--i': i } as React.CSSProperties} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <motion.h1 custom={1} variants={fadeUp} className="hero-display max-w-4xl">
                            <span>Hear any language,</span>
                            <br />
                            <span className="bg-linear-to-r from-(--lagoon-deep) to-(--lagoon) bg-clip-text text-transparent">
                                read yours
                            </span>
                        </motion.h1>

                        <motion.p
                            custom={2}
                            variants={fadeUp}
                            className="max-w-xl text-lg leading-relaxed text-(--sea-ink-soft)"
                        >
                            Listen to lectures in Korean, Chinese, or Japanese — and read the
                            translation in your language instantly. Built for international students.
                        </motion.p>

                        <motion.div
                            custom={3}
                            variants={fadeUp}
                            className="mt-4 flex flex-col items-center gap-4 sm:flex-row"
                        >
                            <a
                                href="/app"
                                className="group inline-flex items-center gap-2 rounded-full bg-(--sea-ink) px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-(--lagoon-deep) hover:shadow-lg"
                            >
                                Go to App
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </motion.div>

                        <motion.p custom={4} variants={fadeUp} className="text-xs text-(--sea-ink-soft)">
                            Free to use · No credit card required
                        </motion.p>
                    </motion.div>
                </motion.div>
            </section>

            {/* ━━━ Scrolling Icon Strip ━━━ */}
            <section className="w-full overflow-hidden py-8">
                <div className="icon-strip">
                    {[...iconStripItems, ...iconStripItems].map((item, i) => (
                        <div key={i} className="icon-bubble" aria-label={item.label}>
                            <item.Icon className="h-6 w-6" />
                        </div>
                    ))}
                </div>
            </section>

            {/* ━━━ Statement ━━━ */}
            <section className="page-wrap py-20 sm:py-28">
                <h2 className="statement-text max-w-3xl">
                    <AnimatedText text="Hey Nabi turns any lecture into readable text — in your language, in real time." />
                </h2>
            </section>

            {/* ━━━ Feature Sections ━━━ */}
            <section id="features" className="page-wrap">
                {features.map((feature, i) => (
                    <motion.div
                        key={feature.title}
                        className={`feature-split ${i % 2 !== 0 ? 'reverse' : ''}`}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Parallax speed={0.08}>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-(--lagoon)/10 p-2.5">
                                        <feature.icon className="h-5 w-5 text-(--lagoon-deep)" />
                                    </div>
                                    <span className="island-kicker">{feature.title}</span>
                                </div>
                                <h3 className="text-3xl font-bold leading-tight sm:text-4xl">
                                    {feature.title}
                                </h3>
                                <p className="max-w-md text-base leading-relaxed text-(--sea-ink-soft)">
                                    {feature.description}
                                </p>
                            </div>
                        </Parallax>
                        <Parallax speed={-0.12} className="glow-card flex items-center justify-center p-6 sm:p-8">
                            <feature.Illustration className="h-full w-full max-w-[280px]" />
                        </Parallax>
                    </motion.div>
                ))}
            </section>

            {/* ━━━ Stats Strip ━━━ */}
            <section className="page-wrap py-16">
                <motion.div
                    className="glow-card grid grid-cols-2 sm:grid-cols-4"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="stat-item border-(--line) not-last:border-r max-sm:nth-2:border-r-0 max-sm:nth-[-n+2]:border-b"
                        >
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* ━━━ Use Cases ━━━ */}
            <section className="page-wrap py-16">
                <motion.h2
                    className="mb-10 text-center text-2xl font-bold sm:text-3xl"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Designed for real classroom moments
                </motion.h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        {
                            icon: Headphones,
                            title: 'During Lectures',
                            desc: 'Open Hey Nabi on your phone or laptop. Listen to the professor and read the translation live.',
                        },
                        {
                            icon: BookOpen,
                            title: 'Study Sessions',
                            desc: 'Review recorded lectures with accurate STT transcriptions and multi-language translations.',
                        },
                        {
                            icon: Languages,
                            title: 'Group Projects',
                            desc: 'Communicate across language barriers with your Korean, Chinese, and Japanese classmates.',
                        },
                    ].map((uc, i) => (
                        <motion.div
                            key={uc.title}
                            className="card-3d-wrap"
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-40px' }}
                            variants={fadeUp}
                        >
                            <div className="glow-card relative" style={{ minHeight: '240px' }}>
                                {/* Stacked circles — spread apart on hover */}
                                <div className="card-3d-circles" aria-hidden>
                                    <span className="circle circle-1" />
                                    <span className="circle circle-2" />
                                    <span className="circle circle-3" />
                                    <span className="circle circle-4">
                                        <uc.icon className="h-4 w-4 text-(--lagoon-deep)" />
                                    </span>
                                </div>

                                {/* Glass morphism layer */}
                                <div className="glow-card-glass" />

                                {/* Content at z=30px */}
                                <div className="glow-card-body p-6 pt-14">
                                    <div className="card-3d-icon mb-3 inline-flex rounded-lg bg-(--lagoon)/10 p-2.5">
                                        <uc.icon className="h-5 w-5 text-(--lagoon-deep)" />
                                    </div>
                                    <div className="card-3d-content">
                                        <h3 className="mb-1 text-lg font-bold">{uc.title}</h3>
                                        <p className="text-sm leading-relaxed text-(--sea-ink-soft)">{uc.desc}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ━━━ Final CTA ━━━ */}
            <section className="page-wrap pb-24">
                <motion.div
                    className="cta-section"
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative z-10 flex flex-col items-center gap-5">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">
                            Start understanding every lecture
                        </h2>
                        <p className="max-w-md text-base text-white/80">
                            Join thousands of international students who never miss a word in
                            class. Free to get started.
                        </p>
                        <a
                            href="/app"
                            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-(--sea-ink) transition-all hover:bg-white/90 hover:shadow-lg"
                        >
                            Go to App
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* ━━━ Mega Footer (Antigravity-inspired) ━━━ */}
            <footer className="mega-footer">
                {/* Zone 1: Tagline + Nav */}
                <div className="mega-footer-top">
                    <div className="mega-footer-tagline">
                        Hear it. Read it. Nabi.
                    </div>
                    <nav className="mega-footer-nav" aria-label="Footer navigation">
                        <div>
                            <a href="#features">Features</a>
                            <a href="#features">Real-time STT</a>
                            <a href="#features">Translation</a>
                            <a href="#features">Languages</a>
                        </div>
                        <div>
                            <a href="#features">Use Cases</a>
                            <a href="#features">About</a>
                            <a href="#features">Contact</a>
                            <a href="#features">GitHub</a>
                        </div>
                    </nav>
                </div>

                {/* Zone 2: Giant brand text */}
                <div className="mega-footer-brand">
                    <span className="mega-footer-brand-text">Hey Nabi</span>
                </div>

                {/* Zone 3: Bottom bar */}
                <div className="mega-footer-bottom">
                    <div className="mega-footer-logo">
                        <div className="footer-butterfly" aria-hidden>
                            <svg viewBox="0 0 18.528 35.424" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.358 35.05c.435-.175.646-.408.861-.95.374-.94.698-1.52 1.145-2.05.78-.92 1.757-1.638 2.666-1.957.603-.212.9-.204 1.505.041.843.343 1.597.25 2.062-.254.95-1.029 3.95-6.873 5.841-11.376.869-2.07.831-1.882.797-3.962-.034-2.106-.024-2.064-.927-3.887-1.639-3.31-4.426-6.582-7.147-8.392C8.71 1.298 6.715.504 5.296.328c-.718-.09-2.465-.001-3.183.16C.943.752.279 1.268.279 1.917c0 .119.437 1.136.97 2.26.533 1.126 1.044 2.291 1.135 2.591.334 1.106.776 3.567.945 5.27.065.652.357 1.286.751 1.633.419.367 1.351.786 1.964.883.286.044.534.096.553.115.018.018-.129.128-.327.244-.761.446-1.432 1.439-1.74 2.574-.216.802-.194 2.914.045 4.121.24 1.212.575 2.318 1.031 3.403.46 1.092.535 1.458.439 2.135-.223 1.575-1.958 4.03-3.489 4.937-.693.41-.885.587-1.066.98-.173.375-.185.535-.069.953.223.802 1.206 1.326 1.937 1.033z" fill="var(--lagoon)" />
                            </svg>
                            <svg viewBox="0 0 2.4 14.4" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.2 13c0 .641-.447 1.16-1 1.16-.553 0-1-.519-1-1.16V1.4C.2.759.647.24 1.2.24c.553 0 1 .519 1 1.16z" fill="var(--lagoon)" />
                            </svg>
                            <svg viewBox="0 0 18.528 35.424" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.105 35.155c-.42-.196-.627-.482-.902-1.253-.544-1.517-2.145-3.126-3.636-3.652-.69-.243-.887-.242-1.486.01-.617.26-1.342.278-1.798.045-.555-.283-1.76-2.262-3.476-5.708C2.628 22.232.984 18.575.455 17.144c-.236-.637-.237-.655-.237-2.485 0-2.164.01-2.209.9-4.013 1.011-2.049 2.53-4.189 4.185-5.9C7.679 2.293 9.783.995 12.49.313c.782-.197 1.554-.236 2.695-.137 1.619.14 2.38.38 2.882.909.21.22.246.321.243.684-.002.373-.122.67-.959 2.395-1.277 2.63-1.59 3.806-2.035 7.63-.111.951-.316 1.426-.809 1.87-.52.47-1.306.807-2.165.928l-.391.054.35.224c.897.574 1.58 1.674 1.834 2.956.193.969.12 2.791-.164 4.15-.222 1.061-.696 2.518-1.12 3.443-.336.735-.411 1.584-.203 2.3.505 1.738 2.056 3.692 3.736 4.705.693.417.938.83.874 1.476-.104 1.071-1.193 1.706-2.153 1.256z" fill="var(--lagoon)" />
                            </svg>
                        </div>
                        Hey Nabi
                    </div>
                    <div className="mega-footer-legal">
                        <a href="#features">About</a>
                        <a href="#features">Privacy</a>
                        <a href="#features">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
