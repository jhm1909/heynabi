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

/**
 * Sign out the current user.
 */
export const signOut = createServerFn({ method: 'POST' }).handler(
    async () => {
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)
        await supabase.auth.signOut()
        return { success: true }
    },
)

/**
 * Get the user's profile from the profiles table.
 */
export const getProfile = createServerFn({ method: 'GET' }).handler(
    async () => {
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) return null

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        return profile
    },
)
