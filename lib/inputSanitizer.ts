// lib/inputSanitizer.ts
// Input sanitization and validation to prevent XSS, SQL injection, and other attacks

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limit consecutive whitespace
    .replace(/\s{10,}/g, ' '.repeat(10))
    // Trim
    .trim()
    // Limit length to prevent DoS
    .slice(0, 10000);
}

/**
 * Sanitize HTML to prevent XSS (escapes dangerous characters)
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;'
  };
  
  return text.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/**
 * Remove potentially dangerous HTML tags and attributes
 */
export function stripDangerousHtml(html: string): string {
  return html
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (can be used for XSS)
    .replace(/data:text\/html/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove object/embed tags
    .replace(/<(object|embed)[^>]*>/gi, '');
}

/**
 * Validate and sanitize email addresses
 */
export function sanitizeEmail(email: string): string | null {
  const sanitized = sanitizeString(email).toLowerCase();
  
  // Basic email regex
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  
  if (!emailRegex.test(sanitized)) {
    return null;
  }
  
  return sanitized;
}

/**
 * Validate and sanitize URLs
 */
export function sanitizeUrl(url: string): string | null {
  const sanitized = sanitizeString(url);
  
  try {
    const parsed = new URL(sanitized);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(input: unknown, options?: { min?: number; max?: number; integer?: boolean }): number | null {
  const num = Number(input);
  
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }
  
  if (options?.integer && !Number.isInteger(num)) {
    return null;
  }
  
  if (options?.min !== undefined && num < options.min) {
    return null;
  }
  
  if (options?.max !== undefined && num > options.max) {
    return null;
  }
  
  return num;
}

/**
 * Sanitize boolean input
 */
export function sanitizeBoolean(input: unknown): boolean {
  if (typeof input === 'boolean') return input;
  if (typeof input === 'string') {
    const lower = input.toLowerCase();
    return lower === 'true' || lower === '1' || lower === 'yes';
  }
  if (typeof input === 'number') return input !== 0;
  return false;
}

/**
 * Validate IP address format
 */
export function isValidIP(ip: string): boolean {
  if (!ip) return false;
  
  // IPv4 regex
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }
  
  // IPv6 basic check
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  return ipv6Regex.test(ip);
}

/**
 * Sanitize UUID
 */
export function sanitizeUUID(uuid: string): string | null {
  const sanitized = sanitizeString(uuid);
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(sanitized)) {
    return null;
  }
  
  return sanitized.toLowerCase();
}

/**
 * Sanitize object keys and values recursively
 */
export function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Sanitize key
    const cleanKey = sanitizeString(key).replace(/[^a-zA-Z0-9_]/g, '');
    
    if (!cleanKey) continue;
    
    // Sanitize value based on type
    if (typeof value === 'string') {
      sanitized[cleanKey] = sanitizeString(value);
    } else if (typeof value === 'number') {
      sanitized[cleanKey] = sanitizeNumber(value);
    } else if (typeof value === 'boolean') {
      sanitized[cleanKey] = value;
    } else if (value === null || value === undefined) {
      sanitized[cleanKey] = null;
    } else if (Array.isArray(value)) {
      sanitized[cleanKey] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else if (typeof value === 'object') {
      sanitized[cleanKey] = sanitizeObject(value as Record<string, unknown>);
    }
  }
  
  return sanitized;
}

/**
 * Check for SQL injection patterns (extra layer of protection)
 * Note: Supabase uses prepared statements, but this adds defense in depth
 */
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/i,
    /--/,  // SQL comment
    /;.*(\b(SELECT|INSERT|UPDATE|DELETE|DROP)\b)/i,
    /\bOR\b.*=.*\bOR\b/i,
    /\bAND\b.*=.*\bAND\b/i,
    /1\s*=\s*1/i,
    /'\s*OR\s*'1'\s*=\s*'1/i,
    /" OR "1"="1/i,
    /\bxp_cmdshell\b/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check for NoSQL injection patterns
 */
