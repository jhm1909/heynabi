/**
 * Lightweight Korean spacing (띄어쓰기) post-processor.
 *
 * Deepgram Nova-3 returns Korean text without spaces.
 * This function adds basic word boundaries using common Korean grammar patterns.
 *
 * NOTE: This is approximate — proper Korean spacing requires NLP.
 * Gemini provides the authoritative corrected text after translation completes.
 */

// Common Korean particles (조사) that typically start a new word
// These are attached to the end of the preceding word
const JOSA = /(?<=[가-힣])(은|는|이|가|을|를|에|에서|에게|으로|로|와|과|의|도|만|부터|까지|에는|으로는|이나|거나|라고|이라고|다고|하고|보다)(?=[가-힣])/g

// Common Korean verb/adjective endings followed by new clauses
const CLAUSE_BOUNDARY = /(?<=[가-힣])(니다|습니다|는데요?|지만|해서|어서|하면|으면|고요?|네요|세요|입니다|었고|했고|되고|한데|인데|겠고|겠는데)(?=[가-힣])/g

// Numbers followed by Korean counters/units
const NUM_UNIT = /(\d+)(밀리미터|센티미터|킬로미터|미터|퍼센트|프로|시간|분|초|개|명|원|만|억|천)/g

export function addKoreanSpacing(text: string): string {
    if (!text) return text

    // Only process if text looks like concatenated Korean (no spaces at all)
    if (text.includes(' ')) return text

    let result = text

    // Add space after clause boundaries
    result = result.replace(CLAUSE_BOUNDARY, '$1 ')

    // Add space before common particles (with preceding word)
    // This is tricky — particles attach to words, so we add space before the next word
    result = result.replace(JOSA, '$1 ')

    // Add space between number + unit
    result = result.replace(NUM_UNIT, '$1 $2')

    return result.trim()
}
