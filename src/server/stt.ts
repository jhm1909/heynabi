import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { createServerSupabaseClient } from '#/lib/supabase/server'

/**
 * Generate a temporary Soniox API key for browser WebSocket auth.
 * The primary SONIOX_API_KEY is never exposed to the client.
 *
 * Uses the Soniox REST API to create a short-lived key
 * scoped to `transcribe_websocket` usage only.
 */
export const getSonioxToken = createServerFn({ method: 'GET' }).handler(
    async () => {
        // Auth check — prevent unauthenticated API abuse
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        const apiKey = process.env.SONIOX_API_KEY

        if (!apiKey || apiKey === 'placeholder') {
            throw new Error('SONIOX_API_KEY is not configured')
        }

        // Create a temporary API key via Soniox REST API
        // This key is limited to WebSocket transcription and expires quickly
        try {
            const response = await fetch('https://api.soniox.com/v1/auth/temporary-key', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usage_type: 'transcribe_websocket',
                    expires_in_seconds: 120,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                return { apiKey: data.api_key ?? data.key ?? data.token }
            }

            // Only allow direct key fallback in development
            if (process.env.NODE_ENV === 'development') {
                console.warn('[DEV ONLY] Soniox temp key API unavailable, using direct key')
                return { apiKey }
            }

            throw new Error('Failed to generate temporary Soniox key')
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('[DEV ONLY] Soniox temp key generation failed, using direct key')
                return { apiKey }
            }
            throw err instanceof Error ? err : new Error('Soniox key generation failed')
        }
    },
)
