/**
 * Custom SVG icons and animated illustrations for the landing page.
 * Replaces all emoji usage with high-quality vector graphics.
 */

/* ─── Sparkle icon (replaces ✨) ─── */
export function SparkleIcon({ className = 'h-4 w-4' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z"
                fill="currentColor"
                opacity="0.9"
            />
        </svg>
    )
}

/* ─── Butterfly icon (replaces 🦋) ─── */
export function ButterflyIcon({ className = 'h-8 w-8' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
                {/* Left wing */}
                <path
                    d="M24 24C20 18 12 14 8 16C4 18 4 24 8 28C12 32 20 30 24 24Z"
                    fill="var(--lagoon)"
                    opacity="0.7"
                />
                <path
                    d="M24 24C22 20 18 16 14 17C10 18 10 22 13 25C16 28 22 27 24 24Z"
                    fill="var(--lagoon-deep)"
                    opacity="0.5"
                />
                {/* Right wing */}
                <path
                    d="M24 24C28 18 36 14 40 16C44 18 44 24 40 28C36 32 28 30 24 24Z"
                    fill="var(--lagoon)"
                    opacity="0.7"
                />
                <path
                    d="M24 24C26 20 30 16 34 17C38 18 38 22 35 25C32 28 26 27 24 24Z"
                    fill="var(--lagoon-deep)"
                    opacity="0.5"
                />
                {/* Body */}
                <ellipse cx="24" cy="26" rx="1.2" ry="6" fill="var(--sea-ink)" opacity="0.6" />
                {/* Antennae */}
                <path d="M23 20C22 17 20 15 19 14" stroke="var(--sea-ink)" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
                <path d="M25 20C26 17 28 15 29 14" stroke="var(--sea-ink)" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
                <circle cx="19" cy="13.5" r="1" fill="var(--lagoon)" opacity="0.7" />
                <circle cx="29" cy="13.5" r="1" fill="var(--lagoon)" opacity="0.7" />
            </g>
        </svg>
    )
}

/* ─── Animated STT/Microphone Illustration ─── */
export function SttIllustration({ className = '' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sound waves */}
            <g opacity="0.3">
                <circle cx="120" cy="100" r="60" stroke="var(--lagoon)" strokeWidth="1.5" strokeDasharray="4 4">
                    <animate attributeName="r" values="50;70;50" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="120" cy="100" r="80" stroke="var(--lagoon)" strokeWidth="1">
                    <animate attributeName="r" values="70;90;70" dur="3s" repeatCount="indefinite" begin="0.5s" />
                    <animate attributeName="opacity" values="0.2;0.05;0.2" dur="3s" repeatCount="indefinite" begin="0.5s" />
                </circle>
            </g>
            {/* Microphone body */}
            <rect x="108" y="60" width="24" height="48" rx="12" fill="var(--lagoon-deep)" />
            <rect x="112" y="64" width="6" height="3" rx="1.5" fill="white" opacity="0.3" />
            {/* Microphone stand */}
            <path d="M100 108C100 90 108 80 120 80C132 80 140 90 140 108" stroke="var(--sea-ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4" />
            <line x1="120" y1="108" x2="120" y2="130" stroke="var(--sea-ink)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
            <line x1="108" y1="130" x2="132" y2="130" stroke="var(--sea-ink)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
            {/* Waveform bars */}
            <g transform="translate(55, 85)">
                {[0, 1, 2, 3].map(i => (
                    <rect key={`l${i}`} x={i * 8} y={15 - i * 3} width="4" height={10 + i * 6} rx="2" fill="var(--lagoon)" opacity="0.5">
                        <animate attributeName="height" values={`${10 + i * 6};${20 + i * 4};${10 + i * 6}`} dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />
                        <animate attributeName="y" values={`${15 - i * 3};${10 - i * 2};${15 - i * 3}`} dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />
                    </rect>
                ))}
            </g>
            <g transform="translate(153, 85)">
                {[0, 1, 2, 3].map(i => (
                    <rect key={`r${i}`} x={i * 8} y={15 - (3 - i) * 3} width="4" height={10 + (3 - i) * 6} rx="2" fill="var(--lagoon)" opacity="0.5">
                        <animate attributeName="height" values={`${10 + (3 - i) * 6};${20 + (3 - i) * 4};${10 + (3 - i) * 6}`} dur={`${1.2 + (3 - i) * 0.2}s`} repeatCount="indefinite" />
                        <animate attributeName="y" values={`${15 - (3 - i) * 3};${10 - (3 - i) * 2};${15 - (3 - i) * 3}`} dur={`${1.2 + (3 - i) * 0.2}s`} repeatCount="indefinite" />
                    </rect>
                ))}
            </g>
        </svg>
    )
}

