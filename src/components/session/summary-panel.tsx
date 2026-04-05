import { FileText } from 'lucide-react'
import { EmptyState } from '#/components/shared/empty-state'

export function SummaryPanel() {
    return (
        <EmptyState
            icon={<FileText className="h-10 w-10" />}
            title="No summary yet"
            description="Summaries will appear here as you record."
        />
    )
}
