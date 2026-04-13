/**
 * Lightweight output-side profanity filter.
 *
 * Masks explicit words with partial asterisks (e.g. "f**k") so that
 * the emotional tone of the content is preserved while satisfying
 * Google AdSense content-policy requirements.
 *
 * The raw text in the database is never modified.
 */

const PROFANITY_LIST: string[] = [
  'fuck', 'fucking', 'fucked', 'fucker', 'fuckers', 'fucks',
  'shit', 'shitting', 'shitty', 'shits',
  'bitch', 'bitches', 'bitching',
  'asshole', 'assholes',
  'bastard', 'bastards',
  'damn', 'damned', 'dammit',
  'dick', 'dicks',
  'pussy', 'pussies',
  'cunt', 'cunts',
  'cock', 'cocks',
  'motherfucker', 'motherfuckers', 'motherfucking',
  'whore', 'whores',
  'slut', 'sluts',
  'bullshit',
  'piss', 'pissed', 'pissing',
  'crap', 'crappy',
  'nigger', 'niggers', 'nigga', 'niggas',
  'retard', 'retards', 'retarded',
  'fag', 'fags', 'faggot', 'faggots',
];

// Build a single regex that matches any word in the list (case-insensitive, whole-word).
const pattern = PROFANITY_LIST
  .sort((a, b) => b.length - a.length) // longest first so "motherfucker" matches before "fuck"
  .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');

const PROFANITY_REGEX = new RegExp(`\\b(${pattern})\\b`, 'gi');

function maskWord(word: string): string {
  if (word.length <= 2) return word;
  if (word.length <= 4) return word[0] + '*'.repeat(word.length - 1);
  // Keep first and last letter, mask the middle
  return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
}

/**
 * Returns the input string with profanity partially masked.
 * Safe to call on any string — returns unchanged text if no profanity found.
 */
export function filterProfanity(text: string): string {
  return text.replace(PROFANITY_REGEX, (match) => maskWord(match));
}
