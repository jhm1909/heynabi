import { createBrowserClient } from '@supabase/ssr'

let clientSingleton: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
    if (clientSingleton) return clientSingleton

    clientSingleton = createBrowserClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!,
    )

    return clientSingleton
}

