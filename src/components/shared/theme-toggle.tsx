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

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('auto')

    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null
        if (stored === 'light' || stored === 'dark' || stored === 'auto') {
            setTheme(stored)
        }
    }, [])

    const toggle = () => {
        const resolved = getResolvedTheme(theme)
        const next: Theme = resolved === 'dark' ? 'light' : 'dark'

        setTheme(next)
        localStorage.setItem('theme', next)

        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(next)
        root.style.colorScheme = next
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
