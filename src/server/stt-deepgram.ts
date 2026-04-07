import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { createServerSupabaseClient } from '#/lib/supabase/server'
import { enforceRateLimit } from './rate-limit'

/**
 * Generate a temporary, scoped Deepgram API key for browser WebSocket auth.
 * The primary DEEPGRAM_API_KEY is never exposed to the client.
 *
 * Uses Deepgram's Create Key API to generate a short-lived key
 * with only 'usage:write' permission (enough for streaming STT).
 * Falls back to the raw key in development only.
 *
 * @see https://developers.deepgram.com/reference/create-key
 */
export const getDeepgramToken = createServerFn({ method: 'GET' }).handler(
    async () => {
        // Auth check — prevent unauthenticated API abuse
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        // Rate limit: max 10 token requests per minute per user
        enforceRateLimit(user.id, 'deepgram-token', { maxRequests: 10, windowMs: 60_000 })

        const apiKey = process.env.DEEPGRAM_API_KEY
        if (!apiKey || apiKey === 'placeholder') {
            throw new Error('DEEPGRAM_API_KEY is not configured')
        }

        const projectId = process.env.DEEPGRAM_PROJECT_ID

        // If project ID is configured, create a short-lived scoped key
        if (projectId) {
            try {
                const response = await fetch(
                    `https://api.deepgram.com/v1/projects/${projectId}/keys`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Token ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            comment: `temp-key-${user.id.slice(0, 8)}`,
                            scopes: ['usage:write'],
                            time_to_live_in_seconds: 120,
                        }),
                    },
                )

                if (response.ok) {
                    const data = await response.json()
                    return { apiKey: data.key }
                }

                console.warn('[Deepgram] Scoped key creation failed, status:', response.status)
            } catch (err) {
                console.warn('[Deepgram] Scoped key creation error:', err)
            }
        }

        // Fallback: return raw key (development only)
        if (process.env.NODE_ENV === 'development') {
            console.warn('[DEV ONLY] Using raw Deepgram API key — configure DEEPGRAM_PROJECT_ID for production')
            return { apiKey }
        }

        throw new Error(
            'DEEPGRAM_PROJECT_ID is required in production for scoped key generation',
        )
    },
)
