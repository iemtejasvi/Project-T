// Shared utilities for name validation and quality control

// Reserved/blocked names that should never become archive pages or clickable links
const BLOCKED_NAMES = new Set([
  'anonymous', 'anon', 'someone', 'nobody', 'unknown', 'me', 'myself',
  'guess who', 'you know who', 'your secret admirer', 'the one who got away',
  'your friend', 'your ex', 'a friend', 'a stranger', 'no one',
  'test', 'testing', 'admin', 'moderator', 'mod', 'system',
  'null', 'undefined', 'none', 'n/a', 'na', 'idk',
  'you', 'him', 'her', 'mom', 'dad', 'hey', 'hello', 'hi', 'god',
  'bro', 'dude', 'bruh', 'sir', 'ma', 'babe', 'baby',
]);

// Obvious placeholder patterns
const PLACEHOLDER_PATTERNS = [
  /^(.)\1{3,}$/,          // repeated single char: aaaa, xxxx
  /^[0-9]+$/,             // numbers only: 123, 456
  /^[^a-zA-Z]+$/,         // no letters at all: !!!, ???, ---
  /^test\d*$/i,           // test, test1, test123
  /^asdf/i,               // keyboard mash
  /^qwer/i,               // keyboard mash
  /^(the|a|an|my|your|his|her|our|their|this|that|i am|who|what)\b/i, // starts with article/pronoun = phrase
  /\b(who|whom|which|that|because|since|every|always|never)\b/i, // sentence words
];

/**
 * Check if a name is "linkable" — worthy of becoming a clickable /name/[name] link.
 * Returns false for single chars, numbers-only, reserved words, spam patterns, phrases (>3 words).
 */
export function isLinkableName(name: string | undefined | null): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  if (trimmed.length < 2) return false;
  if (trimmed.length > 30) return false;

  // Strip trailing/leading punctuation to catch "T.", "A!", "J," etc.
  const stripped = trimmed.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
  if (stripped.length < 3) return false;

  const normalized = trimmed.toLowerCase();

  // Block reserved names
  if (BLOCKED_NAMES.has(normalized)) return false;

  // Block names with more than 3 words (phrases/sentences, not real names)
  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount > 3) return false;

  // Block placeholder patterns
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(normalized)) return false;
  }

  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(trimmed)) return false;

  return true;
}

/**
 * Check if a name is worthy of being indexed as a name archive page.
 * Stricter than isLinkableName — also checks length bounds for SEO quality.
 */
export function isIndexableName(name: string | undefined | null): boolean {
  if (!isLinkableName(name)) return false;
  const trimmed = (name as string).trim();
  // Name must be 2-40 chars for indexing
  if (trimmed.length < 2 || trimmed.length > 40) return false;
  return true;
}
