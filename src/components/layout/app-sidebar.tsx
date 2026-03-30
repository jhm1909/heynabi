import { Link, useLocation } from '@tanstack/react-router'
import { Mic, History, Settings } from 'lucide-react'
import { cn } from '#/lib/utils'

const navItems = [
    { href: '/app/session', icon: Mic, label: 'Session' },
    { href: '/app/history', icon: History, label: 'History' },
    { href: '/app/settings', icon: Settings, label: 'Settings' },
]

export function AppSidebar() {
    const location = useLocation()

    return (
        <aside className="hidden w-56 shrink-0 border-r bg-muted/30 md:block">
            <nav className="flex flex-col gap-1 p-3">
                {navItems.map((item) => {
                    const isActive = location.pathname.includes(item.href)
                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </a>
                    )
                })}
            </nav>
        </aside>
    )
}
