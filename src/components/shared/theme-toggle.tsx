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

/**
 * Reusable hook for reading and setting the theme.
 */
export function useTheme() {
    const [resolved, setResolved] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
        if (stored === 'light' || stored === 'dark') {
            setResolved(stored)
            applyTheme(stored)
        } else {
            const auto = getResolvedTheme('auto')
            setResolved(auto)
        }
    }, [])

    const setTheme = (next: 'light' | 'dark') => {
        setResolved(next)
        localStorage.setItem('theme', next)
        applyTheme(next)
    }

    return { theme: resolved, setTheme }
}

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const toggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <Button variant="ghost" size="icon" onClick={toggle}>
            {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
