import { Link, useLocation } from '@tanstack/react-router'
import { Mic, History, Settings, Sun, Moon, Search } from 'lucide-react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { cn } from '#/lib/utils'
import { useTheme } from '#/components/shared/theme-toggle'
import { SearchDialog } from '#/components/shared/search-dialog'
import { useState } from 'react'

/* ─── Navigation Structure ─── */
const navSections = [
    {
        label: 'Workspace',
        items: [
            { href: '/{-$lang}/app/session' as const, icon: Mic, label: 'New Session' },
            { href: '/{-$lang}/app/history' as const, icon: History, label: 'Session History' },
        ],
    },
    {
        label: 'Account',
        items: [
            { href: '/{-$lang}/app/settings' as const, icon: Settings, label: 'Settings' },
        ],
    },
]

/* ─── Sidebar Component ─── */
interface AppSidebarProps {
    open: boolean
    onClose: () => void
}

export function AppSidebar({ open, onClose: _onClose }: AppSidebarProps) {
    const location = useLocation()
    const [searchOpen, setSearchOpen] = useState(false)
    useHotkey('Mod+K', () => setSearchOpen(true))

    return (
        <>
            <aside
                className={cn(
                    'hidden shrink-0 overflow-hidden transition-all duration-300 ease-in-out md:flex md:flex-col',
                    open ? 'w-60' : 'w-0',
                )}
                style={{
                    borderRight: open ? '1px solid var(--line)' : 'none',
                }}
            >
                <div className="flex w-60 flex-1 flex-col">

                    {/* ─── Search Trigger ─── */}
                    <button
                        className="search-trigger"
                        onClick={() => setSearchOpen(true)}
                    >
                        <Search className="h-3.5 w-3.5 opacity-50" />
                        <span className="flex-1 text-left">Search</span>
                        <kbd className="search-trigger__kbd">Ctrl K</kbd>
                    </button>

                    {/* ─── Nav Sections ─── */}
                    <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-3">
                        {navSections.map((section, idx) => (
                            <div key={section.label} className={idx > 0 ? 'mt-6' : ''}>
                                {/* Section header */}
                                <p className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: 'var(--sea-ink-soft)' }}
                                >
                                    {section.label}
                                </p>

                                {/* Section items */}
                                <div className="flex flex-col gap-0.5">
                                    {section.items.map((item) => {
                                        const isActive = location.pathname.includes(
                                            item.href.replace('/{-$lang}', ''),
                                        )
                                        return (
                                            <Link
                                                key={item.href}
                                                to={item.href}
                                                className={cn(
                                                    'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
                                                    isActive
                                                        ? 'sidebar-item--active'
                                                        : 'sidebar-item--idle',
                                                )}
                                            >
                                                <item.icon className="h-4 w-4 shrink-0" />
                                                {item.label}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* ─── Bottom Toolbar ─── */}
                    <div className="flex items-center gap-1 border-t px-3 py-2.5"
                        style={{ borderColor: 'var(--line)' }}
                    >
                        <ThemeSwitch />
                    </div>
                </div>
            </aside>
            <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    )
}

/* ─── Theme Switch (inline) ─── */
function ThemeSwitch() {
    const { theme, setTheme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <div className="flex rounded-lg p-0.5" style={{ background: 'var(--surface)' }}>
            <button
                onClick={() => setTheme('light')}
                className={cn(
                    'rounded-md p-1.5 transition-colors',
                    !isDark
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                )}
                style={!isDark ? { background: 'var(--surface-strong)' } : {}}
                aria-label="Light mode"
            >
                <Sun className="h-3.5 w-3.5" />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={cn(
                    'rounded-md p-1.5 transition-colors',
                    isDark
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                )}
                style={isDark ? { background: 'var(--surface-strong)' } : {}}
                aria-label="Dark mode"
            >
                <Moon className="h-3.5 w-3.5" />
            </button>
        </div>
    )
}
