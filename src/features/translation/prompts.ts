
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

IMPORTANT: The input comes from a speech-to-text system that may OMIT SPACES between words (e.g., "오늘과내일전국에봄비가내리는데요"). You MUST restore proper word spacing before translating.

Output format — EXACTLY two lines, no extra text:
Line 1: The CORRECTED source text with proper spacing/punctuation restored
Line 2: The ${target} translation

Example input: "오늘과내일전국에봄비가내리는데요"
Example output:
오늘과 내일 전국에 봄비가 내리는데요.
Hôm nay và ngày mai cả nước sẽ có mưa xuân.

Rules:
1. Preserve technical terms and proper nouns.
2. Maintain the academic register and formal tone.
3. Keep sentences natural and fluent in the target language.
4. If the input is a fragment, translate what is available and indicate incompleteness with "...".
5. Output ONLY the two lines — no commentary, labels, or notes.`
}
