/**
 * Korean Spacing Post-Processor (띄어쓰기 교정)
 *
 * Robust fallback for when Deepgram's `words` array is empty.
 * Uses Korean linguistic rules to insert spaces into concatenated text.
 *
 * Strategy: Identify natural word boundaries by detecting:
 * 1. Josa (조사) — particles that attach to the END of nouns
 * 2. Eomi (어미) — verb/adjective endings
 * 3. Transitions between character types (Hangul ↔ Latin ↔ Number)
 */

/**
 * Common Korean particles (조사) — after these, a space is natural.
 * Sorted by length descending to match longest first.
 */
const JOSA_PATTERNS = [
    // 3+ char
    '에서는', '에서도', '으로는', '으로서', '으로도', '이라고', '이라는',
    '까지는', '까지도', '부터는', '만으로',
    // 2 char
    '에서', '으로', '이라', '에게', '한테', '보다', '처럼', '까지',
    '부터', '마다', '조차', '이나', '이든', '이고', '이며',
    '만큼', '대로', '밖에',
    // 1 char (ambiguous — only match when followed by Hangul)
    '은', '는', '이', '가', '을', '를', '에', '의', '로', '도', '와', '과',
    '만', '요', '야',
]

/**
 * Common verb/adjective endings (어미) that signal end of a clause.
 */
const EOMI_PATTERNS = [
    '습니다', '입니다', '됩니다', '합니다',
    '습니까', '입니까', '됩니까', '합니까',
    '해요', '하요', '에요', '이에요', '예요', '네요', '군요', '는데요',
    '거든요', '잖아요', '래요', '세요', '줘요',
    '하고', '하면', '하지만', '하는데', '하니까', '해서', '하여',
    '인데', '는데', '지만', '니까', '으니', '면서', '으면',
    '한다', '했다', '된다', '이다', '였다',
]

/**
 * Add natural spacing to concatenated Korean text.
 * Heuristic-based — not perfect, but much better than no spacing.
 */
export function addKoreanSpacing(text: string): string {
    if (!text || text.length < 2) return text

    // Step 1: Add spaces around Latin/Number sequences in Korean text
    let result = text
        .replace(/([가-힣])([a-zA-Z])/g, '$1 $2')
        .replace(/([a-zA-Z])([가-힣])/g, '$1 $2')
        .replace(/([가-힣])(\d)/g, '$1 $2')
        .replace(/(\d)([가-힣])/g, '$1 $2')

    // Step 2: Insert spaces after known particles (josa)
    for (const josa of JOSA_PATTERNS) {
        const re = new RegExp(`(${josa})([가-힣])`, 'g')
        result = result.replace(re, '$1 $2')
    }

    // Step 3: Insert spaces after known verb endings (eomi)
    for (const eomi of EOMI_PATTERNS) {
        const re = new RegExp(`(${eomi})([가-힣])`, 'g')
        result = result.replace(re, '$1 $2')
    }

    // Step 4: Clean up double spaces
    result = result.replace(/\s{2,}/g, ' ').trim()

    return result
}
