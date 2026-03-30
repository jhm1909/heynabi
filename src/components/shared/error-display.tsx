import { AlertCircle } from 'lucide-react'
import { Button } from '#/components/ui/button'

interface ErrorDisplayProps {
    title?: string
    message?: string
    onRetry?: () => void
}

export function ErrorDisplay({
    title = 'Something went wrong',
    message,
    onRetry,
}: ErrorDisplayProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <h3 className="text-lg font-medium">{title}</h3>
            {message && (
                <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
            )}
            {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry}>
                    Try again
                </Button>
            )}
        </div>
    )
}
