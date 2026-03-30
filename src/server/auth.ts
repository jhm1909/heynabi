import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { createServerSupabaseClient } from '#/lib/supabase/server'

/**
 * Get the currently authenticated user.
 * Called from route `beforeLoad` to protect routes.
 */
export const getUser = createServerFn({ method: 'GET' }).handler(
    async () => {
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)
        const {
            data: { user },
        } = await supabase.auth.getUser()
        return user
    },
)
