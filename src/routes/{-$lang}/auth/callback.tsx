import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { createClient } from '#/lib/supabase/client'
import { Loading } from '#/components/shared/loading'

export const Route = createFileRoute('/{-$lang}/auth/callback')({
    component: AuthCallback,
})

function AuthCallback() {
    const [status, setStatus] = useState('Signing in...')

    useEffect(() => {
        const handleCallback = async () => {
            const supabase = createClient()
            const url = new URL(window.location.href)
            const code = url.searchParams.get('code')
            const errorParam = url.searchParams.get('error')
            const errorDescription = url.searchParams.get('error_description')

            if (errorParam) {
                console.error('OAuth error:', errorParam, errorDescription)
                setStatus(`Error: ${errorDescription || errorParam}`)
                setTimeout(() => (window.location.href = '/'), 2000)
                return
            }

            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code)
                if (error) {
                    console.error('OAuth callback error:', error.message)
                    setStatus('Sign in failed. Redirecting...')
                    setTimeout(() => (window.location.href = '/'), 2000)
                    return
                }
                // Success — redirect to app
                window.location.href = '/app'
                return
            }

            // No code found, check if already signed in
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                window.location.href = '/app'
            } else {
                setStatus('No authentication code found.')
                setTimeout(() => (window.location.href = '/'), 2000)
            }
        }

        handleCallback()
    }, [])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loading text={status} />
        </div>
    )
}
