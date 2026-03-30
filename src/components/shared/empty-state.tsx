import { Inbox } from 'lucide-react'

interface EmptyStateProps {
    icon?: React.ReactNode
    title?: string
    description?: string
    action?: React.ReactNode
}

export function EmptyState({
    icon,
    title = 'Nothing here yet',
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="text-muted-foreground">
                {icon ?? <Inbox className="h-10 w-10" />}
            </div>
            <h3 className="text-lg font-medium">{title}</h3>
            {description && (
                <p className="max-w-sm text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            {action && <div className="mt-2">{action}</div>}
        </div>
    )
}
