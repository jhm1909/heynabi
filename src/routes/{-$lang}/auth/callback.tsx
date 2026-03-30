import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { createServerSupabaseClient } from '#/lib/supabase/server'

const handleOAuthCallback = createServerFn({ method: 'GET' }).handler(
    async () => {
        const request = getRequest()
        const url = new URL(request.url)
        const code = url.searchParams.get('code')

        if (!code) {
            throw redirect({ to: '/{-$lang}' })
        }

        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('OAuth callback error:', error.message)
            throw redirect({ to: '/{-$lang}' })
        }

        throw redirect({ to: '/{-$lang}/app' })
    },
)

export const Route = createFileRoute('/{-$lang}/auth/callback')({
    beforeLoad: async () => {
        await handleOAuthCallback()
    },
    component: () => {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-muted-foreground">Signing in...</p>
            </div>
        )
    },
})
