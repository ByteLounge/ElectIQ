import rateLimit from 'express-rate-limit';

/**
 * Configure rate limiting for various routes.
 */
export const chatRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    error: 'Too many requests',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, ip: false },
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // 200 requests per minute for other routes
  message: {
    error: 'Too many requests',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, ip: false },
});
