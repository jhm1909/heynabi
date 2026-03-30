import { Link } from '@tanstack/react-router'
import { Mic, History, Settings } from 'lucide-react'
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
}

export function AppHeader({ user, onMenuToggle }: AppHeaderProps) {
    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    className="md:hidden"
                    onClick={onMenuToggle}
                    aria-label="Toggle menu"
                >
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
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
