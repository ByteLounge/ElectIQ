import logger from '../utils/logger.js';

/**
 * Middleware to validate the API key.
 * Exempts health check and public data endpoints if specified.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export const validateApiKey = (req, res, next) => {
  const exemptPaths = ['/health', '/api/civic', '/api/ping'];
  if (exemptPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.CLIENT_API_KEY;

  console.log(`[AUTH DEBUG] Path: ${req.path}`);
  console.log(`[AUTH DEBUG] Received Key: ${apiKey ? '***' + apiKey.slice(-4) : 'MISSING'}`);
  console.log(`[AUTH DEBUG] Expected Key: ${expectedKey ? '***' + expectedKey.slice(-4) : 'NOT_SET'}`);
  console.log(`[AUTH DEBUG] All Headers: ${JSON.stringify(req.headers)}`);

  if (!apiKey || apiKey !== expectedKey) {
    logger.warn(`Unauthorized access attempt from ${req.ip} to ${req.path}`);
    return res.status(401).json({ 
      error: 'Missing or invalid API key',
      received: apiKey ? 'provided' : 'missing',
      path: req.path
    });
  }

  next();
};
