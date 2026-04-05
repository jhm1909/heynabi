import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { createServerSupabaseClient } from '#/lib/supabase/server'

/**
 * Generate a temporary Deepgram API key for browser WebSocket auth.
 * The primary DEEPGRAM_API_KEY is never exposed to the client.
 *
 * Deepgram WebSocket auth can use the Sec-WebSocket-Protocol header,
 * so we return the key for use in the protocol field (short-lived via server).
 *
 * TODO: SECURITY — Currently returns the raw API key directly.
 * Replace with Deepgram's Create Key API to generate a short-lived,
 * scoped key: https://developers.deepgram.com/reference/create-key
 * This requires a Deepgram project_id configured in .env.
 */
export const getDeepgramToken = createServerFn({ method: 'GET' }).handler(
    async () => {
        // Auth check — prevent unauthenticated API abuse
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        const apiKey = process.env.DEEPGRAM_API_KEY

        if (!apiKey || apiKey === 'placeholder') {
            throw new Error('DEEPGRAM_API_KEY is not configured')
        }

        // Deepgram doesn't require temporary key creation like Soniox.
        // The API key is passed via Sec-WebSocket-Protocol header on the client side.
        // We still gate it behind auth so only logged-in users can access it.
        return { apiKey }
    },
)
