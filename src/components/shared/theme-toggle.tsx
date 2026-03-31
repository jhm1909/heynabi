import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'

type Theme = 'light' | 'dark' | 'auto'

function getResolvedTheme(mode: Theme): 'light' | 'dark' {
    if (mode === 'auto') {
        if (typeof window === 'undefined') return 'light'
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    }
    return mode
}

function applyTheme(mode: 'light' | 'dark') {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(mode)
    root.setAttribute('data-theme', mode)
    root.style.colorScheme = mode
}

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('auto')
    const [resolved, setResolved] = useState<'light' | 'dark'>('light')

    // Resolve theme on client only — avoids hydration mismatch
    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null
        if (stored === 'light' || stored === 'dark') {
            setTheme(stored)
            setResolved(stored)
            applyTheme(stored)
        } else {
            const auto = getResolvedTheme('auto')
            setResolved(auto)
        }
    }, [])

    const toggle = () => {
        const current = getResolvedTheme(theme)
        const next: Theme = current === 'dark' ? 'light' : 'dark'

        setTheme(next)
        setResolved(next)
        localStorage.setItem('theme', next)
        applyTheme(next)
    }

    return (
        <Button variant="ghost" size="icon" onClick={toggle}>
            {resolved === 'dark' ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
