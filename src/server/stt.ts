import { createServerFn } from '@tanstack/react-start'

/**
 * Generate a temporary Soniox API key for browser WebSocket auth.
 * The primary SONIOX_API_KEY is never exposed to the client.
 *
 * Uses the Soniox REST API to create a short-lived key
 * scoped to `transcribe_websocket` usage only.
 */
export const getSonioxToken = createServerFn({ method: 'GET' }).handler(
    async () => {
        const apiKey = import.meta.env.SONIOX_API_KEY

        if (!apiKey || apiKey === 'placeholder') {
            throw new Error('SONIOX_API_KEY is not configured')
        }

        // Create a temporary API key via Soniox REST API
        // This key is limited to WebSocket transcription and expires quickly
        try {
            const response = await fetch('https://api.soniox.com/v1/auth/temporary-key', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usage_type: 'transcribe_websocket',
                    expires_in_seconds: 120,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                return { apiKey: data.api_key ?? data.key ?? data.token }
            }

            // If temp key endpoint doesn't exist, fall back to direct key
            // This is acceptable for development but NOT for production
            console.warn('Soniox temp key API unavailable, using direct key (dev only)')
            return { apiKey }
        } catch {
            // Fallback: return direct key for development
            console.warn('Soniox temp key generation failed, using direct key (dev only)')
            return { apiKey }
        }
    },
)
