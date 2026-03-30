import { type Locale, defaultLocale } from './config'

type Messages = Record<string, string>

const messageCache = new Map<string, Messages>()

export async function loadMessages(
    locale: Locale,
    namespace = 'common',
): Promise<Messages> {
    const key = `${locale}/${namespace}`

    if (messageCache.has(key)) {
        return messageCache.get(key)!
    }

    try {
        const messages = await import(`../../messages/${locale}/${namespace}.json`)
        messageCache.set(key, messages.default)
        return messages.default
    } catch {
        // Fallback to default locale
        if (locale !== defaultLocale) {
            return loadMessages(defaultLocale, namespace)
        }
        return {}
    }
}

export function createTranslator(messages: Messages) {
    return function t(key: string, params?: Record<string, string>): string {
        let value = messages[key] ?? key

        if (params) {
            for (const [k, v] of Object.entries(params)) {
                value = value.replace(`{${k}}`, v)
            }
        }

        return value
    }
}
