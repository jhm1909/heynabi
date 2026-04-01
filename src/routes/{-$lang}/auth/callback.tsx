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

            // Extract lang prefix from pathname (e.g. "/vi/auth/callback" → "/vi")
            const pathSegments = window.location.pathname.split('/').filter(Boolean)
            const langPrefix = pathSegments.length > 0 ? `/${pathSegments[0]}` : ''

            if (errorParam) {
                console.error('OAuth error:', errorParam, errorDescription)
                setStatus(`Error: ${errorDescription || errorParam}`)
                setTimeout(() => (window.location.href = `${langPrefix}/`), 2000)
                return
            }

            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code)
                if (error) {
                    // PKCE verifier missing = no active auth flow (e.g. HMR reload, direct visit)
                    // Fall through to session check instead of showing an error
                    const isPkceError = error.message?.toLowerCase().includes('code verifier')
                    if (!isPkceError) {
                        console.error('OAuth callback error:', error.message)
                        setStatus('Sign in failed. Redirecting...')
                        setTimeout(() => (window.location.href = `${langPrefix}/`), 2000)
                        return
                    }
                    // PKCE error — fall through to check existing session below
                } else {
                    // Success — redirect to app
                    window.location.href = `${langPrefix}/app`
                    return
                }
            }

            // No code found, check if already signed in
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                window.location.href = `${langPrefix}/app`
            } else {
                setStatus('No authentication code found.')
                setTimeout(() => (window.location.href = `${langPrefix}/`), 2000)
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