/* ─── Animated Translation Illustration ─── */
export function TranslationIllustration({ className = '' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Left text block */}
            <g transform="translate(20, 50)">
                <rect width="80" height="100" rx="8" fill="var(--surface-strong)" stroke="var(--line)" strokeWidth="1" />
                <text x="12" y="28" fontSize="11" fontWeight="600" fill="var(--sea-ink)">안녕하세요</text>
                <rect x="12" y="38" width="56" height="4" rx="2" fill="var(--lagoon)" opacity="0.3" />
                <rect x="12" y="48" width="42" height="4" rx="2" fill="var(--lagoon)" opacity="0.2" />
                <rect x="12" y="62" width="50" height="4" rx="2" fill="var(--lagoon)" opacity="0.3" />
                <rect x="12" y="72" width="38" height="4" rx="2" fill="var(--lagoon)" opacity="0.2" />
                <rect x="12" y="82" width="56" height="4" rx="2" fill="var(--lagoon)" opacity="0.15" />
            </g>
            {/* Arrow */}
            <g transform="translate(110, 85)">
                <line x1="0" y1="15" x2="20" y2="15" stroke="var(--lagoon-deep)" strokeWidth="2" strokeLinecap="round">
                    <animate attributeName="x2" values="15;25;15" dur="2s" repeatCount="indefinite" />
                </line>
                <polyline points="16,10 22,15 16,20" stroke="var(--lagoon-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <animate attributeName="points" values="16,10 22,15 16,20;20,10 26,15 20,20;16,10 22,15 16,20" dur="2s" repeatCount="indefinite" />
                </polyline>
                {/* AI spark */}
                <g transform="translate(10, -8)">
                    <path d="M4 0L4.8 2.8L8 4L4.8 5.2L4 8L3.2 5.2L0 4L3.2 2.8Z" fill="var(--lagoon)" opacity="0.6">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
                    </path>
                </g>
            </g>
            {/* Right text block */}
            <g transform="translate(140, 50)">
                <rect width="80" height="100" rx="8" fill="var(--surface-strong)" stroke="var(--lagoon)" strokeWidth="1" opacity="1" />
                <text x="12" y="28" fontSize="11" fontWeight="600" fill="var(--lagoon-deep)">Xin chào</text>
                <rect x="12" y="38" width="50" height="4" rx="2" fill="var(--palm)" opacity="0.3" />
                <rect x="12" y="48" width="38" height="4" rx="2" fill="var(--palm)" opacity="0.2" />
                <rect x="12" y="62" width="54" height="4" rx="2" fill="var(--palm)" opacity="0.3" />
                <rect x="12" y="72" width="44" height="4" rx="2" fill="var(--palm)" opacity="0.2" />
                <rect x="12" y="82" width="50" height="4" rx="2" fill="var(--palm)" opacity="0.15" />
            </g>
        </svg>
    )
}

/* ─── Animated Speed/Lightning Illustration ─── */
export function SpeedIllustration({ className = '' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Circular speed indicator */}
            <circle cx="120" cy="100" r="60" stroke="var(--line)" strokeWidth="3" fill="none" />
            <circle cx="120" cy="100" r="60" stroke="var(--lagoon)" strokeWidth="3" fill="none" strokeDasharray="300 377" strokeLinecap="round" transform="rotate(-90 120 100)">
                <animate attributeName="stroke-dasharray" values="0 377;300 377;0 377" dur="3s" repeatCount="indefinite" />
            </circle>
            {/* Lightning bolt */}
            <path d="M128 70L112 102H124L116 130L140 94H126L134 70H128Z" fill="var(--lagoon-deep)" opacity="0.8" />
            {/* Pulse dot */}
            <circle cx="120" cy="40" r="4" fill="var(--lagoon)">
                <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite" />
            </circle>
            {/* Speed lines */}
            <g opacity="0.3">
                <line x1="40" y1="80" x2="60" y2="80" stroke="var(--lagoon)" strokeWidth="1.5" strokeLinecap="round">
                    <animate attributeName="x1" values="45;35;45" dur="1s" repeatCount="indefinite" />
                </line>
                <line x1="35" y1="100" x2="55" y2="100" stroke="var(--lagoon)" strokeWidth="1.5" strokeLinecap="round">
                    <animate attributeName="x1" values="40;30;40" dur="1.2s" repeatCount="indefinite" />
                </line>
                <line x1="40" y1="120" x2="60" y2="120" stroke="var(--lagoon)" strokeWidth="1.5" strokeLinecap="round">
                    <animate attributeName="x1" values="45;35;45" dur="0.9s" repeatCount="indefinite" />
                </line>
            </g>
            {/* Time display */}
            <text x="120" y="172" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--lagoon-deep)" fontFamily="var(--font-sans)">
                {'<'}2s
            </text>
        </svg>
    )
}

