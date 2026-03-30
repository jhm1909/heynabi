import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '#/lib/supabase/server'

const updateProfileInput = z.object({
    displayName: z.string().optional(),
    defaultSourceLang: z.string().optional(),
    defaultTargetLang: z.string().optional(),
})

/**
 * Update user profile preferences.
 */
export const updateProfile = createServerFn({ method: 'POST' })
    .inputValidator(updateProfileInput)
    .handler(async (ctx) => {
        const data = ctx.data
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
