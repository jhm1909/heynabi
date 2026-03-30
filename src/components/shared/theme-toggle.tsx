import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'

type Theme = 'light' | 'dark' | 'auto'

function getResolvedTheme(mode: Theme): 'light' | 'dark' {
    if (mode === 'auto') {
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

    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null
        if (stored === 'light' || stored === 'dark') {
            setTheme(stored)
            applyTheme(stored)
        } else {
            // auto mode — let CSS @media handle it, but clear any stale attributes
            const root = document.documentElement
            root.removeAttribute('data-theme')
            root.classList.remove('light', 'dark')
        }
    }, [])

    const toggle = () => {
        const resolved = getResolvedTheme(theme)
        const next: Theme = resolved === 'dark' ? 'light' : 'dark'

        setTheme(next)
        localStorage.setItem('theme', next)
        applyTheme(next)
    }

    const resolved = getResolvedTheme(theme)

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
