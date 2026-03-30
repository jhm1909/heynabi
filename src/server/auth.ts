import { createServerFn } from '@tanstack/react-start'
import { createServerSupabaseClient } from '#/lib/supabase/server'

/**
 * Get the currently authenticated user.
 * Called from route `beforeLoad` to protect routes.
 */
export const getUser = createServerFn({ method: 'GET' }).handler(
    async () => {
        const supabase = createServerSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()
        return user
    },
)
