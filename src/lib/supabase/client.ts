import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let clientSingleton: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
    if (clientSingleton) return clientSingleton

    clientSingleton = createSupabaseClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!,
    )

    return clientSingleton
}
