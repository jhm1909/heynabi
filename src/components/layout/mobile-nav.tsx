import { Mic, History, Settings } from 'lucide-react'
import { useLocation } from '@tanstack/react-router'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '#/components/ui/sheet'
import { cn } from '#/lib/utils'

const navItems = [
    { href: '/app/session', icon: Mic, label: 'Session' },
    { href: '/app/history', icon: History, label: 'History' },
    { href: '/app/settings', icon: Settings, label: 'Settings' },
]

interface MobileNavProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
    const location = useLocation()

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="border-b px-4 py-3">
                    <SheetTitle className="text-left text-lg">Hey Nabi 🦋</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 p-3">
                    {navItems.map((item) => {
                        const isActive = location.pathname.includes(item.href)
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => onOpenChange(false)}
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
            </SheetContent>
        </Sheet>
    )
}
