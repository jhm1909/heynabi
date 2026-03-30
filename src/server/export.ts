import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { createServerSupabaseClient } from '#/lib/supabase/server'

/**
 * Export a session as plain text (TXT format).
 */
export const exportSessionTxt = createServerFn({ method: 'POST' })
    .handler(async ({ data }: { data: { sessionId: string } }) => {
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)

        const { data: session } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', data.sessionId)
            .single()

        if (!session) throw new Error('Session not found')

        const { data: utterances } = await supabase
            .from('utterances')
            .select('*')
            .eq('session_id', data.sessionId)
            .order('created_at', { ascending: true })

        const lines: string[] = [
            `Session: ${session.title ?? 'Untitled'}`,
            `Date: ${new Date(session.created_at).toLocaleString()}`,
            `Languages: ${session.source_lang.toUpperCase()} → ${session.target_lang.toUpperCase()}`,
            '',
            '═'.repeat(50),
            '',
        ]

        for (const u of utterances ?? []) {
            lines.push(`[Original] ${u.original}`)
            if (u.translation) {
                lines.push(`[Translation] ${u.translation}`)
            }
            lines.push('')
        }

        return { content: lines.join('\n'), filename: `session-${data.sessionId}.txt` }
    })

/**
 * Export a session as SRT subtitle format.
 */
export const exportSessionSrt = createServerFn({ method: 'POST' })
    .handler(async ({ data }: { data: { sessionId: string } }) => {
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)

        const { data: utterances } = await supabase
            .from('utterances')
            .select('*')
            .eq('session_id', data.sessionId)
            .order('created_at', { ascending: true })

        const lines: string[] = []

            ; (utterances ?? []).forEach((u, i) => {
                const startMs = u.timestamp_ms ?? i * 5000
                const endMs = startMs + 4000

                lines.push(`${i + 1}`)
                lines.push(`${formatSrtTime(startMs)} --> ${formatSrtTime(endMs)}`)
                lines.push(u.translation ?? u.original)
                lines.push('')
            })

        return { content: lines.join('\n'), filename: `session-${data.sessionId}.srt` }
    })

function formatSrtTime(ms: number): string {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const millis = ms % 1000

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(millis, 3)}`
}

function pad(n: number, len = 2): string {
    return String(n).padStart(len, '0')
}
