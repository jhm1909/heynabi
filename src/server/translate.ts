import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { z } from 'zod'
import { getTranslationPrompt } from '#/features/translation/prompts'
import { createServerSupabaseClient } from '#/lib/supabase/server'

const translateInput = z.object({
    text: z.string(),
    sourceLang: z.string(),
    targetLang: z.string(),
})

/**
 * Translate text using Gemini 2.5 Flash.
 * Server-only — GEMINI_API_KEY never reaches the client.
 */
export const translateText = createServerFn({ method: 'POST' })
    .inputValidator(translateInput)
    .handler(async (ctx) => {
        const { text, sourceLang, targetLang } = ctx.data

        // Auth check — prevent unauthenticated API abuse
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        if (!text.trim()) {
            return { translation: '' }
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey || apiKey === 'placeholder') {
            return { translation: '[Gemini API key not configured]' }
        }

        const model = google('gemini-2.5-flash')
        const systemPrompt = getTranslationPrompt(sourceLang, targetLang)

        const { text: translation } = await generateText({
            model,
            system: systemPrompt,
            prompt: text,
        })

        return { translation }
    })

/**
 * Streaming translation using Gemini 2.5 Flash.
 * NOTE: TanStack Start server functions don't support streaming yet,
 * so this uses generateText as a fallback.
 */
export const translateTextStream = createServerFn({ method: 'POST' })
    .inputValidator(translateInput)
    .handler(async (ctx) => {
        const { text, sourceLang, targetLang } = ctx.data

        // Auth check — prevent unauthenticated API abuse
        const request = getRequest()
        const cookieHeader = request.headers.get('cookie') ?? ''
        const supabase = createServerSupabaseClient(cookieHeader)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        if (!text.trim()) {
            return { translation: '', isStreamed: false as const }
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey || apiKey === 'placeholder') {
            return { translation: '[Gemini API key not configured]', isStreamed: false as const }
        }

        const model = google('gemini-2.5-flash')
        const systemPrompt = getTranslationPrompt(sourceLang, targetLang)

        const { text: translation } = await generateText({
            model,
            system: systemPrompt,
            prompt: text,
        })

        return { translation, isStreamed: false as const }
    })