export function containsNoSqlInjection(input: string): boolean {
  const noSqlPatterns = [
    /\$where/i,
    /\$ne/i,
    /\$gt/i,
    /\$lt/i,
    /\$regex/i,
    /function\s*\(/i,
    /\{\s*\$.*:\s*.*\}/
  ];
  
  return noSqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check for suspiciously long words (concatenated to bypass word limits)
 */
export function hasSuspiciouslyLongWords(input: string): { valid: boolean; error?: string } {
  const words = input.split(/\s+/).filter(word => word.length > 0);
  const MAX_WORD_LENGTH = 15; // No single word should exceed this
  
  for (const word of words) {
    // Remove common punctuation from ends
    const cleanWord = word.replace(/^[.,!?;:'"]+|[.,!?;:'"]+$/g, '');
    
    if (cleanWord.length > MAX_WORD_LENGTH) {
      return {
        valid: false,
        error: `Word too long: "${cleanWord.substring(0, 50)}..." (${cleanWord.length} characters). Maximum word length is ${MAX_WORD_LENGTH} characters. Please use spaces between words.`
      };
    }
  }
  
  return { valid: true };
}

/**
 * Comprehensive input validation for memory submission
 */
export function validateMemoryInput(data: {
  recipient?: unknown;
  message?: unknown;
  sender?: unknown;
  color?: unknown;
  animation?: unknown;
  tag?: unknown;
  sub_tag?: unknown;
}): {
  valid: boolean;
  errors: string[];
  sanitized: Record<string, unknown>;
} {
  const errors: string[] = [];
  const sanitized: Record<string, unknown> = {};
  
  // Validate recipient
  if (!data.recipient || typeof data.recipient !== 'string') {
    errors.push('Recipient is required and must be a string');
  } else {
    const recipient = sanitizeString(data.recipient);
    if (recipient.length === 0) {
      errors.push('Recipient cannot be empty');
    } else if (recipient.length > 100) {
      errors.push('Recipient must be 100 characters or less');
    } else if (containsSqlInjection(recipient) || containsNoSqlInjection(recipient)) {
      errors.push('Recipient contains invalid characters');
    } else {
      // Check for suspiciously long words
      const wordCheck = hasSuspiciouslyLongWords(recipient);
      if (!wordCheck.valid) {
        errors.push('Recipient name is too long or contains concatenated words');
      } else {
        sanitized.recipient = recipient;
      }
    }
  }
  
  // Validate message
  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required and must be a string');
  } else {
    const message = sanitizeString(data.message);
    if (message.length === 0) {
      errors.push('Message cannot be empty');
    } else if (message.length > 5000) {
      errors.push('Message must be 5000 characters or less');
    } else if (containsSqlInjection(message) || containsNoSqlInjection(message)) {
      errors.push('Message contains invalid characters');
    } else {
      // Check for suspiciously long words (concatenated to bypass limits)
      const wordCheck = hasSuspiciouslyLongWords(message);
      if (!wordCheck.valid) {
        errors.push(wordCheck.error || 'Message contains suspiciously long words');
      } else {
        sanitized.message = message;
      }
    }
  }
  
  // Validate sender (optional)
  if (data.sender !== undefined && data.sender !== null) {
    if (typeof data.sender !== 'string') {
      errors.push('Sender must be a string');
    } else {
      const sender = sanitizeString(data.sender);
      if (sender.length > 100) {
        errors.push('Sender must be 100 characters or less');
      } else if (containsSqlInjection(sender) || containsNoSqlInjection(sender)) {
        errors.push('Sender contains invalid characters');
      } else {
        sanitized.sender = sender;
      }
    }
  }
  
  // Validate color (must be from allowed list)
  const allowedColors = [
    'default', 'aqua', 'azure', 'berry', 'brass', 'bronze', 'clay', 'cloud',
    'copper', 'coral', 'cream', 'cyan', 'dune', 'garnet', 'gold', 'honey',
    'ice', 'ivory', 'jade', 'lilac', 'mint', 'moss', 'night', 'ocean',
    'olive', 'peach', 'pearl', 'pine', 'plum', 'rose', 'rouge', 'ruby',
    'sage', 'sand', 'sepia', 'sky', 'slate', 'steel', 'sunny', 'teal', 'wine'
  ];
  
  if (data.color && typeof data.color === 'string') {
    const color = sanitizeString(data.color);
    if (allowedColors.includes(color)) {
      sanitized.color = color;
    } else {
      sanitized.color = 'default';
    }
  }
  
  // Validate animation
  const allowedAnimations = ['cursive', 'handwritten', 'rough', null];
  if (data.animation !== undefined) {
    if (typeof data.animation === 'string') {
      const animation = sanitizeString(data.animation);
      sanitized.animation = allowedAnimations.includes(animation) ? animation : null;
    }
  }
  
  // Validate tag and sub_tag
  if (data.tag && typeof data.tag === 'string') {
    sanitized.tag = sanitizeString(data.tag).slice(0, 50);
  }
  
  if (data.sub_tag && typeof data.sub_tag === 'string') {
    sanitized.sub_tag = sanitizeString(data.sub_tag).slice(0, 50);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized
  };
}
