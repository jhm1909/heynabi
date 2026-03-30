import type { Locale } from '#/lib/i18n'

const langNames: Record<string, string> = {
    ko: 'Korean',
    vi: 'Vietnamese',
    en: 'English',
    zh: 'Chinese',
    ja: 'Japanese',
}

export function getTranslationPrompt(
    sourceLang: string,
    targetLang: string,
): string {
    const source = langNames[sourceLang] ?? sourceLang
    const target = langNames[targetLang] ?? targetLang

    return `You are an expert academic translator. Translate the following ${source} text into ${target}.

Rules:
1. Preserve technical terms and proper nouns — transliterate if needed (e.g., "알고리즘" → "algorithm" in English, or keep as-is with explanation in parentheses).
2. Maintain the academic register and formal tone.
3. Keep sentences natural and fluent in the target language.
4. If the input is a fragment (incomplete sentence), translate what is available and indicate incompleteness with "...".
5. Do NOT add any commentary, explanations, or notes — output ONLY the translation.`
}
