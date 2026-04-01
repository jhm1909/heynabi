
import { PanelLeftClose, PanelLeftOpen, Menu } from 'lucide-react'
import { ThemeToggle } from '#/components/shared/theme-toggle'
import { UserMenu } from '#/components/auth/user-menu'

interface AppHeaderProps {
    user: {
        email?: string | null
        user_metadata?: {
            full_name?: string
            avatar_url?: string
        }
    }
    onMenuToggle?: () => void
    onSidebarToggle?: () => void
    sidebarOpen?: boolean
}

export function AppHeader({ user, onMenuToggle, onSidebarToggle, sidebarOpen }: AppHeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between px-4 backdrop-blur-sm"
        >
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    className="md:hidden"
                    onClick={onMenuToggle}
                    aria-label="Toggle menu"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Desktop sidebar toggle */}
                <button
                    className="hidden rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/20 hover:text-foreground md:block"
                    onClick={onSidebarToggle}
                    aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                >
                    {sidebarOpen
                        ? <PanelLeftClose className="h-4 w-4" />
                        : <PanelLeftOpen className="h-4 w-4" />
                    }
                </button>

                <span className="text-lg font-semibold tracking-tight">
                    Hey Nabi 🦋
                </span>
            </div>

            <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserMenu user={user} />
            </div>
        </header>
    )
}
