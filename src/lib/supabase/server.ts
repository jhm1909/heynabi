import { createServerClient } from '@supabase/ssr'

export function createServerSupabaseClient(cookieHeader: string) {
    return createServerClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieHeader
                        .split(';')
                        .map((c) => {
                            const [name, ...rest] = c.trim().split('=')
                            return { name: name ?? '', value: rest.join('=') }
                        })
                        .filter((c) => c.name)
                },
                setAll() {
                    // Cookie setting handled by response headers in server functions
                },
            },
        },
    )
}
