import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useHotkey } from '@tanstack/react-hotkeys'
import { Search, Mic, History, Settings } from 'lucide-react'

/* ─── Searchable Pages ─── */
const searchableItems = [
    { label: 'New Session', href: '/app/session', icon: Mic, section: 'Workspace' },
    { label: 'Session History', href: '/app/history', icon: History, section: 'Workspace' },
    { label: 'Settings', href: '/app/settings', icon: Settings, section: 'Account' },
]

interface SearchDialogProps {
    open: boolean
    onClose: () => void
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
    const [query, setQuery] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    // Close on ESC (only when dialog is open)
    useHotkey('Escape', () => onClose(), { enabled: open })

    // Focus input when opened
    useEffect(() => {
        if (open) {
            setQuery('')
            requestAnimationFrame(() => inputRef.current?.focus())
        }
    }, [open])

    // Lock scroll
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    const filtered = searchableItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
    )

    // Group by section
    const sections = filtered.reduce<Record<string, typeof searchableItems>>((acc, item) => {
        if (!(item.section in acc)) acc[item.section] = []
        acc[item.section].push(item)
        return acc
    }, {})

    const handleSelect = (href: string) => {
        onClose()
        navigate({ to: `/{-$lang}${href}` })
    }

    if (!open) return null

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-dialog" onClick={(e) => e.stopPropagation()}>
                {/* ─── Search Input ─── */}
                <div className="search-dialog__input-row">
                    <Search className="search-dialog__icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="search-dialog__input"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <kbd className="search-dialog__kbd">ESC</kbd>
                </div>

                {/* ─── Results ─── */}
                <div className="search-dialog__results">
                    {Object.entries(sections).map(([section, items]) => (
                        <div key={section}>
                            <p className="search-dialog__section">{section}</p>
                            {items.map((item) => (
                                <button
                                    key={item.href}
                                    className="search-dialog__item"
                                    onClick={() => handleSelect(item.href)}
                                >
                                    <item.icon className="h-4 w-4 shrink-0 opacity-50" />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    ))}
                    {filtered.length === 0 && query && (
                        <p className="search-dialog__empty">No results for &ldquo;{query}&rdquo;</p>
                    )}
                </div>

                {/* ─── Footer ─── */}
                <div className="search-dialog__footer">
                    <span className="text-xs text-muted-foreground">
                        <kbd className="search-dialog__kbd-sm">↑↓</kbd> to navigate
                        <kbd className="search-dialog__kbd-sm" style={{ marginLeft: 8 }}>↵</kbd> to select
                    </span>
                </div>
            </div>
        </div>
    )
}
