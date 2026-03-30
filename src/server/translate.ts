import { createServerFn } from '@tanstack/react-start'
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { getTranslationPrompt } from '#/features/translation/prompts'

/**
 * Translate text using Gemini 2.5 Flash.
 * Server-only — GEMINI_API_KEY never reaches the client.
 */
export const translateText = createServerFn({ method: 'POST' })
    .validator(
        (input: { text: string; sourceLang: string; targetLang: string }) => input,
    )
    .handler(async ({ data }) => {
        const { text, sourceLang, targetLang } = data

        if (!text.trim()) {
            return { translation: '' }
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured')
        }

        const model = google('gemini-2.5-flash', { apiKey })
        const systemPrompt = getTranslationPrompt(sourceLang, targetLang)

        const { text: translation } = await generateText({
            model,
            system: systemPrompt,
            prompt: text,
        })

        return { translation }
    })
