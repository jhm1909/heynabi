import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, Menu, X, ChevronRight } from 'lucide-react'
import { createClient } from '#/lib/supabase/client'

/* ─── Nav Data ─── */
const navItems = [
    { label: 'Product', href: '#features' },
    {
        label: 'Use Cases',
        panelTitle: 'Built for international students who learn across languages',
        children: [
            { label: 'Lectures', href: '#features' },
            { label: 'Study Groups', href: '#features' },
            { label: 'Multilingual Sessions', href: '#features' },
        ],
    },
    { label: 'Pricing', href: '#cta' },
    { label: 'Blog', href: '#' },
    {
        label: 'Resources',
        panelTitle: 'Everything you need to stay up-to-date and get help',
        children: [
            { label: 'Documentation', href: '#' },
            { label: 'Changelog', href: '#' },
            { label: 'Support', href: '#' },
            { label: 'Press', href: '#' },
            { label: 'Releases', href: '#' },
        ],
    },
]

/* ─── Google icon ─── */
function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" width="15" height="15">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    )
}

/* ─── Butterfly Logo ─── */
function ButterflyLogo() {
    return (
        <svg viewBox="0 0 24 40" width="18" height="22" aria-hidden>
            <path
                d="M5 35c.4-.2.6-.4.9-1 .4-.9.7-1.5 1.1-2a7 7 0 0 1 2.7-2c.6-.2.9-.2 1.5 0 .8.4 1.6.3 2.1-.2 1-1 4-6.9 5.8-11.4.9-2 .8-1.9.8-4 0-2.1 0-2-.9-3.9C17.4 7.2 14.6 3.9 11.9 2.1 10.4 1.1 8.4.3 7 .2A8 8 0 0 0 3.8.3C2.6.6 2 1.1 2 1.7c0 .1.4 1.2 1 2.3l1.1 2.6c.3 1.1.8 3.6.9 5.3.1.6.4 1.3.8 1.6.4.4 1.3.8 2 .9l.5.1-.3.2c-.8.5-1.4 1.5-1.7 2.6-.2.8-.2 2.9 0 4.1.3 1.2.6 2.3 1 3.4.5 1.1.5 1.5.5 2.1-.2 1.6-2 4-3.5 5-.7.4-.9.6-1.1 1-.2.4-.2.5-.1 1 .2.8 1.2 1.3 1.9 1z"
                fill="var(--lagoon-deep)"
            />
        </svg>
    )
}

/* ─── Hook: scroll direction ─── */
function useScrollHide(threshold = 10) {
    const [hidden, setHidden] = useState(false)
    const lastY = useRef(0)
    const ticking = useRef(false)

    useEffect(() => {
        const onScroll = () => {
            if (ticking.current) return
            ticking.current = true
            requestAnimationFrame(() => {
                const y = window.scrollY
                const delta = y - lastY.current
                if (Math.abs(delta) > threshold) {
                    setHidden(delta > 0 && y > 80)
                }
                lastY.current = y
                ticking.current = false
            })
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [threshold])

    return hidden
}

/* ─── Component ─── */
export function LandingNavbar() {
    const hidden = useScrollHide()
    const [openPanel, setOpenPanel] = useState<string | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
    const navRef = useRef<HTMLElement>(null)

    /* Close on outside click */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setOpenPanel(null)
            }
        }
        document.addEventListener('click', handler)
        return () => document.removeEventListener('click', handler)
    }, [])

    /* Lock body scroll mobile */
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    /* Close panel on scroll-hide */
    useEffect(() => {
        if (hidden) setOpenPanel(null)
    }, [hidden])

    const handleSignIn = useCallback(() => {
        const supabase = createClient()
        supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        })
    }, [])

    const togglePanel = (label: string) => {
        setOpenPanel(prev => (prev === label ? null : label))
    }

    // Find active panel data
    const activePanel = navItems.find(item => item.label === openPanel && item.children)

    const navClass = [
        'landing-nav',
        hidden && 'landing-nav--hidden',
        openPanel && 'landing-nav--panel-open',
    ].filter(Boolean).join(' ')

    return (
        <>
            <nav ref={navRef} className={navClass} aria-label="Main navigation">
                {/* ─── Top Bar ─── */}
                <div className="landing-nav__bar">
                    {/* Logo */}
                    <a href="/" className="landing-nav__logo">
                        <ButterflyLogo />
                        Hey Nabi
                    </a>

                    {/* Center links */}
                    <ul className="landing-nav__links">
                        {navItems.map(item => (
                            <li key={item.label} className="landing-nav__item">
                                {item.children ? (
                                    <button
                                        className={`landing-nav__link ${openPanel === item.label ? 'landing-nav__link--active' : ''}`}
                                        onClick={() => togglePanel(item.label)}
                                        aria-expanded={openPanel === item.label}
                                    >
                                        {item.label}
                                        <ChevronDown className="landing-nav__chevron" />
                                    </button>
                                ) : (
                                    <a href={item.href} className="landing-nav__link" onClick={() => setOpenPanel(null)}>
                                        {item.label}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Right */}
                    <div className="landing-nav__right">
                        <button className="landing-nav__signin" onClick={handleSignIn}>
                            <GoogleIcon />
                            Sign in
                        </button>
                        <button
                            className="landing-nav__hamburger"
                            onClick={() => setMobileOpen(prev => !prev)}
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        >
                            {mobileOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* ─── Seamless Mega Panel ─── */}
                <div className={`landing-nav__panel ${activePanel ? 'landing-nav__panel--open' : ''}`}>
                    {activePanel && (
                        <div className="landing-nav__panel-inner">
                            <p className="landing-nav__panel-title">{activePanel.panelTitle}</p>
                            <div className="landing-nav__panel-links">
                                {activePanel.children!.map(child => (
                                    <a
                                        key={child.label}
                                        href={child.href}
                                        className="landing-nav__panel-link"
                                        onClick={() => setOpenPanel(null)}
                                    >
                                        {child.label}
                                        <ChevronRight />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* ─── Mobile Overlay ─── */}
            <div className={`landing-nav__mobile-overlay ${mobileOpen ? 'landing-nav__mobile-overlay--open' : ''}`}>
                <ul className="landing-nav__mobile-list">
                    {navItems.map(item => (
                        <li key={item.label}>
                            {item.children ? (
                                <>
                                    <button
                                        className="landing-nav__mobile-link"
                                        onClick={() => setMobileExpanded(prev => (prev === item.label ? null : item.label))}
                                    >
                                        {item.label}
                                        <ChevronDown
                                            style={{
                                                width: 18,
                                                height: 18,
                                                transition: 'transform 250ms ease',
                                                transform: mobileExpanded === item.label ? 'rotate(180deg)' : 'none',
                                            }}
                                        />
                                    </button>
                                    <ul className={`landing-nav__mobile-sub ${mobileExpanded === item.label ? 'landing-nav__mobile-sub--open' : ''}`}>
                                        {item.children.map(child => (
                                            <li key={child.label}>
                                                <a href={child.href} onClick={() => setMobileOpen(false)}>
                                                    {child.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <a href={item.href} className="landing-nav__mobile-link" onClick={() => setMobileOpen(false)}>
                                    {item.label}
                                </a>
                            )}
                        </li>
                    ))}
                </ul>

                <button className="landing-nav__mobile-signin" onClick={handleSignIn}>
                    <GoogleIcon />
                    Sign in with Google
                </button>
            </div>
        </>
    )
}
