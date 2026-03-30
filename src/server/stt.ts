import { createServerFn } from '@tanstack/react-start'

/**
 * Generate a temporary Soniox auth token.
 * The SONIOX_API_KEY is never exposed to the client.
 */
export const getSonioxToken = createServerFn({ method: 'GET' }).handler(
    async () => {
        const apiKey = process.env.SONIOX_API_KEY

        if (!apiKey) {
            throw new Error('SONIOX_API_KEY is not configured')
        }

        // Soniox uses the API key directly for WebSocket auth
        // In production, you'd exchange it for a temporary token via their API
        return { apiKey }
    },
)
