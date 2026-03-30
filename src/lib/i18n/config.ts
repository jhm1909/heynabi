export const locales = ['vi', 'en', 'ko', 'zh', 'ja'] as const
export const defaultLocale = 'vi' as const

export type Locale = (typeof locales)[number]

export function isValidLocale(value: string): value is Locale {
    return locales.includes(value as Locale)
}

export const localeNames: Record<Locale, string> = {
    vi: 'Tiếng Việt',
    en: 'English',
    ko: '한국어',
    zh: '中文',
    ja: '日本語',
}
