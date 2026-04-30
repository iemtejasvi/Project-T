type RiskCategory =
  | 'csam_or_exploitation'
  | 'sexual_violence'
  | 'self_harm'
  | 'violence_or_extremism'
  | 'hate_or_identity_attack'
  | 'nonconsensual_or_doxxing';

interface RiskTerm {
  category: RiskCategory;
  terms: string[];
}

export interface RiskyContentMatch {
  blocked: true;
  category: RiskCategory;
  field?: string;
}

export interface RiskyContentClear {
  blocked: false;
}

export type RiskyContentResult = RiskyContentMatch | RiskyContentClear;

export const RISKY_CONTENT_ERROR =
  'This submission contains restricted safety terms and cannot be posted. Please rewrite without exploitative, violent, hateful, or self-harm content.';

const LEET_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '!': 'i',
  '|': 'i',
  '3': 'e',
  '4': 'a',
  '@': 'a',
  '#': 'a',
  '5': 's',
  '$': 's',
  '7': 't',
  '+': 't',
  '8': 'b',
  '9': 'g',
};

const RISK_TERMS: RiskTerm[] = [
  {
    category: 'csam_or_exploitation',
    terms: [
      'csam', 'csem', 'cp', 'c p', 'cheese pizza', 'child pornography',
      'child porn', 'pdf', 'pdf file', 'corn', 'porn',
      'child sexual abuse material', 'child exploitation',
      'child nude', 'kid nude', 'minor nude', 'underage nude',
      'underage sex', 'pedophile', 'paedophile', 'pedo', 'p3do',
      'minor attracted person', 'map', 'nomap', 'no map',
      'loli', 'lolicon', 'shota', 'shotacon', 'cub',
    ],
  },
  {
    category: 'sexual_violence',
    terms: [
      'rape', 'raped', 'rapist', 'raping', 'r word', 'r-word',
      'grape', 'graped', 'graping', 'sexual assault', 'sa', 's a',
      'molest', 'molested', 'molesting', 'struggle snuggle',
    ],
  },
  {
    category: 'self_harm',
    terms: [
      'suicide', 'suicidal', 'kill myself', 'kill yourself', 'kill themselves',
      'kms', 'k m s', 'self harm', 'self-harm', 'self delete', 'self-delete',
      'unalive', 'unalive myself', 'unalive yourself', 'unalive themselves',
      'cut myself', 'cut yourself', 'die', 'died', 'dead',
      'catch the bus', 'anorexia', 'bulimia', 'pro ana', 'pro-ana',
      'pro mia', 'pro-mia', 'thinspo', 'bonespo', 'styro', 'beans',
      'barcode', 'sh', 's h', 'kermit', 'yeet',
    ],
  },
  {
    category: 'violence_or_extremism',
    terms: [
      'murder', 'murdered', 'murderer', 'kill', 'killed', 'killing',
      'gun', 'guns', 'shoot', 'shot', 'shooting', 'bomb', 'bombing',
      'terrorist', 'terrorism', 'isis', 'isil', 'daesh', 'al qaeda',
      'al-qaeda', 'nazi', 'neo nazi', 'neo-nazi', 'terrorgram',
      'boogaloo', 'pew pew', 'music festival',
    ],
  },
  {
    category: 'hate_or_identity_attack',
    terms: [
      'nigger', 'nigga', 'kike', 'chink', 'gook', 'spic', 'wetback',
      'raghead', 'sandnigger', 'paki', 'coon', 'jungle bunny',
      'fag', 'faggot', 'dyke', 'tranny', 'shemale',
      'retard', 'retarded', 'mongoloid',
      'globalists', 'skypes', 'googles', 'echoes', 'dindus', 'joggers', 'yahoos',
      'skittles', 'yt', 'shyt', 'mayo',
      'alphabet mafia', 'groomer', 'groomers', 'legbooty',
      'tism', 'acoustic',
    ],
  },
  {
    category: 'nonconsensual_or_doxxing',
    terms: [
      'revenge porn', 'leaked nudes', 'leak nudes', 'leak your nudes',
      'send nudes', 'deepfake porn', 'nonconsensual porn',
      'non consensual porn', 'dox', 'doxx', 'doxxing', 'doxxed',
      'dox you', 'drop your address', 'post your address',
      'blackmail nudes', 'sextortion',
    ],
  },
];

const SPECIAL_PATTERNS: Array<{ category: RiskCategory; regex: RegExp }> = [
  { category: 'hate_or_identity_attack', regex: /\(\(\([^)]+\)\)\)/i },
];

function normalizeLeet(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[0134@#!|5$7+89]/g, (char) => LEET_MAP[char] || char);
}

function toTermParts(term: string): string[] {
  return normalizeLeet(term)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function flexiblePart(part: string): string {
  return part
    .split('')
    .map((char) => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('[^a-z0-9]*');
}

function createFlexibleTermRegex(term: string): RegExp | null {
  const parts = toTermParts(term);
  if (parts.length === 0) return null;
  const body = parts.map(flexiblePart).join('[^a-z0-9]+');
  return new RegExp(`(?:^|[^a-z0-9])${body}(?=$|[^a-z0-9])`, 'i');
}

const COMPILED_TERMS = RISK_TERMS.flatMap(({ category, terms }) =>
  terms
    .map((term) => {
      const regex = createFlexibleTermRegex(term);
      return regex ? { category, regex } : null;
    })
    .filter((entry): entry is { category: RiskCategory; regex: RegExp } => entry !== null)
);

export function detectRiskyContent(text: string): RiskyContentResult {
  if (!text || typeof text !== 'string') return { blocked: false };

  const normalized = normalizeLeet(text);

  for (const { category, regex } of SPECIAL_PATTERNS) {
    if (regex.test(normalized)) {
      return { blocked: true, category };
    }
  }

  for (const { category, regex } of COMPILED_TERMS) {
    if (regex.test(normalized)) {
      return { blocked: true, category };
    }
  }

  return { blocked: false };
}

export function detectRiskySubmissionContent(
  fields: Array<{ field: string; value: string | undefined | null }>
): RiskyContentResult {
  for (const { field, value } of fields) {
    const result = detectRiskyContent(value || '');
    if (result.blocked) {
      return { ...result, field };
    }
  }

  return { blocked: false };
}
