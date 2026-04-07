import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { z } from 'zod'
import { getTranslationPrompt } from '#/features/translation/prompts'
import { createServerSupabaseClient } from '#/lib/supabase/server'
import { enforceRateLimit } from './rate-limit'

const translateInput = z.object({
    text: z.string(),
    sourceLang: z.string(),
    targetLang: z.string(),
})

/**
 * Translate text using Gemini 3 Flash (non-streaming).
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

        // Rate limit: 60 translations per minute per user
        enforceRateLimit(user.id, 'translate', { maxRequests: 60, windowMs: 60_000 })

        if (!text.trim()) {
            return { translation: '' }
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey || apiKey === 'placeholder') {
            return { translation: '[Gemini API key not configured]' }
        }

        const model = google('gemini-3-flash-preview')
        const systemPrompt = getTranslationPrompt(sourceLang, targetLang)

        const start = Date.now()
        const { text: rawOutput } = await generateText({
            model,
            system: systemPrompt,
            prompt: text,
            providerOptions: {
                google: { thinkingConfig: { thinkingBudget: 0 } },
            },
        })
        console.debug(`[Translate] ${Date.now() - start}ms | ${text.slice(0, 30)}...`)

        // Parse 2-line output: line 1 = corrected source, line 2 = translation
        const lines = rawOutput.trim().split('\n').filter(Boolean)
        const correctedOriginal = lines.length >= 2 ? lines[0].trim() : text
        const translation = lines.length >= 2 ? lines.slice(1).join(' ').trim() : rawOutput.trim()

        return { translation, correctedOriginal }
    })


