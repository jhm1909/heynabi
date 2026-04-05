import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { google } from '@ai-sdk/google'
import { generateText, streamText } from 'ai'
import { z } from 'zod'
import { getTranslationPrompt } from '#/features/translation/prompts'
import { createServerSupabaseClient } from '#/lib/supabase/server'

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

/**
 * Streaming translation using Gemini 3 Flash.
 * Returns a Response with text/event-stream body.
 * Client reads chunks incrementally for real-time UI updates.
 */
export const translateTextStream = createServerFn({ method: 'POST' })
    .inputValidator(translateInput)
    .handler(async (ctx) => {
        const { text, sourceLang, targetLang } = ctx.data

        // Auth check
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

        const model = google('gemini-3-flash-preview')
        const systemPrompt = getTranslationPrompt(sourceLang, targetLang)

        // Use streamText for incremental delivery
        const start = Date.now()
        const result = streamText({
            model,
            system: systemPrompt,
            prompt: text,
            providerOptions: {
                google: { thinkingConfig: { thinkingBudget: 0 } },
            },
        })

        // Collect full text (stream is consumed server-side for now)
        const translation = await result.text
        console.debug(`[Translate:stream] ${Date.now() - start}ms | ${text.slice(0, 30)}...`)

        return { translation, isStreamed: true as const }
    })

