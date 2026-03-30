import { createServerFn } from '@tanstack/react-start'
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { getTranslationPrompt } from '#/features/translation/prompts'

/**
 * Translate text using Gemini 2.5 Flash.
 * Server-only — GEMINI_API_KEY never reaches the client.
 */
export const translateText = createServerFn({ method: 'POST' })
    .handler(async ({ data }: { data: { text: string; sourceLang: string; targetLang: string } }) => {
        const { text, sourceLang, targetLang } = data

        if (!text.trim()) {
            return { translation: '' }
        }

        const apiKey = import.meta.env.GEMINI_API_KEY
        if (!apiKey || apiKey === 'placeholder') {
            return { translation: '[Gemini API key not configured]' }
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

/**
 * Streaming translation using Gemini 2.5 Flash.
 * NOTE: TanStack Start server functions don't support streaming yet,
 * so this uses generateText as a fallback.
 */
export const translateTextStream = createServerFn({ method: 'POST' })
    .handler(async ({ data }: { data: { text: string; sourceLang: string; targetLang: string } }) => {
        const { text, sourceLang, targetLang } = data

        if (!text.trim()) {
            return { translation: '', isStreamed: false }
        }

        const apiKey = import.meta.env.GEMINI_API_KEY
        if (!apiKey || apiKey === 'placeholder') {
            return { translation: '[Gemini API key not configured]', isStreamed: false }
        }

        const model = google('gemini-2.5-flash', { apiKey })
        const systemPrompt = getTranslationPrompt(sourceLang, targetLang)

        const { text: translation } = await generateText({
            model,
            system: systemPrompt,
            prompt: text,
        })

        return { translation, isStreamed: false }
    })
