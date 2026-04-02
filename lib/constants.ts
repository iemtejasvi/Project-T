/** Maximum memories a non-unlimited user can submit */
export const MEMORY_LIMIT = 6;

/** Maximum word count for regular submissions */
export const WORD_LIMIT = 50;

/** Word count threshold below which special text effects are allowed */
export const SPECIAL_EFFECT_WORD_LIMIT = 30;

/** Standard word count regex — splits on whitespace and dots */
export const WORD_SPLIT_REGEX = /[\s.]+/;

/** Average English word length used to estimate concatenated words */
const AVG_WORD_LENGTH = 5;

/**
 * Count words with concatenation-bypass protection.
 *
 * Splits on whitespace, dots, hyphens, and underscores. Any resulting token
 * longer than 8 characters is assumed to be multiple words glued together
 * and is counted as ceil(token.length / AVG_WORD_LENGTH) words.
 *
 * Examples:
 *   "hello world"           → 2
 *   "iloveyousomuch"        → 3  (14 chars / 5 = 2.8 → 3)
 *   "ilove.okay"            → 2  (split on dot)
 *   "abcdefghijklmnopqrst"  → 4  (20 chars / 5 = 4)
 *   "hi there ok"           → 3  (all ≤ 8 chars → 1 each)
 */
export function countWords(text: string): number {
  const tokens = text.trim().split(/[\s.\-_]+/).filter(t => t.length > 0);
  let count = 0;
  for (const token of tokens) {
    if (token.length > 8) {
      count += Math.ceil(token.length / AVG_WORD_LENGTH);
    } else {
      count += 1;
    }
  }
  return count;
}
