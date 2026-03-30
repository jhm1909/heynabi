import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { getWebRequest } from '@tanstack/react-start/server'

export function createServerSupabaseClient() {
    const request = getWebRequest()
    const cookies = parseCookieHeader(
        request.headers.get('cookie') ?? '',
    )

    return createServerClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookies.map((cookie) => ({
                        name: cookie.name,
                        value: cookie.value ?? '',
                    }))
                },
                setAll() {
                    // Server functions handle cookie setting via response headers
                },
            },
        },
    )
}
