import { Mic, Square, Pause, Play } from 'lucide-react'
import { Button } from '#/components/ui/button'
import type { SttStatus } from '#/features/stt/lib/types'

interface SessionControlsProps {
    status: SttStatus
    onStart: () => void
    onStop: () => void
    onPause: () => void
    onResume: () => void
}

export function SessionControls({
    status,
    onStart,
    onStop,
    onPause,
    onResume,
}: SessionControlsProps) {
    if (status === 'idle' || status === 'error') {
        return (
            <Button onClick={onStart} size="lg" className="gap-2">
                <Mic className="h-4 w-4" />
                Start
            </Button>
        )
    }

    return (
        <div className="flex items-center gap-2">
            {status === 'recording' && (
                <>
                    <Button
                        onClick={onPause}
                        size="lg"
                        variant="outline"
                        className="gap-2"
                    >
                        <Pause className="h-4 w-4" />
                        Pause
                    </Button>
                    <Button
                        onClick={onStop}
                        size="lg"
                        variant="destructive"
                        className="gap-2"
                    >
                        <Square className="h-4 w-4" />
                        Stop
                    </Button>
                </>
            )}

            {status === 'paused' && (
                <>
                    <Button onClick={onResume} size="lg" className="gap-2">
                        <Play className="h-4 w-4" />
                        Resume
                    </Button>
                    <Button
                        onClick={onStop}
                        size="lg"
                        variant="destructive"
                        className="gap-2"
                    >
                        <Square className="h-4 w-4" />
                        Stop
                    </Button>
                </>
            )}

            {status === 'connecting' && (
                <Button size="lg" disabled>
                    Connecting...
                </Button>
            )}
        </div>
    )
}
