import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { createServerSupabaseClient } from '#/lib/supabase/server'

/**
 * Update user profile preferences.
 */
export const updateProfile = createServerFn({ method: 'POST' })
    .validator(
        (input: {
            displayName?: string
            defaultSourceLang?: string
            defaultTargetLang?: string
        }) => input,
    )
    .handler(async ({ data }) => {
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) throw new Error('Unauthorized')

        const updates: Record<string, string> = {}
        if (data.displayName !== undefined) updates.display_name = data.displayName
        if (data.defaultSourceLang !== undefined)
            updates.default_source_lang = data.defaultSourceLang
        if (data.defaultTargetLang !== undefined)
            updates.default_target_lang = data.defaultTargetLang

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)

        if (error) throw error
        return { success: true }
    })
