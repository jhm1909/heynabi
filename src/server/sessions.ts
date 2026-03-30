import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { createServerSupabaseClient } from '#/lib/supabase/server'

interface SaveSessionInput {
    sourceLang: string
    targetLang: string
    title?: string
    durationMs?: number
    utterances: Array<{
        original: string
        translation?: string
        timestampMs?: number
    }>
}

/**
 * Save a completed session with its utterances.
 */
export const saveSession = createServerFn({ method: 'POST' })
    .handler(async ({ data }: { data: SaveSessionInput }) => {
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) throw new Error('Unauthorized')

        // Create session
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .insert({
                user_id: user.id,
                source_lang: data.sourceLang,
                target_lang: data.targetLang,
                title: data.title ?? `Session ${new Date().toLocaleString()}`,
                duration_ms: data.durationMs,
            })
            .select()
            .single()

        if (sessionError) throw sessionError

        // Insert utterances
        if (data.utterances.length > 0) {
            const { error: uttError } = await supabase.from('utterances').insert(
                data.utterances.map((u) => ({
                    session_id: session.id,
                    original: u.original,
                    translation: u.translation ?? null,
                    timestamp_ms: u.timestampMs ?? null,
                })),
            )

            if (uttError) throw uttError
        }

        return { sessionId: session.id }
    })

/**
 * List user's sessions, most recent first.
 */
export const listSessions = createServerFn({ method: 'GET' }).handler(
    async () => {
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)

        const { data, error } = await supabase
            .from('sessions')
            .select('id, source_lang, target_lang, title, duration_ms, created_at')
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) throw error

        return data ?? []
    },
)

/**
 * Get a single session with its utterances.
 */
export const getSession = createServerFn({ method: 'GET' })
    .handler(async ({ data }: { data: { sessionId: string } }) => {
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)

        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', data.sessionId)
            .single()

        if (sessionError) throw sessionError

        const { data: utterances, error: uttError } = await supabase
            .from('utterances')
            .select('*')
            .eq('session_id', data.sessionId)
            .order('created_at', { ascending: true })

        if (uttError) throw uttError

        return { session, utterances: utterances ?? [] }
    })