/* ─── Animated Globe/Languages Illustration ─── */
export function GlobeIllustration({ className = '' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Globe */}
            <circle cx="120" cy="100" r="55" fill="none" stroke="var(--lagoon)" strokeWidth="1.5" opacity="0.4" />
            <ellipse cx="120" cy="100" rx="30" ry="55" fill="none" stroke="var(--lagoon)" strokeWidth="1" opacity="0.3">
                <animateTransform attributeName="transform" type="rotate" values="0 120 100;360 120 100" dur="20s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="120" cy="100" rx="55" ry="20" fill="none" stroke="var(--lagoon)" strokeWidth="1" opacity="0.3" />
            <ellipse cx="120" cy="100" rx="55" ry="38" fill="none" stroke="var(--lagoon)" strokeWidth="0.8" opacity="0.2" transform="rotate(20 120 100)" />
            {/* Language labels orbiting */}
            <g>
                <g>
                    <animateTransform attributeName="transform" type="rotate" values="0 120 100;360 120 100" dur="12s" repeatCount="indefinite" />
                    <circle cx="175" cy="100" r="16" fill="var(--surface-strong)" stroke="var(--lagoon)" strokeWidth="1" />
                    <text x="175" y="104" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--lagoon-deep)" fontFamily="var(--font-sans)">KO</text>
                </g>
            </g>
            <g>
                <g>
                    <animateTransform attributeName="transform" type="rotate" values="72 120 100;432 120 100" dur="12s" repeatCount="indefinite" />
                    <circle cx="175" cy="100" r="16" fill="var(--surface-strong)" stroke="var(--palm)" strokeWidth="1" />
                    <text x="175" y="104" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--palm)" fontFamily="var(--font-sans)">VI</text>
                </g>
            </g>
            <g>
                <g>
                    <animateTransform attributeName="transform" type="rotate" values="144 120 100;504 120 100" dur="12s" repeatCount="indefinite" />
                    <circle cx="175" cy="100" r="16" fill="var(--surface-strong)" stroke="var(--lagoon-deep)" strokeWidth="1" />
                    <text x="175" y="104" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--lagoon-deep)" fontFamily="var(--font-sans)">EN</text>
                </g>
            </g>
            <g>
                <g>
                    <animateTransform attributeName="transform" type="rotate" values="216 120 100;576 120 100" dur="12s" repeatCount="indefinite" />
                    <circle cx="175" cy="100" r="16" fill="var(--surface-strong)" stroke="var(--lagoon)" strokeWidth="1" />
                    <text x="175" y="104" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--lagoon)" fontFamily="var(--font-sans)">CN</text>
                </g>
            </g>
            <g>
                <g>
                    <animateTransform attributeName="transform" type="rotate" values="288 120 100;648 120 100" dur="12s" repeatCount="indefinite" />
                    <circle cx="175" cy="100" r="16" fill="var(--surface-strong)" stroke="var(--sea-ink-soft)" strokeWidth="1" />
                    <text x="175" y="104" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--sea-ink-soft)" fontFamily="var(--font-sans)">JP</text>
                </g>
            </g>
            {/* Center dot */}
            <circle cx="120" cy="100" r="6" fill="var(--lagoon-deep)" opacity="0.6">
                <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
            </circle>
        </svg>
    )
}

/* ─── Icon strip items (small, clean SVG icons) ─── */
export function MicIcon({ className = 'h-6 w-6' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="var(--lagoon-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
    )
}

export function WaveformIcon({ className = 'h-6 w-6' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="var(--lagoon)" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="8" x2="4" y2="16" />
            <line x1="8" y1="5" x2="8" y2="19" />
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="16" y1="7" x2="16" y2="17" />
            <line x1="20" y1="10" x2="20" y2="14" />
        </svg>
    )
}

export function TranslateIcon({ className = 'h-6 w-6' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="var(--palm)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" />
            <path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
        </svg>
    )
}

export function BoltIcon({ className = 'h-6 w-6' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="var(--lagoon-deep)" stroke="none">
            <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8Z" />
        </svg>
    )
}

export function GlobeSmallIcon({ className = 'h-6 w-6' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="var(--lagoon)" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <ellipse cx="12" cy="12" rx="4" ry="10" />
            <path d="M2 12h20" />
        </svg>
    )
}

export function BookIcon({ className = 'h-6 w-6' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="var(--sea-ink-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
    )
}

export function HeadphonesIcon({ className = 'h-6 w-6' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="var(--lagoon-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
        </svg>
    )
}

export function ChatIcon({ className = 'h-6 w-6' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="var(--palm)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="9" y1="10" x2="15" y2="10" />
        </svg>
    )
}

export function CodeIcon({ className = 'h-6 w-6' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="var(--sea-ink-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    )
}

export function ShieldIcon({ className = 'h-6 w-6' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="var(--lagoon)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
        </svg>
    )
}

/* ─── Language tag icons for the strip ─── */
function LangTag({ code, color }: { code: string; color: string }) {
    return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
            <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
            <text
                x="20"
                y="22"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="700"
                fill={color}
                fontFamily="var(--font-sans)"
            >
                {code}
            </text>
        </svg>
    )
}

export function KoTag() { return <LangTag code="KO" color="var(--lagoon-deep)" /> }
export function ViTag() { return <LangTag code="VI" color="var(--palm)" /> }
export function EnTag() { return <LangTag code="EN" color="var(--sea-ink-soft)" /> }
export function CnTag() { return <LangTag code="CN" color="var(--lagoon)" /> }
export function JpTag() { return <LangTag code="JP" color="var(--lagoon-deep)" /> }
