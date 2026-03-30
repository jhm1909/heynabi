import { z } from 'zod'

const envSchema = z.object({
    VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL must be a valid URL'),
    VITE_SUPABASE_ANON_KEY: z.string().min(1, 'VITE_SUPABASE_ANON_KEY is required'),
})

const serverEnvSchema = z.object({
    GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
    SONIOX_API_KEY: z.string().min(1, 'SONIOX_API_KEY is required'),
})

/**
 * Validate client-side environment variables.
 * Call this in the client entry to catch misconfigs early.
 */
export function validateClientEnv() {
    const result = envSchema.safeParse({
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    })

    if (!result.success) {
        console.warn(
            '⚠️ Missing client environment variables:',
            result.error.flatten().fieldErrors,
        )
    }

    return result.success
}

/**
 * Validate server-side environment variables.
 * Call this in server functions to catch misconfigs early.
 */
export function validateServerEnv() {
    const result = serverEnvSchema.safeParse({
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        SONIOX_API_KEY: process.env.SONIOX_API_KEY,
    })

    if (!result.success) {
        console.warn(
            '⚠️ Missing server environment variables:',
            result.error.flatten().fieldErrors,
        )
    }

    return result.success
}
