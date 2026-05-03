import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes user input by stripping HTML tags and limiting length.
 * Also removes common PII patterns.
 * @param {string} input - The raw user input.
 * @returns {string} - The sanitized input.
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';

  // Strip HTML
  let sanitized = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  });

  // Limit length
  sanitized = sanitized.substring(0, 2000);

  // Remove PII patterns (Simplified regex for SSN and common passport-like numbers)
  // SSN: XXX-XX-XXXX
  sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED SSN]');
  
  // Generic Passport-like (very rough approximation to avoid common PII)
  sanitized = sanitized.replace(/\b[A-Z]{1,2}\d{6,9}\b/g, '[REDACTED ID]');

  return sanitized;
};
